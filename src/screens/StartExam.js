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
import {
  getPatternSelection,
  getPreExam,
  getPreExamdata,
  getPreviousPapRes,
  getSubmitExamResults,
  getAutoSaveData,
  getAutoSaveTime,
  addAutoSaveData,
} from "../core/CommonService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
// import HtmlComponent from "../common/HtmlComponent";
import LoadQuestion from "../common/LoadQuestion";
const windowWidth = Dimensions.get("window").width;

const ANSWERED_QUESTIONS_KEY = "answeredQuestions";
const SKIPPED_QUESTIONS_KEY = "skippedQuestions";
const TAGGED_QUESTIONS_KEY = "taggedQuestions";
const REVIEWED_QUESTIONS_KEY = "reviewedQuestions";
const REMAINING_TIME_KEY = "remainingTime";

  
const StartExam = ({ navigation, route }) => {
    const colorScheme = useColorScheme();
    const [data, setData] = useState([]);
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const studentExamId = route?.params?.studentExamId;
  const [selectedSubject, setSelectedSubject] = useState();
  const [selectedNumber, setSelectedNumber] = useState(1);
  const scrollRef = useRef(null);
  const [scrollViewLayoutComplete, setScrollViewLayoutComplete] = useState(false);
  const [scrollViewWidth, setScrollViewWidth] = useState(0);
  const numberCircleRef = useRef(null);
  const scrollViewRef = useRef(null);
  const flatListRef = useRef(null); 
  const ITEM_WIDTH = 50; 
  const [finishTest, setFinishTest] = useState(false);
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
  const [allNum, setAllNum] = useState([]);
  const [pattern, setPattern] = useState([]);
  const [expand, setExpand] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const timerInterval = useRef(null);
  const answeredQuestionsRef = useRef({});

  const obj = route?.params?.obj;
  const [textInputAnswer, setTextInputAnswer] = useState("");
  const [uid, setUid] = useState("");
  const [session_id, setSessionid] = useState(route?.params?.session_id);
  const examtype = route?.params?.examtype;
  const questionTimerRef = useRef(null);
  const [subjectName, setSubjectName] = useState([]);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [textInputValues, setTextInputValues] = useState({});
  const [exam, setExam] = useState([]);
  const numberCircleRefs = useRef({});
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [autoSaveId, setAutoSaveId] = useState(obj?.auto_save_id? obj?.auto_save_id: 0)
  const previousTimeRef = useRef(timeElapsed);
  const timerRef = useRef(null);
  const [startTime, setStartTime] = useState(null);
  const questionId = selectedNumber;
  const [autoSaveData, setAutoSaveData] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
// console.log(obj, "objobjobj")
const [autoTimeValue, setAutoTimeValue] = useState(0);
const [autoSaveTimer ,setAutoSaveTimer] = useState(null);
const autoTimerRef = useRef();
const hasTriggeredRef = useRef()
const [hasTriggeredAutoSave, setHasTriggeredAutoSave] =useState(true);

useEffect(() => {
  console.log(autoSaveId, autoTimeValue, 'wepjdiope');

  // ✅ Only return early if autoTimeValue is 0 or undefined/null
  if (!autoTimeValue) return;

  hasTriggeredRef.current = false;
  setAutoSaveTimer(autoTimeValue);

  autoTimerRef.current = setInterval(() => {
    setAutoSaveTimer(prev => {
      const next = prev > 0 ? prev - 1 : 0;
      console.log("⏳ Timer Value:", next);

      if (next === 0 && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        console.log("🚨 Auto-saving now...");
        handleAutoSaveFunction();
      }

      return next;
    });
  }, 1000);

  return () => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
      console.log("🛑 Timer cleared");
    }
  };
}, [autoTimeValue]); // ✅ Removed autoSaveId dependency


const getAutoSaveDuration = async () => {
  try {
    const resTime = await getAutoSaveTime({});
    console.log(resTime, "asdefqed3q")
    if(resTime){
      setAutoSaveTimer(Number(resTime?.data?.[0].value))
      setAutoTimeValue(Number(resTime?.data?.[0].value))
    }
    // console.log(resTime?.data?.[0].value, "resfweTime")
  } catch (error) {
    console.error("Error loading remaining time:", error);
  }
}



