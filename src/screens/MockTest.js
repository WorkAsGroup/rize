import React, { useState, useRef, useEffect, useCallback } from "react";
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
  ToastAndroid,
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
} from "../core/CommonService";
import { useFocusEffect } from "@react-navigation/native";
var striptags = require("striptags");
import AsyncStorage from "@react-native-async-storage/async-storage";

const TEST_INTERRUPTED_KEY = "testInterrupted";
const windowWidth = Dimensions.get("window").width;

const ANSWERED_QUESTIONS_KEY = "answeredQuestions";
const SKIPPED_QUESTIONS_KEY = "skippedQuestions";
const TAGGED_QUESTIONS_KEY = "taggedQuestions";
const REVIEWED_QUESTIONS_KEY = "reviewedQuestions";
const REMAINING_TIME_KEY = "remainingTime";
const COMPLETED_EXAMS_KEY = "completedExams";
const COMPLETED_MOCK_TESTS_KEY = "completedMockTests";

const removeHtmlTags = (html) => {
    if (!html) return "";
  
    let cleanedHtml = html
      .replace(/<p[^>]*>/g, "")
      .replace(/<\/p>/g, "\n")
      .replace(/<img[^>]*src="[^"]*"[^>]*>/g, "")
      .replace(/ /g, " ")
      .replace(/<br\s*[\/]?>/gi, "\n")
      .replace(/<table[^>]*>/g, "")
      .replace(/<\/table>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/<span[^>]*style="[^"]*font-size:\s*11\.*[^;]*;[^"]*"[^>]*>/gi, "")
      .replace(/<\/span>/gi, "")
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
  const extractContent = (html) => {
    const imageRegex = /<img[^>]+src="([^">]+)"/g;
    let contentArray = [];
    let lastIndex = 0;
    let match;
  
    html = html
      .replace(/<\/?p[^>]*>/g, "")
      .replace(/\/>?>/g, ">")
      .replace(/ /g, " ")
      .trim();
    while ((match = imageRegex.exec(html)) !== null) {
      const textBeforeImage = html.slice(lastIndex, match.index).trim();
      if (textBeforeImage) {
        contentArray.push({ type: "text", content: textBeforeImage });
      }
      contentArray.push({ type: "image", content: match[1] });
  
      lastIndex = match.index + match[0].length;
    }
  
    const remainingText = html.slice(lastIndex).trim();
    if (remainingText) {
      contentArray.push({ type: "text", content: remainingText });
    }
  
    return contentArray;
  };

const sanitizeHtml = (text) => {
    if (!text) return { html: "<p>No Question provided.</p>" };
  
    text = text.replace(/&nbsp;/g, " "); 
    text = text.replace(/\n/g, " "); 
    text = text.replace(/<p>/g, "").replace(/<\/p>/g, ""); 
    text = text.replace(/<img /g, "<img style='display:inline-block; vertical-align:middle; margin: 0 5px;' "); // Inline images with spacing
  
    return {
      html: `<div style='display: flex; flex-direction: row; flex-wrap: wrap; width: ${windowWidth*0.84}px; align-items: center;'>${text}</div>`,
    };
  };
  const renderersProps = {
    img: {
      initialDimensions: { width: 20, height: 20 },
      enableExperimentalPercentWidth: true,
      style: {
        display: "inline", // ✅ Forces images to be inline
        verticalAlign: "middle", // ✅ Aligns with text properly
        maxWidth: "100%", // ✅ Prevents overflow
      },
    },
  };

  
  
