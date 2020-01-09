import {API_BASE_URL, API_BASE_URL_LOCAL} from './config';
export const STORIES_LIST_API = `${API_BASE_URL}/storiesGetAll`;
export const STORY_HAS_VIDEO_API = `${API_BASE_URL}/story/{}/has-video`;
export const AGENDA_LIST_API = `${API_BASE_URL}/taskgroupGetAll?page={}`;
export const USER_TASK_GROUP_LIST_API =  `${API_BASE_URL}/userTaskGroupWithMessage?page={page}&type={type}`;  // `${API_BASE_URL}/userTaskGroup?page={page}&type={type}`;
export const SAVE_USER_TASK_GROUP_API = `${API_BASE_URL}/saveTaskGroup`;
export const USER_TASK_GROUP_LIST_PATH_API = `userTaskGroupWithMessage?page={page}&type={type}`;//`userTaskGroup?page={page}&type={type}`;
export const TEAM_UPDATE_API = `${API_BASE_URL}/team/{}/`;
export const ACHIEVEMENT_LIST_PATH_API = `/achievement/group/`;
export const USER_ACHIEVEMENT_LIST_PATH_API = `/userAchievement/{}/`;
export const USER_SPARK_LIST_PATH_API = `/userAccounting?id={}`;
export const SAVE_ANSWERS_PATH_API = `/hangoutAnswersSave`;
export const SAVE_TASK_PATH_API = `/taskSavePost`;
export const UPDATE_USER_TASK_GROUP_API_PATH = `/taskGroup/{}`;
export const GET_OBJECTIVE_API_PATH = `/taskRefs/{}`;
export const GET_OBJECTIVE_BY_NAME_API_PATH = `/taskRefsByName/{}`;
export const MAKE_GROUP_PUBLIC_API = `/updateGroupStatusPublic/{}`;
export const MAKE_GROUP_PRIVATE_API = `/updateGroupStatusPrivate/{}`;
export const GET_MESSAGE_LIST_API = `/fetchConversationByParticipants?chatType=GROUP&ids={team_id}`;
export const CHAT_SOCKET_URL = API_BASE_URL;
export const STORY_CHALLENGES_LIST_API_PATH = `/mobile/get-stories-and-challenges`;
export const SAVE_USER_REWARD_API_PATH = `/saveUserReward`;
export const TASK_GROUP_SEQUENCE_API_PATH = `${API_BASE_URL}/getNextSequence`;
export const TASK_GROUP_SET_TASK_COUNTER_API_PATH = `${API_BASE_URL}/setTaskCounter`;
export const TASK_GROUP_SET_SEQUENCE_API_PATH = `${API_BASE_URL}/setNextSequence`;
export const UPLOAD_TASK_FILE_API_PATH = `${API_BASE_URL}/task/{}/upload-files`;
export const SAVE_USER_REWARD_LAST_USED_API_PATH = `useReward?userId={userId}&rewardId={rewardId}`;
// To Leave Team  -->> Geeta
export const LEAVE_TEAM = `${API_BASE_URL}/team/?id={teamId}&userId={userId}`; 
// To Join Team -->> Geeta
export const JOIN_PRIVATE_TEAM = `${API_BASE_URL}/team/add/`;
// To Join Team by secret code -->> Geeta
export const JOIN_BY_SECRET_CODE = `${API_BASE_URL}/joinBySecretCode?secretCode={s_code}&email={email}`;
// To Get Auto Generated Secret Code
// export const REQUEST_SECRET_CODE = `${API_BASE_URL}/requestSecretCode`;
export const CREATE_TEAM_GROUP_API = `${API_BASE_URL}/team-and-group/{}/`;
export const ADD_BRAINDUMP = `${API_BASE_URL}/create-brain-dump/{}`;
export const UPLOAD_BRAINDUMP_IMAGE = `${API_BASE_URL}/create-brain-dump/{}/upload-image`;