const handleAutoSaveFunction = async () => {
  // console.log("calles func")
  const data = {
    autoSaveId,
    exam_paper_id: parseInt(obj.exam_paper_id),
    exam_session_id: session_id ? session_id : 0,
    student_user_exam_id: studentExamId,
    questions_data: [],
    uid: uid,
    qsno: selectedNumber,
    examtimer: timerRef.current,
    questions_count: exams.length,
    type: examtype === "previous"
      ? "previous_exam"
      : examtype === "mock"
      ? "schedule_exam"
      : "custom_exam",
  };
console.log(data,exams, answeredQuestions, "oeioeqijoei")

for (let i = 0; i < exams.length; i++) {
  try {
    const slno = i + 1;
    const exam = exams[i];
    const questionId = exam.id;

    const answeredQuestion = answeredQuestionsRef.current[String(slno)];

    const skippedQuestion = skippedQuestions[String(slno)];
    const reviewedQuestion = reviewedQuestions[String(slno)];
    const textInputAnswer = textInputValues[String(slno)];

    let status = "0";
    let attemptAnswer = "";

    if (answeredQuestion) {
      status = "2";
      attemptAnswer = answeredQuestion.selected_ans;
    } else if (skippedQuestion) {
      status = "1";
    }

    let questionTime = 0;
    try {
      const storedElapsedTime = await AsyncStorage.getItem(`timeElapsed_${slno}`);
      questionTime = storedElapsedTime ? parseInt(storedElapsedTime, 10) : 0;
    } catch (error) {
      console.error("❌ Error fetching elapsed time for question", slno, error);
    }

    const subject = pattern.find(
      (sub) => slno >= sub.starting_no && slno <= sub.ending_no
    );

    console.log(
      questionId,
      exam?.qtype !== 8 ? status : "2",
      questionTime,
      exam?.qtype == 8 ? textInputAnswer : attemptAnswer,
      0,
      slno,
      subject?.id,
      !!reviewedQuestion,
      false,
      "✅ LOOP CONTINUES"
    );

    data.questions_data.push({
      question_id: questionId,
      status: exam?.qtype !== 8 ? status : "2",
      question_time: questionTime,
      attempt_answer: exam?.qtype == 8 ? textInputAnswer : attemptAnswer,
      reason_for_wrong: 0,
      comments: "",
      slno,
      subject_id: subject?.id || 0, // Fallback to 0 if no subject
      review: !!reviewedQuestion,
      is_disabled: false,
    });
    setAutoSaveTimer(autoTimeValue); // resets countdown
hasTriggeredRef.current = false;
  } catch (err) {
    setAutoSaveTimer(autoTimeValue); // resets countdown
hasTriggeredRef.current = false;
    console.error("❌ Error processing question at index ${i}", err);
  }
}


  console.log("Submit Data:", JSON.stringify(data));
  // setExam(data);

  const questions = JSON.stringify(
    data.questions_data.map((question) => ({
      question_id: question.question_id,
      status: question.status,
      question_time: question.question_time,
      attempt_answer: question.attempt_answer,
      reason_for_wrong: question.reason_for_wrong,
      comments: question.comments,
      slno: question.slno,
      subject_id: question.subject_id,
      review: question.review,
      is_disabled: question.is_disabled,
    }))
  );
  data.questions_data = questions;

  console.log("Submit Exam Data:", data);
  try {
    // setIsLoading(true);
    const response = await addAutoSaveData(data);
    console.log("Submit Response:", response);
    setAutoSaveTimer(autoTimeValue)

  } catch (error) {
    // setIsLoading(false);
    setAutoSaveTimer(autoTimeValue)
    console.error("Error submitting results:", error);
  }

}
const getAutoSavedData = async () => {
  setIsLoading(true);

  const params = {
    autoSaveId: autoSaveId,
  };

  try {
    const response = await getAutoSaveData(params);
    const data = response?.data?.[0];
console.log(data, "fetched Data")
    if (data) {
      const questionsData = JSON.parse(data.questions_data || "[]");

      const answered = {};
      const skipped = {};
      const reviewed = {};
      const textInputs = {};
      const selectedAns = {};

      for (let q of questionsData) {
        const slno = String(q.slno);

        // Restore answered/skipped/reviewed state
        if (q.status === "2") {
          answered[slno] = { selected_ans: q.attempt_answer };
          selectedAns[slno] = q.attempt_answer; // ✅ restore to selectedAnswers
        } else if (q.status === "1") {
          skipped[slno] = true;
        }

        if (q.review) {
          reviewed[slno] = true;
        }

        // Handle text input (qtype 8)
        if (typeof q.attempt_answer === "string" && q.attempt_answer.trim() !== "") {
          textInputs[slno] = q.attempt_answer;
        }

        // Restore individual question time
        try {
          await AsyncStorage.setItem(`timeElapsed_${slno}`, q.question_time.toString());
        } catch (err) {
          console.error("❌ Failed to set AsyncStorage for", slno, err);
        }
      }

      // Update all states
      setAnsweredQuestions(answered);
      answeredQuestionsRef.current = answered;
      setSkippedQuestions(skipped);
      setReviewedQuestions(reviewed);
      setTextInputValues(textInputs);
      setSelectedAnswers(selectedAns); // ✅ sets selected options

      // Optional: restore selected question number
      if (data.qsno) {
        setSelectedNumber(data.qsno);
      }

      // Optional: restore timer
      if (data.examtimer) {
        setRemainingTime(Number(data.examtimer));
      }

      console.log("✅ Restored saved data");
    }
  } catch (err) {
    console.error("❌ Failed to get auto save data:", err);
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
if(autoSaveId!==0&& autoSaveId !== undefined) {
  getAutoSavedData();
}
  }, [autoSaveId])
  useEffect(() => {
    getAutoSaveDuration();
   getExam();
   getExamPattern()
   if (obj) {
    // ifgetPrevExam (examtype === "previous") {
    getPrevExam();
    // } else {
    //     getExam();
    // }
  }
  },[]);
  
  const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    []
  );

  useEffect(() => {
    const loadRemainingTime = async () => {
      try {
        const savedTime = await AsyncStorage.getItem(REMAINING_TIME_KEY);
        const timeToSet = obj.exam_duration; // This is in minutes
        // console.log(timeToSet, obj.exam_duration, "savedTime");
  
        if (timeToSet) {
          setRemainingTime(parseInt(timeToSet, 10) * 60); // Convert to seconds
        }
      } catch (error) {
        console.error("Error loading remaining time:", error);
      }
    };
  
    loadRemainingTime();
  }, []);
  
  useEffect(() => {
    if (remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            submitTestResult();
            return 0; // Stop at 0
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  
    return () => clearInterval(timerRef.current); // Cleanup interval
  }, [remainingTime]);
  
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const remainingMins = Math.floor((seconds % 3600) / 60);
    const remainingSecs = seconds % 60;
  
    return `${String(hours).padStart(2, "0")}:${String(remainingMins).padStart(2, "0")}:${String(remainingSecs).padStart(2, "0")}`;
  };
  useEffect(() => {
    const filterNumbers = () => {
      let start, end;
      if (selectedSubjectId) {
        const selectedSubjectData = pattern.find(
          (item) => item.id === selectedSubjectId
        );
        if (selectedSubjectData) {
          const numbers = [];
          for (
            let i = selectedSubjectData.starting_no;
            i <= selectedSubjectData.ending_no && i <= exams.length;
            i++
          ) {
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
        setAllNum(allNumbers);
      }
      const allNumbers = [];
      for (let i = 1; i <= exams.length; i++) {
        allNumbers.push(i);
      }
      setAllNum(allNumbers);
    };
    filterNumbers();
  }, [selectedSubjectId, exams, pattern]);

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
        const timeToSet =  obj.exam_duration; 
        // console.log(timeToSet, obj.exam_duration, "savedTime");
        
        if (timeToSet) {
            setRemainingTime(parseInt(timeToSet, 10)* 60);
        }
      } catch (error) {
        console.error("Error loading stored data:", error);
      }
    };

    loadStoredData();
  }, []);

