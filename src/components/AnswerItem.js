//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

// create a component
class AnswerItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shared : false
        }
        this.uncheckByRef = this.uncheckByRef.bind(this);
    }
    uncheckByRef() {
        if(this.state.shared) {
            this.setState({shared: !this.state.shared});
        }
    }
    render() {
        let {questionContent, showShareModal, itemClick} = this.props;
        return (
            <TouchableOpacity style={styles.dataRow} onPress={()=> {
                itemClick(!this.state.shared);
                this.setState({shared: !this.state.shared});
                }}>
                <TouchableOpacity  style={{  }} onPress={ () => {
                    if(this.state.shared) {
                        showShareModal()
                    }
                }} >
                {
                    this.state.shared ? 
                    <Image style={{ width: 30, width: 30 }} source={require('../../assets/images/Share.png')}/>
                    :
                    <View style={styles.roundColor} />
                }
                </TouchableOpacity>
                <Text style={styles.textAnsColor}>{questionContent.content}</Text>
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    dataRow: {
        marginHorizontal: 20,
        alignItems: 'center',
        marginTop: 8,
        marginLeft: 26,
        marginRight: 26,
        marginBottom: 8,
        borderBottomWidth: 1.5,
        borderColor: '#FF4763',
        flexDirection: 'row'
    },
    roundColor: {
        height: 20,
        width: 20,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#FF4763'
    },
    textAnsColor: {
        color: 'white',
        fontWeight: '400',
        fontSize: 14,
        fontFamily: 'SF UI Display',
        marginLeft: 8,
        marginRight: 18,
        marginBottom: 10
    },
});

//make this component available to the app
export default AnswerItem;