const MockTest = ({ navigation, route }) => {
  console.log(route.params, "wrihfwoiehoi")
    const colorScheme = useColorScheme();
    const [completedMockTests, setCompletedMockTests] = useState([]);
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
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [filteredQuestionNumbers, setFilteredQuestionNumbers] = useState([]);
  const [allNum, setAllNum] = useState([]);
  const [pattern, setPattern] = useState([]);
  const [expand, setExpand] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const timerInterval = useRef(null);
  const obj = route?.params?.obj;
  const examIdData = route?.params?.examIdData
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
  const [completedExams, setCompletedExams] = useState([]);
  const previousTimeRef = useRef(timeElapsed);
  const timerRef = useRef(null);
  const [startTime, setStartTime] = useState(null);
  const questionId = selectedNumber;

  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isFirstRender, setIsFirstRender] = useState(true); 
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [wasTestInterrupted, setWasTestInterrupted] = useState(false);
// console.log(obj, "objobjobj")

  useEffect(() => {
   getExam();
   getExamPattern()

  },[]);
  
  useEffect(() => {
    const loadCompletedMockTests = async () => {
        try {
            let storedMockTests = await AsyncStorage.getItem(COMPLETED_MOCK_TESTS_KEY);
            if (storedMockTests) {
                setCompletedMockTests(JSON.parse(storedMockTests));
            } else {
                await AsyncStorage.setItem(COMPLETED_MOCK_TESTS_KEY, JSON.stringify([]));
            }
        } catch (error) {
            console.error("Error loading completed mock tests:", error);
        }
    };

    loadCompletedMockTests();
}, []);

  useEffect(() => {
    const loadCompletedExams = async () => {
        try {
            const completedExamsString = await AsyncStorage.getItem(COMPLETED_EXAMS_KEY);
            if (completedExamsString) {
                setCompletedExams(JSON.parse(completedExamsString));
            }
        } catch (error) {
            console.error("Error loading completed exams:", error);
        }
    };

    loadCompletedExams();
}, []);


  
  const loadInitialData = useCallback(async () => {
    setQuestionsLoading(true);
    try {
      if (wasTestInterrupted) {
        await resetQuestionTimers();
        await clearStoredAnswers();
        await AsyncStorage.removeItem(TEST_INTERRUPTED_KEY);
        setWasTestInterrupted(false); // Reset the flag
      }

      await getExam();
      await getExamPattern();

      if (pattern.data && pattern.data.length > 0) {
        setSelectedSubjectId(pattern.data[0].id);
        setSelectedSubject(pattern.data[0]);
        setSelectedNumber(pattern.data[0].starting_no);
        setInitialDataLoaded(true);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setQuestionsLoading(false);
    }
  }, [wasTestInterrupted]);

  const resetQuestionTimers = async () => {
    try {
        if (exams?.length > 0) {
          for (let i = 1; i <= exams.length; i++) {
            await AsyncStorage.setItem(`timeElapsed_${i}`, "0");
          }
        }
      } catch (error) {
        console.error("Error resetting question timers:", error);
      }
    };


  const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    []
  );

  useEffect(() => {
    const checkInterruption = async () => {
      const wasInterrupted = await AsyncStorage.getItem(TEST_INTERRUPTED_KEY);
      if (wasInterrupted === "true") {
        setWasTestInterrupted(true); 
      } else {
        loadInitialData(); 
      }
    };

    checkInterruption();
  }, [loadInitialData]);

  useEffect(() => {
    const loadRemainingTime = async () => {
      try {
        const timeToSet = route?.params?.obj?.duration;
  
        if (timeToSet) {
          const totalSeconds = parseInt(timeToSet, 10) * 60; 
          // console.log(timeToSet, totalSeconds*60, "")
          setRemainingTime(totalSeconds*60); 
        }
      } catch (error) {
        console.error("Error loading remaining time:", error);
      }
    };
  
    loadRemainingTime();
  }, [route?.params?.obj?.duration]); 
  
  useEffect(() => {
    if (remainingTime > 0 && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            return 0; // Stop at 0
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [remainingTime]); 
  
  
  const formatTime = (seconds) => {
    // console.log(seconds, "sec")
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
  
        
        const timeToSet = route?.params?.obj?.duration; 
  
        if (timeToSet) {
          const totalSeconds = parseInt(timeToSet, 10) * 60; 
          // console.log(timeToSet, totalSeconds*60, "")
          setRemainingTime(totalSeconds*60); 
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
 
  
    useFocusEffect(
    useCallback(() => {
      return () => {
        AsyncStorage.setItem(TEST_INTERRUPTED_KEY, "true");
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setTimeElapsed(0);
      };
    }, []) 
  );
  
  const clearStoredAnswers = async () => { 
    try {
      await AsyncStorage.removeItem(ANSWERED_QUESTIONS_KEY);
      await AsyncStorage.removeItem(SKIPPED_QUESTIONS_KEY);
      await AsyncStorage.removeItem(REVIEWED_QUESTIONS_KEY);
      await AsyncStorage.removeItem(TAGGED_QUESTIONS_KEY);
      await AsyncStorage.removeItem(REMAINING_TIME_KEY);

      for (let i = 1; i <= exams.length; i++) {
        await AsyncStorage.removeItem(`questionStartTime_${i}`);
      }
    } catch (error) {
      console.error("Error clearing stored answers:", error);
    }
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
    console.log("setSelectedSubject", sub);
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
              resetQuestionTimers;
              navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      navigation.goBack();
      resetQuestionTimers;
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
  const getExamPattern = async () => {
    setQuestionsLoading(true);
    const data = {
      exam_pattern_id: obj.exam_pattern_id,
    };
    try {
      const examPattern = await getPatternSelection(data);
      console.log("examPatternexamPattern", examPattern);
      setPattern(examPattern.data);

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
      setQuestionsLoading(false);
    }
  };


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
  
  useEffect(() => {
    loadQuestionElapsedTime();
  
    return () => {
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
      }
    };
  }, [selectedNumber]);
  
  useEffect(() => {
    if (selectedNumber) {
      AsyncStorage.setItem(`timeElapsed_${selectedNumber}`, timeElapsed.toString());
    }
  }, [timeElapsed, selectedNumber]);
  
  useEffect(() => {
    return () => {
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
      }
    };
  }, []);
  

  const getExam = async () => {
    console.log("objobjobj", obj);
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

      console.log("Subject Counts:", subjectCounts);
      console.log("Exams Response:", examsResponse);
      setQuestionsLoading(false);
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
        // setIsLoading(false);
      setQuestionsLoading(false);
    }
  };

  
  

    // // Format time in HH:MM:SS
    // const formatedTime = (seconds) => {
    //     const hours = Math.floor(seconds / 3600);
    //     const minutes = Math.floor((seconds % 3600) / 60);
    //     const remainingSeconds = seconds % 60;
    //     return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
    //       .toString()
    //       .padStart(2, "0")}`;
    //   };


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
    console.log("Current Subject:", currentSubject);
    console.log("Current Index in Subject:", currentIndexInSubject);
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
    console.log("handleSelectAndNext called for question:", questionId);
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
      console.log("handleAnswerSelect called with:", questionId, option);
  
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
        console.log("Setting selectedOption to:", option);
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
    try {
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
                "status": exams[i - 1]?.qtype !== 8 ? status : "2", 
                "question_time": questionTime,
                "attempt_answer": exams[i - 1]?.qtype == 8 ? textInputAnswer : attemptAnswer, 
                "reason_for_wrong": 0,
                "comments": "",
                "slno": i,
                "subject_id": subject?.id,
                "review": !!reviewedQuestion,
                "is_disabled": false,
            });
        }

        console.log("Submit Data:", JSON.stringify(data));
        setExam(data);



        let completedMockTests = await AsyncStorage.getItem(COMPLETED_MOCK_TESTS_KEY);
        completedMockTests = completedMockTests ? JSON.parse(completedMockTests) : [];

        const existingTestIndex = completedMockTests.findIndex(
            (test) => test.exam_pattern_id === obj.exam_pattern_id
        );

        if (existingTestIndex !== -1) {
            completedMockTests[existingTestIndex] = {
                exam_pattern_id: obj.exam_pattern_id,
                results: data,
            };
        } else {
            completedMockTests.push({
                exam_pattern_id: obj.exam_pattern_id,
                results: data,
            });
        }

        await AsyncStorage.setItem(COMPLETED_MOCK_TESTS_KEY, JSON.stringify(completedMockTests));



        let completedExams = await AsyncStorage.getItem(COMPLETED_EXAMS_KEY);
        completedExams = completedExams ? JSON.parse(completedExams) : [];
        var examData = {
          exam_id: examIdData?.[0]?.exam_id,
          exam_paper_id: obj.exam_paper_id,
          exam_type: examIdData?.[0]?.exam_type, // Corrected syntax here
        };
        console.log(examData, "erridata")
        completedExams.push(examData);
        await AsyncStorage.setItem(COMPLETED_EXAMS_KEY, JSON.stringify(completedExams));


        navigation.navigate("Login", { exam: data });


        setRemainingTime(0); 
        setTimeElapsed(0);   
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        
        try {
          for (let i = 1; i <= exams.length; i++) {
            await AsyncStorage.removeItem(`timeElapsed_${i}`);
          }
        } catch (error) {
          console.error("Error clearing timeElapsed data:", error);
        }
  
      } catch (error) {
        console.error("Error saving data:", error);
    }
};



  // if (isLoading) {
  //   return (
  //     <View
  //       style={[
  //         styles.container,
  //         { justifyContent: "center", alignItems: "center" },
  //       ]}
  //     >
  //       <ActivityIndicator size="large" color={theme.textColor} />
  //     </View>
  //   );
  // }
