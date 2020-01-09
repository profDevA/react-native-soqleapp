import {StyleSheet} from 'react-native'

export default StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    container: {
        height: 250,
        backgroundColor: '#2dbeb7',
        padding: 10,
        borderRadius: 5,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headingText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    codeInputContainer: {
        alignItems: 'center',
        marginBottom: 35,
        paddingHorizontal: 20
    },
    codeInputStyle: {
      fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        paddingVertical: 5
    },
    submitButton: {
        width: 80,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 100,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    submitText: {
        color: '#2dbeb7',
        fontSize: 20
    },
    iconContainer: {
        width: 40,
        height: 40,
        position: 'absolute',
        top: 7,
        right: -10
    },
    closeIcon: {
        fontSize: 20,
    }
})
