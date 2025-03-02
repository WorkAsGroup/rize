import React, { useState, useRef, useEffect,useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    useColorScheme,
    Dimensions,
    Image,
    ScrollView,
    ActivityIndicator,
    Modal,
    Alert,
    TextInput,
    BackHandler,
} from "react-native";
import {StaticRenderer} from "react-native-render-html";
import LinearGradient from "react-native-linear-gradient";
import { darkTheme, lightTheme } from "../theme/theme";
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from "react-native-svg";
import { getPatternSelection, getPreExam, getPreExamdata, getSubmitExamResults } from "../core/CommonService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

const windowWidth = Dimensions.get("window").width;

const ANSWERED_QUESTIONS_KEY = 'answeredQuestions';
const SKIPPED_QUESTIONS_KEY = 'skippedQuestions';
const TAGGED_QUESTIONS_KEY = 'taggedQuestions';
const REVIEWED_QUESTIONS_KEY = 'reviewedQuestions';
const REMAINING_TIME_KEY = 'remainingTime';

const removeHtmlTags = (html) => {
    if (!html) return "";

    let cleanedHtml = html
        .replace(/<p[^>]*>/g, '')
        .replace(/<\/p>/g, '\n')
        .replace(/<img[^>]*src="[^"]*"[^>]*>/g, '')
        .replace(/ /g, " ")
        .replace(/<br\s*[\/]?>/gi, "\n")
        .replace(/<table[^>]*>/g, '')
        .replace(/<\/table>/g, '')
        .replace(/&nbsp;/g, " ")
        .replace(/<span[^>]*style="[^"]*font-size:\s*11\.*[^;]*;[^"]*"[^>]*>/gi, '')
        .replace(/<\/span>/gi, '')
        .replace(/<tr[^>]*>/g, "")
        .replace(/<\/tr>/g, "")
        .replace(/<td[^>]*>/g, "")
        .replace(/<\/td>/g, "")
        .replace(/style="[^"]*"/g, "")
        
        .replace(/valign="[^"]*"/g, "")
        .replace(/width="[^"]*"/g, "")
        .trim()
        .replace(/<style[^>]*>[\s\S]*?<\/style>/g, "");

    return cleanedHtml;
};

const extractImages = (html) => {
    const imageRegex = /<img[^>]+src="([^">]+)"/g;
    let images = [];
    let match;
    while ((match = imageRegex.exec(html)) !== null) {
        images.push(match[1]);
    }
    return images;
};

const RenderContent = ({ html }) => {
    const contentArray = extractContent(html);
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;
    return (
        <View style={[styles.question, { color: theme.textColor }]}>
            {contentArray.map((item, index) => {
                if (item.type === 'text') {
                    return (
                        <Text key={`text-${index}`} style={{ color: theme.textColor, fontSize: 16 }}>
                            {item.content}
                        </Text>
                    );
                } else if (item.type === 'image') {
                    return (
                        <View style={{ backgroundColor: '#fff' }}>
                            <Image
                                key={`image-${index}`}
                                source={{ uri: item.content }}
                                style={{ height: 50, width: 100, resizeMode: 'contain' }}
                            />
                        </View>
                    );
                }
                return null;
            })}
        </View>
    );
};

const extractContent = (html) => {
    const imageRegex = /<img[^>]+src="([^">]+)"/g;
    let contentArray = [];
    let lastIndex = 0;
    let match;

    html = html.replace(/<\/?p[^>]*>/g, '')
        .replace(/\/>?>/g, '>')
        .replace(/ /g, ' ')
        .trim();
    while ((match = imageRegex.exec(html)) !== null) {
        const textBeforeImage = html.slice(lastIndex, match.index).trim();
        if (textBeforeImage) {
            contentArray.push({ type: 'text', content: textBeforeImage });
        }
        contentArray.push({ type: 'image', content: match[1] });

        lastIndex = match.index + match[0].length;
    }

    const remainingText = html.slice(lastIndex).trim();
    if (remainingText) {
        contentArray.push({ type: 'text', content: remainingText });
    }

    return contentArray;
};

