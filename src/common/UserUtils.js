
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
// import SecureStorage from 'react-native-secure-storage';
import Moment from 'moment';
const config = {
  service: 'mobile',
}

const NAME = 'name';
const PASSWORD = 'password';
const USER_TOKEN = 'token';
const USER_LEVEL = 'user_level';
const EMAIL = 'email';
const MOBILE = 'mobile';
const PROFILE_PIC = 'profile_pic';
const IS_LOGGEDIN = 'is_loggedin';
const EXAM = 'exam';
const CLASS = 'class';
const SHOW_SLIDER = 'show_slider';
const SUBJECTS  = 'subjects';
const USER_OBJECT = 'user_obj';
const EXAM_QUESTIONS_DATA = 'exam_questions_data';
const GLOBAL_DATA = 'global_data';
const USER_ACCESS = 'user_access';
const MODULE_ACCESS = 'module_access';
const SHOW_SPLASH_POPUP = 'show_splash_popup';
const ENABLED_CHAPTERS = 'enabled_chapters';
const ENABLED_PREVIOUS_SETS = 'enabled_previous_sets';
const ENABLE_EXAM_STARTER = 'enabled_exam_starter';


const UserUtils = {
  getAvatar(avatarUrl) {
    const avatar =
      avatarUrl !== null && avatarUrl !== '' && avatarUrl !== undefined
        ? { uri: global.FILE_PATH+avatarUrl }
        : require('../images/user.png');
    return avatar;
  },

  getErrorMessage(error, screenProps = null) {
    if (typeof error.graphQLErrors !== 'undefined') {
      if (screenProps !== null && error.graphQLErrors['0'].message === 'Unauthenticated.') {
        this.clearStorage(screenProps);
        return 'Unauthenticated.';
      }
      return error.graphQLErrors['0'].message;
    }
    return 'Api not Found Or No Internet Connection';
  },

  generateUUID() {
    // Public Domain/MIT
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); // use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  },

  getJsonObject(urlParams) {
    const jsonObj = JSON.parse(
      `{"${decodeURI(urlParams)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')}"}`
    );
    return jsonObj;
  },

  IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  },

  validateEmail(email) {
    const re = new RegExp(
      [
        '^(([^<>()\\[\\]\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\.,;:\\s@"]+)*)',
        '|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])',
        '|(([a-zA-ZÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜŸäëïöüŸ¡¿çÇŒœßØøÅåÆæÞþÐð:\\-0-9]+\\.)',
        '+[a-zA-ZÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜŸäëïöüŸ¡¿çÇŒœßØøÅåÆæÞþÐð:]{2,}))$',
      ].join('')
    );
    return re.test(email);
  },

  getButtonText(value) {
    return value ? 'SAVE' : 'NEXT';
  },

  getTime(value) {
    let time = '';
    let newValue = '';
    if (value === 0 || value === 24) {
      time = '12:00 AM';
    } else if (value === 12) {
      time = '12:00 PM';
    } else if (value < 12) {
      time = `${value}:00 AM`;
    } else {
      newValue = value - 12;
      time = `${newValue}:00 PM`;
    }
    return time;
  },

  getColor(value){
    return value <= 30 ? '#F05D70' : value > 30 && value <60  ? '#FEAF55' : '#00C596';
  },

  getChapterColor(value){
     if(value < 50){
       return '#F05D70';
     }else if(value >=50 && value < 70){
       return '#DF7E00';
     }else if(value >=70 && value < 90){
      return '#ffd600';
    }else if(value >=90){
      return '#00C596';
    }
  },

  getExamTitle(exam){
    if(exam == 'custom'){
      return 'Custom Exam';
    }else if(exam == 'error_exam'){
      return 'Error Exam';
    }else if(exam == 'adaptive_exam'){
      return 'Adaptive Exam';
    }else if(exam == 'previous_exam'){
      return 'Previous Paper';
    }else if(exam == 'schedule_exam'){
      return 'Schedule Exam';
    }
    return 'Exam';
  },

  isValidJSON(str){
    try {
      JSON.parse(str);
      return true;
    } catch (ex) {
      return false;
    }
  },

  getIndex(index,type){
      const numbers = ['1','2','3','4','5','6','7','8','9','10'];
      const romans = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];
      const alphabets = ['A','B','C','D','E','F','G','H','I','J'];
