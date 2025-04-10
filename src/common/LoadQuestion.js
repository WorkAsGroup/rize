import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import HtmlComponent from './HtmlComponent';
import AppStyles from './AppStyles';
import COLORS from './Colors';
import React, { Fragment } from 'react'
import OptionGroup from './OptionGroup';
import { theme } from '../core/theme';
import UserUtils from './UserUtils';




const ReviewLaterButton = ({value,onPress}) =>{
    // const icon = (value === null || value == false) ? require('../../images/circle.png') :  require('../../images/check-circle.png');
    const tintColor = (value === null || value == false) ? '#52b9e6' : '#52b9e6';
    return(
        <TouchableOpacity onPress={onPress}>
        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
            {/* <Image source={icon} style={{ width:16, height:16,marginRight:5,marginTop:-15,tintColor:tintColor}}/> */}
            <Text style={[
                // AppStyles.oddMMedium,
                {color:'#52b9e6',textAlign:'right',marginBottom:15}]}>Mark for Review</Text>
        </View>
        </TouchableOpacity>
    )
}

const ReloadButton = ({onPress}) =>{
    const tintColor='#ff5722';
   return(
        <TouchableOpacity onPress={onPress}>
        <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
            {/* <Image source={require('../../images/fontawesome/redo-alt.png')} style={{ width:16, height:16,marginRight:5,marginTop:-15,tintColor:tintColor}}/> */}
            <Text style={[
                // AppStyles.oddMMedium,
                {color:tintColor,textAlign:'right',marginBottom:15}]}>Reload</Text>
        </View>
        </TouchableOpacity>
    )
}