export default function StartExam({ navigation, route }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;
    const studentExamId = route?.params?.studentExamId;
    const [selectedSubject, setSelectedSubject] = useState();
    const [selectedNumber, setSelectedNumber] = useState(1);
    const scrollRef = useRef(null);
    const numberCircleRef = useRef(null);
    const [scrollViewWidth, setScrollViewWidth] = useState(0);
    const [numberCircleWidth, setNumberCircleWidth] = useState(0);
    const [exams, setExams] = useState([]);
    const [answeredQuestions, setAnsweredQuestions] = useState({});
    const [skippedQuestions, setSkippedQuestions] = useState({});
    const [taggedQuestions, setTaggedQuestions] = useState({});
    const [reviewedQuestions, setReviewedQuestions] = useState({});
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [remainingTime, setRemainingTime] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [selectedOption, setSelectedOption] = useState(null);
    const [filteredQuestionNumbers, setFilteredQuestionNumbers] = useState([]);
    const [allNum,setAllNum] = useState([]);
    const [pattern, setPattern] = useState([]);
    const [expand, setExpand] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const timerInterval = useRef(null);
    const obj = route?.params?.obj;
    const [session_id , setSessionid] = useState(route?.params?.session_id);
    const examtype = route?.params?.examtype;

    const [subjectName,setSubjectName] = useState([]);
    const [submitModalVisible, setSubmitModalVisible] = useState(false);
    const [textInputValues, setTextInputValues] = useState({});
    const [exam, setExam] = useState([]); 
    const numberCircleRefs = useRef({});
    const [questionsLoading, setQuestionsLoading] = useState(true);
    const handleTextInputChange = (text, questionNumber) => {
        setTextInputValues(prevValues => ({
            ...prevValues,
            [questionNumber]: text,
        }));
    };

    const scrollToQuestion = useCallback((questionNumber) => {
        if (scrollRef.current && numberCircleRefs.current[questionNumber]) {
            numberCircleRefs.current[questionNumber].measureLayout(
                scrollRef.current,
                (x, y, width, height) => {
                    scrollRef.current.scrollTo({ x: x - 10, animated: true }); 
                }
            );
        }
    }, []);

    useEffect(() => {
        scrollToQuestion(selectedNumber); 
    }, [selectedNumber, scrollToQuestion,filteredQuestionNumbers]);

    const handleBackPress = React.useCallback(() => {
        if(!isFirstLoad){
        Alert.alert(
            "Exit Test?",
            "Are you sure you want to exit the test? Your progress will be saved.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => {
                      setIsFirstLoad(true)
                      navigation.goBack();
                    }
                }
            ],
            { cancelable: false }
        );
    }else{
        navigation.goBack()
    }
        return true; 
    }, [navigation,isFirstLoad]);

    useEffect(() => {
        if(!isFirstLoad){
         BackHandler.addEventListener("hardwareBackPress", handleBackPress);
        }
 
         return () => {
           if(!isFirstLoad){
 
             BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
           }
         };
     }, [handleBackPress,isFirstLoad]);
 
      const handleSubjectSelect = (sub) => {
             setExpand(false); 
          setSelectedSubjectId(sub.id);
         setSelectedSubject(sub);
        //  setSelectedNumber(sub.starting_no);
         if (selectedNumber < sub.starting_no || selectedNumber > sub.ending_no) {
            setSelectedNumber(sub.starting_no);
        } else {
            scrollToQuestion(selectedNumber);  
        }
         console.log("setSelectedSubject", sub)
 
     };

     useEffect(() => {
        if (!expand) {  
            scrollToQuestion(selectedNumber); 
        }
    }, [expand, selectedNumber, scrollToQuestion]); 
 
    //  useFocusEffect(
    //     React.useCallback(() => {
    //         return () => {
    //             if(!isFirstLoad){
    //             Alert.alert(
    //                 "Reset Test?",
    //                 "Do you want to reset the test progress?",
    //                 [
    //                     {
    //                         text: "Cancel",
    //                         style: "cancel"
    //                     },
    //                     {
    //                         text: "Yes",
    //                         onPress: async () => {
    //                             try {
    //                                 await AsyncStorage.removeItem(ANSWERED_QUESTIONS_KEY);
    //                                 await AsyncStorage.removeItem(SKIPPED_QUESTIONS_KEY);
    //                                 await AsyncStorage.removeItem(TAGGED_QUESTIONS_KEY);
    //                                 await AsyncStorage.removeItem(REVIEWED_QUESTIONS_KEY);
    //                                 await AsyncStorage.removeItem(REMAINING_TIME_KEY);

    //                                 for (let i = 1; i <= exams.length; i++) {
    //                                     await AsyncStorage.removeItem(`questionStartTime_${i}`);
    //                                 }
    //                             } catch (error) {
    //                                 console.error("Error resetting AsyncStorage:", error);
    //                             }
    //                             setAnsweredQuestions({});
    //                             setSkippedQuestions({});
    //                             setTaggedQuestions({});
    //                             setReviewedQuestions({});
    //                             setRemainingTime(0);
    //                             setSelectedNumber(1);
    //                             setSelectedOption(null);
    //                         }
    //                     }
    //                 ],
    //                 { cancelable: false }
    //             );
    //         }
    //         };
    //     }, [exams.length,isFirstLoad])
    // );

    useEffect(() => {
        loadStoredData();
        getExamPattern();
        if (obj) {
            if (examtype === "previous") {
            getPrevExam()
            } else {
                getExam();
            }
            
        }
    }, []);

    useEffect(() => {
        const loadStoredData = async () => {
            try {
                if (isFirstLoad) { 
                    await AsyncStorage.removeItem(ANSWERED_QUESTIONS_KEY);
                    await AsyncStorage.removeItem(SKIPPED_QUESTIONS_KEY);
                    await AsyncStorage.removeItem(REVIEWED_QUESTIONS_KEY);
                    await AsyncStorage.removeItem(TAGGED_QUESTIONS_KEY);
                    await AsyncStorage.removeItem(REMAINING_TIME_KEY);


                    for (let i = 1; i <= exams?.length; i++) {
                        await AsyncStorage.removeItem(`questionStartTime_${i}`);
                    }
                    setIsFirstLoad(false); 
                }


                const answered = await AsyncStorage.getItem(ANSWERED_QUESTIONS_KEY);
                const skipped = await AsyncStorage.getItem(SKIPPED_QUESTIONS_KEY);
                const reviewed = await AsyncStorage.getItem(REVIEWED_QUESTIONS_KEY);
                const tagged = await AsyncStorage.getItem(TAGGED_QUESTIONS_KEY);

                setAnsweredQuestions(answered ? JSON.parse(answered) : {});
                setSkippedQuestions(skipped ? JSON.parse(skipped) : {});
                setReviewedQuestions(reviewed ? JSON.parse(reviewed) : {});
                setTaggedQuestions(tagged ? JSON.parse(tagged) : {});




                const savedTime = await AsyncStorage.getItem(REMAINING_TIME_KEY);

                if (savedTime) {
                    setRemainingTime(parseInt(savedTime, 10));
                }
            } catch (error) {
                console.error('Error loading stored data:', error);
            }
        };

        loadStoredData();
    }, []);


    const getExamPattern = async () => {
        setIsLoading(true);
        const data = {
            exam_pattern_id: obj.exam_pattern_id,
        }
        try {
            const examPattern = await getPatternSelection(data);
            console.log("examPatternexamPattern", examPattern)
            setPattern(examPattern.data);

            if (examPattern.data && examPattern.data.length > 0) {
                setSelectedSubjectId(examPattern.data[0].id);  
                setSelectedSubject(examPattern.data[0]);
                setSelectedNumber(examPattern.data[0].starting_no)
            }
            // const sub = [];
            // for (let i = start; i <= end && i <= examPattern.data.length; i++) {
            //     sub.push(i).section_name;
            // }
            // setSubjectName(sub);
        } catch (error) {
            console.error("Error examPattern:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadRemainingTime = async () => {
            try {
                const savedTime = await AsyncStorage.getItem(REMAINING_TIME_KEY);
                if (savedTime) {
                    setRemainingTime(parseInt(savedTime, 10));
                }
            } catch (error) {
                console.error("Error loading remaining time:", error);
            }
        };

        loadRemainingTime();
    }, []);

    useEffect(() => {
        const saveRemainingTime = async () => {
            try {
                await AsyncStorage.setItem(REMAINING_TIME_KEY, remainingTime.toString());
            } catch (error) {
                console.error("Error saving remaining time:", error);
            }
        };

        saveRemainingTime();
    }, [remainingTime]);

    useEffect(() => {
        const handleSubjectByQuestion = () => {
            // if (selectedNumber >= 1 && selectedNumber <= 20) {
            //     setSelectedSubjectId(2);
            // } else if (selectedNumber >= 21 && selectedNumber <= 40) {
            //     setSelectedSubjectId(3);
            // } else {
            //     setSelectedSubjectId(4);
            // }
        };

        handleSubjectByQuestion();
    }, [selectedNumber]);

    useEffect(() => {
        if (exams.length > 0) {
            const initialTime = exams.length * 120;
            setRemainingTime(initialTime);

            timerInterval.current = setInterval(() => {
                setRemainingTime((prevTime) => {
                    if (prevTime <= 0) {
                        clearInterval(timerInterval.current);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => {
                clearInterval(timerInterval.current);
            };
        }
    }, [exams]);

    useEffect(() => {
        const loadStoredData = async () => {
            try {
                const answered = await AsyncStorage.getItem(ANSWERED_QUESTIONS_KEY);
                const skipped = await AsyncStorage.getItem(SKIPPED_QUESTIONS_KEY);
                const reviewed = await AsyncStorage.getItem(REVIEWED_QUESTIONS_KEY);
                const tagged = await AsyncStorage.getItem(TAGGED_QUESTIONS_KEY);

                setAnsweredQuestions(answered ? JSON.parse(answered) : {});
                setSkippedQuestions(skipped ? JSON.parse(skipped) : {});
                setReviewedQuestions(reviewed ? JSON.parse(reviewed) : {});
                setTaggedQuestions(tagged ? JSON.parse(tagged) : {});
            } catch (error) {
                console.error('Error loading stored data:', error);
            }
        };

        loadStoredData();
        getExamPattern();

        if (obj) {
            if (examtype === "previous") {
                getPrevExam()
                } else {
                    getExam();
                }
        }
    }, []);

    const loadStoredData = async () => {
        try {
            const answered = await AsyncStorage.getItem(ANSWERED_QUESTIONS_KEY);
            const skipped = await AsyncStorage.getItem(SKIPPED_QUESTIONS_KEY);
            const reviewed = await AsyncStorage.getItem(REVIEWED_QUESTIONS_KEY);
            const tagged = await AsyncStorage.getItem(TAGGED_QUESTIONS_KEY);
            const savedTime = await AsyncStorage.getItem(REMAINING_TIME_KEY);
            await AsyncStorage.removeItem(`questionStartTime_${selectedNumber}`);

            setAnsweredQuestions(answered ? JSON.parse(answered) : {});
            setSkippedQuestions(skipped ? JSON.parse(skipped) : {});
            setReviewedQuestions(reviewed ? JSON.parse(reviewed) : {});
            setTaggedQuestions(tagged ? JSON.parse(tagged) : {});
            setRemainingTime(savedTime ? JSON.parse(savedTime) : 0);
        } catch (error) {
            console.error('Error loading stored answers:', error);
        }
    };

    const handleAnswerSelect = async (questionId, option) => {
        const currentSubject = pattern.find(subject => 
            questionId >= subject.starting_no && questionId <= subject.ending_no
        );
    
        if (!currentSubject) {
            console.error("Question doesn't belong to any subject in the pattern.");
            return; 
        }
    
        const answeredCountForSubject = Object.keys(answeredQuestions).filter(qId => 
            qId >= currentSubject.starting_no && qId <= currentSubject.ending_no
        ).length;
    
        if (answeredCountForSubject >= currentSubject.no_of_qus_answer) {
            Alert.alert("Answer Limit Reached", `You have already answered the maximum allowed questions for ${currentSubject.subject}.`);
            return; 
        }
    
        try {
            const updatedAnswers = { ...answeredQuestions, [questionId]: { selected_ans: option, submit_ans: option } };
            setAnsweredQuestions(updatedAnswers);
            setSelectedAnswers((prev) => ({
                ...prev,
                [selectedNumber]: option,
            }));

            const updatedSkipped = { ...skippedQuestions };
            delete updatedSkipped[questionId];
            setSkippedQuestions(updatedSkipped);

            const updatedReviewed = { ...reviewedQuestions };
            delete updatedReviewed[questionId];
            setReviewedQuestions(updatedReviewed);

            setSelectedOption(option);
            await AsyncStorage.setItem(ANSWERED_QUESTIONS_KEY, JSON.stringify(updatedAnswers));
            await AsyncStorage.setItem(SKIPPED_QUESTIONS_KEY, JSON.stringify(updatedSkipped));
            await AsyncStorage.setItem(REVIEWED_QUESTIONS_KEY, JSON.stringify(updatedReviewed));

        } catch (error) {
            console.error("Error saving answer:", error);
        }
    };

    const handleReviewTag = async (questionId) => {
        try {
            const updatedReviewed = { ...reviewedQuestions, [selectedNumber]: true };
            setReviewedQuestions(updatedReviewed);

            const updatedAnswered = { ...answeredQuestions };
            delete updatedAnswered[selectedNumber];
            setAnsweredQuestions(updatedAnswered);

            const updatedSkipped = { ...skippedQuestions };
            delete updatedSkipped[selectedNumber];
            setSkippedQuestions(updatedSkipped);

            await AsyncStorage.setItem(REVIEWED_QUESTIONS_KEY, JSON.stringify(updatedReviewed));
            await AsyncStorage.setItem(ANSWERED_QUESTIONS_KEY, JSON.stringify(updatedAnswered));
            await AsyncStorage.setItem(SKIPPED_QUESTIONS_KEY, JSON.stringify(updatedSkipped));
        } catch (error) {
            console.error("Error saving reviewed tag:", error);
        }
    };

    const handleSkipQuestion = async () => {
        try {
            const updatedSkipped = { ...skippedQuestions, [selectedNumber]: true };
            setSkippedQuestions(updatedSkipped);

            const updatedAnswers = { ...answeredQuestions };
            delete updatedAnswers[selectedNumber];
            setAnsweredQuestions(updatedAnswers);

            const updatedReviewed = { ...reviewedQuestions };
            delete updatedReviewed[selectedNumber];
            setReviewedQuestions(updatedReviewed);

            setSelectedOption(null);

            await AsyncStorage.setItem(SKIPPED_QUESTIONS_KEY, JSON.stringify(updatedSkipped));
            await AsyncStorage.setItem(ANSWERED_QUESTIONS_KEY, JSON.stringify(updatedAnswers));
            await AsyncStorage.setItem(REVIEWED_QUESTIONS_KEY, JSON.stringify(updatedReviewed));

            moveToNextQuestion();

        } catch (error) {
            console.error("Error skipping question:", error);
        }
    };

    const handleTagQuestion = async () => {
        try {
            const updatedTags = { ...taggedQuestions };
            if (updatedTags[selectedNumber]) {
                delete updatedTags[selectedNumber];
            } else {
                updatedTags[selectedNumber] = true;
            }
            setTaggedQuestions(updatedTags);
            await AsyncStorage.setItem(TAGGED_QUESTIONS_KEY, JSON.stringify(updatedTags));
        } catch (error) {
            console.error("Error tagging question:", error);
        }
    };

    const scrollX = useRef(0);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                x: Math.max(0, scrollRef.current.scrollLeft - 45),
                animated: true,
            });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                x: Math.min(
                    scrollRef.current.scrollLeft + 45,
                    scrollViewWidth - scrollRef.current.offsetWidth 
                ),
                animated: true,
            });
        }
    };

    const getExam = async () => {
        console.log("objobjobj", obj);
        setQuestionsLoading(true);
      
            const datas = {
                exam_paper_id: obj.exam_paper_id,
                exam_session_id: 0,
                type: "schedule_exam",
              };
        
      
          try {
            const examsResponse = await getPreExam(datas);
            setExams(examsResponse.data);
      
            const subjectCounts = {};
      
            examsResponse.data.forEach(exam => {
              const subjectValue = exam.subject !== undefined ? exam.subject : "Unknown Subject";
      
              subjectCounts[subjectValue] = (subjectCounts[subjectValue] || 0) + 1; 
            });
      
            for (const subjectValue in subjectCounts) {
              if (subjectCounts.hasOwnProperty(subjectValue)) {
                console.log(`Subject Value: ${subjectValue}, Object Count: ${subjectCounts[subjectValue]}`);
              }
            }
      
            console.log("Subject Counts:", subjectCounts);
            console.log("Exams Response:", examsResponse);
      
          } catch (error) {
            console.error("Error fetching exams:", error);
          } finally {
            setQuestionsLoading(false);
          }
         
      
         
        }

    const getPrevExam = async () => {
        console.log("objobjobj", obj);
        setQuestionsLoading(true);
      
          const datas = {
            exam_paper_id: obj.exam_paper_id,
            exam_session_id: session_id,
            type: "previous_exam",
          };
    
        
      
          try {
            const examsResponse = await getPreExam(datas);
            setExams(examsResponse.data);
      
            const subjectCounts = {};
      
            examsResponse.data.forEach(exam => {
              const subjectValue = exam.subject !== undefined ? exam.subject : "Unknown Subject";
      
              subjectCounts[subjectValue] = (subjectCounts[subjectValue] || 0) + 1; 
            });
      
            for (const subjectValue in subjectCounts) {
              if (subjectCounts.hasOwnProperty(subjectValue)) {
                console.log(`Subject Value: ${subjectValue}, Object Count: ${subjectCounts[subjectValue]}`);
              }
            }
      
            console.log("Subject Counts:", subjectCounts);
            console.log("Exams Response:", examsResponse);
      
          } catch (error) {
            console.error("Error fetching exams:", error);
          } finally {
            setQuestionsLoading(false);
          }
         
      
         
        }
    

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return `${String(hours).padStart(2, '0')}:${String(remainingMins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    useEffect(() => {
        const filterNumbers = () => {
            let start, end;
            if (selectedSubjectId) {
                const selectedSubjectData = pattern.find(item => item.id === selectedSubjectId);
                if (selectedSubjectData) {
                    const numbers = [];
                    for (let i = selectedSubjectData.starting_no; i <= selectedSubjectData.ending_no && i <= exams.length; i++) {
                        numbers.push(i);
                    }
                    setFilteredQuestionNumbers(numbers);
                } 
            } else {

            const allNumbers = [];
            for (let i = 1; i <= exams.length; i++) {
                allNumbers.push(i);
            }
            setFilteredQuestionNumbers(allNumbers);
            setAllNum(allNumbers)
            
}
const allNumbers = [];
for (let i = 1; i <= exams.length; i++) {
    allNumbers.push(i);
}
setAllNum(allNumbers);
        };
        filterNumbers();
    }, [selectedSubjectId, exams, pattern]);

    const questionHtml = exams.length > 0 ? exams[selectedNumber - 1]?.question : "";
    const questionHtml1 = exams.length > 0 ? exams[selectedNumber - 1]?.compquestion : "";

    const cleanedText = removeHtmlTags(questionHtml);
    const images = extractImages(questionHtml);

    const cleanedText1 = removeHtmlTags(questionHtml1);
    const images1 = extractImages(questionHtml1);

    const QuestionTimer = () => {
        const [timeElapsed, setTimeElapsed] = useState(120);
        const [startTime, setStartTime] = useState(null);
        const questionId = selectedNumber
        const colorScheme = useColorScheme();
        const theme = colorScheme === "dark" ? darkTheme : lightTheme;

        useEffect(() => {
            const loadTimer = async () => {
                try {
                    const savedStartTime = await AsyncStorage.getItem(`questionStartTime_${questionId}`);
                    if (savedStartTime) {
                        setStartTime(savedStartTime);
                        const elapsedTime = Math.floor((Date.now() - parseInt(savedStartTime, 10)) / 1000);
                        setTimeElapsed(Math.max(60 - elapsedTime, 0));
                    } else {
                        const newStartTime = Date.now().toString();
                        await AsyncStorage.setItem(`questionStartTime_${questionId}`, newStartTime);
                        setStartTime(newStartTime);
                        setTimeElapsed(60);
                    }
                } catch (error) {
                    console.error('Error loading question timer:', error);
                }
            };

            loadTimer();
        }, [selectedNumber]);

        useEffect(() => {
            if (startTime) {
                const timer = setInterval(() => {
                    setTimeElapsed(prevTime => {
                        if (prevTime <= 0) {
                            clearInterval(timer);
                            return 0;
                        }
                        return prevTime - 1;
                    });
                }, 1000);

                return () => clearInterval(timer);
            }
        }, [startTime]);

        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        };

        const resetTimer = async () => {
            const newStartTime = Date.now().toString();
            await AsyncStorage.setItem(`questionStartTime_${questionId}`, newStartTime);
            setStartTime(newStartTime);
            setTimeElapsed(60);
        };

        return (
            <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>Question Timer:</Text>
                <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>{formatTime(timeElapsed)}</Text>
            </View>
        );
    };

    const handleSelectAndNext = async (questionId, option) => {
        await handleAnswerSelect(questionId, option);
        moveToNextQuestion();
    };

    const moveToNextQuestion = () => {
        const currentIndex = filteredQuestionNumbers.indexOf(selectedNumber);
        if (currentIndex < filteredQuestionNumbers.length - 1) {
            setSelectedNumber(filteredQuestionNumbers[currentIndex + 1]);
            setSelectedOption(null);
        }
    };

    const handleSubmitTest = () => {
        setSubmitModalVisible(true);
      
    };
    
    const submitTestResult = async () => {
        const data = {
            "exam_paper_id": obj.exam_paper_id,
            "exam_session_id": 0,
            "student_user_exam_id": 0,
            "questions": []
        };

        for (let i = 1; i <= exams.length; i++) { 
            const questionId = exams[i - 1].id; 
            const answeredQuestion = answeredQuestions[i];
            const skippedQuestion = skippedQuestions[i];
            const reviewedQuestion = reviewedQuestions[i];
            const textInputAnswer = textInputValues[i];

            let status = "0"; 
            let attemptAnswer = ""; 
            let questionTime = 0; 

            if (answeredQuestion) {
                status = "2";
                attemptAnswer = answeredQuestion.selected_ans; 
                try {
                    const questionStartTime = await AsyncStorage.getItem(`questionStartTime_${i}`);
                    if (questionStartTime) {
                        questionTime = Math.floor((Date.now() - parseInt(questionStartTime, 10)) / 1000);
                    }
                  } catch (error) {
                    console.error('Error fetching question start time:', error);
                  }
            } else if (skippedQuestion) {
                status = "1"; 
            }

            const subject = pattern.find(sub => i >= sub.starting_no && i <= sub.ending_no);

            data.questions.push({
                "question_id": questionId, 
                "status": exams?.qtype !== 8 ? status: "2",
                "question_time": questionTime,
                "attempt_answer": exams?.qtype == 8 ? textInputAnswer : attemptAnswer, 
                "reason_for_wrong": 0,
                "comments": "",
                "slno": i,
                "subject_id": subject?.id, 
                "review": !!reviewedQuestion,
                "is_disabled": false,
            });
        }

        console.log("Submit Data:", JSON.stringify(data)); 
        setExam(data)
        navigation.navigate("DashboardContent",{exam :data});

    };

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.textColor} />
            </View>
        );
    }

    const ClearResponseData = async () => {
        try {
            if (selectedNumber) {
                const updatedAnswers = { ...answeredQuestions };
                delete updatedAnswers[selectedNumber];
                setAnsweredQuestions(updatedAnswers);
    
                const updatedSelectedAnswers = { ...selectedAnswers };
                delete updatedSelectedAnswers[selectedNumber];
                setSelectedAnswers(updatedSelectedAnswers);
    
                setSelectedOption(null);
    
                const updatedReviewed = { ...reviewedQuestions };
                delete updatedReviewed[selectedNumber];
                setReviewedQuestions(updatedReviewed);
    
    
                await AsyncStorage.setItem(ANSWERED_QUESTIONS_KEY, JSON.stringify(updatedAnswers));
                await AsyncStorage.setItem(REVIEWED_QUESTIONS_KEY, JSON.stringify(updatedReviewed));
                
            }
        } catch (error) {
            console.error("Error clearing response data:", error);
        }
    };
    
    
    return (
        <LinearGradient
            colors={theme.back}
            style={styles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
        >

{questionsLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={theme.textColor} />
                </View>
            )}
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>EAMCET Mock Test</Text>
                    <Text style={[styles.mockSubtitle, { color: theme.textColor, marginLeft: 40 }]}>Remaining Time</Text>
                    <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>{formatTime(remainingTime)}</Text>
                </View>
                <ScrollView>

                    <View style={{ paddingHorizontal: 20 }}>
                        <LinearGradient
                            colors={theme.mcb1}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.header}
                        >
                            <View style={styles.headerline}>
                                {[...new Set(pattern.map(item => item.subject))].map((subject, index) => {
                                    const sub = pattern.find(item => item.subject === subject);
                                    if (!sub) {
                                        return null;
                                    }

                                    return (
                                        <TouchableOpacity key={index}
                                            onPress={() => handleSubjectSelect(sub)}>
                                            <LinearGradient
                                                colors={selectedSubjectId == sub.id ? [theme.bg1, theme.bg2] : theme.bmc}
                                                style={[
                                                    styles.headerline1,
                                                    {
                                                        borderWidth: selectedSubjectId === sub.id ? 0 : 1,
                                                        borderColor: selectedSubjectId === sub.id ? theme.textColor1 : theme.textColor,
                                                    },
                                                ]}
                                                start={{ x: 0, y: 1 }}
                                                end={{ x: 1, y: 1 }}
                                            >
                                                <Text style={[styles.headtext, { color: selectedSubjectId === sub.id ? theme.textColor1 : theme.textColor }]}>
                                                    {sub.subject}
                                                </Text>
                                            </LinearGradient>
                                        </TouchableOpacity>

                                    )
                                })}

                            </View>
                            
                            {!expand &&  (
                                <View style={{ flexDirection: 'column', paddingStart: 20, paddingEnd: 20 }}>
                                    <View style={{ alignItems:'flex-end', marginTop: 15, marginRight: 20, }}>
                                        <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>Total Questions :{exams.length}</Text>
                                    </View>

                                    <View style={styles.numberContainer}>
                                        {/* <TouchableOpacity onPress={scrollLeft}> */}
                                            <Image
                                                style={[styles.img, { tintColor: theme.textColor,}]}
                                                source={require("../images/to.png")}
                                            />
                                        {/* </TouchableOpacity> */}
                                
                                        <ScrollView
                                            horizontal
                                            ref={scrollRef}
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{ ...styles.numberScrollView, flexGrow: 1 }}                                             
                                            onContentSizeChange={(contentWidth) => {
                                                setScrollViewWidth(contentWidth);
                                            }}
                                            onLayout={({ nativeEvent: { layout: { width } } }) => {
                                                setScrollViewWidth(width);
                                            }}
                                       
                                        >
                                            {allNum.map((num) => {
                                                let backgroundColor = theme.gray;
                                                let borderColor = 'transparent';
                                                let borderWidth = 0;

                                                if (answeredQuestions[num]) backgroundColor = "#04A953";
                                                else if (skippedQuestions[num]) backgroundColor = "#DE6C00";
                                                else if (reviewedQuestions[num]) backgroundColor = "#36A1F5";

                                                if (num === selectedNumber) {
                                                    borderColor = "#fff";
                                                    borderWidth = 1;
                                                }
                                                return (
                                                    <View
                                                    key={num}
                                                    ref={el => (numberCircleRefs.current[num] = el)}                                                    onLayout={({ nativeEvent: { layout: { width } } }) => {
                                                    //    if (numberCircleWidth === 0) {
                                                    //         setNumberCircleWidth(width);
                                                    //    }
                                                    }}
                                                >
                                                    <TouchableOpacity key={num} onPress={() => {
                                                        if (filteredQuestionNumbers.includes(num)) {
                                                            setSelectedNumber(num);
                                                        }
                                                    }}>
                                                        <View style={[styles.numberCircle, { backgroundColor, borderColor, borderWidth }]}>
                                                            <Text style={{ color: "#FFF", fontSize: 16 }}>{num}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    </View>
                                                );
                                            })}
                                        </ScrollView>

                                        {/* <TouchableOpacity onPress={scrollRight}> */}
                                            <Image
                                                style={[styles.img, { tintColor: theme.textColor ,}]}
                                                source={require("../images/fro.png")}
                                            />
                                        {/* </TouchableOpacity> */}
                                    </View>
                                </View>
                            )}

                            {expand && (
                                <View style={{ flexDirection: 'column', paddingStart: 10, paddingEnd: 20 }}>
                                {pattern.map((subject, index) => {
                                    const subjectNumbers = [];
                                    if (selectedSubject && subject.subject === selectedSubject.subject) { 
                                    for (let i = subject.starting_no; i <= subject.ending_no && i <= exams.length; i++) {
                                            subjectNumbers.push(i);
                                    }
                                }
                                if (subjectNumbers.length > 0) {
                                    return (
                                    <View key={index}>
                                        <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 15 }}>
                                            <Text style={[styles.mockSubtitle, { color: theme.textColor, marginRight: 100 }]}>{subject.section_name}</Text>
                                            <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>Total Questions :</Text>
                                            <Text style={[styles.mockSubtitle, { color: theme.textColor, marginLeft: -8 }]}>{subject.ending_no - subject.starting_no + 1}</Text> {/* Calculate total questions per subject */}
                                        </View>

                                    <View style={{ width: windowWidth * 0.9, paddingStart: 30, marginTop: 10 }}>

                                        <View style={styles.gridContainer}>
                                            {subjectNumbers.map((num) => {
                                                let backgroundColor = theme.gray;
                                                let borderColor = 'transparent';
                                                let borderWidth = 0;

                                                if (answeredQuestions[num]) backgroundColor = "#04A953";
                                                else if (skippedQuestions[num]) backgroundColor = "#DE6C00";
                                                else if (reviewedQuestions[num]) backgroundColor = "#36A1F5";

                                                if (num === selectedNumber) {
                                                    borderColor = "#fff";
                                                    borderWidth = 1;
                                                }
                                                return (
                                                    <TouchableOpacity
                                                        key={num}
                                                        onPress={() => {
                                                            setSelectedNumber(num);
                                                            setExpand(false)
                                                        }}
                                                        style={styles.gridItem}
                                                    >
                                                        <View style={[styles.numberCircle1, { backgroundColor, borderColor, borderWidth }]}>
                                                            <Text style={[styles.numberText, { color: "#FFF" }]}>{num}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    </View>
                                    </View>
                                    )} else {
                                        return null; 
                                    }
                                
                                }
                                      )}
                                </View>
                            )}


                            <View style={{ marginTop: 15, flexDirection: 'row', marginBottom: 5 }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={[styles.res, { color: theme.textColor }]}>
                                        Not Seen
                                    </Text>
                                    <Text style={[styles.res, { color: theme.textColor }]}>
                                        {exams.length - Object.keys(answeredQuestions).length - Object.keys(skippedQuestions).length}
                                    </Text>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={[styles.res, { color: "#04A953" }]}>
                                        Answered
                                    </Text>
                                    <Text style={[styles.res, { color: "#04A953" }]}>
                                        {Object.keys(answeredQuestions).length}
                                    </Text>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={[styles.res, { color: "#DE6C00" }]}>
                                        Skipped
                                    </Text>
                                    <Text style={[styles.res, { color: "#DE6C00" }]}>
                                        {Object.keys(skippedQuestions).length}
                                    </Text>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={[styles.res, { color: "#36A1F5" }]}>
                                        Review
                                    </Text>
                                    <Text style={[styles.res, { color: "#36A1F5" }]}>
                                        {Object.keys(reviewedQuestions).length}
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => {
                                setExpand(!expand)
                            }}>
                                {!expand && (
                                    <Image
                                        source={require("../images/down.png")}
                                        style={{ height: 30, width: 30, resizeMode: 'contain', tintColor: theme.textColor }}
                                    />
                                )}
                                {expand && (
                                    <Image
                                        source={require("../images/up.png")}
                                        style={{ height: 30, width: 30, resizeMode: 'contain', tintColor: theme.textColor }}
                                    />
                                )}
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>

                    <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
                        <LinearGradient
                            colors={theme.mcb1}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.header}
                        >
                            <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                <Svg height="35" width={windowWidth * 0.35}>
                                    <Defs>
                                        <SvgLinearGradient id="grad" x1="0" y1="1" x2="1" y2="1">
                                            <Stop offset="0" stopColor={theme.bg1} stopOpacity="1" />
                                            <Stop offset="1" stopColor={theme.bg2} stopOpacity="1" />
                                        </SvgLinearGradient>
                                    </Defs>
                                    <SvgText
                                        fill="url(#grad)"
                                        fontSize="16"
                                        fontWeight="bold"
                                        x="55"
                                        y="15"
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                    >
                                        {selectedNumber && `Question # ${selectedNumber}`}
                                    </SvgText>
                                </Svg>
                                <QuestionTimer />
                            </View>
                            <View>
                                <RenderContent html={questionHtml1} />
                                {images.length > 0 && images.map((imageUrl, index) => (
                                    <View style={{ backgroundColor: '#FFF' }}>
                                        <Image
                                            key={index}
                                            source={{ uri: imageUrl }}
                                            style={{ height: 70, width: windowWidth * 0.5, resizeMode: 'contain' }}
                                        />
                                    </View>
                                ))}
                                <Text style={[styles.question, { color: theme.textColor }]}>
                                    {exams.length > 0 ? removeHtmlTags(exams[selectedNumber - 1]?.question) : "Loading question..."}
                                </Text>
                            </View>
                            {/* {exams?.qtype == 7 && exams?.qtype !== 8 && exams?.qtype == 3  &&(
                                  <View>
                                  {["A", "B", "C", "D"].map((option, index) => {
                                      const optionText = index === 0 ? exams[selectedNumber - 1]?.option1 :
                                          index === 1 ? exams[selectedNumber - 1]?.option2 :
                                              index === 2 ? exams[selectedNumber - 1]?.option3 :
                                                  exams[selectedNumber - 1]?.option4;
  
                                      const cleanedOptionText = removeHtmlTags(optionText);
                                      const imagesInOption = extractImages(optionText);
                                      const isImageUrl = imagesInOption.length > 0;
  
                                      const isSelected = selectedAnswers[selectedNumber]?.selected_ans?.includes(option);  
                                      return (
                                          <TouchableOpacity
                                              key={option}
                                              style={[
                                                  styles.opt,
                                                  {
                                                      borderColor: theme.textColor,
                                                      borderRadius: 25,
                                                      backgroundColor: isSelected ? theme.textColor : "transparent",                                                  }
                                              ]}
                                              onPress={() => {
                                                  setSelectedOption(option);
                                                  handleAnswerSelect(selectedNumber, option);
                                              }}
                                          >
                                              <View style={[styles.optbg, { backgroundColor: theme.gray }]}>
                                                  <Text style={[styles.option, { color: "#FFF" }]}>
                                                      {option}
                                                  </Text>
                                              </View>
  
                                              <View>
                                                  {isImageUrl ? (
                                                      <View style={{ backgroundColor: '#FFF' }}>
                                                          <Image
                                                              source={{ uri: imagesInOption[0] }}
                                                              style={{ width: 80, height: 40, borderRadius: 25, resizeMode: 'contain' }}
                                                          />
                                                      </View>
                                                  ) : (
                                                      <Text style={[
                                                          styles.option,
                                                          { color: theme.textColor, width: 220 }
                                                      ]}>
                                                          {cleanedOptionText || "Option not available"}
                                                      </Text>
                                                  )}
                                              </View>
  
                                              <View
                                                  style={[
                                                      styles.select,
                                                      {
                                                          borderColor: theme.textColor,
                                                          backgroundColor: isSelected ? theme.textColor : "transparent",
                                                      }
                                                  ]}
                                              />
                                          </TouchableOpacity>
                                      );
                                  })}
                              </View>
                            )} */}
                              {exams?.qtype !== 8 &&(
                                  <View>
                                   {["A", "B", "C", "D"].map((option, index) => {
                                      const optionText = index === 0 ? exams[selectedNumber - 1]?.option1 :
                                          index === 1 ? exams[selectedNumber - 1]?.option2 :
                                              index === 2 ? exams[selectedNumber - 1]?.option3 :
                                                  exams[selectedNumber - 1]?.option4;
  
                                      const cleanedOptionText = removeHtmlTags(optionText);
                                      const imagesInOption = extractImages(optionText);
                                      const isImageUrl = imagesInOption.length > 0;
  
                                      const isSelected = selectedAnswers[selectedNumber] === option;
  
                                      return (
                                          <TouchableOpacity
                                              key={option}
                                              style={[
                                                  styles.opt,
                                                  {
                                                      borderColor: theme.textColor,
                                                      borderRadius: 25,
                                                      backgroundColor: "transparent",
                                                  }
                                              ]}
                                              onPress={() => {
                                                  setSelectedOption(option);
                                                  handleAnswerSelect(selectedNumber, option);
                                              }}
                                          >
                                              <View style={[styles.optbg, { backgroundColor: theme.gray }]}>
                                                  <Text style={[styles.option, { color: "#FFF" }]}>
                                                      {option}
                                                  </Text>
                                              </View>
  
                                              <View>
                                                  {isImageUrl ? (
                                                      <View style={{ backgroundColor: '#FFF' }}>
                                                          <Image
                                                              source={{ uri: imagesInOption[0] }}
                                                              style={{ width: 80, height: 40, borderRadius: 25, resizeMode: 'contain' }}
                                                          />
                                                      </View>
                                                  ) : (
                                                      <Text style={[
                                                          styles.option,
                                                          { color: theme.textColor, width: 220 }
                                                      ]}>
                                                          {cleanedOptionText || "Option not available"}
                                                      </Text>
                                                  )}
                                              </View>
  
                                              <View
                                                  style={[
                                                      styles.select,
                                                      {
                                                          borderColor: theme.textColor,
                                                          backgroundColor: isSelected ? theme.textColor : "transparent",
                                                      }
                                                  ]}
                                              />
                                          </TouchableOpacity>
                                      );
                                  })}
                              </View>
                            )}
                            {exams?.qtype == 8 &&(
                                  <View>
                        <TextInput
                            style={[styles.textInputStyle,{backgroundColor:theme.textColor1,borderColor:theme.textColor1,color:theme.textColor}]} 
                            value={textInputValues[selectedNumber] || ''} 
                            onChangeText={(text) => handleTextInputChange(text, selectedNumber)}
                            placeholder={`Enter Text`}
                            placeholderTextColor={theme.textColor}
                            multiline={true} 
                        />
                    </View>
                            )}
                          
                            <View style={{ marginTop: 10, width: windowWidth * 0.8, paddingStart: 10 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity style={[styles.ins, { backgroundColor: theme.textColor1, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }]}>
                                        <Image
                                            style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: theme.textColor }}
                                            source={require("../images/caution.png")}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleReviewTag} style={[styles.ins, { backgroundColor: theme.textColor1, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }]}>
                                        <Image
                                            style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: theme.textColor }}
                                            source={require("../images/tag.png")}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.ins, { backgroundColor: theme.textColor1, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }]} onPress={() => navigation.navigate("Instruct")}>
                                        <Image
                                            style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: theme.textColor }}
                                            source={require("../images/info.png")}
                                        />
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity onPress={() => {
                                    handleSkipQuestion();
                                    setSelectedOption(null);
                                }} style={{ width: 130, height: 36, borderWidth: 1, borderColor: theme.textColor, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: 15 }}>
                                    <Text style={[styles.ans, { color: theme.textColor, }]}>
                                        Skip Question
                                    </Text>
                                </TouchableOpacity> */}
                                    <TouchableOpacity style={{ marginLeft: 15, marginTop: 5 }} onPress={ClearResponseData}>
                                        <Text style={[styles.ans, { color: "red", fontWeight: '700', textDecorationLine: "underline" }]}>
                                           Clear Response
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </LinearGradient>


                    </View>
                </ScrollView>

                <View >
                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center', marginBottom: 15,paddingHorizontal:10 }}>
                        <TouchableOpacity style={{ height: 36, borderWidth: 1, borderColor: theme.textColor, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: 15 }}
                            onPress={() => {
                                handleSkipQuestion();
                                setSelectedOption(null);
                            }}
                        >
                            <Text style={[styles.ans, { color: theme.textColor, fontWeight: '700' }]}>
                                Skip Question
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ height: 36, borderWidth: 1, borderColor: theme.textColor, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}
                            onPress={() => {
                                if (selectedOption) {
                                    handleSelectAndNext(selectedNumber, selectedOption);
                                }
                            }}
                        >
                            <Text style={[styles.ans, { color: theme.textColor, fontWeight: '700' }]}>
                                Submit Selection
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSubmitTest} >
                            <LinearGradient
                                colors={theme.background}
                                style={{ height: 36, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: 10 }} start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={[styles.ans, { color: theme.textColor1, fontWeight: '700' }]}>
                                    Submit Test
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center',marginBottom:5}}>
                  
                    
                    </View> */}

                </View>

            </View>

            {/* Submit Test Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={submitModalVisible}
                onRequestClose={() => {
                    setSubmitModalVisible(!submitModalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    {/* <TouchableOpacity>
                        <Image
                            style={{ tintColor: theme.textColor, marginRight: 10, height: 45, width: 45, left: 150, top: 40, position: 'absolute' }}
                            source={require("../images/delete.png")}
                        />
                    </TouchableOpacity> */}
                    <View style={[styles.modalView, { backgroundColor: theme.bmc1 }]}>
                        <Text style={[styles.modalText, { color: theme.textColor }]}>
                            Do you want to submit the exam.
                        </Text>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: theme.background[0] }]}
                                onPress={() => {
                                    setSubmitModalVisible(false);
                                    submitTestResult();
                                    setIsFirstLoad(true);
                                   
                                }}
                            >
                                <Text style={[styles.textStyle, { color: theme.textColor1 }]}>Ok</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: theme.background[1] }]}
                                // onPress={() => {
                                //     setSubmitModalVisible(false);
                                //     navigation.navigate("Signup");
                                // }}
                                onPress={() => setSubmitModalVisible(false)}

                            >
                                <Text style={[styles.textStyle, { color: theme.textColor1 }]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <TouchableOpacity
                            style={[styles.button, { backgroundColor: theme.gray, marginTop: 10 }]}
                            onPress={() => setSubmitModalVisible(false)}
                        >
                            <Text style={[styles.textStyle, { color: '#FFF' }]}>Cancel</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: "center",
        marginTop: 10,
        padding: 10,
        borderRadius: 30,
    },
    headerline: {
        flexDirection: "row",
        marginTop: 10
    },
    headtext: {
        fontSize: 15,
        fontWeight: "700",
        fontFamily: "CustomFont",
        paddingStart: 6,
        paddingEnd: 6
    },
    headerline1: {
        height: 30,
        alignItems: "center",
        borderRadius: 20,
        marginHorizontal: 4,
        justifyContent: 'center'
    },
    mockSubtitle: {
        fontSize: 16,
        fontWeight: "bold",
        paddingStart: 10,
    },
    numberContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
    },
    numberCircle: {
        width: 40,
        height: 40,
        borderRadius: 10,
        marginHorizontal: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    numberCircle1: {
        width: 35,
        height: 35,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        height: 20,
        width: 20,
        resizeMode: "contain",
    },
    res: {
        fontWeight: '700',
        fontSize: 16,
        marginLeft: 8,
        marginRight: 8
    },
    question: {
        fontWeight: '400',
        fontSize: 16,
        marginHorizontal: 10,
        lineHeight: 26
    },
    ans: {
        fontWeight: '400',
        fontSize: 16,
        paddingStart: 10,
        paddingEnd: 10
    },
    option: {
        fontWeight: '400',
        fontSize: 14,
    },
    optbg: {
        height: 38,
        width: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        marginRight: 10,
    },
    select: {
        height: 16,
        width: 16,
        borderWidth: 1,
        borderRadius: 8,
        position: "absolute",
        right: 15,
    },
    opt: {
        flexDirection: "row",
        width: windowWidth * 0.8,
        marginTop: 8,
        height: 54,
        alignItems: "center",
        paddingStart: 10,
        paddingEnd: 10,
        borderWidth: 0.6,
        position: "relative",
    },
    ins: {
        height: 32,
        width: 32,
        marginLeft: 8,
        marginRight: 8
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: "CustomFont",
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginHorizontal: 10,
        width: 100,
        alignItems: 'center',
    },
    buttonLogin: {
        backgroundColor: "transparent",
    },
    buttonRegister: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    gridItem: {
        margin: 5,
    },
    textInputStyle: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 10, 
        borderRadius:15,
        width:300,
        marginTop:20
    },
    numberScrollView: {
        paddingHorizontal: 10, 
        alignItems:"center"
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, 
    },
    htmlStyles: {
        div: { 
            flexWrap: 'wrap', 
        },
        p: {
            fontSize: 16,
        },
        strong: {
            fontWeight: 'bold',
        },
        em: {
            fontStyle: 'italic',
        },
    },
});