console.log(index,type, "typeCheck")
      return type == 'numbers' ? numbers[index] : type == 'roman' ? romans[index] : alphabets[index];
  },

  getRomanNumber(value){

    if(value == '1'){
      return 'I';
    }else if(value == '2'){
      return 'II';
    }else if(value == '3'){
      return 'III';
    }else if(value == '4'){
      return 'IV';
    }else if(value == '5'){
      return 'V';
    }else if(value == '6'){
      return 'VI';
    }else if(value == '7'){
      return 'VII';
    }else{
      return 'I';
    }
  },

  compareValues(key, order,type='integer') {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
  
      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];
  
      let comparison = 0;
      if(type == 'string'){
        if (varA > varB) {
          comparison = 1;
        } 
        else if (varA < varB) {
          comparison = -1;
        }
      }else{
        if (Math.round(varA) > Math.round(varB)) {
          comparison = 1;
        } 
        else if (Math.round(varA) < Math.round(varB)) {
          comparison = -1;
        }
      }


      return (
        (order == 'desc') ? comparison * -1 : comparison
      );
    };

  },
  compareObjectValues(key, order, type) {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (type == 'DATE') {

        let date1 = Moment(varA, "DD-MM-YYYY").format("MM/DD/YYYY");
        let date2 = Moment(varB, "DD-MM-YYYY").format("MM/DD/YYYY");
        if (varA === varB) {
          return a.time - b.time;
        }

        return new Date(date1).getTime() > new Date(date2).getTime() ? comparison = 1 : comparison = -1;
      }


      return (
        (order == 'desc') ? comparison * -1 : comparison
      );
    };

  },

//   getHomeSubjectBackgroundImage(subjectId){
//     if(subjectId == '1'){
//       return require('../../images/market/botany_background.png');
//     }else if(subjectId == '2'){
//     //   return require('../../images/market/physics_background.png');
//     return require('../../images/market/botany_background.png');
//     }else if(subjectId == '3'){
//       return require('../../images/market/chemistry_background.png');
//     }else if(subjectId == '4'){
//       return require('../../images/market/maths_background.png');
//     }else if(subjectId == '5'){
//     //   return require('../../images/market/zoology_background.png');
//     return require('../../images/market/botany_background.png');
//     }
//     return require('../../images/market/botany_background.png');
//     // return require('../../images/market/physics_background.png');
//   },

//   getSubjectImage(subjectId){
//     if(subjectId == '1' || subjectId == 'Botany'){
//       return require('../../images/analysis/plant.png');
//     }else if(subjectId == '2' || subjectId == 'Physics'){
//       return require('../../images/analysis/star.png');
//     }else if(subjectId == '3' || subjectId == 'Chemistry'){
//       return require('../../images/analysis/flask.png');
//     }else if(subjectId == '4' || subjectId == 'Mathematics'){
//       return require('../../images/analysis/maths.png');
//     }else if(subjectId == '5' || subjectId == 'Zoology'){
//       return require('../../images/analysis/frog.png');
//     }
//     return require('../../images/analysis/plant.png');
//   },

//   getResultSubjectImage(subjectId){
//     if(subjectId == '1' || subjectId == 'Botany'){
//       return require('../../images/result/botany.png');
//     }else if(subjectId == '2' || subjectId == 'Physics'){
//       return require('../../images/result/physics.png');
//     }else if(subjectId == '3' || subjectId == 'Chemistry'){
//       return require('../../images/result/chemistry.png');
//     }else if(subjectId == '4' || subjectId == 'Mathematics'){
//       return require('../../images/result/botany.png');
//     }else if(subjectId == '5' || subjectId == 'Zoology'){
//       return require('../../images/result/zoology.png');
//     }
//     return require('../../images/result/grand_active.png');
//   },

//   getTransparentSubjectImage(subjectId){
//     if(subjectId == '1' || subjectId == 'Botany'){
//       return require('../../images/transparent/botany.png');
//     }else if(subjectId == '2' || subjectId == 'Physics'){
//       return require('../../images/transparent/physics.png');
//     }else if(subjectId == '3' || subjectId == 'Chemistry'){
//       return require('../../images/transparent/chemistry.png');
//     }else if(subjectId == '4' || subjectId == 'Mathematics'){
//       return require('../../images/transparent/maths.png');
//     }else if(subjectId == '5' || subjectId == 'Zoology'){
//       return require('../../images/transparent/zoology.png');
//     }
//     return require('../../images/transparent/physics.png');
//   },

  getSubjectColor(subjectId){
    if(subjectId == '1' || subjectId == 'Botany'){
      return '#00B186';
    }else if(subjectId == '2' || subjectId == 'Physics'){
      return '#EA9909';
    }else if(subjectId == '3' || subjectId == 'Chemistry'){
      return '#2A90E0';
    }else if(subjectId == '4' || subjectId == 'Mathematics'){
      return '#8F4E02';
    }else if(subjectId == '5' || subjectId == 'Zoology'){
      return '#8F4E02';
    }
    return '#00B186';
  },

  getResultSubjectColor(subjectId){
    if(subjectId == '1' || subjectId == 'Botany'){
      return '#3ac555';
    }else if(subjectId == '2' || subjectId == 'Physics'){
      return '#ee5d70';
    }else if(subjectId == '3' || subjectId == 'Chemistry'){
      return '#0960ce';
    }else if(subjectId == '4' || subjectId == 'Mathematics'){
      return '#01040a';
    }else if(subjectId == '5' || subjectId == 'Zoology'){
      return '#c37800';
    }
    return '#ee5d70';
  },