const handleTextInputChange = (text, questionId) => {
  setTextInputValues((prevValues) => ({ ...prevValues, [questionId]: text }));
};
 
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
  }, [allNum]);


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
    // console.log("setSelectedSubject", sub);
  };

  useEffect(() => {
    if (selectedNumber) {
      scrollToQuestion(selectedNumber);
    }
  }, [selectedNumber, scrollToQuestion]);


  const handleBackPress = React.useCallback(() => {
    if (!isFirstLoad) {
      Alert.alert(
        "Exit Test?",
        "Are you sure you want to exit the test? Your progress will be saved.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              setIsFirstLoad(true);
              navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      navigation.goBack();
    }
    return true;
  }, [navigation, isFirstLoad]);
  
  useEffect(() => {
    if (!isFirstLoad) {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    }

    return () => {
      if (!isFirstLoad) {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      }
    };
  }, [handleBackPress, isFirstLoad]);
  const getPrevExam = async () => {
    // console.log("objobjobj", obj);
    setQuestionsLoading(true);

    const datas = {
      exam_paper_id: parseInt(obj.exam_paper_id),
      exam_session_id: session_id ? session_id : 0,
      type:
        examtype === "previous"
          ? "previous_exam"
          : examtype === "mock"
          ? "schedule_exam"
          : "custom_exam",
    };
    // console.log(obj, "hoisefoue");
    const startPrevSession = {
      previous_exam_paper_id: obj.previous_paper_id,
      student_user_exam_id: studentExamId,
    };
    const startSession = {
      exam_paper_id: parseInt(obj.exam_paper_id),
      student_user_exam_id: studentExamId,
    };

    try {
      // console.log(examtype, "weoihewouh");
      var sessionStart = "";
      if (examtype === "previous") {
        sessionStart = await getPreviousPapRes(
          examtype === "previous" ? startPrevSession : startSession
        );
        // console.log(sessionStart, "weoihfiweufhweiu");
        setSessionid(sessionStart?.data?.exam_session_id);
      }
      const startExm = {
        student_user_exam_id: studentExamId,
        exam_paper_id: parseInt(obj.exam_paper_id),
        exam_session_id: sessionStart?.data?.exam_session_id
          ? sessionStart?.data?.exam_session_id
          : session_id
          ? session_id
          : 0,
      };

      const startExamResponse = await getPreExamdata(startExm);
      setUid(startExamResponse?.data?.uid);
      console.log(
        startExamResponse?.data?.uid,
        startExm,
        "wrfhwiufwe",
        startExamResponse
      );
      if (startExamResponse) {
        const examsResponse = await getPreExam(datas);
        setExams(examsResponse.data);

        const subjectCounts = {};

        examsResponse?.data.forEach((exam) => {
          const subjectValue =
            exam.subject !== undefined ? exam.subject : "Unknown Subject";

          subjectCounts[subjectValue] = (subjectCounts[subjectValue] || 0) + 1;
        });

        for (const subjectValue in subjectCounts) {
          if (subjectCounts.hasOwnProperty(subjectValue)) {
            console.log(
              `Subject Value: ${subjectValue}, Object Count: ${subjectCounts[subjectValue]}`
            );
          }
        }

        // console.log("Subject Counts:", subjectCounts);
        // console.log("Exams Response:", examsResponse);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setQuestionsLoading(false);
    }
  };
  const getExamPattern = async () => {
    setIsLoading(true);
    const data = {
      exam_pattern_id: obj.exam_pattern_id,
    };
    try {
      const examPattern = await getPatternSelection(data);
      // console.log("examPatternexamPattern", examPattern);
      let filterPattern = examPattern.data.filter((item) => 
        (exams || []).some((exam) => Number(exam?.subject) === Number(item?.subject_id))
      );

      // console.log("examPatternexamPattern", filterPattern, exams, examPattern.data);
      setPattern(filterPattern);

      if (examPattern.data && examPattern.data.length > 0) {
        setSelectedSubjectId(examPattern.data[0].id);
        setSelectedSubject(examPattern.data[0]);
        setSelectedNumber(examPattern.data[0].starting_no);
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
    getExamPattern();
  },[exams])



  const loadQuestionElapsedTime = async () => {
    try {
      if (!selectedNumber) return;
  
      // Stop any existing timer
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
      }
  
      // Load previously saved elapsed time
      const savedTime = await AsyncStorage.getItem(`timeElapsed_${selectedNumber}`);
      const initialTime = savedTime ? parseInt(savedTime, 10) : 0;
      setTimeElapsed(initialTime);
  
      // Start a new timer
      questionTimerRef.current = setInterval(() => {
        setTimeElapsed(prevTime => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error("Error loading elapsed time:", error);
    }
  };
  // useEffect(() => {

  
  //   loadQuestionElapsedTime();
  
  //   return () => {
  //     if (selectedNumber) {
  //       // ✅ Save elapsed time for previous question before unmount
  //       AsyncStorage.setItem(`timeElapsed_${selectedNumber}`, timeElapsed.toString());
  //     }
  
  //     if (questionTimerRef.current) {
  //       clearInterval(questionTimerRef.current);
  //     }
  //   };
  // }, []);  
  useEffect(() => {

  
    loadQuestionElapsedTime();
  
    return () => {
      if (selectedNumber) {
        // ✅ Save elapsed time for previous question before unmount
        AsyncStorage.setItem(`timeElapsed_${selectedNumber}`, timeElapsed.toString());
      }
  
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
      }
    };
  }, [selectedNumber]);  

 
    useEffect(() => {
      return () => {
        if (questionTimerRef.current) {
          clearInterval(questionTimerRef.current);
        }
      };
    }, []);

  const getExam = async () => {
    //  console.log("objobjobj", obj);
     setQuestionsLoading(true);
 
     const datas = {
       exam_paper_id: parseInt(obj.exam_paper_id),
       exam_session_id: session_id ? session_id : 0,
       type: "schedule_exam",
     };
 
     try {
       const examsResponse = await getPreExam(datas);
       setExams(examsResponse.data);
 
       const subjectCounts = {};
 
       examsResponse?.data?.forEach((exam) => {
         const subjectValue =
           exam.subject !== undefined ? exam.subject : "Unknown Subject";
 
         subjectCounts[subjectValue] = (subjectCounts[subjectValue] || 0) + 1;
       });
 
       for (const subjectValue in subjectCounts) {
         if (subjectCounts.hasOwnProperty(subjectValue)) {
           console.log(
             `Subject Value: ${subjectValue}, Object Count: ${subjectCounts[subjectValue]}`
           );
         }
       }
 
      //  console.log("Subject Counts:", subjectCounts);
      //  console.log("Exams Response:", examsResponse);
       setQuestionsLoading(false);
     } catch (error) {
       console.error("Error fetching exams:", error);
     } finally {
         // setIsLoading(false);
       setQuestionsLoading(false);
     }
   };
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
  
          await AsyncStorage.setItem(
            ANSWERED_QUESTIONS_KEY,
            JSON.stringify(updatedAnswers)
          );
          await AsyncStorage.setItem(
            REVIEWED_QUESTIONS_KEY,
            JSON.stringify(updatedReviewed)
          );
        }
      } catch (error) {
        console.error("Error clearing response data:", error);
      }
    };
  const moveToNextQuestion = useCallback(() => {
      // console.log("Current Subject:", currentSubject);
      // console.log("Current Index in Subject:", currentIndexInSubject);
      const currentSubject = pattern.find(
        (subject) =>
          selectedNumber >= subject.starting_no &&
          selectedNumber <= subject.ending_no
      );
  
      if (!currentSubject) {
        console.error(
          "Current question does not belong to any subject in the pattern."
        );
        return; 
      }
  
      const currentSubjectQuestions = allNum.filter(
        (num) =>
          num >= currentSubject.starting_no && num <= currentSubject.ending_no
      );
  
      const currentIndexInSubject = currentSubjectQuestions.indexOf(selectedNumber);
  
  
      if (currentIndexInSubject < currentSubjectQuestions.length - 1) {
        const nextQuestionInSubject = currentSubjectQuestions[currentIndexInSubject + 1];
        setSelectedNumber(nextQuestionInSubject);
  
      } else {
      const nextSubjectIndex = pattern.findIndex(subject => subject.id === currentSubject.id) + 1;
      if (nextSubjectIndex < pattern.length) {
        const nextSubject = pattern[nextSubjectIndex];
        setSelectedNumber(nextSubject.starting_no);
      }
  
  
      }
  
      setSelectedOption(null); 
    }, [selectedNumber, allNum, pattern]);
  
    const handleSelectAndNext = useCallback(async (questionId) => {
      // console.log("handleSelectAndNext called for question:", questionId);
      // const answer = textInputValues[questionId];
      const currentQuestionType = exams[questionId - 1]?.qtype;
  
      if (answeredQuestions[questionId]) {  
        moveToNextQuestion();  
        setSelectedOption(null);
        return;
      }
    
      const answer = textInputValues[questionId];
      if (!answer && currentQuestionType === 8) {
          ToastAndroid.showWithGravity(
              "Please enter the answer in the text field.",
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
          return;
      } else if (currentQuestionType !== 8 && !selectedOption) {
        ToastAndroid.showWithGravity(
            "Please select an option.",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
          return;      
    }
  
    if (currentQuestionType === 8) { 
      await handleAnswerSelect(questionId, answer);
  }
  
  moveToNextQuestion();
  setSelectedOption(null); 
  }, [exams, handleAnswerSelect, moveToNextQuestion,answeredQuestions, selectedOption, textInputValues]);
  
 const handleAnswerSelect = useCallback(
    async (questionId, option) => {
      // console.log("handleAnswerSelect called with:", questionId, option);
  
      const currentSubject = pattern.find(
        (subject) =>
          questionId >= subject.starting_no && questionId <= subject.ending_no
      );
  
      if (!currentSubject) {
        console.error("Question doesn't belong to any subject in the pattern.");
        return;
      }
  
      let answerToStore = option;
      if (exams[selectedNumber - 1]?.qtype === 8) {
        // answerToStore = textInputAnswer;
        answerToStore = textInputValues[questionId];

         if (!answerToStore) {
          if (Platform.OS === 'android') {
            ToastAndroid.showWithGravity(
              "Please enter the answer in the text field.",
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
          } else {
            Alert.alert("Please enter the answer in the text field.");
          }
          return;
        } else if (!option) { 
          if (Platform.OS === 'android') {
            ToastAndroid.showWithGravity(
              "Please select an option.",
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
          } else {
            Alert.alert("Please select an option.");
          }
          return;
        }
        setTextInputAnswer(""); 
      } else if (!option){  
         if (Platform.OS === 'android') {
          //  ToastAndroid.showWithGravity(
          //    "Please select an option.",
          //    ToastAndroid.SHORT,
          //    ToastAndroid.CENTER
          //  );
         } else {
           Alert.alert("Please select an option.");
         }
         return;
       }
  
      const answeredCountForSubject = Object.keys(answeredQuestions).filter(
        (qId) =>
          qId >= currentSubject.starting_no && qId <= currentSubject.ending_no
      ).length;
  
      if (answeredCountForSubject >= currentSubject.no_of_qus_answer) {
        Alert.alert(
          "Answer Limit Reached",
          `You have already answered the maximum allowed questions for ${currentSubject.subject}.`
        );
        return;
      }
  
  
      try {
        const updatedAnswers = {
          ...answeredQuestions,
          [questionId]: { selected_ans: option, submit_ans: option },
        };
        
        setAnsweredQuestions(updatedAnswers);
        answeredQuestionsRef.current = updatedAnswers;
        setSelectedAnswers((prev) => ({
          ...prev,
          [selectedNumber]: answerToStore,
        }));
  
        const updatedSkipped = { ...skippedQuestions };
        delete updatedSkipped[questionId];
        setSkippedQuestions(updatedSkipped);
  
        const updatedReviewed = { ...reviewedQuestions };
        delete updatedReviewed[questionId];
        setReviewedQuestions(updatedReviewed);
        // console.log("Setting selectedOption to:", option);
        setSelectedOption(option);
  
        await AsyncStorage.setItem(
          ANSWERED_QUESTIONS_KEY,
          JSON.stringify(updatedAnswers)
        );
        await AsyncStorage.setItem(
          SKIPPED_QUESTIONS_KEY,
          JSON.stringify(updatedSkipped)
        );
        await AsyncStorage.setItem(
          REVIEWED_QUESTIONS_KEY,
          JSON.stringify(updatedReviewed)
        );
      } catch (error) {
        console.error("Error saving answer:", error);
      }
    },
    [answeredQuestions, exams, pattern, selectedNumber, skippedQuestions, textInputValues, reviewedQuestions]);


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

      await AsyncStorage.setItem(
        SKIPPED_QUESTIONS_KEY,
        JSON.stringify(updatedSkipped)
      );
      await AsyncStorage.setItem(
        ANSWERED_QUESTIONS_KEY,
        JSON.stringify(updatedAnswers)
      );
      await AsyncStorage.setItem(
        REVIEWED_QUESTIONS_KEY,
        JSON.stringify(updatedReviewed)
      );

      moveToNextQuestion();
    } catch (error) {
      console.error("Error skipping question:", error);
    }
  };

  const handleSubmitTest = () => {
    setSubmitModalVisible(true);
  };

  const submitTestResult = async () => {
    const data = {
      exam_paper_id: parseInt(obj.exam_paper_id),
      exam_session_id: session_id ? session_id : 0,
      student_user_exam_id: studentExamId,
      questions: [],
      uid: uid,
      type: examtype === "previous"
        ? "previous_exam"
        : examtype === "mock"
        ? "schedule_exam"
        : "custom_exam",
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
      } else if (skippedQuestion) {
        status = "1";
      }
  
      try {
        // Get elapsed time from AsyncStorage instead of recalculating
        const storedElapsedTime = await AsyncStorage.getItem(`timeElapsed_${i}`);
        questionTime = storedElapsedTime ? parseInt(storedElapsedTime, 10) : 0;
      } catch (error) {
        console.error("Error fetching elapsed time:", error);
      }
  
      const subject = pattern.find(
        (sub) => i >= sub.starting_no && i <= sub.ending_no
      );
  
      data.questions.push({
        question_id: questionId,
        status: exams?.qtype !== 8 ? status : "2",
        question_time: questionTime, // ✅ Now correct
        attempt_answer: exams?.qtype == 8 ? textInputAnswer : attemptAnswer,
        reason_for_wrong: 0,
        comments: "",
        slno: i,
        subject_id: subject?.id,
        review: !!reviewedQuestion,
        is_disabled: false,
      });
    }
  
    // console.log("Submit Data:", JSON.stringify(data));
    setExam(data);
  
    const questions = JSON.stringify(
      data.questions.map((question) => ({
        question_id: question.question_id,
        status: question.status,
        question_time: question.question_time,
        attempt_answer: question.attempt_answer,
        reason_for_wrong: question.reason_for_wrong,
        comments: question.comments,
        slno: question.slno,
        subject_id: question.subject_id,
        review: question.review,
        is_disabled: question.is_disabled,
      }))
    );
    data.questions = questions;
  
    // console.log("Submit Exam Data:", data);
    try {
      setIsLoading(true);
      const response = await getSubmitExamResults(data);
      // console.log("Submit Response:", response);
      const sampleObj = {
        exam_session_id: response?.data?.exam_session_id
          ? response.data.exam_session_id
          : session_id
          ? session_id
          : 0,
        isTimeUp: false,
        studentExamUID: studentExamId,
        exam_paper_id: parseInt(obj.exam_paper_id),
        type: examtype,
        exam_name: obj?.exam_name,
      };
      setData(sampleObj);
      setFinishTest(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error submitting results:", error);
    }
  };
  

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={theme.textColor} />
      </View>
    );
  }
// console.log(exams, "remainingTime")


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

    await AsyncStorage.setItem(
      REVIEWED_QUESTIONS_KEY,
      JSON.stringify(updatedReviewed)
    );
    await AsyncStorage.setItem(
      ANSWERED_QUESTIONS_KEY,
      JSON.stringify(updatedAnswered)
    );
    await AsyncStorage.setItem(
      SKIPPED_QUESTIONS_KEY,
      JSON.stringify(updatedSkipped)
    );
  } catch (error) {
    console.error("Error saving reviewed tag:", error);
  }
};


