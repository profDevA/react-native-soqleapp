import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    contentView: {
        flex: 1,
        backgroundColor: '#2C2649'
    },
    groupTagsView: {
        padding: 5,
    },
    groupTag: {
        margin: 5,
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#1FBEB8',
        overflow: 'hidden',
        color: '#1FBEB8',
    },
    achievementTile: {
        backgroundColor: '#ffffff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    achievementTitle: {
        color: '#000000',
        fontSize: 18,
        paddingBottom: 1,
    },
    achievementImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        marginRight: 10,
    },
    achievementText: {
        color: 'rgba(0, 0, 0, 0.5)',
        fontSize: 14,
    },
    achievementTags: {
        marginTop: 6,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center'
    },
    achievementTag: {
        backgroundColor: '#9600A1',
        overflow: 'hidden',
        borderRadius: 14,
        color: '#ffffff',
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 14,
        marginTop: 5,
        marginRight: 6,
        
    },
    achievementStatus: {
        overflow: 'hidden',
        color: '#1FBEB8',
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        marginTop: 5,
        marginRight: 6,
        fontWeight: '500'
    },
    completionStatus: {
        width:100,
        height:4,
        backgroundColor:'#d8d8d8',
        borderRadius:2,
        marginRight:6
    },
    progressBar: {
        height:4,
        backgroundColor:'#1fbeb8',
        borderRadius:2
    }
});