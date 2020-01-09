import React, {
	useState,
	useEffect,
} from 'react'
import {
	Text,
	View,
	Image,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import NetInfo from '@react-native-community/netinfo';

export default NetworkInfo = () => {

	let unsubscribe;
	const [connection, setConnection] = useState(true);

	useEffect(() => {
		unsubscribe = NetInfo.addEventListener(({ isConnected }) => {
			setConnection(isConnected)
		});
		return () => unsubscribe();
	}, []);

	const retyring = () => {
		NetInfo.fetch().then(({ isConnected }) => {
			setConnection(isConnected)
		});
	};

	return (
		<Modal
			animationInTiming={1000}
			useNativeDriver={true}
			transparent={true}
			visible={!connection}
			style={styles.modalContent}
		>
			<View style={styles.container}>
				<Image style={styles.image} source={require('../images/internet.png')} />
				<Text style={styles.firstText}>No Internet connection!</Text>
				<View style={{ flexDirection: 'row' }}>
					<TouchableOpacity
						onPress={retyring}>
						<Text style={styles.secondText}>Retrying</Text>
					</TouchableOpacity>
					<Text style={styles.thirdText}> in 20 seconds</Text>
				</View>
			</View>
		</Modal>
	)
};

const styles = StyleSheet.create({
	container: {
		height: 130,
		opacity: 0.9,
		zIndex: 1,
		width: "100%",
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#dc3232',
	},
	image: {
		width: 30,
		height: 30,
	},
	firstText: {
		marginTop: 5,
		fontSize: 16,
		color: '#fff',
		fontWeight: '500',
		textAlign: 'center',
	},
	secondText: {
		color: '#fff',
		textDecorationLine: 'underline'
	},
	thirdText: {
		color: '#fff',
	},
	modalContent: {
		margin: 0,
		justifyContent: 'flex-start',
	},
});