// console.log(remainingTime, "remainingTime")


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



// const handleTagQuestion = async () => {
//   try {
//     const updatedTags = { ...taggedQuestions };
//     if (updatedTags[selectedNumber]) {
//       delete updatedTags[selectedNumber];
//     } else {
//       updatedTags[selectedNumber] = true;
//     }
//     setTaggedQuestions(updatedTags);
//     await AsyncStorage.setItem(
//       TAGGED_QUESTIONS_KEY,
//       JSON.stringify(updatedTags)
//     );
//   } catch (error) {
//     console.error("Error tagging question:", error);
//   }
// };

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
      {questionsLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.textColor} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>
            {obj.examName}
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
            <LinearGradient
              colors={theme.mcb1}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
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
                              : theme.bmc
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
            </LinearGradient>
          </View>

          <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
            <LinearGradient
              colors={theme.mcb1}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
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
              <View>
                {/* <RenderContent html={questionHtml1} />
                                {images.length > 0 && images.map((imageUrl, index) => (
                                    <View style={{ backgroundColor: '#FFF' }}>
                                        <Image
                                            key={index}
                                            source={{ uri: imageUrl }}
                                            style={{ height: 70, width: windowWidth * 0.5, resizeMode: 'contain' }}
                                        />
                                    </View>
                                ))} */}
                <RenderHTML
                   source={sanitizeHtml((exams[selectedNumber - 1]?.question) || "<p>No Question provided.</p>",)}
                   contentWidth={windowWidth}
                //    tagsStyles={{
                //      p: { marginBottom: 0, display: "inline", flexWrap: "wrap" }, // Ensure paragraph stays inline
                //      img: { display: "inline-block", verticalAlign: "middle", maxWidth: "100%" }, // Force inline images
                //      span: { display: "inline", flexWrap: "wrap" }, // Ensure span elements wrap properly
                //    }}
                  
                 />
           
              </View>
           
              {exams[selectedNumber - 1]?.qtype !== 8 ? (
                <View>
                  {["A", "B", "C", "D"].map((option, index) => {
                    const optionText =
                      index === 0
                        ? exams[selectedNumber - 1]?.option1
                        : index === 1
                        ? exams[selectedNumber - 1]?.option2
                        : index === 2
                        ? exams[selectedNumber - 1]?.option3
                        : exams[selectedNumber - 1]?.option4;

                    // const cleanedOptionText = removeHtmlTags(optionText);
                    const imagesInOption = extractImages(optionText);
                    const isImageUrl = imagesInOption.length > 0;

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

                        <View>
                          {isImageUrl ? (
                            <View style={{ backgroundColor: "#FFF" }}>
                              <Image
                                source={{ uri: imagesInOption[0] }}
                                style={{
                                  width: 80,
                                  height: 40,
                                  borderRadius: 25,
                                  resizeMode: "contain",
                                }}
                              />
                            </View>
                          ) : (
                            <View style={{alignContent:'center'}}>
                            <Text
                              style={[
                                styles.option,
                                {
                                  color: theme.textColor,
                                  width:226,
                                  overflow: "scroll",
                                },
                              ]}
                            >
                              {/* {cleanedOptionText || "Option not available"} */}
                              <RenderHTML
                                source={sanitizeHtml(
                                  optionText || "<p>No question provided.</p>"
                                )}
                                renderersProps={renderersProps}
                                // baseFontStyle={baseFontStyle}
                                // {...DEFAULT_PROPS}
                                contentWidth={windowWidth}
                              />
                            </Text>
                            </View>
                          )}
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
          backgroundColor: theme.textColor1,
          borderColor: theme.textColor1,
          color: theme.textColor,
        },
      ]}
      value={textInputValues[selectedNumber] || ""}
      onChangeText={(text) => {
        handleTextInputChange(text, selectedNumber);
        console.log("TextInput changed for question:", selectedNumber, "to:", text);
    }}
      placeholder={`Enter Text`}
      keyboardType="numeric"
      placeholderTextColor={theme.textColor}
      multiline={true}
      onSubmitEditing={() => {
        console.log("onSubmitEditing called for question:", selectedNumber);
        handleSelectAndNext(selectedNumber);
    }}
      onBlur={() => handleAnswerSelect(selectedNumber, textInputValues[selectedNumber])} 
          />
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
                  {/* <TouchableOpacity style={[styles.ins, { backgroundColor: theme.textColor1, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }]}>
                                        <Image
                                            style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: theme.textColor }}
                                            source={require("../images/caution.png")}
                                        />
                                    </TouchableOpacity> */}
                                    <TouchableOpacity onPress={handleReviewTag} style={[styles.ins, { backgroundColor: theme.textColor1, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }]}>
                                        <Image
                                            style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: theme.textColor }}
                                            source={require("../images/tag.png")}
                                        />
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity style={[styles.ins, { backgroundColor: theme.textColor1, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }]} onPress={() => navigation.navigate("Instruct")}>
                                        <Image
                                            style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: theme.textColor }}
                                            source={require("../images/info.png")}
                                        />
                                    </TouchableOpacity>  */}

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
            </LinearGradient>
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
                Skip Question
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
                Submit Selection
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

export default MockTest


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