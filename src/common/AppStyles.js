import { StyleSheet, Platform, Dimensions } from 'react-native';
import COLORS from './Colors';
import Fonts from './Fonts';
const { width } = Dimensions.get('window');

const AppStyles = StyleSheet.create({
  //Directions
  row:{
    flexDirection:'row',
  },
  rowBetween:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  rowStart:{
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
  },
  rowEnd:{
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center',
  },
  rowCenter:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  column:{
    flexDirection:'column',
  },
  columnBetween:{
    flexDirection:'column',
    justifyContent:'space-between',
  },
  columnStart:{
    flexDirection:'column',
    justifyContent:'flex-start',
  },
  columnEnd:{
    flexDirection:'column',
    justifyContent:'flex-end',
  },

  // components
  page:{
    flex:1,
    backgroundColor:'#F2F5F8',
  },
  container:{
    flex:1,
  },
  card:{
    borderRadius:4,
    backgroundColor:COLORS.WHITE,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.SHADOW_COLOR,
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: {
          height: 1,
          width: 0,
        },
        zIndex: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  // SplachBackground: {
  //   width: Dimensions.get('window').width,
  //   height: Dimensions.get('window').height,
  //   backgroundColor: '#142031'
  // },
  subjectContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F49D03',
    borderRadius: 8,
    margin: 14,
    paddingBottom: -2,
  },
  subjectStyle: {
    flex: 2,
    width: 100,
    height: 120,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  bookStyle: {
    width: 100,
    height: 120,
    marginLeft: -4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 8,
  }, 
  percentageText: {
    fontSize: 24,
    textAlign: "center",
    color: "#fff",
    fontFamily: Fonts.Ubuntu_Bold,
  },
  completeText: {
    fontSize: 12,
    textAlign: "center",
    color: "#fff",
    fontFamily: Fonts.Ubuntu_Bold,
  },
  materialTabIcon:{
    width:50,
    height:50
  },
  tabIcon:{
    width:20,
    height:20
  },
  statsContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: COLORS.ULTRA_LIGHT_GRAY,
    borderRadius: 6,
    margin: 6,
    paddingTop: 10,
    paddingBottom: 6,
    flex: 1.4,
  },
  ActFeedContainer: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#F49D03',
    borderRadius: 8,
    margin: 14,
  },
  errorText:{
    color:COLORS.RED,
    fontSize:16,
    fontFamily:Fonts.Ubuntu_Regular,
    marginHorizontal:25,
    paddingTop:3,
  },

  // Text 
  headerTitle:{
    fontSize: 24,
    color: COLORS.WHITE,
    fontFamily: Fonts.ProximaNovaSemiBold,
    paddingBottom:5,
  },
  backText:{
    fontSize: 16,
    color: COLORS.WHITE,
    fontFamily: Fonts.SFTProRegular,
  },
  chapterText:{
    color: COLORS.BLACK,
    fontSize: 14,
    fontFamily: Fonts.ProximaNovaBold,
  },

  // Fonts
  evenXSRegular:{
    color: COLORS.BLACK,
    fontSize: 10,
    fontFamily: Fonts.ProximaNovaRegular,
  },
  evenSRegular:{
    color: COLORS.BLACK,
    fontSize: 12,
    fontFamily: Fonts.ProximaNovaRegular,
  },
  evenMRegular:{
    color: COLORS.BLACK,
    fontSize: 14,
    fontFamily: Fonts.ProximaNovaRegular,
  },
  evenLRegular:{
    color: COLORS.BLACK,
    fontSize: 16,
    fontFamily: Fonts.ProximaNovaRegular,
  },
  evenXLRegular:{
    color: COLORS.BLACK,
    fontSize: 18,
    fontFamily: Fonts.ProximaNovaRegular,
  },

  oddXSRegular:{
    color: COLORS.BLACK,
    fontSize: 11,
    fontFamily: Fonts.ProximaNovaRegular,
  },
  oddSRegular:{
    color: COLORS.BLACK,
    fontSize: 13,
    fontFamily: Fonts.ProximaNovaRegular,
  },
  oddMRegular:{
    color: COLORS.BLACK,
    fontSize: 15,
    fontFamily: Fonts.ProximaNovaRegular,
  },
  oddLRegular:{
    color: COLORS.BLACK,
    fontSize: 17,
    fontFamily: Fonts.ProximaNovaRegular,
  },
  oddXLRegular:{
    color: COLORS.BLACK,
    fontSize: 19,
    fontFamily: Fonts.ProximaNovaRegular,
  },

  // Medium
  evenXSMedium:{
    color: COLORS.BLACK,
    fontSize: 10,
    fontFamily: Fonts.ProximaNovaSemiBold,
  },
  evenSMedium:{
    color: COLORS.BLACK,
    fontSize: 12,
    fontFamily: Fonts.ProximaNovaSemiBold,
  },
  evenMMedium:{
    color: COLORS.BLACK,
    fontSize: 14,
    fontFamily: Fonts.ProximaNovaSemiBold,
  },
  evenLMedium:{
    color: COLORS.BLACK,
    fontSize: 16,
    fontFamily: Fonts.ProximaNovaSemiBold,
  },
  evenXLMedium:{
    color: COLORS.BLACK,
    fontSize: 18,
    fontFamily: Fonts.ProximaNovaSemiBold,
  },

  oddXSMedium:{
    color: COLORS.BLACK,
    fontSize: 11,
    fontFamily: Fonts.ProximaNovaSemiBold,
  },
  oddSMedium:{
    color: COLORS.BLACK,
    fontSize: 13,
    fontFamily: Fonts.ProximaNovaSemiBold,
  },
  oddMMedium:{
    color: COLORS.BLACK,
    fontSize: 15,
    fontFamily: Fonts.ProximaNovaSemiBold,
  },
  oddLMedium:{
    color: COLORS.BLACK,
    fontSize: 17,
    fontFamily: Fonts.ProximaNovaSemiBold,
  },
  oddXLMedium:{
    color: COLORS.BLACK,
    fontSize: 19,
    fontFamily: Fonts.ProximaNovaSemiBold,
  },

  //Bold

  evenXSBold:{
    color: COLORS.BLACK,
    fontSize: 10,
    fontFamily: Fonts.ProximaNovaBold,
  },
  evenSBold:{
    color: COLORS.BLACK,
    fontSize: 12,
    fontFamily: Fonts.ProximaNovaBold,
  },
  evenMBold:{
    color: COLORS.BLACK,
    fontSize: 14,
    fontFamily: Fonts.ProximaNovaBold,
  },
  evenLBold:{
    color: COLORS.BLACK,
    fontSize: 16,
    fontFamily: Fonts.ProximaNovaBold,
  },
  evenXLBold:{
    color: COLORS.BLACK,
    fontSize: 18,
    fontFamily: Fonts.ProximaNovaBold,
  },

  oddXSBold:{
    color: COLORS.BLACK,
    fontSize: 11,
    fontFamily: Fonts.ProximaNovaBold,
  },
  oddSBold:{
    color: COLORS.BLACK,
    fontSize: 13,
    fontFamily: Fonts.ProximaNovaBold,
  },
  oddMBold:{
    color: COLORS.BLACK,
    fontSize: 15,
    fontFamily: Fonts.ProximaNovaBold,
  },
  oddLBold:{
    color: COLORS.BLACK,
    fontSize: 17,
    fontFamily: Fonts.ProximaNovaBold,
  },
  oddXLBold:{
    color: COLORS.BLACK,
    fontSize: 19,
    fontFamily: Fonts.ProximaNovaBold,
  },

    //ExtraBold

    evenXSXBold:{
      color: COLORS.BLACK,
      fontSize: 10,
      fontFamily: Fonts.ProximaNovaExtraBold,
    },
    evenSXBold:{
      color: COLORS.BLACK,
      fontSize: 12,
      fontFamily: Fonts.ProximaNovaExtraBold,
    },
    evenMXBold:{
      color: COLORS.BLACK,
      fontSize: 14,
      fontFamily: Fonts.ProximaNovaExtraBold,
    },
    evenLXBold:{
      color: COLORS.BLACK,
      fontSize: 16,
      fontFamily: Fonts.ProximaNovaExtraBold,
    },
    evenXLXBold:{
      color: COLORS.BLACK,
      fontSize: 18,
      fontFamily: Fonts.ProximaNovaExtraBold,
    },
  
    oddXSXBold:{
      color: COLORS.BLACK,
      fontSize: 11,
      fontFamily: Fonts.ProximaNovaExtraBold,
    },
    oddSXBold:{
      color: COLORS.BLACK,
      fontSize: 13,
      fontFamily: Fonts.ProximaNovaExtraBold,
    },
    oddMXBold:{
      color: COLORS.BLACK,
      fontSize: 15,
      fontFamily: Fonts.ProximaNovaExtraBold,
    },
    oddLXBold:{
      color: COLORS.BLACK,
      fontSize: 17,
      fontFamily: Fonts.ProximaNovaExtraBold,
    },
    oddXLXBold:{
      color: COLORS.BLACK,
      fontSize: 19,
      fontFamily: Fonts.ProximaNovaExtraBold,
    },

  // SF PRO Fonts

  evenXSSFRegular:{
    color: COLORS.BLACK,
    fontSize: 10,
    fontFamily: Fonts.SFTProRegular,
  },
  evenSSFRegular:{
    color: COLORS.BLACK,
    fontSize: 12,
    fontFamily: Fonts.SFTProRegular,
  },
  evenMSFRegular:{
    color: COLORS.BLACK,
    fontSize: 14,
    fontFamily: Fonts.SFTProRegular,
  },
  evenLSFRegular:{
    color: COLORS.BLACK,
    fontSize: 16,
    fontFamily: Fonts.SFTProRegular,
  },
  evenXLSFRegular:{
    color: COLORS.BLACK,
    fontSize: 18,
    fontFamily: Fonts.SFTProRegular,
  },

  oddXSSFRegular:{
    color: COLORS.BLACK,
    fontSize: 11,
    fontFamily: Fonts.SFTProRegular,
  },
  oddSSFRegular:{
    color: COLORS.BLACK,
    fontSize: 13,
    fontFamily: Fonts.SFTProRegular,
  },
  oddMSFRegular:{
    color: COLORS.BLACK,
    fontSize: 15,
    fontFamily: Fonts.SFTProRegular,
  },
  oddLSFRegular:{
    color: COLORS.BLACK,
    fontSize: 17,
    fontFamily: Fonts.SFTProRegular,
  },
  oddXLSFRegular:{
    color: COLORS.BLACK,
    fontSize: 19,
    fontFamily: Fonts.SFTProRegular,
  },

  // Medium
  evenXSSFMedium:{
    color: COLORS.BLACK,
    fontSize: 10,
    fontFamily: Fonts.SFTProMedium,
  },
  evenSSFMedium:{
    color: COLORS.BLACK,
    fontSize: 12,
    fontFamily: Fonts.SFTProMedium,
  },
  evenMSFMedium:{
    color: COLORS.BLACK,
    fontSize: 14,
    fontFamily: Fonts.SFTProMedium,
  },
  evenLSFMedium:{
    color: COLORS.BLACK,
    fontSize: 16,
    fontFamily: Fonts.SFTProMedium,
  },
  evenXLSFMedium:{
    color: COLORS.BLACK,
    fontSize: 18,
    fontFamily: Fonts.SFTProMedium,
  },

  oddXSSFMedium:{
    color: COLORS.BLACK,
    fontSize: 11,
    fontFamily: Fonts.SFTProMedium,
  },
  oddSSFMedium:{
    color: COLORS.BLACK,
    fontSize: 13,
    fontFamily: Fonts.SFTProMedium,
  },
  oddMSFMedium:{
    color: COLORS.BLACK,
    fontSize: 15,
    fontFamily: Fonts.SFTProMedium,
  },
  oddLSFMedium:{
    color: COLORS.BLACK,
    fontSize: 17,
    fontFamily: Fonts.SFTProMedium,
  },
  oddXLSFMedium:{
    color: COLORS.BLACK,
    fontSize: 19,
    fontFamily: Fonts.SFTProMedium,
  },

  //Bold

  evenXSSFBold:{
    color: COLORS.BLACK,
    fontSize: 10,
    fontFamily: Fonts.SFTProBold,
  },
  evenSSFBold:{
    color: COLORS.BLACK,
    fontSize: 12,
    fontFamily: Fonts.SFTProBold,
  },
  evenMSFBold:{
    color: COLORS.BLACK,
    fontSize: 14,
    fontFamily: Fonts.SFTProBold,
  },
  evenLSFBold:{
    color: COLORS.BLACK,
    fontSize: 16,
    fontFamily: Fonts.SFTProBold,
  },
  evenXLSFBold:{
    color: COLORS.BLACK,
    fontSize: 18,
    fontFamily: Fonts.SFTProBold,
  },

  oddXSSFBold:{
    color: COLORS.BLACK,
    fontSize: 11,
    fontFamily: Fonts.SFTProBold,
  },
  oddSSFBold:{
    color: COLORS.BLACK,
    fontSize: 13,
    fontFamily: Fonts.SFTProBold,
  },
  oddMSFBold:{
    color: COLORS.BLACK,
    fontSize: 15,
    fontFamily: Fonts.SFTProBold,
  },
  oddLSFBold:{
    color: COLORS.BLACK,
    fontSize: 17,
    fontFamily: Fonts.SFTProBold,
  },
  oddXLSFBold:{
    color: COLORS.BLACK,
    fontSize: 19,
    fontFamily: Fonts.SFTProBold,
  }


});

export default AppStyles;
