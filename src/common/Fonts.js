import { Platform } from 'react-native';

let PoppinsBold;
let PoppinsMedium;
let PoppinsRegular;
let PoppinsSemiBold;
let PoppinsLight;
let PoppinsSemiBoldItalic;
let CeraRoundProBold;
let UbuntuBold;
let UbuntuBoldItalic;
let UbuntuItalic;
let UbuntuLight;
let UbuntuLightItalic;
let UbuntuMedium;
let UbuntuMediumItalic;
let UbuntuRegular;
let SFTProLight;
let SFTProRegular;
let SFTProMedium;
let SFTProSemiBold;
let SFTProBold;
let SFTProHeavy;
let ProximaNovaBlack;
let ProximaNovaBold;
let ProximaNovaExtraBold;
let ProximaNovaLight;
let ProximaNovaRegular;
let ProximaNovaSemiBold;
let ProximaNovaThin;

Platform.select({
  ios: () => {
    PoppinsBold = 'Poppins-Bold';
    PoppinsMedium = 'Poppins-Medium';
    PoppinsRegular = 'Poppins-Regular';
    PoppinsSemiBold = 'Poppins-SemiBold';
    PoppinsLight = 'Poppins-Light';
    PoppinsSemiBoldItalic = 'Poppins-SemiBoldItalic';
    CeraRoundProBold = 'Cera Round Pro';
    UbuntuBold = 'Ubuntu-Bold';
    UbuntuBoldItalic = 'Ubuntu-BoldItalic';
    UbuntuItalic = 'Ubuntu-Italic';
    UbuntuLight = 'Ubuntu-Light';
    UbuntuLightItalic = 'Ubuntu-LightItalic';
    UbuntuMedium = 'Ubuntu-Medium';
    UbuntuMediumItalic = 'Ubuntu-MediumItalic';
    SFTProLight = 'SFProText-Light';
    SFTProRegular = 'SFProText-Regular';
    SFTProMedium = 'SFProText-Medium';
    SFTProSemiBold = 'SFProText-Semibold';
    SFTProBold = 'SFProText-Bold';
    SFTProHeavy = 'SFProText-Heavy';
    ProximaNovaBlack = 'ProximaNova-Black';
    ProximaNovaBold = 'ProximaNova-Bold';
    ProximaNovaExtraBold = 'ProximaNova-Extrabld';
    ProximaNovaLight = 'ProximaNova-Light';
    ProximaNovaRegular = 'ProximaNova-Regular';
    ProximaNovaSemiBold = 'ProximaNova-Semibold';
    ProximaNovaThin = 'ProximaNovaT-Thin';
  },
  android: () => {
    PoppinsBold = 'Poppins-Bold';
    PoppinsMedium = 'Poppins-Medium';
    PoppinsRegular = 'Poppins-Regular';
    PoppinsSemiBold = 'Poppins-SemiBold';
    PoppinsLight = 'Poppins-Light';
    PoppinsSemiBoldItalic = 'Poppins-SemiBoldItalic';
    CeraRoundProBold = 'Cera-RoundProBold';
    UbuntuBold = 'Ubuntu-Bold';
    UbuntuBoldItalic = 'Ubuntu-BoldItalic';
    UbuntuItalic = 'Ubuntu-Italic';
    UbuntuLight = 'Ubuntu-Light';
    UbuntuLightItalic = 'Ubuntu-LightItalic';
    UbuntuMedium = 'Ubuntu-Medium';
    UbuntuMediumItalic = 'Ubuntu-MediumItalic';
    UbuntuRegular = 'Ubuntu-Regular';
    SFTProLight = 'SF-Pro-Text-Light';
    SFTProRegular = 'SF-Pro-Text-Regular';
    SFTProMedium = 'SF-Pro-Text-Medium';
    SFTProSemiBold = 'SF-Pro-Text-Semibold';
    SFTProBold = 'SF-Pro-Text-Bold';
    SFTProHeavy = 'SF-Pro-Text-Heavy';
    ProximaNovaBlack = 'ProximaNova-Black';
    ProximaNovaBold = 'ProximaNova-Bold';
    ProximaNovaExtraBold = 'ProximaNova-Extrabold';
    ProximaNovaLight = 'ProximaNova-Light';
    ProximaNovaRegular = 'ProximaNova-Regular';
    ProximaNovaSemiBold = 'ProximaNova-Semibold';
    ProximaNovaThin = 'ProximaNova-Thin';
  },
})();

const Fonts = {
  Poppins_Bold: PoppinsBold,
  Poppins_Medium: PoppinsMedium,
  Poppins_Regular: PoppinsRegular,
  Poppins_SemiBold: PoppinsSemiBold,
  Poppins_Light: PoppinsLight,
  Poppins_SemiBoldItalic: PoppinsSemiBoldItalic,
  Cera_RoundProBold: CeraRoundProBold,
  Ubuntu_Bold: UbuntuBold,
  Ubuntu_BoldItalic: UbuntuBoldItalic,
  Ubuntu_Italic: UbuntuItalic,
  Ubuntu_Light: UbuntuLight,
  Ubuntu_LightItalic: UbuntuLightItalic,
  Ubuntu_Medium: UbuntuMedium,
  Ubuntu_MediumItalic: UbuntuMediumItalic,
  Ubuntu_Regular: UbuntuRegular,
  SFTProLight: SFTProLight,
  SFTProRegular: SFTProRegular,
  SFTProMedium: SFTProMedium,
  SFTProSemiBold: SFTProSemiBold,
  SFTProBold: SFTProBold,
  SFTProHeavy: SFTProHeavy,
  ProximaNovaBlack: ProximaNovaBlack,
  ProximaNovaBold: ProximaNovaBold,
  ProximaNovaExtraBold: ProximaNovaExtraBold,
  ProximaNovaLight: ProximaNovaLight,
  ProximaNovaRegular: ProximaNovaRegular,
  ProximaNovaSemiBold: ProximaNovaSemiBold,
  ProximaNovaThin: ProximaNovaThin,
};

export default Fonts;
