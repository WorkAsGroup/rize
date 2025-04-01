import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  FlatList,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
// import { LineChart } from 'react-native-svg-charts';
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  getAutoLogin,
  getYearsData,
  addExams,
  getMockExams,
  getAchievements,
  getExamType,
  getLeaderBoards,
  getPreviousPapers,
  getCustomExams,
  getDashboardExamResult,
  getSubmitExamResults,
  getPreviousPapRes,
} from "../core/CommonService";
import { darkTheme, lightTheme } from "../theme/theme";
import CustomExamCreation from "./CustomExamCreation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from "react-native-element-dropdown";
import ExamModalComponent from "./ExamModalComponent";
import AchivementsModel from "./models/AchivementsModel";
import { useRef } from "react";
import WeeklyPerformance from "./dashboardItems/WeeklyPeroformance";
import MockTests from "./dashboardItems/MockTests";
import Achivements from "./dashboardItems/Achivements";
import LeaderBoard from "./dashboardItems/LeaderBoard";

const COMPLETED_EXAMS_KEY = "completedExams";
const COMPLETED_MOCK_TESTS_KEY = "completedMockTests";

const Tab = createBottomTabNavigator();

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const DashboardContent = ({ route, navigation, onChangeAuth }) => {
  // const navigation = useNavigation();
  const [studentUserId, setStudentUserId] = useState(null);
  // const { onChangeAuth } = route.params;
  const [completedExams, setCompletedExams] = useState([]);
  const [completedMockTests, setCompletedMockTests] = useState([]);
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const [addExam, setAddExam] = useState(false);
  const [examResults, setExamResults] = useState([]);
  const [name, setName] = useState("");
  const [uid, setUid] = useState(route?.params?.exam?.uid ?? "");
  const [studentId, setStudentId] = useState("");
  const [studentExamId, setStudentExamId] = useState("");
  const [champ, setChamp] = useState([]);
  const [mocklist, setMocklist] = useState([]);
  const [pre, setPre] = useState([]);
  const [customExams, setCustomExams] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [mock, setMock] = useState([]);
  const [examsData, setExamsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ach, setAch] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalExamCount, setTotalExamCount] = useState(0);
  const [dateRange, setDateRange] = useState("-");
  const data = [50, 70, 60, 90, 80];
  const [selectedType, setSelectedType] = useState("mock");
  const [selectedPerformanceType, setSelectedPerformanceType] =
    useState("score");
  const [showCustom, setShowCustom] = useState(false);
  const [preExamResults, setPreExamResults] = useState(null);
  const [achivementShow, setAchivementShow] = useState(false);

  const hasSubmitted = useRef(false);

  const [items, setItems] = useState([]);

  const toggleDropdown = () => {
    setIsOpen(true);
  };
  const handleOptionSelect = (option) => {
    // console.log(option, "options", option.exam_id)
    setStudentExamId(option.student_user_exam_id);
    setSelectedOption(option.exam_type);
    setIsOpen(false);
  };
  const retrieveExam = async () => {
    try {
      const examData = await AsyncStorage.getItem("exam");
      if (examData !== null) {
        setPreExamResults(JSON.parse(examData));
        console.error("999 AsyncStorage:", preExamResults);
        // submitTestResult();
      }
    } catch (error) {
      console.error("Error retrieving exam from AsyncStorage:", error);
    }
  };

  useEffect(() => {
if(items.length == 0) {
  setItems([{ label: "➕ Add", value: "add"}])
  // setAddExam(true);
}
  },[items])

  useEffect(() => {
    if (!route?.params?.exam) {
      retrieveExam();
    }
  }, []);

  useEffect(() => {
    const loadCompletedExams = async () => {
      try {
        let storedExams = await AsyncStorage.getItem(COMPLETED_EXAMS_KEY);
        if (storedExams) {
          setCompletedExams(JSON.parse(storedExams));
        }
      } catch (error) {
        console.error("Error loading completed exams:", error);
      }
    };
    loadCompletedExams();
  }, []);

  useEffect(() => {
    const loadCompletedMockTests = async () => {
      try {
        let storedMockTests = await AsyncStorage.getItem(
          COMPLETED_MOCK_TESTS_KEY
        );
        if (storedMockTests) {
          const parsedMockTests = JSON.parse(storedMockTests);

          const validMockTests = parsedMockTests.filter((test) => test.results);
console.log(validMockTests, "ValidMocks")
          setCompletedMockTests(validMockTests);
        }
      } catch (error) {
        console.error("Error loading completed mock tests:", error);
      }
    };
    loadCompletedMockTests();
  }, []);

  
  useEffect(() => {
    if (addExam == false) {
      fetchData();
    }
  }, [addExam]);

  


  const getEx = async () => {
    let completedExams = await AsyncStorage.getItem(COMPLETED_EXAMS_KEY);

    console.log(completedExams, "woifowrif")
  };
  useEffect(() => {
    console.log(examsData)
  getEx();
  },[])
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await getYears();
      await getMock();

      await getAchieve();
      await getLeaders();
      await getPrevious();
      if (studentExamId) {
        await getExamResults();
        await getCustomeExam();
      }
    } catch (error) {
      console.error("Error fetching data in useEffect:", error);
      Alert.alert(
        "Error",
        "Failed to refresh data. Please check your connection and try again."
      ); // More user-friendly error handling
    } finally {
      setLoading(false);
    }
  }, [studentExamId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setMock(mocklist);
  }, [mocklist, pre]);

  useEffect(() => {
    getUser();
  }, []);

  const getCustomeExam = async () => {
    const data = {
      student_user_exam_id: studentExamId,
    };
    const response = await getCustomExams(data);
    setCustomExams(response.data);
    console.log(response, "custom");
  };

 

  const getPrevious = async () => {
    const data = {
      student_user_exam_id: studentExamId,
    };
    try {
      const res = await getPreviousPapers(data);
      // console.log("Previouspao", res);
      const tyu = res?.data;
      setPre(tyu);
    } catch (error) {
      console.error("Error fetching Previouspaper data:", error);
      // Alert.alert("Error", "Failed to get previous papers. Please check your connection and try again.");
    }
  };

  const getYears = async () => {
    try {
      const response = await getYearsData();
      // console.log("years", response);
    } catch (error) {
      console.error("Error fetching years data:", error);
      Alert.alert(
        "Error",
        "Failed to get years data. Please check your connection and try again."
      );
    }
  };

  const getAchieve = async () => {
    const data = {
      student_user_exam_id: studentExamId,
    };
    try {
      const response = await getAchievements(data);
      // console.log("getAchievements", JSON.stringify(response?.data));
      if (response?.data) {
        setAch(response.data);
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
      Alert.alert(
        "Error",
        "Failed to get achievements. Please check your connection and try again."
      );
    }
  };

  const getLeaders = async () => {
    const data = {
      student_user_exam_id: studentExamId,
    };
    try {
      // console.log("getLeader Boards fields", data);
      const response = await getLeaderBoards(data);
      // console.log("getLeaderBoards", JSON.stringify(response.data));
      if (response.data && Array.isArray(response.data)) {
        setChamp(response.data);
      } else {
        setChamp();
        console.warn("No leaderboard data received or data is not an array.");
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      setChamp();
      Alert.alert(
        "Error",
        "Failed to get leaderboard data. Please check your connection and try again."
      );
    }
  };

  const getMock = async () => {
    const data = {
      student_user_exam_id: studentExamId,
    };
    try {
      const response = await getMockExams(data);
      // console.log("mock exam", response.data);
      const tyu = response?.data;
      setMocklist(tyu);
    } catch (error) {
      console.error("Error fetching mock exams:", error);
      Alert.alert(
        "Error",
        "Failed to get mock exams. Please check your connection and try again."
      );
    }
  };

  const getExamResults = async () => {
    const data = {
      student_user_exam_id: studentExamId,
      duration_id: 1,
    };

    try {
      const response = await getDashboardExamResult(data);
      // console.log("exam response", response);
      setTotalExamCount(response.data.total_test_count);
      setExamResults(response.data.periods);
      setDateRange(response.data.duration_dates);
    } catch (error) {
      console.error("Error fetching mock exams:", error);
      Alert.alert(
        "Error",
        "Failed to get mock exams. Please check your connection and try again."
      );
    }
  };

  const handleStartTest = async (item) => {
    // console.log("item", item);
    const previousExam = pre.find((p) => p.exam_name === item.exam_name);

    let previousPaperId = null;
    if (previousExam) {
      previousPaperId = previousExam.previous_paper_id;
      // console.log("previousPaperId:", previousPaperId);
    } else {
      console.log("No previous exam found for:", item.exam_name);
    }

    try {
      // Add a try/catch block for better error handling
      const dat = {
        previous_exam_paper_id: previousPaperId,
        student_user_exam_id: studentExamId,
      };

      const response = await getPreviousPapRes(dat);
      // console.log("getPreviousPapRes Response:", JSON.stringify(response));

      let sessionId = null; // Initialize sessionId
      if (response && response.data && response.data.exam_session_id) {
        sessionId = response.data.exam_session_id;
      }

      navigation.navigate("InstructionAuth", {
        obj: item,
        studentExamId: studentExamId,
        examtype: selectedType,
        session_id: sessionId ? sessionId : item.custom_exam_id,
      });
    } catch (error) {
      console.error("Error in handleStartTest:", error);
    }
  };

  const handlePrv = async (item) => {
    const previous_id = pre.filter((p) => p.exam_name === item.exam_name);
    if (previous_id.length > 0) {
      console.log("previous_id", previous_id);
    }

    const dat = {
      previous_exam_paper_id: previous_id,
      student_user_exam_id: studentExamId,
    };
    // console.log("getLeader Boards handlePrv", dat , item);

    const response = await getPreviousPapRes(dat);
    // console.log("getLeader Boards handlePrvs", JSON.stringify(response));
    if (response) {
      console.log("0000", response);
    }
  };

  const handleCheckResults = (data, type) => {
    const examObject = {
      ...data,
      type: type,
      studentExamUID: studentExamId,
    };
    // dispatch(setExamSessionId(data.exam_session_id));
    navigation.navigate("resultsPage", { state: examObject });
  };
  const getUser = async () => {
    try {
      const response = await getAutoLogin();
      console.log("auto-login-", response);

      if (!response?.data) {
        console.warn("No user data received from API");
        return; // Early exit if no data
      }

      const { name: nm, student_user_id: id, examsData } = response.data;
      setName(nm);
      setStudentId(id);
      setStudentUserId(id);
      setExamsData(examsData);

      if (!examsData || examsData.length === 0) {
        const comData = AsyncStorage.getItem(COMPLETED_EXAMS_KEY);
        if (JSON.parse(comData).length < 1) {
          setAddExam(true);
        }
        return; // Early exit if no examsData
      }

      const exams = await getExamType();

      if (exams?.data?.length > 0) {
        // Use a Map for efficient lookup of examsData
        const examsDataMap = new Map(
          examsData.map((exam) => [exam.exam_id, exam])
        );

        const mergedExamsData = exams.data.map((exam) => {
          const existingExamData = examsDataMap.get(exam.exam_id);
          // Use spread operator conditionally, providing a default empty object if existingExamData is undefined
          return { ...exam, ...(existingExamData || {}) };
        });

        // Filter out entries where is_default is not present (meaning it wasn't in examsData)
        const filteredMergedData = mergedExamsData.filter((exam) =>
          exam.hasOwnProperty("is_default")
        );
        checkUserIdExamExist(filteredMergedData);

        const dropdownItems = [
          ...filteredMergedData.map((option) => ({
            label: option.exam_type,
            value: option.exam_id,
            isDefault: option.is_default,
            stUserExamId: option.student_user_exam_id,
          })),
          { label: "➕ Add", value: "add", custom: true },
        ];

        setItems(dropdownItems);

        const defaultItem = dropdownItems.find((item) => item.isDefault === 1);
        setSelectedOption(defaultItem || dropdownItems[0]);
        setStudentExamId((defaultItem || dropdownItems[0]).stUserExamId);

        console.log(
          filteredMergedData,
          "Filtered Merged Data",
          examsData,
          exams.data
        );
      } else {
        // Handle the case where getExamType returns no data or an error
        console.warn("No exam type data received from API");
        if (examsData && examsData.length > 0) {
          // Fallback to first exam in examsData if no exam types are available.
          setStudentExamId(examsData[0].student_user_exam_id);
          setItems([
            {
              label: examsData[0].exam_type || "Default Exam", //Provide a default label
              value: examsData[0].exam_id,
              stUserExamId: examsData[0].student_user_exam_id,
            },
          ]);
          setSelectedOption(items[0]);
        } else {
          setItems([{ label: "➕ Add", value: "add"}]);
        }
      } 
    } catch (error) {
      console.error("Error fetching user data:", error);
      checkUserIdExamExist([]);
      // Alert.alert(
      //   "Error",
      //   "Failed to get user data. Please check your connection and try again."
      // ); 
      // Reinstated the Alert for better user experience
    }
  };
  const submitTestResult = useCallback(
    async (sendingProps) => {
      const { examData, exam_paper_id, exId} = sendingProps
      console.log("📤 Submitting test result for:", exam_paper_id, exId);
      setLoading(true); // Start loading
  
      try {
        const questions = JSON.stringify(
          examData.questions.map((question) => ({
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
  
        const data = {
          exam_paper_id,
          exam_session_id: 0,
          student_user_exam_id: exId,
          questions,
          type: "guestMockTest",
        };
  
        console.log("📨 Submit Data:", data);
  
        const response = await getSubmitExamResults(data);
  
        console.log("📨 Submit Response:", response);
  
        if (response && response.statusCode === 200 && response.data) {
          console.log("✅ Exam submitted successfully:", response.data);
          return true;
        } else {
          console.error("❌ Submission failed: Invalid response", response);
          return false;
        }
      } catch (error) {
        console.error("🚨 Error submitting results:", error);
        return false;
      } finally {
        setLoading(false); // Stop loading
      }
    },
    []
  );
  
  

  const submitAllStoredResults = useCallback(async (exId) => {
    console.log("🚀 Starting submission for exam ID:", exId );
  
    setLoading(true); // Start loading animation
  
    try {
      // 1️⃣ Retrieve completed exams from AsyncStorage
      let completedExams = await AsyncStorage.getItem(COMPLETED_EXAMS_KEY);
      completedExams = completedExams ? JSON.parse(completedExams) : [];
  
      if (!Array.isArray(completedExams) || completedExams.length === 0) {
        console.log("⚠️ No completed exams found.");
        return;
      }
  
      console.log("📂 Loaded completed exams:", completedExams);
  
      // 2️⃣ Track successful submissions
      const successfulSubmissions = new Set();
      const submissionsInProgress = new Set();
  
      // 3️⃣ Filter mock tests that match completed exams
      // console.log(completedExams, completedExams[0]?.exam_paper_id, "nevaoihef")
      let storedMockTests = await AsyncStorage.getItem(
        COMPLETED_MOCK_TESTS_KEY
      );

      console.log(
        completedExams,
        JSON.parse(storedMockTests).map((i) => ({
          exam_paper_id: i.results.exam_paper_id,
          i,
        })),
        "storedMockTests"
      );
      
      if (storedMockTests) {
        const parsedMockTests = JSON.parse(storedMockTests);

        const validMockTests = parsedMockTests.filter((test) => test.results);
      
        let submissionPromises = validMockTests
        .filter(test => 
          test.results &&
          completedExams.some((cm) => 
            cm.exam_paper_id === test.results.exam_paper_id && 
            cm.exam_id === test.exam_id // Ensuring exam_id also matches
          )
        ) 
        .map(async (mocTest) => { 
          console.log(mocTest, "finalStep")
          const exPaperId = mocTest?.results?.exam_paper_id;
      
          // 4️⃣ Avoid duplicate submissions
          if (successfulSubmissions.has(exPaperId) || submissionsInProgress.has(exPaperId)) {
            console.log(`🔄 Skipping already submitted exam_paper_id: ${exPaperId}`);
            return;
          }
      
          submissionsInProgress.add(exPaperId); // Mark as in progress
          console.log("📤 Submitting exam:", { exPaperId, exId, data: mocTest.results });
      
          try {
            // 5️⃣ Submit the test result and check response
            var sendingProps = {
              examData : mocTest.results,
              exam_paper_id: exPaperId,
               exId: exId ||  mocTest?.exam_id,
              
            }

            console.log(sendingProps, "asleeprops")
            const submissionSuccessful = await submitTestResult(
              sendingProps
            );
      
            console.log("✅ Submission Result:", {mock: mocTest.results,
              exPaperId,
              exId, status: submissionSuccessful });
      
            if (submissionSuccessful) {
              successfulSubmissions.add(exPaperId); // Mark as successful
            } else {
              console.warn(`⚠️ Submission failed for ${exPaperId}: Response was false`);
            }
          } catch (error) {
            console.error(`❌ Error submitting ${exPaperId}:`, error);
          } finally {
            submissionsInProgress.delete(exPaperId); // Remove from in-progress
          }
        });
      
      // 6️⃣ Wait for all submissions to complete
      await Promise.all(submissionPromises);
  
      console.log("🏆 Successfully submitted exams:", [...successfulSubmissions]);
  
      // 7️⃣ Remove successfully submitted exams
      let remainingExams = completedExams.filter(
        exam => !successfulSubmissions.has(exam.exam_paper_id)
      );
      
  
      console.log("🗂 Remaining exams after filter:", remainingExams);
  
      // 8️⃣ Update AsyncStorage properly
      if ([...successfulSubmissions].length > 0) {
        const remaining = await AsyncStorage.getItem(COMPLETED_EXAMS_KEY);
        console.log([...successfulSubmissions], JSON.parse(remaining), "ExamsDataClear")
        const filtered = JSON.parse(remaining).filter(checkEx => 
          ![...successfulSubmissions].some(it => parseInt(checkEx.exam_paper_id) === parseInt(it))
        );
        
      
       await AsyncStorage.setItem(COMPLETED_EXAMS_KEY, JSON.stringify(filtered));
       // Clear storage
  
        // ✅ Double-check: Reload storage to confirm it's cleared
        let checkStorage = await AsyncStorage.getItem(COMPLETED_EXAMS_KEY);
        console.log("🔍 After removeItem, check storage:", checkStorage);
  
        if (!checkStorage) {
          console.log("✅ Storage successfully cleared!");
        } else {
          console.warn("⚠️ Storage was NOT cleared properly!");
        }
      }
 
       if(successfulSubmissions.size > 0)  {
        // getUser();
        Alert.alert("Success", `${successfulSubmissions.size} result(s) submitted successfully.`);
       }
      } else {
        // Some exams failed; update AsyncStorage with remaining ones
        await AsyncStorage.setItem(COMPLETED_EXAMS_KEY, JSON.stringify(remainingExams));
        console.log("📝 Updated AsyncStorage with remaining exams:", remainingExams);
        setCompletedExams(remainingExams);
      }
    } catch (error) {
      console.error("🔥 Error in submitAllStoredResults:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  }, [completedMockTests, submitTestResult]);
  

  const saveWithOutExistedExamID = async (compExams) => {
    setLoading(true); // Start loading
  
    try {
      const response = await getAutoLogin();
      console.log("🚀 Auto-login response:", response);
  
      if (!response?.data) {
        console.warn("⚠️ No user data received from API");
        return; // Early exit if no data
      }
  
      const { name: nm, student_user_id: id } = response.data;
  
      // Track already processed exam IDs to send the first occurrence to `addExam`
      const processedExamIds = new Set();
      const newExams = [];
      const existingExams = [];
  
      // Iterate over exams and separate into new and existing
      compExams.forEach((exam) => {
        if (!processedExamIds.has(exam.exam_id)) {
          // First occurrence, send to addExam
          processedExamIds.add(exam.exam_id);  // Mark as processed
          newExams.push(exam);  // This exam will be processed with `addExam`
        } else {
          // Subsequent occurrences, send to existingExams
          existingExams.push(exam);  // This exam will be processed with `saveWithExistedExamID`
        }
      });
  
      // Process newExams (those sent for `addExam`)
      await Promise.all(
        newExams.map(async (exam) => {
          try {
            const payload = {
              student_user_id: id,
              exam_id: parseInt(exam.exam_id),
              target_year: 2025,
            };
  
            console.log("📤 Sending Payload:", payload);
  
            const addExamResponse = await addExams(payload);
  
            if (!addExamResponse?.data || addExamResponse.data.length === 0) {
              console.error("❌ addExams failed:", addExamResponse);
              return;
            }
  
            const studentExamId = addExamResponse.data[0].student_user_exam_id;
            console.log("✅ New student_user_exam_id:", studentExamId);
  
            // Submit only for new exams
            await submitAllStoredResults(studentExamId);
          } catch (error) {
            console.error(`❌ Error in exam ID ${exam.exam_id}:`, error);
          }
        })
      );
  
      // 🚀 Ensure all newExams are processed before calling existing exams
      if (existingExams.length > 0) {
        console.log("📌 Sending existing exams to saveWithExistedExamID:", existingExams);
        await saveWithExistedExamID(existingExams); // Ensure this runs only after all new exams finish
      }
  
      console.log("🎉 All exams processed successfully:", compExams);
    } catch (error) {
      console.error("🚨 Error processing exams:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  
  

  const saveWithExistedExamID = async (exist) => {
    setLoading(true); // Start loading

    try {
      await Promise.all(
        exist.map(async (exam) => {
          console.log(`🚀 Processing existing exam_id: ${exam?.student_user_exam_id}`);
          await submitAllStoredResults(exam?.student_user_exam_id);
        })
      );
    } catch (error) {
      console.error("Error processing exams:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const checkUserIdExamExist = async (xdata) => {
    setLoading(true); // Start loading
    // debugger;
    try {
      let completedExams = await AsyncStorage.getItem(COMPLETED_EXAMS_KEY);
      completedExams = completedExams ? JSON.parse(completedExams) : [];
      console.log("Checking User Exam Existence:", completedExams, xdata);

      if (!Array.isArray(completedExams)) {
        console.error("Invalid format for completed exams.");
        return;
      }

      if (xdata.length > 0) {
        const res = xdata.filter((item) =>
          completedExams.some((ex) => item.exam_id === ex.exam_id)
        );
        const nonExist = completedExams.filter((item) =>
          xdata.every((ex) => item.exam_id !== ex.exam_id)
        );

        console.log("Existing Exams:", res, "Non-Existing Exams:", nonExist);

        if (res.length > 0) saveWithExistedExamID(res);
        if (nonExist.length > 0) saveWithOutExistedExamID(nonExist);
      } else {
        saveWithOutExistedExamID(completedExams);
      }
    } catch (error) {
      console.error("Error in checkUserIdExamExist:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, [fetchData]);

  // console.log(items, "itemsvaluses")
  const handleSelect = (item) => {
    if (item.value === "add") {
      setAddExam(true);
    } else {
      setSelectedOption(item);
      setStudentExamId(item.stUserExamId);
    }
  };

  // console.log(addExam, "modalstatus")
  return (
    <View style={[styles.container, { backgroundColor: theme.textbgcolor }]}>
      {/* Header */}
      <View style={styles.header}>
        {/* Hamburger Menu */}
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/1828/1828859.png",
            }}
            style={[styles.icon, { tintColor: theme.textColor }]}
          />
        </TouchableOpacity>

        {/* App Logo */}
        <Image
          source={require("../images/title.png")}
          style={[styles.logo, { tintColor: theme.textColor }]}
        />

        {/* Compact Dropdown */}
        <View style={{ zIndex: 1000 }}>
        {items.length > 0 && (
          <Dropdown
            style={{
              backgroundColor: theme.background,
              borderColor: theme.tx1,
              borderWidth: 1,
              minHeight: 35,
              width: 120,
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
            containerStyle={{
              backgroundColor: theme.textColor1,
              borderColor: theme.brad,
              maxHeight: 150,
            }}
            placeholderStyle={{
              color: theme.textColor,
              fontSize: 12, // Smaller font size for placeholder
            }}
            selectedTextStyle={{
              color: theme.textColor,
              fontSize: 12, // Smaller font size for selected value
            }}
            itemTextStyle={{
              fontSize: 11, // ✅ Decreased font size for dropdown items
              color: theme.textColor,
            }}
            data={items.length>0?items: { label: "➕ Add", value: "add"}}
            labelField="label"
            valueField="value"
            value={selectedOption?.value === "add" ? null : selectedOption}
            onChange={(item) => handleSelect(item)}
            placeholder="Select"
          />
        )}
        </View>
      </View>

      {/* Welcome Message */}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.textColor}
          />
        }
      >
        <ExamModalComponent
          show={addExam}
          setShow={setAddExam}
          studentUserId={studentUserId}
        />

        <SafeAreaView style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={false} // Ensures full screen
            visible={showCustom}
           
            onRequestClose={() => setShowCustom(false)}
          >
            <View style={styles.modalContainer}>
              {/* Header Section */}
              <View style={[styles.header, { paddingHorizontal: 20 }]}>
                <Text style={styles.headerText}>Custom Exam</Text>
                <Pressable onPress={() => setShowCustom(false)}>
                  <Image
                    source={require("../images/delete.png")}
                    style={{ height: 30, width: 30 }}
                  />
                </Pressable>
              </View>

              {/* Separator Line */}
              <View style={styles.separator} />

              {/* Modal Content */}

              <CustomExamCreation id={studentExamId} fetchData={fetchData} onClose={setShowCustom} />
            </View>
          </Modal>
          {achivementShow && (
            <AchivementsModel
              visible={achivementShow}
              onClose={() => setAchivementShow(false)} // ✅ Corrected this
            />
          )}
        </SafeAreaView>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6A5ACD" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <>
            <WeeklyPerformance
              examResults={examResults}
              selectedPerformanceType={selectedPerformanceType}
              dateRange={dateRange}
              setSelectedPerformanceType={setSelectedPerformanceType}
              totalExamCount={totalExamCount}
            />

            <MockTests
              selectedType={selectedType}
              mocklist={mocklist}
              pre={pre}
              customExams={customExams}
              setSelectedType={setSelectedType}
              setMock={setMock}
              setShowCustom={setShowCustom}
              handleCheckResults={handleCheckResults}
              handleStartTest={handleStartTest}
            />

            <Achivements ach={ach} setAchivementShow={setAchivementShow} />
            <LeaderBoard champ={champ} />
          </>
        )}

        {/* <View style={styles.tabScreen}><Text>Performance</Text></View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 45,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6A5ACD",
    flex: 1,
    textAlign: "center",
  },
  icon: { width: 25, height: 25, tintColor: "black" },
  examTypeContainer: {
    flexDirection: "row",
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: "#E9EAEB",
    padding: 5,
    justifyContent: "space-evenly",
    marginHorizontal: 15,
    borderRadius: 10,
  },
  examTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedExamButton: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    elevation: 2,
    width: 100,
    alignItems: "center",
  },
  examType: { fontSize: 16, color: "gray" },
  selectedExam: { color: "black", fontWeight: "bold" },
  welcome: { marginTop: 10, fontSize: 16 },
  username: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  performanceCard: { padding: 10, borderRadius: 10, elevation: 1 },
  performanceTitle: { fontSize: 18, fontWeight: "bold" },
  subText: { color: "gray" },
  bigText: { fontSize: 30, fontWeight: "bold", marginTop: 5 },
  chart: { height: 150, marginTop: 10 },
  tabScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 500,
    justifyContent: "center",
  },
  startButtonGradient: {
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 50,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  containertext: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Pushes text & dropdown to opposite sides
  },
  textContainer: {
    flex: 1, // Takes up available space
  },
  dropdownContainer: {
    width: 150, // Set width for dropdown to avoid shrinking
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 14,
    color: "gray",
  },
  bigText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  startButtonGradients: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: 150,
    fontWeight: "700",
  },
  startButtonTexts: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 30,
    // paddingHorizontal: 25,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "transparent",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  logo: {
    height: 50,
    width: 150,
    resizeMode: "contain",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    width: "100%",
  },
  content: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  itemContainer: {
    width: "98%",
    margin: 5,
    padding: 5,
    borderRadius: 15,
  },

  dropdownLinearGradient: {
    borderRadius: 15,
  },
  dropdownButton: {
    padding: 10,
    borderColor: "#ccc",
    borderRadius: 5,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  dropdown: {
    position: "absolute",
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    zIndex: 2,
  },
  option: {
    padding: 10,
    width: "100%",
  },
  addButton: {
    padding: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  addButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  option1: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
});

export default DashboardContent;