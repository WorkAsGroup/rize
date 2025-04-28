import React, { useState, useRef, useEffect, useCallback, useDebugValue } from "react";
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
  FlatList,
} from "react-native";

import RenderHTML, { StaticRenderer } from "react-native-render-html";
import SubmitTestModal from "./resultsScreen/SubmitTestModal";
import LinearGradient from "react-native-linear-gradient";
import { darkTheme, lightTheme } from "../theme/theme";
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import { useFocusEffect } from "@react-navigation/native";
import { getExamQuestions, getActiveQuestionIndex, getQuestionDetails, getExamPatternSections, getReloadQusationLoader, getActiveSubjectId, getAutoSaveId, getExamUniqueeId, getExamSessionId, getExamDuration, getFinishTest, getAutoSaveTime } from "../store/selectors/questionsSelectors"
// import HtmlComponent from "../common/HtmlComponent";
import { updateQuestionDetail, setActiveQuestionIndex, setActiveSubjectId, setQuestionDetails } from '../store/slices/examSlice'
import LoadQuestion from "../common/LoadQuestion";
import AnimationWithImperativeApi from "../common/LoadingComponent";
import { useDispatch, useSelector } from "react-redux";
import { addAutoSaveThunk, questionsThunk, startExamThunk, submitExamThunk } from "../store/thunks/questionsThunk";
import { reloadQuesationThunk } from "../store/thunks/questionsThunk";
import { addAnalytics } from "../core/CommonService";

const windowWidth = Dimensions.get("window").width;