//   getComplexityImage(complexityId){
//     if(complexityId == '1' || complexityId == 'Easy'){
//       return require('../../images/result/easy.png');
//     }else if(complexityId == '2' || complexityId == 'Moderate'){
//       return require('../../images/result/moderate.png');
//     }else if(complexityId == '3' || complexityId == 'Difficult'){
//       return require('../../images/result/difficult.png');
//     }else if(complexityId == '5' || complexityId == 'Highly Difficult'){
//       return require('../../images/result/high_difficult.png');
//     }
//     return require('../../images/result/high_difficult.png');
//   },

  getGradientColor(name){
    const botanyScreen = ['#68AC33','#028163'];
    const physicsScreen = ['#FEAF55','#F05D70'];
    const chemistryScreen = ['#55B5FE','#2091E9','#0060CE'];
    const mathematicsScreen = ['#6D6D6D','#6D6D6D','#00040A']
    const zoologyScreen = ['#C57B00','#922E01'];
    const resumeScren = ['#A7A7A7','#17324F'];
    const analysisScreen = ['#AECCE7','#9AA1B4'];
    const readyExamScreen = ['#00C596','#064E3D'];
    const errorExamScreen = ['#B50000','#481313'];
    const semiGrandExamScreen = ['#FEAF55','#DF7E00'];
    const grandExamScreen = ['#1ED69E','#17324F'];
    const chapterExamScreen = ['#FEAF55','#DF7E00'];
    const cumulativeExamScreen = ['#1ED69E','#17324F'];
    const bookmarkScreen = ['#6D6D6D','#1B2430'];
    const notesScreen = ['#6D6D6D','#1B2430'];
    const practiceScreen = ['#5147A5','#2D24A2'];
    const learnScreen = ['#077EE6','#0060CE'];
    const scheduleScreen = ['#1ED69E','#17324F'];

    if(name == '1'){
      return botanyScreen;
    }
    else if(name == '2'){
      return physicsScreen;
    }
    else if(name == '3'){
      return chemistryScreen;
    }
    else if(name == '4'){
      return mathematicsScreen;
    }
    else if(name == '5'){
      return zoologyScreen;
    }
    else if(name == 'resume'){
      return resumeScren;
    }
    else if(name == 'practice'){
      return practiceScreen;
    }
    else if(name == 'learn'){
      return learnScreen;
    }
    else if(name == 'analysis'){
      return analysisScreen;
    }
    else if(name == 'ready_exam'){
      return readyExamScreen;
    }
    else if(name == 'schedule_exam'){
      return scheduleScreen;
    }
    else if(name == 'error_exam'){
      return errorExamScreen;
    }
    else if(name == 'semi_grand'){
      return semiGrandExamScreen;
    }
    else if(name == 'grand'){
      return grandExamScreen;
    }
    else if(name == 'chapter'){
      return chapterExamScreen;
    }
    else if(name == 'cumulative'){
      return cumulativeExamScreen;
    }
    else if(name == 'bookmark'){
      return bookmarkScreen;
    }
    else if(name == 'notes'){
      return notesScreen;
    }
    return chemistryScreen;

  },

//   getContentIcons(contentType){
//     let image = require('../../images/icons/formula_short_logo.png');
//     //  require('../../images/icons/content_short_logo.png');

//     if(contentType == '2'){
//       image = require('../../images/icons/formula_short_logo.png');
//     }else if(contentType == '3'){
//       image = require('../../images/icons/reaction_short_logo.png');
//     }else if(contentType == '4'){
//       image = require('../../images/icons/numericals_short_logo.png');
//     }else if(contentType == '6'){
//       image = require('../../images/icons/constants_short_logo.png');
//     }else if(contentType == '7'){
//       image = require('../../images/icons/exceptions_short_logo.png');
//     }else if(contentType == '10'){
//       image = require('../../images/icons/shapes_short_logo.png');
//     }else if(contentType == '11'){
//       image = require('../../images/icons/chemical_short_logo.png');
//     }else if(contentType == '12'){
//       image = require('../../images/icons/named_reactions_short_logo.png');
//     }else if(contentType == '13'){
//       image = require('../../images/icons/reaction_short_logo.png');
//     }

