import { StyleSheet } from 'react-native'
import { MAIN_COLOR } from '../constants'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'

export default StyleSheet.create({
  companyButton: {
    backgroundColor: 'white',
    borderColor: MAIN_COLOR,
    borderWidth: 1,
    marginRight: 10,
    marginLeft: 10
  },
  txtBioShow: {
    marginLeft: 12
  },
  topProfile: {
    paddingBottom: 20,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    marginBottom: 12

  },
  headerIcon: {
    marginRight: 10
  },
  headerMenuIcon: {
    fontSize: 15,
    color: 'black'
  },
  blockIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
    marginRight: 10
  },
  blurBg: {
    backgroundColor: '#F8F8F8'

  },
  txtArea: {
    marginLeft: 12
  },
  card: {
    marginLeft: 12,
    marginRight: 12,
    borderRadius: 10
  },
  cardImage: {
    height: 200,
    width: null,
    flex: 1,
    borderRadius: 5
  },
  cardBody: {
    margin: 10,
    justifyContent: 'flex-start'
  },
  cardTitle: {
    fontSize: 15
  },
  cardDescription: {
    color: 'rgba(19, 12, 56, 0.5)'
  },
  joinButton: {
    marginTop: 5,
    backgroundColor: MAIN_COLOR
  },
  avatar: {
    width: 60,
    height: 60,
    marginLeft: 10
  },
  inputName: {
    fontSize: 20
  },
  input: {
    fontSize: 15,
    marginLeft: 10
  },
  profileStats: {
    flexDirection: 'row',
    marginTop: 3
  },
  profileTokenIcon: {
    color: '#9600A1',
    fontSize: 16,
    paddingRight: 3
  },
  profileTokenText: {
    color: '#9600A1',
    fontSize: 15
  },
  txtDescription: {
        // marginTop:10,
    margin: 10,
    fontSize: 14,
    color: '#000000'
        // alignSelf:'center',
        // backgroundColor:'yellow',
  },
  viewLikeComments: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: 10
  },
  textInput: {
    color: 'white',
    borderRadius: 5
  },
    // Bottom news feed
  viewContainImage: {
        // width:'90%',
        // margin:10,
    borderRadius: 10,
        // height:200,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.5,
    alignSelf: 'center',
    backgroundColor: 'white',
    width: wp('90%'),
    margin: 10
  },
  imgStyle: {
    alignSelf: 'center',
    width: '100%',
    height: hp('25%'),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  txtMin: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    fontSize: 14,
    color: 'rgba(19, 12, 56, 0.5)' // 'black',

  },
  textGrayLine: {
    fontSize: 14,
    color: 'gray',
    alignSelf: 'center'
  },
  txtIluminates: {
    fontSize: 12,
    color: '#20B8BE',
    marginRight: 2,
    marginLeft: 2
  },
  listContainer: {
    marginTop: 10,
    width: '100%',
    height: '79%'
        // backgroundColor:'red',
  },
  listStyle: {
        // marginBottom:100
  },
  bottomImageIconStyle: {
    marginRight: 5
  },
  buttonLike: {
    flexDirection: 'row'
  },
  buttonComment: {
    marginLeft: 8,
    flexDirection: 'row'
  },
  txtLike: {
    marginLeft: 5,
    color: 'rgba(19, 12, 56, 0.5)'
  },
  txtComment: {
    marginLeft: 5,
    color: 'rgba(19, 12, 56, 0.5)'
  },
  modalButton:
  {
    alignItems: 'center',
    height: hp('5%'),
    justifyContent: 'center',
    borderRadius: hp('5%'),
    width: wp('70%'),
    marginBottom: hp('1%')
  },
  sendFeedbackButton: { alignItems: 'center', paddingTop: hp('3%') },
  description: { height: hp('15%'), borderColor: '#ffffff', borderWidth: 1, width: wp('80%'), borderRadius: wp('2%'), marginBottom: hp('2%') },
  modalSendFeedBack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  sendFeedbackContainer: {
    backgroundColor: '#10123b',
    paddingVertical: 25,
    paddingHorizontal: 10,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  myaccountsItem : {flexDirection : 'row',justifyContent : 'space-around',marginVertical : wp('10%') },
  myaccountSubContainer : {flex: 1,flexDirection : 'row',justifyContent : 'space-around'},
  helpText: { color: '#ffffff',
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: '500' },
    flexStart : {alignItems: 'flex-start'},
    facebookRow : {flexDirection : 'row',justifyContent : 'space-around',flex : 1},
    flexEnd : {alignItems: 'flex-end'},
    colorWhite:  {color : "#ffffff",fontWeight: '500'},
    paddingWhiteRight:  {color : "#ffffff",fontWeight: '500'},

  closeButton: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: 7,
    right: -10
  },
  modalButtonSubmit: { backgroundColor: '#800094', width: wp('40%') },
  submitText: { color: '#ffffff', textAlign: 'center' },
  submitModal: { marginVertical: 40 },
  thumbnailImage: {height: wp('20%'), width: wp('20%') },
  marginTop: {marginTop: wp('10%')},
  marginBottom: {marginBottom: wp('10%')},
  closeIcon: {
    color: '#ffffff'
  },
  dropdown: {width: wp('70%'), paddingBottom: wp('5%')},
  pickerStyle: {height: 10},
  dropdownOverlay: {margin: 0, padding: 0, height: wp('10%')},
  faqTitle: { fontSize: 18 },
  faqText: {fontSize: 16, color: '#8F8BA0'},
  marginBottomFaq: {marginBottom: wp('5%'), paddingBottom: 0},
  lineFaq: {height: 1, width: wp('70%'), backgroundColor: '#9600A1' },
  modalFaq: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  sendFeedbackContainerFaq: {
    height: hp('60%'),
    borderRadius: wp('10%')
  },
  lastFaqButtons: { flexDirection: 'row'},
  chatToSomeOne: {
    borderColor: '#ffffff', borderWidth: 2, borderRadius: wp('5%'), height: hp('5%'), width: wp('40%'), justifyContent: 'center', marginRight: wp('2%')
  },
  submitATicket: {
    borderRadius: wp('5%'), backgroundColor: '#ffffff', width: wp('30%'), justifyContent: 'center', height: hp('5%'), width: wp('40%'), marginLeft: wp('2%')
  },
  submitTicketText: { color: '#10123b', textAlign: 'center' },
  latButtonFont: { fontSize: 8, fontWeight: '500'},
  imageFaqs: {width: wp('50%'), height: wp('20%')},
  imageUrlView: {alignItems: 'center', paddingBottom: wp('5%')},
  associateContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  associateView1: {
    minHeight: 380,
    marginHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#130C38'
  },
  associateTitle: {
    fontSize: 22,
    fontFamily: 'SF UI Display',
    color: 'white',
    textAlign: 'center',
    marginTop: 16
  }
})