const StartExam = ({ navigation, route }) => {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const examSessionId = useSelector(getExamSessionId);
  const activeSubjectId = useSelector(getActiveSubjectId);
  const theme = lightTheme;
  const studentExamId = useSelector((state) => state.header.selectedExam);
  const uid = useSelector((state) => state.questions.uid);
  const autoSaveId = useSelector((state) => state.questions.autoSaveId);
  const finishTest = useSelector((state) => state.questions.finishTest);
  const finishedData = useSelector((state) => state.questions.finishedData);
  const questionLoading = useSelector((state) => state.questions.questionLoading);
  const examQuestions = useSelector(getExamQuestions);
  const questionDetails = useSelector(getQuestionDetails);
  const examPatternData = useSelector(getExamPatternSections);
  const reloadQuestionLoader = useSelector(getReloadQusationLoader);
  const activeQuestionIndex = useSelector(getActiveQuestionIndex);
  const loading = useSelector((state) => state.questions.loading)
  const selectedQuestion = examQuestions[activeQuestionIndex];
  const examtype = route?.params?.examtype;
  const activeSubject = useSelector(getActiveSubjectId);
  const examDuration = useSelector(getExamDuration);
  const autoSaveTimeData = useSelector(getAutoSaveTime);
  const autoSaveTime = autoSaveTimeData[0]?.value;
  const autoTimerRef = useRef();
  const attemptedQuestionsRef = useRef([]);
  const uidRef = useRef();
  const attempt_answer = questionDetails.filter((item) => item.question_id === selectedQuestion?.id)[0]?.attempt_answer || "";
  const [state, setState] = useState({
    selectSubjectQuestions: [],
    notViewed: "",
    skip: "",
    answered: "",
    markedView: "",
    answerAndMarkedView: "",
  });
  const activeQuestionIndexRef = useRef(activeQuestionIndex);
  const activeExamIdRef = useRef(studentExamId);
  const [reloadQuestions, setReloadQuestions] = useState(false);
  
  const [data, setData] = useState([]);
  const flatListRef = useRef(null);
  const ITEM_WIDTH = 50;
  const [subState, setSubState] = useState({
    uniqueSubjects: []
});
const isComponentMounted = useRef(true);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [skippedQuestions, setSkippedQuestions] = useState({});
  const [taggedQuestions, setTaggedQuestions] = useState({});
  const [reviewedQuestions, setReviewedQuestions] = useState({});
  // const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [allNum, setAllNum] = useState([]);
  const [expand, setExpand] = useState(false);

  const obj = route?.params?.obj;
  // const [reloadQuestion, setReloadQuestion] = useState(false);
  const [textInputAnswer, setTextInputAnswer] = useState("");

  const [session_id, setSessionid] = useState(route?.params?.session_id);


  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const intervalRef = useRef(null);



  const [backSubmitBtn, setBackSubmitBtn] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState(autoSaveTime)
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const timeLeftRef = useRef(timeLeft);
  const hasTriggeredRef = useRef()

  const answerArray = selectedQuestion && selectedQuestion?.answer?.split(',').filter(item => item.trim() !== '');


  const [timer, setTimer] = useState(0);
  const previousTimeRef = useRef(timer);




  const [restrictionMessage, setRestrictionMessage] = useState("");
     const uniqueId = useSelector((state) => state.header.deviceId);
    
    
      
    
        const handleAnalytics = async () => {
            console.log("hey Um called")
            try {
                // Define your params correctly
                const params = {
                    "student_user_exam_id": 0,
                    "type": 0,
                    "source": 0,
                    "testonic_page_id":  route?.params?.type == "mock" ? 48 : route?.params?.type == "previous" ? 52 : 57,
                };
        
                console.log(uniqueId,  "payloaddlscknl");
        
                // Create payload
                const payload = {
                    ...params,
                    ip_address: uniqueId ? uniqueId: "",
                    location: "Hyderabad", // Ensure location is correctly handled (but you should pass the location data properly here)
                };
        
                console.log(payload, "payload");
        
                // Send analytics request
                const response = await addAnalytics(payload); // Assuming addAnalytics is an API call function
                console.log("Analytics Response:", response);
        
            } catch (error) {
                // Handle errors gracefully
                const errorMessage = error.response?.data?.message || error.message;
              
                console.error("Error:", errorMessage);
            }
        };
  // console.log(  uidRef.current, "UID")

  useEffect(() => {
    if(uniqueId) {
      handleAnalytics()
    }

  },[])
useEffect(() => {
  console.log(uid, "UID")
  uidRef.current=uid
}, [uid])

  useEffect(() => {
    activeExamIdRef.current = studentExamId;
  }, [studentExamId])
  useEffect(() => {
    activeQuestionIndexRef.current = activeQuestionIndex;
  }, [activeQuestionIndex])
  // console.log(autoSaveId, "duration")  
  const [timeLeft, setTimeLeft] = useState(() => {
    // Use examDuration if available, otherwise default to 60 minutes (3600 seconds)
    return examDuration ? examDuration * 60 : 3600;
  });
  useEffect(() => {
    attemptedQuestionsRef.current = questionDetails;
}, [questionDetails, attempt_answer]);



  useEffect(() => {
    if (examDuration && examDuration > 0) {
      setTimeLeft(examDuration * 60);
    }
  }, [examDuration]);
  useEffect(() => {
    const timerInterval = setInterval(() => {
      // ... existing timer logic ...
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [hasSubmitted]);
  // Question timer cleanup
  useEffect(() => {
    const timerInterval = setInterval(() => {
      // ... existing question timer logic ...
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [dispatch, selectedQuestion, activeQuestionIndex, questionDetails]);

  useEffect(() => {
    console.log(examQuestions, "examQuestions");

    if (examQuestions.length > 0) {
        // Extract unique subjects from examQuestions based on the subject field
        const uniqueSubjects = examQuestions.reduce((unique, data) => {
            if (data.subject !== undefined && !unique.some((item) => item.subject === data.subject)) {
                unique.push(data); // Add unique subject data object
            }
            return unique;
        }, []);

        // Filter examPatternData to get only matching subjects
        const filteredPatternData = examPatternData.filter((patternData) => {
            return uniqueSubjects.some((unique) => unique.subject === patternData.subject_id);
        });
console.log(uniqueSubjects, filteredPatternData, examPatternData, "uq")
        // Remove duplicates in the filteredPatternData
        const distinctSubjects = filteredPatternData.reduce((unique, item) => {
            if (!unique.some((i) => i.subject_id === item.subject_id)) {
                unique.push(item);
            }
            return unique;
        }, []);

        // Update state with the distinct subjects
        setSubState((prevState) => ({
            ...prevState,
            uniqueSubjects: distinctSubjects, // Update with distinct subjects
        }));
    }
}, [examQuestions, examPatternData]);




// console.log(subState?.uniqueSubjects, "uniqueeeeee")
  useEffect(() => {
    // Initialize timeLeftRef with the current timeLeft
    timeLeftRef.current = timeLeft;
  
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        timeLeftRef.current = newTime; // Keep ref in sync
  
        if (newTime <= 0) {
          clearInterval(timerInterval);
          if (!hasSubmitted) {
            setIsTimeUp(true);
            handleSubmitOnTimeUp();
            setHasSubmitted(true);
          }
          return 0;
        }
        return newTime;
      });
    }, 1000);
  
    return () => {
      clearInterval(timerInterval);
    };
  }, [hasSubmitted]);

useEffect(() => {
  const backAction = () => {
    Alert.alert(
      "Confirm Exit",
      "Are you sure you want to exit the exam?",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { 
          text: "YES", 
          onPress: () => {
            // Handle exam submission or cleanup
            navigation.goBack();
          }
        }
      ]
    );
    return true;
  };

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => backHandler.remove();
}, []);

// useEffect(() => {
//   attemptedQuestionsRef.current = questionDetails;
// }, [questionDetails]);

// Fix the auto-save useEffect


useEffect(() => {
  return () => {
    // Clear all intervals and timeouts
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    
    // Cancel any pending API requests or thunks
    // (Assuming you're using Redux Toolkit, you might need additional logic here)
    
    // Reset any ongoing states
    // setHasSubmitted(true); // Prevent further submissions
    setAutoSaveTimer(0);
    hasTriggeredRef.current = true;
  };
}, [submitModalVisible]);

useEffect(() => {
  timeLeftRef.current = timeLeft;
}, [timeLeft]);

  const autoSaveData = async (params) => {
    try {
      console.log("Attempting auto-save...", params);
      const response = await dispatch(addAutoSaveThunk(params));
      setAutoSaveTimer(autoSaveTime)
      hasTriggeredRef.current=false;
      console.log("Auto-save successful:", response);
      return response;
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  };

  useEffect(() => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  
    if (!autoSaveTime || autoSaveTime <= 0) return;
  
    hasTriggeredRef.current = false;
    setAutoSaveTimer(autoSaveTime);
  
    autoTimerRef.current = setInterval(() => {
      setAutoSaveTimer(prev => {
        const next = prev > 0 ? prev - 1 : 0;
        console.log("⏳ Auto-save countdown:", next);
  
        if (next === 0 && !hasTriggeredRef.current && examQuestions.length > 0) {
          hasTriggeredRef.current = true;
          console.log("🚀 Auto-saving now...");
  
          const params = {
            autoSaveId,
            exam_paper_id: obj.exam_paper_id,
            questions_data: JSON.stringify(attemptedQuestionsRef.current),
            qsno: activeQuestionIndexRef.current + 1,  // ✅ using ref here
            examtimer: timeLeftRef.current,
            questions_count: examQuestions.length,
            uid:uidRef.current,
            exam_session_id: examSessionId ? examSessionId : route?.params?.ession_id,
            student_user_exam_id: activeExamIdRef.current,
          };
  
          console.log(params, "autpsavwewe");
          autoSaveData(params);
          setAutoSaveTimer(autoSaveTime);
        }
  
        return next;
      });
    }, 1000);
  
    return () => {
      // if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current);
        autoTimerRef.current=null;
        dispatch(setQuestionDetails([]))
        autoTimerRef.current = null;
      // }
    };
  }, [autoSaveTime, autoSaveId]);  // ❌ removed activeQuestionIndex

  

  const resultAnalytics = async() => {
    try {
      // Define your params correctly
      const params = {
          "student_user_exam_id": 0,
          "type": 0,
          "source": 0,
          "testonic_page_id":  route?.params?.type == "mock" ? 49 : route?.params?.type == "previous" ? 53 : 58,
      };

      console.log(uniqueId,  "payloaddlscknl");

      // Create payload
      const payload = {
          ...params,
          ip_address: uniqueId ? uniqueId: "",
          location: "Hyderabad", // Ensure location is correctly handled (but you should pass the location data properly here)
      };

      console.log(payload, "payload");

      // Send analytics request
      const response = await addAnalytics(payload); // Assuming addAnalytics is an API call function
      console.log("Analytics Response:", response);

  } catch (error) {
      // Handle errors gracefully
      const errorMessage = error.response?.data?.message || error.message;
    
      console.error("Error:", errorMessage);
  }
  }
  const handleSubmitOnTimeUp = useCallback(() => {
    if (hasSubmitted) return; // Prevent multiple submissions
 
    
    const isScheduledExam = obj.exam_type === "schedule_exam";
    const params = {
      "exam_paper_id": parseInt(obj.exam_paper_id),
      "exam_session_id": examSessionId ? examSessionId : 0,
      "student_user_exam_id": activeExamIdRef.current,
      "questions": JSON.stringify(attemptedQuestionsRef.current),
      "uid": uidRef.current,
      "type": examtype,
    };
    
    if (["schedule_exam", "previous_exam", "custom_exam"].includes(examtype)) {
      dispatch(submitExamThunk({ params, isTimeUp: true }));
    }
     resultAnalytics();
    setHasSubmitted(true);
  }, [hasSubmitted]);



  useEffect(() => {
    const questionInitialTime = questionDetails.filter((item) => item.question_id === selectedQuestion?.id)[0]?.question_time || 0
    setTimer(questionInitialTime);
}, [selectedQuestion, questionDetails, activeQuestionIndex]);


useEffect(() => {
    const timerInterval = setInterval(() => {
        setTimer((prevTime) => {
            const newTime = prevTime + 1;
            if (newTime !== previousTimeRef.current) {
                if (selectedQuestion) {
                    const updatedQuestionDetails = questionDetails.map((item) =>
                        item.slno === activeQuestionIndex + 1
                            ? {
                                ...item,
                                question_time: newTime
                            }
                            : item
                    );
                    dispatch(updateQuestionDetail(updatedQuestionDetails))
                }
                previousTimeRef.current = newTime;
            }
            return newTime;
        });
    }, 1000);
    return () => clearInterval(timerInterval);
}, [dispatch, selectedQuestion, activeQuestionIndex, questionDetails]);


  // console.log(questionDetails, "questionsDetails")
  useEffect(() => {

    const counts = questionDetails.reduce(
      (acc, item) => {
        if (item.status === "0") acc.notViewed++;
        if (item.status === "1") acc.skip++;
        if (item.status === "2") acc.answered++;
        if (item.review === true) acc.markedView++;
        if (item.review === true && item.status === "2") acc.answerAndMarkedView++;
        return acc;
      },
      { notViewed: 0, skip: 0, answered: 0, markedView: 0, answerAndMarkedView: 0 }
    );

    const selectSubjectQuestionsData = examQuestions.filter(
      (question) => question.subject === activeSubject
    );

    setState((prevState) => ({
      ...prevState,
      ...counts,
      selectSubjectQuestions: selectSubjectQuestionsData
    }));
  }, [questionDetails, examQuestions, activeSubject]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);  // 1 hour = 3600 seconds
    const minutes = Math.floor((seconds % 3600) / 60);  // Remaining minutes after hours are accounted for
    const remainingSeconds = seconds % 60;  // Remaining seconds after minutes are accounted for
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };




  const disabledQuestions = (updatedQuestionDetails) => {

    let patternData = examPatternData&&examPatternData.find(
      (item) => (+item.starting_no <= (activeQuestionIndex + 1)) && (+item.ending_no >= (activeQuestionIndex + 1)));

    let answeredCount = updatedQuestionDetails.filter((item) => item.slno >= patternData.starting_no && item.slno <= patternData.ending_no && item.status === '2');

    if (answeredCount.length >= patternData.no_of_qus_answer) {
      setRestrictionMessage(`*You can only answer ${patternData.no_of_qus_answer} questions`);
      return updatedQuestionDetails.map((item) => ({
        ...item,
        is_disabled:
          item.slno >= patternData.starting_no &&
            item.slno <= patternData.ending_no
            ? answeredCount.some((ans) => ans.slno === item.slno)
              ? false
              : true
            : item.is_disabled,
      }));
    };
    return updatedQuestionDetails
  };

  // const handleOptionChange = (event) => {
  //     const updatedQuestionDetails = questionDetails.map((item) =>
  //         item.slno === activeQuestionIndex + 1
  //             ? {
  //                 ...item, attempt_answer: event.target.value,
  //                 status: "2",
  //             }
  //             : item
  //     );
  //     dispatch(updateQuestionDetail(disabledQuestions(updatedQuestionDetails)))
  // };



  const handleOptionChange = (questionId, option) => {
    // const value = event.target.value;
console.log(option, "oprtion")
    const updatedQuestionDetails = questionDetails.map((item) => {
      if (item.slno === activeQuestionIndexRef.current + 1) {
        let updatedAnswer = "";

        // Convert attempt_answer to string (safe guard)
        // console.log(item, ";dwepfwiuefiewf")
        const attemptAnswerString = typeof item.attempt_answer === "string"
          ? item.attempt_answer
          : "";

        if (answerArray?.length > 1&&attemptAnswerString.length>1) {
          const currentAnswers = attemptAnswerString
            .split(",")
            .filter((v) => v); // remove empty strings

          let newAnswers;
// console.log(attemptAnswerString, currentAnswers, "qwidfoqiwfpqiwfoqiwfn")
          if (currentAnswers.includes(option)) {
            newAnswers = currentAnswers.filter((v) => v !== option);
          } else {
            newAnswers = [...currentAnswers, option];
          }

          updatedAnswer = newAnswers.sort().join(",")
        } else {
          updatedAnswer = option;
        }

        return {
          ...item,
          attempt_answer: updatedAnswer,
          status: "2"
        };
      }
      return item;
    });

    dispatch(updateQuestionDetail(disabledQuestions(updatedQuestionDetails)));
  };



  const handleInputChange = (value) => {
    // const { value } = e.target;
    const regex = /^\d{0,15}(\.\d{0,50})?$/;

    if (regex.test(value) || value === "") {
      const updatedQuestionDetails = questionDetails.map((item) =>
        item.slno === activeQuestionIndex + 1
          ? {
            ...item,
            attempt_answer: value,
            status: value === "" ? "1" : "2",
          }
          : item
      );

      let patternData = examPatternData.find(
        (item) =>
          +item.starting_no <= activeQuestionIndex + 1 &&
          +item.ending_no >= activeQuestionIndex + 1
      );

      if (value === "" && patternData) {
        const resetDisabledState = updatedQuestionDetails.map((item) => ({
          ...item,
          is_disabled:
            item.slno >= patternData.starting_no &&
              item.slno <= patternData.ending_no
              ? false
              : item.is_disabled,
        }));
        dispatch(updateQuestionDetail(resetDisabledState));
      } else {
        dispatch(updateQuestionDetail(disabledQuestions(updatedQuestionDetails)));
      }
    }
  };


  const handleClearOptions = () => {
    const updatedQuestionDetails = questionDetails.map((item) =>
      item.slno === activeQuestionIndex + 1
        ? {
          ...item,
          attempt_answer: "",
          status: "0",
        }
        : item
    );

    let patternData = examPatternData.find(
      (item) =>
        +item.starting_no <= activeQuestionIndex + 1 &&
        +item.ending_no >= activeQuestionIndex + 1
    );

    if (patternData) {
      const resetDisabledState = updatedQuestionDetails.map((item) => ({
        ...item,
        is_disabled:
          item.slno >= patternData.starting_no &&
            item.slno <= patternData.ending_no
            ? false
            : item.is_disabled,
      }));
      dispatch(updateQuestionDetail(resetDisabledState));
    } else {
      dispatch(updateQuestionDetail(updatedQuestionDetails));
    }
  };


  const handleMarkedReview = () => {
    const updatedQuestionDetails = questionDetails.map((item) => {
      if (item.slno === activeQuestionIndex + 1) {
        return { ...item, review: !item.review };
      }
      return item;
    });
    console.log(updatedQuestionDetails, "reviewww")
    dispatch(updateQuestionDetail(updatedQuestionDetails));
  };

  const isOptionDisabled = () => {
    const currentQuestionNo = activeQuestionIndex + 1;
    const disabled = questionDetails.some((item) => {
      return item.slno === currentQuestionNo && item.is_disabled
    });

    return disabled;
  };


  const reloadQuestion = (id) => {
    // const params = { 'question_id': id }
    // dispatch(reloadQuesationThunk(params));
    setReloadQuestions(true);
    setTimeout(() => {  
      setReloadQuestions(false);
    },1000)
    
  };


  const questionStatus = questionDetails.find((item) => item.question_id === selectedQuestion?.id)?.question_id;

  const getQuestionsData = async () => {
    const startExm = {
      student_user_exam_id: activeExamIdRef.current,
      exam_paper_id: parseInt(obj.exam_paper_id),
      exam_session_id: session_id ? session_id : 0,
      exam_type: examtype,
      autoSaveId: obj?.auto_save_id ? obj?.auto_save_id : 0,
      exam_pattern_id: obj?.exam_pattern_id,
      type: route?.params?.type,
    };
    dispatch(startExamThunk(startExm));
  }
  useEffect(() => {
    getQuestionsData();
  }, [])

  useEffect(() => {
    const allNumbers = [];
    for (let i = 1; i <= questionDetails.length; i++) {
      allNumbers.push(i);
    }

    setAllNum(allNumbers);
  }, [questionDetails])

  useEffect(() => {
    if (activeQuestionIndex) {
      scrollToQuestion(activeQuestionIndex);
    }
  }, [activeQuestionIndex, scrollToQuestion]);

  const scrollToQuestion = useCallback((questionNumber) => {
    if (!flatListRef.current) {
      console.warn("scrollToQuestion: FlatList ref not ready");
      return;
    }

    const index = allNum.indexOf(questionNumber);

    if (index !== -1) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    } else {
      console.warn("scrollToQuestion: Question number not found in allNum");
    }
  }, [activeQuestionIndex,allNum]);






  const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    []
  );



  if (loading||questionLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <AnimationWithImperativeApi />
      </View>
    );
  }
  // console.log(exams, "remainingTime")




  // console.log(pattern, "patternsss")
  // const handleReloadQuestion = () => {
  //   setReloadQuestion(true)
  //   setTimeout(() => {
  //     setReloadQuestion(false)
  //   },1000)
  // }

  const handleSubmitTest = () => {
    setSubmitModalVisible(true);
  };

  const handleSubjectClick = (subject_id) => {

    const questionStatus = questionDetails.find((item) => item.question_id === selectedQuestion?.id);

    if (questionStatus?.status === "0") {
      const updatedQuestionDetails = questionDetails.map((item) =>
        item.slno === activeQuestionIndex + 1
          ? {
            ...item,
            status: "1",
          }
          : item
      );
      dispatch(updateQuestionDetail(updatedQuestionDetails))
    }

    const findSubjectIndexValue = examQuestions.findIndex((item) => item.subject === subject_id);

    dispatch(setActiveQuestionIndex(findSubjectIndexValue));
    dispatch(setActiveSubjectId(subject_id));
  };

  const handleNextQuestion = () => {
    const nextIndex = activeQuestionIndex + 1;

    if (activeQuestionIndex < examQuestions.length) {
      // scrollToTop();
      dispatch(setActiveQuestionIndex(nextIndex));
      if (attempt_answer && attempt_answer !== "") {
        const updatedQuestionDetails = questionDetails.map((item) =>
          item.slno === nextIndex
            ? {
              ...item,
              status: "2"
            }
            : item
        );
        dispatch(updateQuestionDetail(updatedQuestionDetails))
           dispatch(setQuestionDetails(updatedQuestionDetails));

      } else {
        const updatedQuestionDetails = questionDetails.map((item) =>
          item.slno === nextIndex
            ? {
              ...item,
              status: item.review ? "0" : "1",
            }
            : item
        );
        dispatch(updateQuestionDetail(updatedQuestionDetails))
        dispatch(setQuestionDetails(updatedQuestionDetails));
      }

      const activeSubjectIndex = examQuestions.findIndex((_subject, index) => {
        return index === nextIndex;
      });
      const activeSubjectData = examQuestions[activeSubjectIndex];
      dispatch(setActiveSubjectId(activeSubjectData?.subject));
    }
  }

  const handleSkip = () => {
    // scrollToTop();
    const nextIndex = activeQuestionIndex + 1;
    if (activeQuestionIndex < examQuestions.length) {
      dispatch(setActiveQuestionIndex(nextIndex));

      const updatedQuestionDetails = questionDetails.map((item) =>
        item.slno == activeQuestionIndex + 1
          ? item.status == "2"
            ? item
            : {
              ...item,
              status: item.review ? "0" : "1",
            }
          : item
      );
      console.log(questionDetails, updatedQuestionDetails, "updatedDetails")
      dispatch(updateQuestionDetail(updatedQuestionDetails))
      dispatch(setQuestionDetails(updatedQuestionDetails));

      const activeSubjectIndex = examQuestions.findIndex((_subject, index) => {
        return index === nextIndex;
      });
      const activeSubjectData = examQuestions[activeSubjectIndex];
      dispatch(setActiveSubjectId(activeSubjectData?.subject))
    }
  };



  const handlePreviousQuestion = () => {
    const questionStatus = questionDetails.find((item) => item.question_id === selectedQuestion?.id);
    // scrollToTop();
    if (questionStatus?.status === "0") {
      const updatedQuestionDetails = questionDetails.map((item) =>
        item.slno === activeQuestionIndex + 1
          ? {
            ...item,
            status: "1",
          }
          : item
      );
      dispatch(updateQuestionDetail(updatedQuestionDetails))
    };

    const nextIndex = activeQuestionIndex - 1;
    if (nextIndex >= 0) {
      dispatch(setActiveQuestionIndex(nextIndex));
      const activeSubjectIndex = examQuestions.findIndex((_subject, index) => {
        return index === nextIndex;
      });
      const activeSubjectData = examQuestions[activeSubjectIndex];
      dispatch(setActiveSubjectId(activeSubjectData?.subject))
    };
  };

  


  return (
    <LinearGradient
      colors={theme.back}
      style={styles.container}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
    >
      <SubmitTestModal
        studentExamId={activeExamIdRef.current}
        data={finishedData}
        examType={examtype}
        finishTest={finishTest}
        isTimeUp={false}
      />

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>
            {obj.exam_name}
          </Text>
          <Text
            style={[
              styles.mockSubtitle,
              { color: theme.textColor, marginLeft: 40 },
            ]}
          >
            Remaining Time
          </Text>
          <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>
            {formatTime(timeLeft)}
          </Text>
        </View>
        <ScrollView>
          <View style={{ paddingHorizontal: 20 }}>
            <View
              // colors={theme.mcb1}
              // start={{ x: 0, y: 1 }}
              // end={{ x: 1, y: 1 }}
              style={styles.header}
            >
          <View style={styles.headerline}>
  {subState?.uniqueSubjects&&subState?.uniqueSubjects.length>0&&subState.uniqueSubjects
    .filter(item => item.subject_id) // Only subjects with valid IDs
    .map((item) => {
      const isActive = item.subject_id === activeSubjectId;
      // const subjectColor = subjectWiseColors(item.subject);  // assumes you have this function

      return (
        <TouchableOpacity
          key={item.subject_id}
          onPress={() => handleSubjectClick(item.subject_id)}
        >
           <LinearGradient
          colors={isActive ? [theme.bg1, theme.bg2] : ["#ffffff", "#ffffff"]}
          style={[
            styles.headerline1,
            {
              borderWidth: isActive ? 0 : 1,
              borderColor: isActive ? theme.textColor1 : theme.textColor,
            },
          ]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
        >
          <Text
            style={[
              styles.headtext,
              {
                color: isActive ? theme.textColor1 : theme.textColor,
              },
            ]}
          >
            {item.subject}
          </Text>
        </LinearGradient>
        </TouchableOpacity>
      );
    })}
</View>



              {!expand && (
                <View
                  style={{
                    flexDirection: "column",
                    paddingStart: 20,
                    paddingEnd: 20,
                  }}
                >
                  <View
                    style={{
                      alignItems: "flex-end",
                      marginTop: 15,
                      marginRight: 20,
                    }}
                  >
                    <Text
                      style={[styles.mockSubtitle, { color: theme.textColor }]}
                    >
                      Total Questions :{examQuestions.length}
                    </Text>
                  </View>

                  <View style={styles.numberContainer}>
                    {/* <TouchableOpacity onPress={scrollLeft}> */}
                    <Image
                      style={[styles.img, { tintColor: theme.textColor }]}
                      source={require("../images/to.png")}
                    />
                    {/* </TouchableOpacity> */}

                    <FlatList
                      ref={flatListRef}
                      horizontal
                      data={allNum}
                      keyExtractor={(item) => item.toString()}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.numberScrollView}
                      renderItem={({ item: num }) => {
                        const qDetail = questionDetails.find((q) => q.slno === num);

                        let backgroundColor = theme.gray;
                        let borderColor = num === selectedQuestion ? "#fff" : "transparent";
                        let borderWidth = num === selectedQuestion ? 1 : 0;

                        if (qDetail?.review && qDetail.status === "2") {
                          backgroundColor = "#1B9C85"; // Answered + Review (you can customize)
                        } else if (qDetail?.review) {
                          backgroundColor = "#36A1F5"; // Just reviewed
                        } else if (qDetail?.status === "0") {
                          backgroundColor = "#999999"; // Not viewed
                        } else if (qDetail?.status === "1") {
                          backgroundColor = "#DE6C00"; // Skipped
                        } else if (qDetail?.status === "2") {
                          backgroundColor = "#04A953"; // Answered
                        }

                        return (
                          <TouchableOpacity
                            onPress={() => {
                              dispatch(setActiveQuestionIndex(num - 1));
                            }}
                          >
                            <View
                              style={[
                                styles.numberCircle,
                                {
                                  backgroundColor,
                                  borderColor,
                                  borderWidth,
                                },
                              ]}
                            >
                              <Text style={{ color: "#FFF", fontSize: 16 }}>{num}</Text>
                            </View>
                          </TouchableOpacity>
                        );
                      }}
                      getItemLayout={getItemLayout}
                    />



                    {/* <TouchableOpacity onPress={scrollRight}> */}
                    <Image
                      style={[styles.img, { tintColor: theme.textColor }]}
                      source={require("../images/fro.png")}
                    />
                    {/* </TouchableOpacity> */}
                  </View>
                </View>
              )}

              {expand && (
                <View
                  style={{
                    flexDirection: "column",
                    paddingStart: 10,
                    paddingEnd: 20,
                  }}
                >
                  {examPatternData
                    .filter((section) => section.subject_id === activeSubjectId)
                    .map((section, index) => {
                      const { section_name, starting_no, ending_no } = section;

                      const subjectNumbers = Array.from(
                        { length: ending_no - starting_no + 1 },
                        (_, idx) => starting_no + idx
                      );

                      return (
                        <View key={index}>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 15,
                              marginLeft: 15,
                            }}
                          >
                            <Text
                              style={[
                                styles.mockSubtitle,
                                { color: theme.textColor, marginRight: 100 },
                              ]}
                            >
                              {section_name}
                            </Text>
                            <Text
                              style={[
                                styles.mockSubtitle,
                                { color: theme.textColor },
                              ]}
                            >
                              Total Questions :
                            </Text>
                            <Text
                              style={[
                                styles.mockSubtitle,
                                { color: theme.textColor, marginLeft: -8 },
                              ]}
                            >
                              {subjectNumbers.length}
                            </Text>
                          </View>

                          <View
                            style={{
                              width: windowWidth * 0.9,
                              paddingStart: 30,
                              marginTop: 10,
                            }}
                          >
                            <View style={styles.gridContainer}>
                            {subjectNumbers.map((num) => {
  let backgroundColor = theme.gray;
  let borderColor = "transparent";
  let borderWidth = 0;

  const qDetail = questionDetails.find((q) => q.slno === num);

  if (qDetail?.review && qDetail.status === "2") {
    backgroundColor = "#1B9C85"; // Answered + Review
  } else if (qDetail?.review) {
    backgroundColor = "#36A1F5"; // Just reviewed
  } else if (qDetail?.status === "0") {
    backgroundColor = "#999999"; // Not viewed
  } else if (qDetail?.status === "1") {
    backgroundColor = "#DE6C00"; // Skipped
  } else if (qDetail?.status === "2") {
    backgroundColor = "#04A953"; // Answered
  }

  if (num === selectedQuestion) {
    borderColor = "#fff";
    borderWidth = 1;
  }

  return (
    <TouchableOpacity
      key={num}
      onPress={() => {
        dispatch(setActiveQuestionIndex(num - 1));
        setExpand(false);
      }}
      style={styles.gridItem}
    >
      <View
        style={[
          styles.numberCircle1,
          {
            backgroundColor,
            borderColor,
            borderWidth,
          },
        ]}
      >
        <Text
          style={[
            styles.numberText,
            { color: "#FFF" },
          ]}
        >
          {num}
        </Text>
      </View>
    </TouchableOpacity>
  );
})}

                            </View>
                          </View>
                        </View>
                      );
                    })}
                </View>
              )}


              <View
                style={{ marginTop: 15, flexDirection: "row", marginBottom: 5 }}
              >
                <View style={{ alignItems: "center" }}>
                  <Text style={[styles.res, { color: theme.textColor }]}>
                    Not Seen
                  </Text>
                  <Text style={[styles.res, { color: theme.textColor }]}>
                    {state.notViewed}
                  </Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text style={[styles.res, { color: "#04A953" }]}>
                    Answered
                  </Text>
                  <Text style={[styles.res, { color: "#04A953" }]}>
                    {state.answered}
                  </Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text style={[styles.res, { color: "#DE6C00" }]}>
                    Skipped
                  </Text>
                  <Text style={[styles.res, { color: "#DE6C00" }]}>
                    {state.skip}
                  </Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text style={[styles.res, { color: "#36A1F5" }]}>Review</Text>
                  <Text style={[styles.res, { color: "#36A1F5" }]}>
                    {state.answerAndMarkedView}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setExpand(!expand);
                }}
              >
                {!expand && (
                  <Image
                    source={require("../images/down.png")}
                    style={{
                      height: 30,
                      width: 30,
                      resizeMode: "contain",
                      tintColor: theme.textColor,
                    }}
                  />
                )}
                {expand && (
                  <Image
                    source={require("../images/up.png")}
                    style={{
                      height: 30,
                      width: 30,
                      resizeMode: "contain",
                      tintColor: theme.textColor,
                    }}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
            <View
              style={styles.header}
            >
              <View style={{ flexDirection: "row", marginTop: 8 }}>
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
                    {selectedQuestion && `Question # ${activeQuestionIndex + 1}`} 
                  </SvgText>
                  <Text style={{marginTop: 19, marginLeft: 15, fontSize: 10}}>ID{selectedQuestion?.id}</Text>
                </Svg>
          
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={[styles.mockSubtitle, { color: theme.textColor }]}
                  >
                    Time spent:
                  </Text>
                  <Text
                    style={[styles.mockSubtitle, { color: theme.textColor }]}
                  >
                    {formatTime(timer)}
                  </Text>
                 
                </View>
                <View style={{ marginLeft: 15, marginRight: 10 }}>
                  <TouchableOpacity
                   onPress={() => reloadQuestion(examQuestions[activeQuestionIndex]?.exam_id)}
                  >
                    <Image source={require("../images/refresh.png")} style={{ width: 18, height: 18 }} />
                  </TouchableOpacity>
                </View>
              </View>

              {(examQuestions[activeQuestionIndex]?.compquestion.length > 0 ||
                examQuestions[activeQuestionIndex]?.question.length > 0) && (
                  <View>
{!reloadQuestions ?
                    <LoadQuestion
                      type="exam"
                      item={examQuestions[activeQuestionIndex]}
                      attempted={attempt_answer}
                      selectedAnswers={selectedAnswers}
                      selectedNumber={activeQuestionIndex}
                      currentQuestionIndex={examQuestions[activeQuestionIndex]}
                      questionLength={examQuestions.length}
                      onChangeValue={(value) => handleOptionChange(activeQuestionIndex, value)}
                      onSkip={() => {
                        handleSkip();
                        // setSelectedOption(null);
                      }}
                      onNext={() => {
                        if (answeredQuestions[activeQuestionIndex]) {
                          handleNextQuestion();
                          return;
                        }
                        // handleSelectAndNext(activeQuestionIndex);
                        // if (examQuestions[activeQuestionIndex]?.qtype !== 8) {
                        //   handleAnswerSelect(activeQuestionIndex, selectedOption);
                        //   setSelectedOption(null);
                        // }
                        // Remove this line as it's redundant with textInputValues
                        // setTextInputAnswer(""); 
                      }}
                      attempt_answer={attempt_answer}
                      onReviewLater={() => handleMarkedReview()}
                      onSubmit={() => handleSubmitTest()}
                      handleTextInputChange={(text) => handleInputChange(text, activeQuestionIndex)}
                      handleSelectAndNext={handleNextQuestion}
                      handleAnswerSelect={(text) => handleInputChange(text, activeQuestionIndex)}
                    // textInputValue={textInputValues[activeQuestionIndex] || ""} // Pass current value
                    />
                    :  <View
                    style={[
                      // styles.container,
                      { justifyContent: "center", alignItems: "center" },
                    ]}
                  >
                    <AnimationWithImperativeApi />
                  </View>


                  }
                  </View>
                )}
              <View
                style={{
                  marginTop: 10,
                  width: windowWidth * 0.8,
                  paddingStart: 10,
                }}
              >
                <View style={{ flexDirection: "row" }}>

                  <TouchableOpacity onPress={handleMarkedReview} style={[styles.ins, { backgroundColor: theme.textColor1, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }]}>
                    <Image
                      style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: theme.textColor }}
                      source={require("../images/tag.png")}
                    />
                  </TouchableOpacity>


                  <TouchableOpacity
                    style={{ marginLeft: 15, marginTop: 5 }}
                    onPress={handleClearOptions}
                  >
                    <Text
                      style={[
                        styles.ans,
                        {
                          color: "red",
                          fontWeight: "700",
                          textDecorationLine: "underline",
                        },
                      ]}
                    >
                      Clear Response
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View>
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 15,
              paddingHorizontal: 10,
            }}
          >
            <TouchableOpacity
              style={{
                height: 36,
                borderWidth: 1,
                borderColor: theme.textColor,
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 15,
              }}
              onPress={() => {
                handleSkip();
                // setSelectedOption(null);
              }}
            >
              <Text
                style={[
                  styles.ans,
                  { color: theme.textColor, fontWeight: "700" },
                ]}
              >
                Skip
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 36,
                borderWidth: 1,
                borderColor: theme.textColor,
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 10,
              }}
              onPress={() => {
                if (answeredQuestions[selectedQuestion]) {
                  moveToNextQuestion();
                  return;
                }

                // handleSelectAndNext(selectedQuestion);
                if (examQuestions[selectedQuestion - 1]?.qtype !== 8) {
                  handleNextQuestion(selectedQuestion, selectedOption);
                  // setSelectedOption(null);
                }
                setTextInputAnswer('');
              }}
            >
              <Text
                style={[
                  styles.ans,
                  { color: theme.textColor, fontWeight: "700" },
                ]}
              >
                Save & Next
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmitTest}>
              <LinearGradient
                colors={theme.background}
                style={{
                  height: 36,
                  borderRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 10,
                }}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
              >
                <Text
                  style={[
                    styles.ans,
                    { color: theme.textColor1, fontWeight: "700" },
                  ]}
                >
                  Submit Test
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

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

          <View style={[styles.modalView, { backgroundColor: theme.bmc1 }]}>
            <Text style={[styles.modalText, { color: theme.textColor }]}>
              Do you want to submit the exam.
            </Text>
            <View style={{ flexDirection: "row", width: "100%" }}>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: theme.background[0] },
                ]}
                onPress={() => {
                  setSubmitModalVisible(false);
                  handleSubmitOnTimeUp();
                  // setIsFirstLoad(true);
                }}
              >
                <Text style={[styles.textStyle, { color: theme.textColor1 }]}>
                  Ok
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: theme.background[1] },
                ]}

                onPress={() => setSubmitModalVisible(false)}
              >
                <Text style={[styles.textStyle, { color: theme.textColor1 }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

export default StartExam


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    borderRadius: 30,
    backgroundColor: "#ffffff", // White background
    borderWidth: 0.5, // Thin border
    borderColor: "#ccc", // Light gray border
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Slightly raised
    shadowOpacity: 0.2, // Subtle shadow
    shadowRadius: 4, // Smooth edges
    elevation: 3, // Android shadow
  },

  headerline: {
    flexDirection: "row",
    marginTop: 10,
  },
  headtext: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "CustomFont",
    paddingStart: 6,
    paddingEnd: 6,
  },
  headerline1: {
    height: 30,
    alignItems: "center",
    borderRadius: 20,
    marginHorizontal: 4,
    justifyContent: "center",
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
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  res: {
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
    marginRight: 8,
  },
  question: {
    fontWeight: "400",
    fontSize: 16,
    marginHorizontal: 10,
    lineHeight: 26,
  },
  ans: {
    fontWeight: "400",
    fontSize: 16,
    paddingStart: 10,
    paddingEnd: 10,
  },
  option: {
    fontWeight: "400",
    fontSize: 14,
    alignContent: "center",
  },
  optbg: {
    height: 38,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
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
    minHeight: 54,
    alignItems: "center",
    paddingStart: 10,
    paddingEnd: 10,
    borderWidth: 0.6,
    position: "relative",
    maxHeight: "100%",
  },
  ins: {
    height: 32,
    width: 32,
    marginLeft: 8,
    marginRight: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
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
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "CustomFont",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
    width: 100,
    alignItems: "center",
  },
  buttonLogin: {
    backgroundColor: "transparent",
  },
  buttonRegister: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  gridItem: {
    margin: 5,
  },
  textInputStyle: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 15,
    width: 300,
    marginTop: 20,
    borderColor: "rgba(0, 0, 0, 0.5)",

  },
  numberScrollView: {
    paddingHorizontal: 10,
    alignItems: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  htmlStyles: {
    div: {
      flexWrap: "wrap",
    },
    p: {
      fontSize: 16,
    },
    strong: {
      fontWeight: "bold",
    },
    em: {
      fontStyle: "italic",
    },
  },
});