//     return image;
//   },

  getExamName(exam_id){
    if(exam_id == '1'){
      return 'NEET';
    }else if(exam_id == '2'){
      return 'IITJEE';
    }
    return '';
  },

//   getExamLogo(exam_id){
//     if(exam_id == '1'){
//       return require('../../images/icons/formula_short_logo.png');
//     }else if(exam_id == '2'){
//       return require('../../images/icons/formula_short_logo.png');
//     }
//     return require('../../images/icons/formula_short_logo.png');
//   },

  getUID(length=8) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  getRatingText(rating){
    if(rating == '1'){
      return 'Poor';
    }else if(rating == '2'){
      return 'Average';
    }else if(rating == '3'){
      return 'Good';
    }else if(rating == '4'){
      return 'Very Good';
    }else if(rating == '5'){
      return 'Excellent';
    }
    return '';
  },

  /* Set AsyncStorage Data */

  async setName(params) {
    try {
      await EncryptedStorage.setItem(
        NAME,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("NAME",error)
        // There was an error on the native side
    }
  },
  async setPassword(params) {
    try {
      await EncryptedStorage.setItem(
        PASSWORD,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("PASSWORD",error)
        // There was an error on the native side
    }
  },
  async setToken(params) {
    try {
      await EncryptedStorage.setItem(
        USER_TOKEN,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("USER_TOKEN",error)
        // There was an error on the native side
    }
  },

  async setUserLevel(params) {
    try {
      await EncryptedStorage.setItem(
        USER_LEVEL,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("USER_LEVEL",error)
        // There was an error on the native side
    }
  },
  
  async setEmail(params) {
    try {
      await EncryptedStorage.setItem(
        EMAIL,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("EMAIL",error)
        // There was an error on the native side
    }
  },  
  async setClass(params) {
    try {
      await EncryptedStorage.setItem(
        CLASS,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("CLASS",error)
        // There was an error on the native side
    }
  },  
  async setMobile(params) {
    try {
      await EncryptedStorage.setItem(
        MOBILE,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("MOBILE",error)
        // There was an error on the native side
    }
  },
  async setProfilePic(params) {
    try {
      await EncryptedStorage.setItem(
        PROFILE_PIC,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("PROFILE_PIC",error)
        // There was an error on the native side
    }
  },
  async setExam(params) {
    try {
      await EncryptedStorage.setItem(
        EXAM,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("EXAM",error)
        // There was an error on the native side
    }
  },
  async setIsLoggedIn(params) {
    try {
      await EncryptedStorage.setItem(
        IS_LOGGEDIN,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("IS_LOGGEDIN",error)
        // There was an error on the native side
    }
  },
  async setShowSlider(params) {
    try {
      await EncryptedStorage.setItem(
        SHOW_SLIDER,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("SHOW_SLIDER",error)
        // There was an error on the native side
    }
  },

  async setSplashPopup(params) {
    try {
      await EncryptedStorage.setItem(
        SHOW_SPLASH_POPUP,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("SHOW_SPLASH_POPUP",error)
        // There was an error on the native side
    }
  },
  async setSubjects(params) {
    try {
      await EncryptedStorage.setItem(
        SUBJECTS,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("SUBJECTS",error)
        // There was an error on the native side
    }
  },
  async setUserObject(params) {
    try {
      await EncryptedStorage.setItem(
        USER_OBJECT,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("USER_OBJECT",error)
        // There was an error on the native side
    }
  },

  async setExamData(params) {
    try {
      await EncryptedStorage.setItem(
        EXAM_QUESTIONS_DATA,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("EXAM_QUESTIONS_DATA",error)
        // There was an error on the native side
    }
  },

  async setExamStartTimer(params) {
    try {
      await EncryptedStorage.setItem(
        ENABLE_EXAM_STARTER,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("ENABLE_EXAM_STARTER",error)
        // There was an error on the native side
    }
  },
  async setGlobalData(params) {
    try {
      await EncryptedStorage.setItem(
        GLOBAL_DATA,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("GLOBAL_DATA",error)
        // There was an error on the native side
    }
  },
  async setUserAccess(params) {
    try {
      await EncryptedStorage.setItem(
        USER_ACCESS,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("USER_ACCESS",error)
        // There was an error on the native side
    }
  },
  async setModuleAccess(params) {
    try {
      await EncryptedStorage.setItem(
        MODULE_ACCESS,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("MODULE_ACCESS",error)
        // There was an error on the native side
    }
  },
  async setEnabledChapters(params) {
    try {
      await EncryptedStorage.setItem(
        ENABLED_CHAPTERS,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("ENABLED_CHAPTERS",error)
        // There was an error on the native side
    }
  },

  async setEnabledPreviousSets(params) {
    try {
      await EncryptedStorage.setItem(
        ENABLED_PREVIOUS_SETS,
          JSON.stringify({
            params
          })
      );      
    } catch (error) {
        console.log("ENABLED_PREVIOUS_SETS",error)
        // There was an error on the native side
    }
  },
 
  /* Get AsyncStorage Data */
  async getName() {
    try {   
      const value = await EncryptedStorage.getItem(NAME);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async getPassword() {
    try {   
      const value = await EncryptedStorage.getItem(PASSWORD);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async getUserLevel() {
    try {   
      const value = await EncryptedStorage.getItem(USER_LEVEL);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async getEmail() {
    try {   
      const value = await EncryptedStorage.getItem(EMAIL);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async getMobile() {
    try {   
      const value = await EncryptedStorage.getItem(MOBILE);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async getProfilePic() {
    try {   
      const value = await EncryptedStorage.getItem(PROFILE_PIC);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async getExam() {
    try {   
      const value = await EncryptedStorage.getItem(EXAM);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async getClass() {
    try {   
      const value = await EncryptedStorage.getItem(CLASS);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async getToken() {
    try {   
      const value = await EncryptedStorage.getItem(USER_TOKEN);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async getIsLoggedIn() {
    try {   
      const value = await EncryptedStorage.getItem(IS_LOGGEDIN);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async getShowSlider() {
    try {   
      const value = await EncryptedStorage.getItem(SHOW_SLIDER);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async getSplashPopup() {
    try {   
      const value = await EncryptedStorage.getItem(SHOW_SPLASH_POPUP);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async getSubjects() {
    try {   
      const value = await EncryptedStorage.getItem(SUBJECTS);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async getUserObject() {
    try {   
      const value = await EncryptedStorage.getItem(USER_OBJECT);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async getExamData() {
    try {   
      const value = await EncryptedStorage.getItem(EXAM_QUESTIONS_DATA);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async getExamStartTimer() {
    try {   
      const value = await EncryptedStorage.getItem(ENABLE_EXAM_STARTER);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async getGlobalData() {
    try {   
      const value = await EncryptedStorage.getItem(GLOBAL_DATA);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async getUserAccess() {
    try {   
      const value = await EncryptedStorage.getItem(USER_ACCESS);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async getModuleAccess() {
    try {   
      const value = await EncryptedStorage.getItem(MODULE_ACCESS);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async getEnabledChapters() {
    try {   
      const value = await EncryptedStorage.getItem(ENABLED_CHAPTERS);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async getEnabledPreviousSets() {
    try {   
      const value = await EncryptedStorage.getItem(ENABLED_PREVIOUS_SETS);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async clearExamData() {
    try {   
      const value = await EncryptedStorage.getItem(EXAM_QUESTIONS_DATA);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },
  async clearExamStartTimer() {
    try {   
      const value = await EncryptedStorage.getItem(ENABLE_EXAM_STARTER);
  
      if (value !== null) {
        return JSON.parse(value).params;
      }
    } catch (error) {
      return null;
    }
  },

  async clearStorage() {
    await EncryptedStorage.removeItem(NAME);
    await EncryptedStorage.removeItem(EMAIL);
    await EncryptedStorage.removeItem(MOBILE);
    await EncryptedStorage.removeItem(PROFILE_PIC);
    await EncryptedStorage.removeItem(EXAM);
    await EncryptedStorage.removeItem(CLASS);
    await EncryptedStorage.removeItem(IS_LOGGEDIN);
    await EncryptedStorage.removeItem(USER_LEVEL);
    await EncryptedStorage.removeItem(USER_TOKEN);
    await EncryptedStorage.removeItem(PASSWORD);
    await EncryptedStorage.removeItem(SHOW_SPLASH_POPUP);
    await EncryptedStorage.removeItem(EXAM_QUESTIONS_DATA);
    await EncryptedStorage.removeItem(ENABLE_EXAM_STARTER);
    await EncryptedStorage.removeItem(GLOBAL_DATA);
    await EncryptedStorage.removeItem(USER_ACCESS);

    // await SecureStorage.removeItem(SHOW_SLIDER);
    await AsyncStorage.clear();
  },

};

export default UserUtils;
