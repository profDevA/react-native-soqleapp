import React, { Component } from 'react';
import {Text, StyleSheet, View, Dimensions, Image} from 'react-native';
import { Content, Card, CardItem, Thumbnail, Left, Right, CheckBox } from 'native-base';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window')
const cardRound = 10;

export class ExportImageView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: props.selected
        }
    }
    onChangeCheck(){
        this.setState({ checked: !this.state.checked})
        this.props.selectedImageItem(this.props.item, this.state.checked);
    }
    dateFormate(dateObj) {
        if(dateObj) {
            return this.dateConversion(dateObj);
        }
        return '';
    }
    dateConversion(dateObj){
        var dd = dateObj.toDateString()
        var arr= dd.split(' ')
        return arr[2]+' '+ arr[1] + ' '+ arr[3] ;
    }
    render(){
        const item = this.props.item;
        return (
        <Content style={{ padding: 5, width: width*0.5 ,maxWidth:width*0.5}}>
            <Card transparent style={{ flex: 0, borderRadius: cardRound, backgroundColor:'#fafafa' }}>
                <View margin={0} padding={0} style={{
                    borderTopLeftRadius: cardRound, borderTopRightRadius: cardRound}}>
                    <FastImage
                        style={{ borderTopLeftRadius: cardRound, borderTopRightRadius: cardRound, height: width*0.5, width: '100%', backgroundColor:'#efefef'}}
                        resizeMode={FastImage.resizeMode.cover}
                        source={{ uri: (item.content && item.content.image) ? item.content.image : ''}}
                    />
                </View>
                <CardItem padding={0} margin={0} style={{ height: 35, borderBottomLeftRadius: cardRound, borderBottomRightRadius: cardRound }}>
                    <Left>
                        <CheckBox
                          checked={this.state.checked}
                          onPress={() => this.onChangeCheck()}
                          color="gray"
                        />
                    </Left>
                    <Right padding={0} margin={0} style={{flexDirection:'row', alignItems:'center'}}>
                        <Image style={styles.timeIconStyle} source={require('../images/Time.png')} />
                        <Text style={{color: '#979797', fontWeight: "normal", fontSize: 8}}>
                            {this.dateFormate((item.content) ? item.content.date : null)}
                        </Text>
                    </Right>
                </CardItem>
            </Card>
        </Content>
        )
    }
}
const styles = StyleSheet.create({
    GroupPicker: {
        height: 35,
        flex: 1,
        marginRight: 60,
        marginLeft: 10,
        borderRadius: 5,
        backgroundColor: '#20beb8',
        color: '#ffffff'
    },
    DownloadAllText: {
        textAlign: 'center',
        color: '#9600A1'
    },
    timeIconStyle:{
        maxHeight: 16,
        maxWidth: 16,
      marginRight: 2
    }
});