// console.log(pattern, "patternsss")

return (
  <LinearGradient
    colors={theme.back}
    style={styles.container}
    start={{ x: 0, y: 1 }}
    end={{ x: 1, y: 1 }}
  >
    <SubmitTestModal
      studentExamId={studentExamId}
      data={data}
      examType={examtype}
      setFinishTest={setFinishTest}
      finishTest={finishTest}
      isTimeUp={false}
    />
    {questionsLoading&&exams.length==0 && (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color={theme.textColor} />
      </View>
    )}
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
          {formatTime(remainingTime)}
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
              {[...new Set(pattern.map((item) => item.subject))].map(
                (subject, index) => {
                  const sub = pattern.find(
                    (item) => item.subject === subject
                  );
                  if (!sub) {
                    return null;
                  }

                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleSubjectSelect(sub)}
                    >
                      <LinearGradient
                        colors={
                          selectedSubjectId == sub.id
                            ? [theme.bg1, theme.bg2]
                            : ["#ffffff", "#ffffff"]
                        }
                        style={[
                          styles.headerline1,
                          {
                            borderWidth: selectedSubjectId === sub.id ? 0 : 1,
                            borderColor:
                              selectedSubjectId === sub.id
                                ? theme.textColor1
                                : theme.textColor,
                          },  
                        ]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Text
                          style={[
                            styles.headtext,
                            {
                              color:
                                selectedSubjectId === sub.id
                                  ? theme.textColor1
                                  : theme.textColor,
                            },
                          ]}
                        >
                          {sub.subject}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                }
              )}
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
                    Total Questions :{exams.length}
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
    renderItem={({ item: num }) => ( 
        <TouchableOpacity
            onPress={() => {
                // if (filteredQuestionNumbers.includes(num)) {
                    setSelectedNumber(num);
                // }
            }}
        >
            <View 
                style={[
                    styles.numberCircle,
                    {
                        backgroundColor: answeredQuestions[num] ? "#04A953" : skippedQuestions[num] ? "#DE6C00" : reviewedQuestions[num] ? "#36A1F5" : theme.gray,
                        borderColor: num === selectedNumber ? "#fff" : "transparent",
                        borderWidth: num === selectedNumber ? 1 : 0,
                    },
                ]}
            >
                <Text style={{ color: "#FFF", fontSize: 16 }}>{num}</Text>
            </View>
        </TouchableOpacity>
    )}
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
                {pattern.map((subject, index) => {
                  const subjectNumbers = [];
                  if (
                    selectedSubject &&
                    subject.subject === selectedSubject.subject
                  ) {
                    for (
                      let i = subject.starting_no;
                      i <= subject.ending_no && i <= exams.length;
                      i++
                    ) {
                      subjectNumbers.push(i);
                    }
                  }
                  if (subjectNumbers.length > 0) {
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
                            {subject.section_name}
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
                            {subject.ending_no - subject.starting_no + 1}
                          </Text>{" "}
                          {/* Calculate total questions per subject */}
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

                              if (answeredQuestions[num])
                                backgroundColor = "#04A953";
                              else if (skippedQuestions[num])
                                backgroundColor = "#DE6C00";
                              else if (reviewedQuestions[num])
                                backgroundColor = "#36A1F5";

                              if (num === selectedNumber) {
                                borderColor = "#fff";
                                borderWidth = 1;
                              }
                              return (
                                <TouchableOpacity
                                  key={num}
                                  onPress={() => {
                                    setSelectedNumber(num);
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
                  } else {
                    return null;
                  }
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
                  {exams.length -
                    Object.keys(answeredQuestions).length -
                    Object.keys(skippedQuestions).length}
                </Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={[styles.res, { color: "#04A953" }]}>
                  Answered
                </Text>
                <Text style={[styles.res, { color: "#04A953" }]}>
                  {Object.keys(answeredQuestions).length}
                </Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={[styles.res, { color: "#DE6C00" }]}>
                  Skipped
                </Text>
                <Text style={[styles.res, { color: "#DE6C00" }]}>
                  {Object.keys(skippedQuestions).length}
                </Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={[styles.res, { color: "#36A1F5" }]}>Review</Text>
                <Text style={[styles.res, { color: "#36A1F5" }]}>
                  {Object.keys(reviewedQuestions).length}
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

        <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
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
                  {selectedNumber && `Question # ${selectedNumber}`}
                </SvgText>
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
                  {formatTime(timeElapsed)}
                </Text>
              </View>
            </View>
         
          {exams[selectedNumber - 1]?.compquestion.length > 0 ||
                    exams[selectedNumber - 1]?.question.length > 0 ? (
                      <View>
                   
                  <LoadQuestion
              
                        type="exam"
                        item={exams[selectedNumber- 1]} 
                        selectedAnswers={selectedAnswers}
                        selectedNumber={selectedNumber}
                        currentQuestionIndex={exams[selectedNumber- 1]}
                        questionLength={exams.length}
                        onChangeValue={(value)=>handleAnswerSelect(selectedNumber,value)}
                        onSkip={()=>{ handleSkipQuestion();
                          setSelectedOption(null);}}
                        // onPrevious={()=>this.previous(currentQuestionIndex)}
                        onNext={()=>{
                          if (answeredQuestions[selectedNumber]) {
                            moveToNextQuestion();
                            return;
                          }
          
                          handleSelectAndNext(selectedNumber);
                          if (exams[selectedNumber - 1]?.qtype !== 8) {
                            handleAnswerSelect(selectedNumber, selectedOption);
                            setSelectedOption(null);
                          }
                          setTextInputAnswer("");
                        }}
                        onReviewLater={()=>handleReviewTag()}
                        onSubmit={()=> handleSubmitTest()}
                        // onReload={()=>this.onReload(questions[currentQuestionIndex].id,questions[currentQuestionIndex].selection_type)}
                        handleTextInputChange={handleTextInputChange}
                        handleSelectAndNext={handleSelectAndNext}
                        handleAnswerSelect={handleAnswerSelect}
                        textInputValues={textInputValues}
                         />
      
      
                        {/* {exams[selectedNumber - 1]?.qtype !== 8 ? (
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              flexWrap: "wrap",
                            }}
                          >
                            {["A", "B", "C", "D"].map((option, index) => {
                              const optionText =
                                index === 0
                                  ? exams[selectedNumber - 1]?.option1
                                  : index === 1
                                  ? exams[selectedNumber - 1]?.option2
                                  : index === 2
                                  ? exams[selectedNumber - 1]?.option3
                                  : exams[selectedNumber - 1]?.option4;
                              const optionHtml = optionText;
                              const optionImages = [];
      
                              // console.log("Exam Data:", exams[selectedNumber - 1]);
                              // const { html: optionHtml, images: optionImages } = extractAndSanitizeHtml(optionText);      const isImageUrl = optionImages.length > 0;
                              const isSelected =
                                selectedAnswers[selectedNumber] === option;
                              return (
                                <TouchableOpacity
                                  key={option}
                                  style={[
                                    styles.opt,
                                    {
                                      borderColor: theme.textColor,
                                      borderRadius: 25,
                                      backgroundColor: "transparent",
                                    },
                                  ]}
                                  onPress={() => {
                                    setSelectedOption(option);
                                    handleAnswerSelect(selectedNumber, option);
                                  }}
                                >
                                  <View
                                    style={[
                                      styles.optbg,
                                      { backgroundColor: theme.gray },
                                    ]}
                                  >
                                    <Text style={[styles.option, { color: "#FFF" }]}>
                                      {option}
                                    </Text>
                                  </View>
      
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      flexWrap: "wrap",
                                      justifyContent: "flex-start",
                                    }}
                                  >
                                    <HtmlComponent
                                      style={{
                                        // ...AppStyles.oddMRegular,color:COLORS.BLACK,
                                        fontSize: 15,
                                        lineHeight: 23,
                                        width: windowWidth * 0.6,
                                      }}
                                      containerStyle={{
                                        marginBottom: 20,
                                        marginTop: 3,
                                      }}
                                      baseFontStyle={18}
                                      text={`${optionHtml} `}
                                      // tintColor={COLORS.BLACK}
                                    />
                                  </View>
      
                                  <View
                                    style={[
                                      styles.select,
                                      {
                                        borderColor: theme.textColor,
                                        backgroundColor: isSelected
                                          ? theme.textColor
                                          : "transparent",
                                      },
                                    ]}
                                  />
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        ) : (
                          <View>
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
                              placeholder={`Enter Text`}
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
                          </View>
                        )} */}
                      </View>
                    ) : (
                      <ActivityIndicator size="large" color={theme.textColor} />
                    )}
            <View
              style={{
                marginTop: 10,
                width: windowWidth * 0.8,
                paddingStart: 10,
              }}
            >
              <View style={{ flexDirection: "row" }}>

                                  <TouchableOpacity onPress={handleReviewTag} style={[styles.ins, { backgroundColor: theme.textColor1, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }]}>
                                      <Image
                                          style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: theme.textColor }}
                                          source={require("../images/tag.png")}
                                      />
                                  </TouchableOpacity>


                <TouchableOpacity
                  style={{ marginLeft: 15, marginTop: 5 }}
                  onPress={ClearResponseData}
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
              handleSkipQuestion();
              setSelectedOption(null);
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
              if (answeredQuestions[selectedNumber]) {
                  moveToNextQuestion();
                  return;
              }
        
              handleSelectAndNext(selectedNumber);
              if (exams[selectedNumber - 1]?.qtype !== 8) {  
                  handleAnswerSelect(selectedNumber, selectedOption); 
                  setSelectedOption(null); 
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
              Submit 
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
          <View style={{ flexDirection: "row", width: "100%" }}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.background[0] },
              ]}
              onPress={() => {
                setSubmitModalVisible(false);
                submitTestResult();
                setIsFirstLoad(true);
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
              // onPress={() => {
              //     setSubmitModalVisible(false);
              //     navigation.navigate("Signup");
              // }}
              onPress={() => setSubmitModalVisible(false)}
            >
              <Text style={[styles.textStyle, { color: theme.textColor1 }]}>
                Cancel
              </Text>
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