const LoadQuestion = (props) => {
    // console.log(props, "lsidjceoicoreicoericeoricer")
    const {item,currentQuestionIndex,questionLength,onChangeValue,onSkip,onPrevious=null,onReviewLater,onReload=null,onNext,onSubmit,type='exam'} = props;  
    let {id,question,option1,option2,option3,option4,qtype,inputquestion='',compquestion,mat_question,list1type,list2type,answer,attempted,result,reviewLater,section_name='',section='',explanation,bookmarked,isSubmitted,errorReason} = item;
    const {selectedAnswers, selectedNumber, globalQuestionTypes,currentTab,questions,  handleTextInputChange,
    handleSelectAndNext,handleAnswerSelect, textInputValues} = props;


    // console.log(item, "iurtiuegiuer")
    // let qtypeName = [];

    // for(const qid of inputquestion.split(',')){
    //     const qtypeObj = globalQuestionTypes.find(item => item.id == qid);
    //     if(qtypeObj != undefined){
    //         qtypeName.push(qtypeObj.questiontype);
    //     }
    // }
    
    // qtypeName = qtypeName.toString(); 

    // console.log(selectedAnswers[selectedNumber],selectedNumber, "confirmation")

    if(qtype == 3 || qtype == 9){
        // question = question.replace(/src="/g,'src=\\"');
        // question = question.replace(/" \/>/g,'\\" />');
        question = question.replace(/(\r\n|\r|\n)/g, '<br>');
        question =question.replaceAll("\" alt=\"\"", "\' alt=\'\'");
        question =question.replaceAll("\" ", "\' ");
        question =question.replaceAll("=\"", "=\'");
    }
    let questionTypeName = '';

    if(qtype == '3'){
        questionTypeName = 'Matching';
    }else if(qtype == '5'){
        questionTypeName = 'Comprehension';
    }else if(qtype == '7'){
        questionTypeName = 'General';
    }else if(qtype == '8'){
        questionTypeName = 'Numerical Questions';
    }else if(qtype == '9'){
        questionTypeName = 'Matrix Matching';
    }

  return (
    <View>
     {
                    qtype == 5 && (
                        <Fragment>
                             {/* <ReloadButton onPress={()=>onReload()} /> */}
                        <HtmlComponent 
                            style={{...AppStyles.oddMRegular,color:COLORS.BLACK,fontSize:15,lineHeight:23}} 
                            containerStyle={{ marginBottom:20,marginTop:3}} 
                            baseFontStyle={18}
                            text={`${compquestion}`}
                            tintColor={COLORS.BLACK}
                            />                            

                            <HtmlComponent 
                            style={{...AppStyles.oddMRegular,color:COLORS.BLACK,fontSize:15,lineHeight:23}} 
                            containerStyle={{ marginBottom:40,marginTop:3}} 
                            baseFontStyle={18}
                            text={`${question}`}
                            tintColor={COLORS.BLACK}
                            />

                            



                            <OptionGroup 
                            option1={option1}
                            option2={option2}
                            option3={option3}
                            option4={option4}
                            value={attempted}
                            onChangeValue={(value)=>onChangeValue(value)}
                            selectedAnswers={selectedAnswers}
                            selectedNumber={selectedNumber}
                            />
                  
                        </Fragment>
                    )
                }

                {
                    (qtype == 7 && (answer&&answer.length >= 3 && answer&&answer.includes(','))) && (
                        <Fragment>
                             {/* <ReloadButton onPress={()=>onReload()} /> */}
                            <HtmlComponent  
                            style={{...AppStyles.oddMRegular,color:COLORS.BLACK,fontSize:15,lineHeight:23}} 
                            containerStyle={{ marginBottom:20,marginTop:3}} 
                            baseFontStyle={18}
                            text={`${question}`}
                            tintColor={COLORS.BLACK}
                            />

                           

                            <OptionGroup 
                            option1={option1}
                            option2={option2}
                            option3={option3}
                            option4={option4}
                            value={attempted}
                            multiple={true}
                            onChangeValue={(value)=>onChangeValue(value)}
                            selectedAnswers={selectedAnswers}
                              selectedNumber={selectedNumber}
                            />
                        </Fragment>
                    )

                    }

                    {
                        (qtype == 7 && !(answer&&answer.length >= 3 && answer&&answer.includes(','))) && (
                            <Fragment>
                                {/* <ReloadButton onPress={()=>onReload()} /> */}

                                <HtmlComponent 
                                style={{...AppStyles.oddMRegular,color:COLORS.BLACK,fontSize:15,lineHeight:23}} 
                                containerStyle={{ marginBottom:20,marginTop:3}} 
                                baseFontStyle={18}
                                text={`${question}`}
                                tintColor={COLORS.BLACK}
                                />

                         

                              
                               


                                <OptionGroup 
                                option1={option1}
                                option2={option2}
                                option3={option3}
                                option4={option4}
                                value={attempted}
                                onChangeValue={(value)=>onChangeValue(value)}
                                selectedAnswers={selectedAnswers}
                                  selectedNumber={selectedNumber}
                                />
                            </Fragment>
                    )
                }

                {
                    (qtype == 8) && (
                        <Fragment>
                             {/* <ReloadButton onPress={()=>onReload()} /> */}
                        <HtmlComponent 
                            style={{...AppStyles.oddMRegular,color:COLORS.BLACK,fontSize:15,lineHeight:23}} 
                            containerStyle={{ marginBottom:20,marginTop:3}} 
                            baseFontStyle={18}
                            text={`${question}`}
                            tintColor={COLORS.BLACK}
                            />

                            

                            
                          
<TextInput
                        style={[
                          styles.textInputStyle,
                          {
                            // backgroundColor: theme.textColor1,
                            // borderColor: theme.textColor1,
                            color: theme.textColor,
                          },
                        ]}
                        value={textInputValues[selectedNumber] || ""}
                        onChangeText={(text) => {
                          handleTextInputChange(text, selectedNumber);
                          // console.log("TextInput changed for question:", selectedNumber, "to:", text);
                        }}
                        placeholder={`Enter answer`}
                        keyboardType="numeric"
                        placeholderTextColor={theme.textColor}
                        multiline={true}
                        onSubmitEditing={() => {
                          // console.log("onSubmitEditing called for question:", selectedNumber);
                          handleSelectAndNext(selectedNumber);
                        }}
                        onBlur={() =>
                          handleAnswerSelect(
                            selectedNumber,
                            textInputValues[selectedNumber]
                          )
                        }
                      />

      
                            

                        </Fragment>
                    )
                }

                {
                    (qtype == 3 || qtype == 9) && (
                        
                        <Fragment>
                             {/* <ReloadButton onPress={()=>onReload()} /> */}
                            <HtmlComponent 
                            style={{...AppStyles.oddMRegular,color:COLORS.BLACK,fontSize:15,lineHeight:23}} 
                            containerStyle={{ marginBottom:20,marginTop:3}} 
                            baseFontStyle={18}
                            text={`${mat_question}`}
                            tintColor={COLORS.BLACK}
                            />

                        <View style={{backgroundColor:'#fff',marginHorizontal:-10,paddingHorizontal:10,paddingVertical:10,marginBottom:20,borderRadius:4}}>
                         
                           
                            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>
                                    <Text style={AppStyles.oddMMedium}>List 1</Text>
                                </View>

                                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>
                                <Text style={AppStyles.oddMMedium}>List 2</Text>
                                </View>
                            </View>
                            

                           {
                              UserUtils.isValidJSON(question) &&  
                              JSON.parse(question).map((item,index) =>{
                                   return(

                                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                                         <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>
                                         <HtmlComponent 
                                                style={{...AppStyles.oddMRegular,color:COLORS.BLACK,fontSize:15,lineHeight:23}}
                                                baseFontStyle={18}
                                                text={`(${UserUtils.getIndex(index,list1type)})  ${item.qlist1}`}
                                                tintColor={COLORS.BLACK}
                                                />
                                         </View>
                                         <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>
                                          <HtmlComponent 
                                                style={{...AppStyles.oddMRegular,color:COLORS.BLACK,fontSize:15,lineHeight:23}} 
                                                
                                                baseFontStyle={18}
                                                text={`(${UserUtils.getIndex(index,list2type)})  ${item.qlist2}`}
                                                tintColor={COLORS.BLACK}
                                                />
                                         </View>
                                       </View>
                                     )
                               })
                           }

                          </View> 

                            <OptionGroup 
                            option1={option1}
                            option2={option2}
                            option3={option3}
                            option4={option4}
                            value={attempted}
                            onChangeValue={(value)=>onChangeValue(value)}
                            selectedAnswers={selectedAnswers}
                              selectedNumber={selectedNumber}
                            />
                        </Fragment>
                    )
                }

                {
                    (qtype != 3 && qtype != 9 && qtype != 8 && qtype != 7 && qtype != 5) && (
                        <Fragment>
                             {/* <ReloadButton onPress={()=>onReload()} /> */}
                            <HtmlComponent 
                            style={{...AppStyles.oddMRegular,color:COLORS.BLACK,fontSize:15,lineHeight:23}} 
                            containerStyle={{ marginBottom:20,marginTop:3}} 
                            baseFontStyle={18}
                            text={`${question}`}
                            tintColor={COLORS.BLACK}
                            />



                            <OptionGroup
                            option1={option1}
                            option2={option2}
                            option3={option3}
                            option4={option4}
                            value={attempted}
                            onChangeValue={(value)=>onChangeValue(value)}
                            />
                        </Fragment>
                    )
                }
    </View>
  )
}

export default LoadQuestion

const styles = StyleSheet.create({
    textInputStyle: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 15,
        width: 300,
        marginTop: 20,
        borderColor: "rgba(0, 0, 0, 0.5)",
      },
})