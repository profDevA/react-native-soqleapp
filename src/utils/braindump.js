import { resizeImg, trackMixpanel } from './common';
import { Platform } from 'react-native';
import { ADD_BRAINDUMP, UPLOAD_BRAINDUMP_IMAGE } from '../endpoints';
import { EVENT_BRAINDUMP_COMPLETE, EVENT_USERSTORY_PROGRESS } from '../../src/constants';
import { getuuid } from '../utils/common';
import { addNewMessage, createTask, createUpdateGroup, createUpdateUserStory, getGroup } from '../realm/RealmHelper';
import { getSocket } from './socket';
import { checkProgressStory } from './grouputil';
import axios from 'axios';

const saveBrainDump = (data, taskId, userActions, content1, content2, group, user,type) => {
	new Promise((resolve, reject) => {
		let image = data.imageLocation;
		let contentObj = { content1, content2 };
		if(type == "video"){
			contentObj = {...contentObj,video :image }
		}else{
			contentObj = {...contentObj,image }
		}

		let shareuuid = getuuid();

		// Share obj to hold array of content obj.
		let share = { content: [ contentObj ], userId: user._id, _feid: shareuuid };
		let path = ADD_BRAINDUMP.replace('{}', group._id);

		axios
			.post(path, { ...share, taskId })
			.then((res) => {
				let latestGroup = res.data.userTaskGroup;
				latestGroup.messages = group._team.conversation.messages;
				checkProgressStory(latestGroup);
				const newGroup = getGroup(group._id)[0]; //somehow it returns an array

				createUpdateGroup(res.data.userTaskGroup);

				/*
            Needed to have the share populated into the this.props.user.shares. THis is used in the export share in the dashboard
            Should just add the share to the state instead - need to synch with login
            */
				userActions.fetchUserProfile(user._id);

				resolve('Snapshot Uploaded! :)');
			})
			.catch((err) => {
				reject('Unable to upload your snapshot :(');
			});
	});
};

const createFormData = (photo, body) => {
	return new Promise((resolve, reject) => {
		try {
			const data = new FormData();
			data.append('image', {
				name: photo.fileName,
				type: photo.type,
				uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', '')
			});

			Object.keys(body).forEach((key) => {
				data.append(key, body[key]);
			});

			resolve(data);
		} catch (error) {
			reject(error);
		}
	});
};

const uploadImage = async (photo, taskId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let data = await createFormData(photo, { userId: '123', taskId: taskId });
			let path = UPLOAD_BRAINDUMP_IMAGE.replace('{}', taskId);

			fetch(path, { method: 'POST', body: data })
				.then((response) => response.json())
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
		} catch (err) {
			reject(err);
		}
	});
};

const initiateBraindump = (imageLocation, user, userActions, content1, content2, group, taskId,type) => {

	return new Promise(async (resolve, reject) => {
		try {
			let generateduuid = getuuid();
			await addNewMessage(
				group,
				content1,
				user._id,
				group._team._id,
				EVENT_BRAINDUMP_COMPLETE,
				generateduuid,
				imageLocation,
				type
			);

			await saveBrainDump({ imageLocation: imageLocation }, taskId, userActions, content1, content2, group, user,type);
			console.log('WWW-emit before');
			getSocket().emit('client:message', {
				msgId: generateduuid, //special id to synch server and client ids
				sender: user._id,
				receiver: group._team._id,
				chatType: 'GROUP_MESSAGE',
				type: EVENT_BRAINDUMP_COMPLETE,
				image: imageLocation,
				userProfile: user,
				time: new Date().toISOString(),
				createdAt: new Date(),
				message: content1,
				groupId: group._id
			});

			resolve();
		} catch (error) {
			reject(error);
		}
	});
};

export const submitScreenShot = (taskId, content1, content2, group, user, userActions, uri, type) => {
	return new Promise(async (resolve, reject) => {
		try {
			let submitURI = type == 'image' ? await resizeImg(uri, 414, 896, 'JPEG', 80) : uri;
			let obj = {
				uri: submitURI,
				fileName: taskId,
				type: type == 'image' ? 'image/png' : type == 'audio' ? 'audio/wav' :  'video/mp4'
			};
			let result = await uploadImage(obj, taskId);
			if (result) {
				await initiateBraindump(result.Location, user, userActions, content1, content2, group, taskId,type);
			}
			resolve(true);
		} catch (error) {
			reject(error);
		}
	});
};
