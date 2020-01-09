import React from 'react';
import { StyleSheet, Text, View, Modal, TextInput, TouchableOpacity,
         Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
class DialogInput extends React.Component{
  constructor(props){
    super(props);
    this.state = { inputModal: '', openning: true }
  }

  render(){
    let title = this.props.title || '';
    let hintInput = this.props.hintInput || '';
    let value = '';
    if (!this.state.openning) {
      value = this.state.inputModal;
    }else{
      value = this.props.initValueTextInput ? this.props.initValueTextInput : '';
    }

    let textProps = this.props.textInputProps || null;
    let modalStyleProps = this.props.modalStyle || {};
    let dialogStyleProps = this.props.dialogStyle || {};
    var cancelText = this.props.cancelText || 'Cancel';
    var submitText = this.props.submitText || 'Submit';
    cancelText = (Platform.OS === 'ios')? cancelText:cancelText.toUpperCase();
    submitText = (Platform.OS === 'ios')? submitText:submitText.toUpperCase();

    return(
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.isDialogVisible}
      	onRequestClose={() => {
          this.props.closeDialog();
          this.setState({ inputModal: '' });
      	}}>
        <View style={[styles.container, {...modalStyleProps}]}  >
          <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => { this.props.closeDialog(); this.setState({ inputModal: '',openning: true })}} >
            <View style={[styles.modal_container, {...dialogStyleProps}]} >
              <View style={styles.btn_close_container}>
                <TouchableOpacity style={styles.close_touch_modal}
                  onPress={() => {
                    this.props.closeDialog();
                    this.setState({ inputModal: '',openning: true })
                  }}>
                  <Icon
                              name='close'
                              style={styles.close_icon}
                              size={40}
                          />
                </TouchableOpacity>
              </View>
              <View style={styles.modal_body} >
                <Text style={styles.title_modal}>{title}</Text>
                <Text style={[this.props.message ? styles.message_modal : {height:0} ]}>{this.props.message}</Text>
                <TextInput style={styles.input_container}
                  autoCorrect={(textProps && textProps.autoCorrect==false)?false:true}
                  autoCapitalize={(textProps && textProps.autoCapitalize)?textProps.autoCapitalize:'none'}
                  clearButtonMode={(textProps && textProps.clearButtonMode)?textProps.clearButtonMode:'never'}
                  clearTextOnFocus={(textProps && textProps.clearTextOnFocus==true)?textProps.clearTextOnFocus:false}
                  keyboardType={(textProps && textProps.keyboardType)?textProps.keyboardType:'default'}
                  autoFocus={true}
                  onKeyPress={() => this.setState({ openning: false })}
                  underlineColorAndroid='transparent'
                  placeholder={hintInput}
                  onChangeText={(inputModal) => this.setState({inputModal})}
                  value={value}
                  />
              </View>
              <View style={styles.btn_container}>
                <TouchableOpacity  style={styles.touch_modal}
                  onPress={() => {
                    this.props.submitInput(this.state.inputModal);
                    this.setState({ inputModal: '',openning: true })
                  }}>
                    <View style={styles.TextViewStyle}>
                      <Text style={styles.TextStyle}>{submitText}</Text>
                    </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  TextViewStyle : {
    borderRadius: 10,
    width: '80%',
    marginTop: 10,
    alignSelf: 'center',
    padding: 5,
    backgroundColor: '#9600A1'
  },
  TextStyle : {
    textAlign: 'center',
    color: '#fff',
    padding: 5
  },
  container:{
    flex:1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android:{
        backgroundColor: 'rgba(0,0,0,0.62)'
      }
    }),
  },
  modal_container:{
    marginLeft: 30,
    marginRight: 30,
    backgroundColor:'#fff',
    elevation: 24,
    minWidth: 230,
    borderWidth: 2,
    borderColor: '#9600A1',
    borderRadius: 10,
  },
  modal_body:{
    ...Platform.select({
      ios: {
        padding: 10,
      },
      android: {
        padding: 24,
      },
    }),
  },
  title_modal:{
    fontWeight: 'bold',
    fontSize: 20,
    color: '#3c1464',
    ...Platform.select({
      ios: {
        marginTop: 10,
        textAlign:'center',
        marginBottom: 5,
      },
      android: {
        textAlign:'center',
      },
    }),
  },
  message_modal:{
    fontSize: 16,
    ...Platform.select({
      ios: {
        textAlign:'center',
        marginBottom: 10,
      },
      android: {
        textAlign:'left',
        marginTop: 20
      },
    }),
  },
  input_container:{
    textAlign:'left',
    fontSize: 16,
    color: '#3c1464',
    marginTop: 8,
    borderBottomWidth: 2,
    borderColor: '#3c1464',
  },
  btn_close_container: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    maxHeight: 30,
    paddingTop: 8
  },
  btn_container:{
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    maxHeight: 52,
    width: '100%',
    paddingTop: 8,
    paddingBottom: 8
  },
  divider_btn:{
    ...Platform.select({
      ios:{
      	width: 1,
        backgroundColor: '#B0B0B0',
      },
      android:{
	      width: 0
      },
    }),
  },
  touch_modal:{
    alignSelf: 'center',
    width: 150,
    height: 36
  },
  close_touch_modal:{
    paddingRight: 8,
    minWidth: 5,
    height: 25
  },
  close_icon : {
      color: '#3c1464',
      fontSize: 20,
      alignSelf: 'flex-end'
  },
  btn_modal_left:{
    ...Platform.select({
      fontWeight: "bold",
      ios: {
        fontSize:18,
        color:'#408AE2',
        textAlign:'center',
        borderRightWidth: 5,
        borderColor: '#B0B0B0',
        padding: 10,
	      height: 48,
	      maxHeight: 48,
      },
      android: {
        textAlign:'right',
        color:'#009688',
        padding: 8
      },
    }),
  },
  btn_modal_right:{
    ...Platform.select({
      fontWeight: "bold",
      ios: {
        fontSize:18,
        color:'#408AE2',
        textAlign:'center',
        padding: 10,
      },
      android: {
        textAlign:'right',
        color:'#009688',
        padding: 8
      },
    }),
  },
});
export default DialogInput;