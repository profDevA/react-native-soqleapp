import React from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

function MysteryCard(props) {
	
	return (
		<TouchableOpacity
			style={styles.container}
			onPress={() => props.onPressItem(props.id, props.type, props.bonusSparks, props.maxnum)}
		>
			<ImageBackground
				source={require('../../assets/images/rectangles/card_background.png')}
				style={styles.imageBackGround}
				resizeMode={'cover'}
			>
				<View style={styles.innerContainer}>
					<Image
						style={styles.imageVector}
						source={require('../images/card_vector.png')}
						resizeMode={'cover'}
					/>
                    {/* { uri: props.imageURL } */}
					<View style={styles.viewRound}>
						<Image source={{uri: props.imageURL.replace('{}', props.id), priority: FastImage.priority.normal,}} style={styles.imageSoldier} resizeMode={'cover'} />
					</View>
					<View style={styles.viewCurv}>
						<View style={styles.viewCurvInnerLeft}>
							<ImageBackground
								style={styles.imageCurvLeft}
								source={require('../images/left_half_curv.png')}
								resizeMode={'contain'}
							>
								<Image
									style={styles.watch}
									source={require('../images/card_clock.png')}
									resizeMode={'contain'}
								/>
								<Text style={styles.textCount}>
									{`0 `}\{` ${props.maxnum}`}
								</Text>
							</ImageBackground>
						</View>
						<View style={styles.viewCurvInnerRight}>
							<ImageBackground
								style={[ styles.imageCurvLeft, { alignItems: 'flex-end', marginLeft: 10 } ]}
								source={require('../images/right_half_curv.png')}
								resizeMode={'contain'}
							>
								<Text
									style={[ styles.textGo, { transform: [ { rotate: '-35deg' } ] } ]}
								>{`GO!!!`}</Text>
							</ImageBackground>
						</View>
					</View>
					<View style={styles.viewStory}>
						<ImageBackground
							style={styles.descriptionImg}
							source={require('../images/description_effect.png')}
							resizeMode={'contain'}
						>
							<Text style={styles.txtTitle}>{`${props.title}`}</Text>
							<Image
								style={styles.imgLine}
								source={require('../images/shinning_line.png')}
								resizeMode={'cover'}
							/>
							<Text style={styles.txtDescription} numberOfLines={6}>{`${props.description}`}</Text>
							<View style={styles.viewReadMore}>
								<Text style={styles.txtReadMore}>{`Read More...`}</Text>
							</View>
						</ImageBackground>
					</View>
					<View style={styles.viewLogo}>
						<Image
							style={styles.imgLogo}
							source={require('../images/logo_text.png')}
							resizeMode={'cover'}
						/>
					</View>
				</View>
			</ImageBackground>
		</TouchableOpacity>
	);
}

export default MysteryCard;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: 20,
		marginVertical: 20,
		borderRadius: 7
	},
	imageBackGround: {
		width: '100%',
		height: '100%',
		borderRadius: 7
	},
	innerContainer: {
		backgroundColor: '#33E9E7',
		margin: 10,
		flex: 1,
		borderRadius: 7
	},
	imageVector: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		width: '100%',
		height: '100%'
	},
	viewRound: {
		backgroundColor: '#E71457',
		width: 180,
		height: 180,
		borderRadius: 90,
		marginTop: 10,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center'
	},
	imageSoldier: {
		width: 160,
		height: 160,
		borderRadius: 80
	},
	viewCurv: {
		position: 'absolute',
		flex: 1,
		height: 115,
		top: 100,
		width: '100%',
		flexDirection: 'row'
	},
	viewCurvInnerLeft: {
		marginLeft: 10,
		marginRight: 10,
		flex: 1
	},
	viewCurvInnerRight: {
		marginRight: 20,
		marginLeft: 10,
		flex: 1
	},
	imageCurvLeft: {
		marginLeft: 15,
		height: 100,
		width: 130
	},
	watch: {
		marginTop: 54,
		marginLeft: 14,
		height: 23,
		width: 23
	},
	textCount: {
		marginLeft: 14,
		fontFamily: 'OpenSans-Bold',
		fontSize: 16
	},
	textGo: {
		marginRight: 14,
		marginTop: 56,
		fontFamily: 'OpenSans-Bold',
		fontSize: 20,
		color: '#E71457',
		textShadowColor: '#212121',
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: -10
	},
	viewStory: {
		flex: 1,
		marginTop: 30,
		marginLeft: 20,
		marginRight: 20,
		borderWidth: 5,
		backgroundColor: '#A813CD',
		borderColor: '#212121',
		borderRadius: 7
	},
	descriptionImg: {
		flex: 1
	},
	txtTitle: {
		color: '#FFFFFF',
		fontFamily: 'OpenSans-BoldItalic',
		fontSize: 20,
		textAlign: 'center'
	},
	imgLine: {
		height: 10,
		width: '90%',
		marginTop: 5,
		alignSelf: 'center'
	},
	txtDescription: {
		color: '#FFFFFF',
		fontFamily: 'OpenSans-Regular',
		marginTop: 0,
		margin: 10,
		textAlign: 'center',
		fontSize: 16,
		overflow: 'hidden'
	},
	viewReadMore: {
		alignItems: 'flex-end',
	},
	txtReadMore: {
		color: '#FCBBBE',
		fontFamily: 'OpenSans-Regular',
		fontSize: 19,
	},
	viewLogo: {
		height: 40
	},
	imgLogo: {
		alignSelf: 'center'
	}
});
