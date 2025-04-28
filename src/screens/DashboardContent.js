import React, { useState, useEffect, useCallback, useMemo, useLayoutEffect } from "react";
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
  DeviceEventEmitter,
} from "react-native";
import {setAutoSaveId, setExamDuration, setExamSessionId} from "../store/slices/examSlice"
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
  addAnalytics,
} from "../core/CommonService";
import { darkTheme, lightTheme } from "../theme/theme";
import CustomExamCreation from "./CustomExamCreation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRef } from "react";
import MockTests from "./dashboardItems/MockTests";
import Header from "../common/Header";
import AnimationWithImperativeApi from "../common/LoadingComponent";
import { useDispatch, useSelector } from "react-redux";
import { getDeviceId, getUniqueId } from  "react-native-device-info";
import { setDeviceId } from "../store/slices/headerSlice";

const COMPLETED_EXAMS_KEY = "completedExams";
const COMPLETED_MOCK_TESTS_KEY = "completedMockTests";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const DashboardContent = ({ route, navigation, onChangeAuth }) => {


  const dispatch = useDispatch();
  const selectedExam = useSelector((state) => state.header.selectedExam);
  const [completedExams, setCompletedExams] = useState([]);
  const [completedMockTests, setCompletedMockTests] = useState([]);
  const colorScheme = useColorScheme();
  const theme = darkTheme;
  const [addExam, setAddExam] = useState(false);
  const [examResults, setExamResults] = useState([]);
  const [name, setName] = useState("");
  const [uid, setUid] = useState(route?.params?.exam?.uid ?? "");
  const [studentId, setStudentId] = useState("");
  const [studentExamId, setStudentExamId] = useState(selectedExam);
  const [champ, setChamp] = useState([]);
  const [mocklist, setMocklist] = useState([]);
  const [pre, setPre] = useState([]);
  const [customExams, setCustomExams] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [mock, setMock] = useState([]);
  const [examsData, setExamsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecteditem, setSelectedItem] = useState(null)
  const [examLoading, setExamLoading] = useState(false);
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
   const uniqueId = useSelector((state) => state.header.deviceId);
  
  
    
  
      const handleAnalytics = async (id) => {
          console.log("hey Um called")
          try {
              // Define your params correctly
              const params = {
                  "student_user_exam_id": 0,
                  "type": 0,
                  "source": 0,
                  "testonic_page_id": id,
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
              setExamLoading(false);
          } catch (error) {
              // Handle errors gracefully
              const errorMessage = error.response?.data?.message || error.message;
            
              console.error("Error:", errorMessage);      setExamLoading(false);
          }
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
  const getData = async () => {
        const uniqueId = await getUniqueId();
       dispatch(setDeviceId(uniqueId));
        // Log the uniqueId and current route information
        console.log(uniqueId,  "payloaddlscknl");
        await handleAnalytics(41);
    };

  useEffect(() => {

    getData();
  },[])

useEffect(() => {
setStudentExamId(selectedExam);
if(selectedExam) {
  setSelectedOption(items.find((item) => item.stUserExamId === selectedExam));
}
console.log(items, selectedExam, "items")
}, [selectedExam]);
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

  useEffect(() => {
    fetchData();
  }, [selectedExam, navigation]);


  useEffect(() => {
    setMock(mocklist);
  }, [mocklist, pre]);

  useEffect(() => {
    getUser();
  }, []);

  const getCustomeExam = async (id) => {
    const data = {
      student_user_exam_id: id,
    };
    const response = await getCustomExams(data);
   if(response?.data) {
    setCustomExams(response?.data);
   }
    console.log(response, "custom");
  };

 

  const getPrevious = async () => {
    const data = {
      student_user_exam_id: selectedExam,
    };
    try {
      const res = await getPreviousPapers(data);
      console.log("Previouspao", res);
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
      console.log("years", response);
    } catch (error) {
      console.error("Error fetching years data:", error);
      Alert.alert(
        "Error",
        "Failed to get years data. Please check your connection and try again."
      );
    }
  };





  const getMock = async () => {
    const data = {
      student_user_exam_id: selectedExam,
    };
    try {
      const response = await getMockExams(data);
      console.log("mock exam", response.data);
      const tyu = response?.data;
      setMocklist(tyu);
    } catch (error) {
      console.error("Error fetching mock exams:", error);
      // Alert.alert(
      //   "Error",
      //   "Failed to get mock exams. Please check your connection and try again."
      // );
    }
  };


  const handleStartTest = async (item, type) => {
    try {
      setExamLoading(true);
      setSelectedItem(item);
      console.log(item, "uieurgirqbwkqef")
      const previousExam = pre.find((p) => p.exam_name === item.exam_name);
      let previousPaperId = previousExam ? previousExam.previous_paper_id : null;
      let sessionId = null;
  
      // Case 1: Previous exam with no session
      if (
        selectedType === "previous" &&
        item.exam_session_id == 0 &&
        type !== "replay" &&
        item?.previous_session_id == 0
      ) {
        const dat = {
          previous_exam_paper_id: previousPaperId,
          student_user_exam_id: selectedExam,
        };
  
        const response = await getPreviousPapRes(dat);
        console.log(response, selectedType, item, "prev Response");
  
        if (response?.data?.exam_session_id) {
          sessionId = response.data.exam_session_id;
        } else {
          console.warn("⚠️ No session ID returned in response");
          return; // Exit early if sessionId is invalid
        }
      }
  
      // Set session ID from appropriate source
      if (Number(item?.previous_session_id) > 0) {
        await handleAnalytics(45);
        sessionId = item.previous_session_id;
      } else if (Number(item?.custom_exam_id) > 0) {
        await handleAnalytics(46);
        sessionId = item.custom_exam_id;
      } else if (sessionId) {
        await handleAnalytics(44);
      } else {
        await handleAnalytics(44);
        sessionId = item.exam_session_id;
      }
  
      console.log("✅ Final Session ID:", sessionId);
  
      dispatch(setExamSessionId(sessionId));
      dispatch(setAutoSaveId(item?.auto_save_id || 0));
  
      if (!item?.auto_save_id) {
        dispatch(setExamDuration(item?.exam_duration));
      }
  
      navigation.navigate("InstructionAuth", {
        obj: item,
        studentExamId: selectedExam,
        examtype: "schedule_exam",
        type: selectedType,
        session_id:
          sessionId || item.previous_session_id || item.custom_exam_id || 0,
      });
    } catch (error) {
      console.error("❌ Error in handleStartTest:", error);
    } finally {
      setExamLoading(false); // ✅ Always called, no matter what happens
    }
  };
  
  

  const handlePrv = async (item) => {
    const previous_id = pre.filter((p) => p.exam_name === item.exam_name);
    if (previous_id.length > 0) {
      console.log("previous_id", previous_id);
    }

    const dat = {
      previous_exam_paper_id: previous_id,
      student_user_exam_id: selectedExam,
    };
    // console.log("getLeader Boards handlePrv", dat , item);

    const response = await getPreviousPapRes(dat);
    // console.log("getLeader Boards handlePrvs", JSON.stringify(response));
    if (response) {
      console.log("0000", response);
    }
  };

  const handleCheckResults = async (data, type) => {
    const examObject = {
      ...data,
      type: type,
      studentExamUID: selectedExam ,
    };
    // dispatch(setExamSessionId(data.exam_session_id));
    try {
      // Define your params correctly
      const params = {
          "student_user_exam_id": 0,
          "type": 0,
          "source": 0,
          "testonic_page_id": selectedType=="previous" ? 54:  selectedType=="mock" ? 50 : 59,
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

    navigation.navigate("resultsPage", { state: examObject });
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
  
  const toggleDropdown = () => {
    setIsOpen(true);
  };

 const getUser = async () => {

    try {
      const response = await getAutoLogin();

      if (!response?.data) {
        console.warn("No user data received from API");
        return;
      }

      const { name, student_user_id, examsData } = response.data;

      let comData = await AsyncStorage.getItem(COMPLETED_EXAMS_KEY);
      let parsedData = comData ? JSON.parse(comData) : null;

      if (parsedData && Array.isArray(parsedData) && parsedData.length > 0) {
        console.log("parse",parsedData);

        const uniqueExams = parsedData.filter(
          (exam, index, self) =>
            index === self.findIndex((e) => e.exam_id === exam.exam_id)
        );
        
        const updatedExamsData = await createExamIds(uniqueExams, student_user_id);
        if (updatedExamsData) {
          setExamsData(updatedExamsData);
          addDropDownValues(updatedExamsData);

          await submitAllStoredResults()
        }
        return

      }

      console.log("Fetched user data:", response.data);

      setName(name);
      setStudentId(student_user_id);
      // setStudentUserId(student_user_id);

      if (!(examsData?.length)) {
        setAddExam(true); // No exam data, prompt user to add an exam
      } else {
        setExamsData(examsData);
        addDropDownValues(examsData);
      }

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };




  const createExamIds = async (newExams, student_user_id) => {

    try {
      const results = await Promise.allSettled(newExams.map(exam =>
        addExams({
          student_user_id,
          exam_id: Number(exam.exam_id),
          target_year: 2025,
        })
      ));

      const successfulExams = results
        .filter((result) => result.status === "fulfilled")
        .map((_, index) => newExams[index]);

      if (successfulExams.length === 0) return null;

      const response = await getAutoLogin();
      return response?.data?.examsData || null;

    } catch (error) {
      console.error("❌ Error in createExamIds:", error);
      return null;
    }
  };




  const addDropDownValues = async (existingExams) => {
    console.log("dropdownavlaues");

    const exams = await getExamType();

    const examsDataMap = new Map(
      existingExams.map((exam) => [exam.exam_id, exam])
    );

    const mergedExamsData = exams.data.map((exam) => {
      const existingExamData = examsDataMap.get(exam.exam_id);
      return { ...exam, ...(existingExamData || {}) };
    });
    const filteredMergedData = mergedExamsData.filter((exam) =>
      exam.hasOwnProperty("is_default")
    );


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
    let examID = (defaultItem || dropdownItems[0]).stUserExamId
    setSelectedOption(defaultItem || dropdownItems[0]);
    setStudentExamId(examID);

    await fetchData(examID);

  };



  const submitAllStoredResults = async () => {
    const response = await getAutoLogin();
  
    if (!response?.data) {
      console.warn("No user data received from API");
      return;
    }
  
    const { examsData } = response.data;
  
    let storedMockTests = await AsyncStorage.getItem(COMPLETED_MOCK_TESTS_KEY);

    console.log("storedMockTests",storedMockTests);
    
  
    if (storedMockTests) {
      let parsedMockTests = JSON.parse(storedMockTests);
      let validMockTests = parsedMockTests.filter((test) => test.results);
      let successfulExamPaperIds = new Set();
      console.log("parsedMockTests",parsedMockTests);
      
  
      try {
        await Promise.all(
          validMockTests.map(async (testData) => {
            try {
              let questions = testData?.results;
              let exam_paper_id = testData?.results?.exam_paper_id;
  
              let examObj = examsData.find(
                (item) => item.exam_id == testData.exam_id
              );
  
              if (!examObj) {
                console.warn(`⚠️ No matching exam found for ID: ${testData.exam_id}`);
                return;
              }
  
              let sendingProps = {
                examData: questions,
                exam_paper_id: exam_paper_id,
                exId: examObj.student_user_exam_id,
              };
  
              const submissionResponse = await submitTestResult(sendingProps);
  
              console.log("submissionResponse", submissionResponse);
  
              if (submissionResponse?.success) {
                console.log(`✅ Successfully submitted ${exam_paper_id}`);
                successfulExamPaperIds.add(exam_paper_id); // Mark for removal
              } else {
                console.warn(`⚠️ Submission failed for ${exam_paper_id}`);
              }
            } catch (error) {
              console.error(`❌ Error submitting ${testData.exam_id}:`, error);
            }
          })
        );
  
        // Optional: Filter out only successful submissions if you want to keep failed ones
   
  
      } catch (error) {
        console.error("❌ Error processing mock tests:", error);
      }
  
      // 💥 Remove all stored mock tests completely after everything is done
      try {
        await AsyncStorage.removeItem(COMPLETED_MOCK_TESTS_KEY);
        await AsyncStorage.removeItem(COMPLETED_EXAMS_KEY);
        console.log("examsData",examsData);
        
        const defaultItem = examsData.find((item) => item.is_default === 1);
        console.log("defaultItem",defaultItem);
        
        await fetchData(defaultItem.student_user_exam_id);
        DeviceEventEmitter.emit('allExamsSubmitted');
        console.log("🧹 All stored mock tests have been removed from AsyncStorage.");
      } catch (error) {
        console.error("❌ Error clearing stored mock tests:", error);
      }
    }
  };
  
  const getExamResults = async (examID) => {
    const data = {
      student_user_exam_id: examID,
      duration_id: 1,
    };

    try {
      const response = await getDashboardExamResult(data);
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




  const fetchData = useCallback(async (examID) => {
    setLoading(true);

    try {
      await Promise.all([getYears(), getMock(examID|| selectedExam), getPrevious(examID|| selectedExam)]);
      if (examID|| selectedExam) {
        await Promise.all([getExamResults(examID|| selectedExam), getCustomeExam(examID|| selectedExam)]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Alert.alert("Error", "Failed to refresh data. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  });


  // console.log(items, "itemsvaluses")



const memoizedContent = useMemo(() => {
  if (loading||!mocklist?.length>0) {
    return (
      <View style={styles.loadingContainer}>
       <AnimationWithImperativeApi />
      </View>
    );
  }

  return (
    <>
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
        loading={examLoading}
        selecteditem={selecteditem}
      />
    </>
  );
}, [loading, examLoading,selecteditem,selectedType, mocklist, pre, customExams]);




  // console.log(addExam, "modalstatus")
  return (
    <View style={[styles.container, { backgroundColor: theme.textbgcolor }]}>
      {/* Header */}
   
<Header setAddExam={setAddExam} addExam={addExam} setId={setStudentExamId}  />
{memoizedContent}
      {/* Welcome Message */}
      {/* <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.textColor}
          />
        }
      > */}
   

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

              <CustomExamCreation id={selectedExam} selectedOption={selectedOption} fetchData={fetchData} onClose={setShowCustom} />
            </View>
          </Modal>
    
        </SafeAreaView>
     

        {/* <View style={styles.tabScreen}><Text>Performance</Text></View> */}
      {/* </ScrollView> */}
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

  subText: { color: "gray" },
  bigText: { fontSize: 30, fontWeight: "bold", marginTop: 5 },
  chart: { height: 150, marginTop: 10 },
  tabScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    marginTop: 250,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: windowHeight,
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