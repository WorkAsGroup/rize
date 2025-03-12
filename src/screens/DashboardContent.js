import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, useColorScheme, FlatList, ActivityIndicator, ScrollView, RefreshControl, Alert, Modal, Pressable } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
// import { LineChart } from 'react-native-svg-charts';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getAutoLogin, getYearsData, getMockExams, getAchievements, getExamType, getLeaderBoards, getPreviousPapers, getCustomExams, getDashboardExamResult, getSubmitExamResults, getPreviousPapRes } from '../core/CommonService';
import { darkTheme, lightTheme } from '../theme/theme';
import LinearGradient from "react-native-linear-gradient";
import RNPickerSelect from 'react-native-picker-select';
import { AreaChart, Grid, XAxis, YAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { LineChart } from "react-native-chart-kit";
import { Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg";
import CustomExamCreation from './CustomExamCreation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { Dropdown } from 'react-native-element-dropdown';
import ExamModalComponent from './ExamModalComponent';

const Tab = createBottomTabNavigator();

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const DashboardContent = ({ route,navigation, onChangeAuth  }) => {
  // const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [studentUserId, setStudentUserId] = useState(null)
  // const { onChangeAuth } = route.params;


  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const [addExam, setAddExam] = useState(false)
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
  const [examsData, setExamsData] = useState([])
  const [loading, setLoading] = useState(true);
  const [ach, setAch] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalExamCount, setTotalExamCount] = useState(0)
  const [dateRange, setDateRange] = useState("-")
  const data = [50, 70, 60, 90, 80];
  const [selectedType, setSelectedType] = useState('mock');
  const [selectedPerformanceType, setSelectedPerformanceType] = useState('score');
  const [showCustom, setShowCustom] = useState(false);
  const [preExamResults, setPreExamResults] = useState(null);
  const [hasLoadedResults, setHasLoadedResults] = useState(false);
  const chartData = [
    { data: [50, 70, 60, 90, 80], color: '#6A5ACD', strokeWidth: 2 },
    { data: [90, 50, 20, 50, 50], color: 'green', strokeWidth: 2 },
    { data: [10, 90, 20, 80, 50], color: 'red', strokeWidth: 2 },
  ];
    const [items, setItems] = useState([]);
  const [selectedValue, setSelectedValue] = useState(1);
  console.log("99999999", preExamResults);
  const options = [
    { label: 'Last 30 Days', value: 1 },
    { label: 'Last 2 Months', value: 2 },
  ];
  const handleSetMockType = (type) => {
    setSelectedType(type);

  };
  const toggleDropdown = () => {
    setIsOpen(true);
  };
  const handleOptionSelect = (option) => {
    console.log(option, "options", option.exam_id)
    setStudentExamId(option.student_user_exam_id)
    setSelectedOption(option.exam_type);
    setIsOpen(false);
  };
  const retrieveExam = async () => {
    try {
      const examData = await AsyncStorage.getItem('exam');
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
    if(!route?.params?.exam) {
      retrieveExam();
    }


   
  }, []);

  // useEffect(() => {
  //   console.log("response exams", items, examsData);
  //   if(examsData.length>0&&items.length>0){
  //     const filterData = items.filter((item) =>
  //       examsData.some(exam => exam.exam_id === item.exam_id)
  //   );
  //   setStudentExamId(filterData[0].exam_id)
  //   console.log(filterData, "heeeha");
  //   setItems(filterData)
  //   } 
  // },[items, examsData])
 

  const submitTestResult = async () => {
    if (!preExamResults) {
      if (route.params.exam) {
        setPreExamResults(route.params.exam);
      }
    }

    const questions = JSON.stringify(
      preExamResults.questions.map(question => ({
        question_id: question.question_id,
        status: question.status,
        question_time: question.question_time,
        attempt_answer: question.attempt_answer,
        reason_for_wrong: question.reason_for_wrong,
        comments: question.comments,
        slno: question.slno,
        subject_id: question.subject_id,
        review: question.review,
        is_disabled: question.is_disabled
      }))
    );

    console.log(typeof questions, "questionaryr");

    const data = {
      exam_paper_id: preExamResults.exam_paper_id,
      exam_session_id: 0,
      student_user_exam_id: studentExamId,
      questions: questions,
    };
    const prevData ={
      exam_paper_id: preExamResults.exam_paper_id,
      exam_session_id: 0,
      student_user_exam_id: studentExamId,
      questions: questions,
      type: "previous_exam",
      uid: uid ? uid: route?.params?.exam?.uid,
    }

    console.log("Submit Data:",route?.params?.exam,selectedType, JSON.stringify(selectedType==="previous" ? prevData:data));
    try {
      const response = await getSubmitExamResults(selectedType==="previous" ? prevData:data);
      console.log("Submit Response:", response);
      setPreExamResults(null);
    } catch (error) {
      console.error("Error submitting results:", error);
      // ... handle error
    }
  };


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
      Alert.alert("Error", "Failed to refresh data. Please check your connection and try again.");  // More user-friendly error handling
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
},[])

  const getCustomeExam = async () => {
    const data = {
      student_user_exam_id: studentExamId,

    };
    const response = await getCustomExams(data)
    setCustomExams(response.data)
    console.log(response, "custom")
  }

  const getUser = async () => {
    try {
      const response = await getAutoLogin();
      console.log("auto-login", response);
      if (response.data) {
        const nm = response.data.name;
        const id = response.data.student_user_id;
        setStudentUserId(id)
        setExamsData(response.data.examsData)
        const examId = response.data.examsData[0].student_user_exam_id;
        const exams = await getExamType();
       console.log(response?.data?.examsData, "e[okpqeof")
        if (response?.data?.examsData&&response.data.examsData?.length > 0 && exams.data?.length > 0) {
          // Create a Set of exam_ids present in response.data.examsData
          const examsDataSet = new Set(response.data.examsData.map(exam => exam.exam_id));
      
          // Merge and filter exams where exam_id exists in both
          const filteredMergedData = exams.data
              .filter(item => examsDataSet.has(item.exam_id)) // Keep only matching exam_id
              .map(item => ({
                  ...item, // Retain properties from exams.data
                  ...response.data.examsData.find(exam => exam.exam_id === item.exam_id) // Merge matching exam_id data
              }));
         
  const dropdownItems = [
   
    ...filteredMergedData.map((option) => ({
      label: option.exam_type,
      value: option.exam_id,
      isDefault: option.is_default,
      stUserExamId:  option.student_user_exam_id
    })),
    { label: "➕ Add", value: "add", custom: true },
  ];
  setItems(dropdownItems);
  const defaultItem = dropdownItems.find((item) => item.is_default === 1);
if(defaultItem) {
  console.log(defaultItem,dropdownItems,examsDataSet, "defaultItem")
  setSelectedOption(defaultItem);

  setStudentExamId(defaultItem.stUserExamId);
} else {
  setSelectedOption(dropdownItems[0]);
  setStudentExamId(dropdownItems[0].stUserExamId);
}
// Ensure safe access
          console.log(filteredMergedData, "Filtered Merged Data", response.data.examsData, exams.data);
      }
      
      else {
        setStudentExamId(examId)
      }
 
        setName(nm);
        setStudentId(id);
      
      } else {
        console.warn("No user data received from API");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "Failed to get user data. Please check your connection and try again.");
    }
  };

  const getPrevious = async () => {
    const data = {
      "student_user_exam_id": studentExamId
    };
    try {
      const res = await getPreviousPapers(data);
      console.log("Previouspao", res);
      const tyu = res?.data;
      setPre(tyu);
    } catch (error) {
      console.error("Error fetching Previouspaper data:", error);
      Alert.alert("Error", "Failed to get previous papers. Please check your connection and try again.");
    }
  };

  const getYears = async () => {
    try {
      const response = await getYearsData();
      console.log("years", response);
    } catch (error) {
      console.error("Error fetching years data:", error);
      Alert.alert("Error", "Failed to get years data. Please check your connection and try again.");
    }
  };

  const getAchieve = async () => {
    const data = {
      "student_user_exam_id": studentExamId
    };
    try {
      const response = await getAchievements(data);
      console.log("getAchievements", JSON.stringify(response?.data));
      if (response?.data) {
        setAch(response.data);
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
      Alert.alert("Error", "Failed to get achievements. Please check your connection and try again.");
    }
  };

  const getLeaders = async () => {
    const data = {
      "student_user_exam_id": studentExamId
    };
    try {
      const response = await getLeaderBoards(data);
      console.log("getLeaderBoards", JSON.stringify(response.data));
      if (response.data && Array.isArray(response.data)) {
        setChamp(response.data);
      } else {
        setChamp();
        console.warn("No leaderboard data received or data is not an array.");
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      setChamp();
      Alert.alert("Error", "Failed to get leaderboard data. Please check your connection and try again.");
    }
  };

  const getMock = async () => {
    const data = {
      "student_user_exam_id": studentExamId
    };
    try {
      const response = await getMockExams(data);
      console.log("mock exam", response.data);
      const tyu = response?.data;
      setMocklist(tyu);
    } catch (error) {
      console.error("Error fetching mock exams:", error);
      Alert.alert("Error", "Failed to get mock exams. Please check your connection and try again.");
    }
  };



  const getExamResults = async () => {
    const data = {
      student_user_exam_id: studentExamId,
      duration_id: 1
    };

    try {
      const response = await getDashboardExamResult(data);
      console.log("exam response", response);
      setTotalExamCount(response.data.total_test_count)
      setExamResults(response.data.periods);
      setDateRange(response.data.duration_dates)
    } catch (error) {
      console.error("Error fetching mock exams:", error);
      Alert.alert("Error", "Failed to get mock exams. Please check your connection and try again.");
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ width: "98%", margin: 5, flexDirection: 'row', padding: 5, backgroundColor: theme.textColor1, borderRadius: 15, left: -5 }}>
        <LinearGradient
          colors={[theme.tx1, theme.tx2]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={styles.startButtonGradient}
        >
          <Text style={[{ color: theme.black, fontFamily: "CustomFont", fontWeight: '800' }]}>{item.rank}</Text>
        </LinearGradient>
        <View style={{ height: 35, width: 35, backgroundColor: theme.gray, borderRadius: 20, alignItems: 'center', justifyContent: "center", borderWidth: 1, borderColor: theme.white, alignSelf: 'center', left: -10 }}>
          <Text style={{ color: theme.white }}>
            {item.name[0]}
          </Text>
        </View>
        <View style={{ height: 40, width: 50 }}>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 200, left: -55 }}>
          <Text style={{ color: "#000", color: theme.textColor }}>{item.name}</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
  {item.count === 0 ? (
    <Text style={{fontSize: 21, color: "#2575FC", marginRight: 5 }} >=</Text>
  ) : item.is_increase ? (
    <>
      <Image source={require("../images/up_arrow.png")} style={{ height: 30, width: 15, tintColor: "green", resizeMode: 'contain', marginRight: 5 }} />
      <Text style={{ color: "green" }}>{item.count}</Text>
    </>
  ) : (
    <>
      <Image source={require("../images/down_arrow.png")} style={{ height: 30, width: 15, tintColor: "red", resizeMode: 'contain', marginRight: 5 }} />
      <Text style={{ color: "red" }}>{item.count}</Text>
    </>
  )}
</View>

        </View>

      </View>
    );
  };


  const handleStartTest = async (item) => {
    console.log("item", item);
    const previousExam = pre.find((p) => p.exam_name === item.exam_name);

    let previousPaperId = null;
    if (previousExam) {
      previousPaperId = previousExam.previous_paper_id;
      console.log("previousPaperId:", previousPaperId);
    } else {
      console.log("No previous exam found for:", item.exam_name);
    }

    try { // Add a try/catch block for better error handling
      const dat = {
        previous_exam_paper_id: previousPaperId,
        student_user_exam_id: studentExamId,
      };

      const response = await getPreviousPapRes(dat);
      console.log("getLeaderBoards Response:", JSON.stringify(response));

      let sessionId = null; // Initialize sessionId
      if (response && response.data && response.data.exam_session_id) {
        sessionId = response.data.exam_session_id;
      }

      navigation.navigate("InstructionAuth", {
        obj: item,
        studentExamId: studentExamId,
        examtype: selectedType,
        session_id: sessionId ? sessionId: item.custom_exam_id, 
      });
    } catch (error) {
      console.error("Error in handleStartTest:", error);
    }
  };

  const handlePrv = async (item) => {
    const previous_id = pre.filter((p) => p.exam_name === item.exam_name);
    if(previous_id.length > 0){
      console.log("previous_id", previous_id);
    }
   
    const dat = {
      "previous_exam_paper_id": previous_id,
      "student_user_exam_id": studentExamId
    };
    console.log("getLeaderBoards", dat , item);

    const response = await getPreviousPapRes(dat);
    console.log("getLeaderBoards", JSON.stringify(response));
    if (response) {
      console.log("0000", response)
    }

  }

  const handleCheckResults = (data, type) => {
    const examObject = {
      ...data,
      type: type,
      studentExamUID: studentExamId,
    }
    // dispatch(setExamSessionId(data.exam_session_id));
    navigation.navigate("resultsPage", { state: examObject });
  };

  const renderItemMock = ({ item }) => {
    // console.log(item, "exam status")
    return (
      <View style={[styles.itemContainer, { backgroundColor: theme.textColor1 }]} key={item?.exam_paper_id}>
        {/* Exam Details */}
        <View style={styles.detailsContainer}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.examName, { color: theme.textColor }]}>{item.exam_name}</Text>
            <View style={styles.timeContainer}>
              <Image source={require("../images/clock.png")} style={[styles.clockIcon, { tintColor: theme.textColor }]} />
              <Text style={[styles.timeText, { color: theme.textColor }]}>3 Hours 0 minutes</Text>
            </View>
          </View>
          {/* Start Button */}
          <View style={{ marginTop: 10 }}>
            {item.exam_session_id === 0 && item.auto_save_id === 0 ? (
              // Start Button
              <TouchableOpacity
                style={[styles.startExamBtn, { marginRight: 10 }]}
                // onPress={() => handleStartExam(item, "mockTest")}
                onPress={() => handleStartTest(item)}
              >
                <LinearGradient
                  colors={["#B465DA", "#CF6CC9", "#EE609C", "#EE609C"]}
                  style={styles.gradientButton}
                >
                  <Text style={styles.textExamBtn}>Start ➡</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : item.exam_session_id !== 0 && item.auto_save_id === 0 ? (
              // Replay & Results Button
              <View style={[styles.startExamBtn, { flexDirection: "row", marginRight: 10 }]}>
                <TouchableOpacity
                  onPress={() => handleStartTest(item, "mockTest")}
                  style={[styles.textExamBtn, styles.replayButton]}
                >
                  <Text style={styles.buttonText}>🔄</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleCheckResults(item, "schedule_exam")}
                  style={[styles.textExamBtn, styles.resultsButton]}
                >
                  <Text style={styles.buttonText}>Results</Text>
                  <Image source={require("../images/pie-chart.png")} style={styles.icon} />
                </TouchableOpacity>
              </View>
            ) : item.exam_session_id !== 0 && item.auto_save_id !== 0 ? (
              // Resume & Results Button
              <View style={[styles.startExamBtn, { flexDirection: "row", marginRight: 10 }]}>
                <LinearGradient
                  colors={["#B465DA", "#CF6CC9", "#EE609C", "#EE609C"]}
                  style={[styles.gradientButton, { marginRight: 10 }]}
                >
                  <TouchableOpacity onPress={() => handleStartTest(item, "mockTest")}>
                    <Text style={styles.textExamBtn}>Resume</Text>
                  </TouchableOpacity>
                </LinearGradient>
                <TouchableOpacity
                  onPress={() => handleCheckResults(item, "schedule_exam")}
                  style={[styles.textExamBtn, styles.resultsButton]}
                >
                  <Text style={styles.buttonText}>Results</Text>
                  <Image source={require("../images/pie-chart.png")} style={styles.icon} />
                </TouchableOpacity>
              </View>
            ) : (
              // Resume Button Only
              <LinearGradient
                colors={["#B465DA", "#CF6CC9", "#EE609C", "#EE609C"]}
                style={[styles.gradientButton, { marginRight: 10 }]}
              >
                <TouchableOpacity onPress={() => handleStartTest(item)}          >
                  <Text style={styles.textExamBtn}>Resume</Text>
                </TouchableOpacity>
              </LinearGradient>
            )}
          </View>
        </View>

        {/* Exam Marks List */}
        {item.marks?.length > 0 && (<ScrollView showsHorizontalScrollIndicator={false}

          horizontal contentContainerStyle={styles.marksContainer} >
          {item.marks.map((mark, index) => (
            <TouchableOpacity key={index} style={[styles.markButton, styles[`bgColor${index}`], styles[`borderColor${index}`]]}>
              <Text style={[styles.markText, { color: theme.textColor }]}>{mark.subject}: {mark.subject_score}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        )}
      </View>
    );
  };

  const renderItems = ({ item }) => {
    console.log(item, "badgeItem")
    return (
      <View style={{ width: "98%", margin: 5, flexDirection: 'column', padding: 5, backgroundColor: theme.textColor1, borderRadius: 15, justifyContent: 'center' , alignItems: 'center' }}>
        <Image source={{ uri: item.badge_logo }} style={{ height: 50, width: 50, resizeMode: 'contain' }} />
        <Text style={{ color: "#000" }}>
          {item.badge_name}
        </Text>
        
      </View>
    )
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, [fetchData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A5ACD" />
        <Text>Loading...</Text>
      </View>
    );
  }

  const WeeklyPerformance = () => {
    console.log(examResults, "results");

    if (!examResults || !Array.isArray(examResults)) {
      return <Text>No data available</Text>;
    }

    const periods = examResults || [];
    const allSubjects = [...new Set(periods.flatMap((period) => period.subjects?.map((s) => s.subject_name) || []))];
    const uniqueDates = [...new Set(periods.map((period) => period.date))];
    const chartData = allSubjects.map((subject) => ({
      name: subject,
      data: periods.map((period) => {
        const subjectData = period.subjects?.find((s) => s.subject_name === subject);
        return subjectData
          ? selectedPerformanceType === "score"
            ? Number(subjectData.obtained_marks) || 0
            : Number(subjectData.average_time_spent) || 0
          : 0;
      }),
    }));

    const xLabels = uniqueDates

    const subjectColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF"];

    return (
      <View style={{ backgroundColor: theme.conbk, padding: 10, borderRadius: 10 }}>
       
          {chartData?.length > 0 ? (
          <React.Fragment>
             <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: theme.textColor }}>Weekly Performance</Text>
            <Text style={{ fontSize: 14, color: theme.textColor }}>Total tests taken current week</Text>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: theme.textColor }}>
              {totalExamCount ? totalExamCount : 0}
            </Text>
          </View>

          <View>
            <Text style={{ color: theme.textColor }}>{dateRange}</Text>
            <RNPickerSelect
              onValueChange={(value) => setSelectedValue(value)}
              items={options}
              value={selectedValue}
              style={{
                inputAndroid: { color: theme.textColor },
                inputIOS: { color: theme.textColor },
              }}
            />
          </View>
          </View>

<View style={{ flexDirection: "row", marginTop: 10 }}>
  <TouchableOpacity
    style={{
      padding: 8,
      borderBottomWidth: selectedPerformanceType === "score" ? 2 : 0,
      borderBottomColor: selectedPerformanceType === "score" ? theme.tx1 : "transparent",
    }}
    onPress={() => setSelectedPerformanceType("score")}
  >
    <Text style={{ color: selectedPerformanceType === "score" ? theme.tx1 : theme.textColor }}>Scoring</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={{
      padding: 8,
      marginLeft: 10,
      borderBottomWidth: selectedPerformanceType === "avgtime" ? 2 : 0,
      borderBottomColor: selectedPerformanceType === "avgtime" ? theme.tx1 : "transparent",
    }}
    onPress={() => setSelectedPerformanceType("avgtime")}
  >
    <Text style={{ color: selectedPerformanceType === "avgtime" ? theme.tx1 : theme.textColor }}>
      Avg Time Spent
    </Text>
  </TouchableOpacity>
</View>

{/* Line Chart */}
{chartData && chartData.length > 0 && xLabels && xLabels.length > 0 ? (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <LineChart
      data={{
        labels: xLabels,
        datasets: chartData.map((subject, index) => ({
          data: subject.data || [],
          color: () => subjectColors[index % subjectColors.length],
          strokeWidth: 2,
        })),
      }}
      width={chartData.length >5 ? chartData.length* 0.8 : windowWidth*0.85}
      height={250}
      yAxisLabel=""
      chartConfig={{
        backgroundColor: theme.conbk,
        backgroundGradientFrom: theme.white,
        backgroundGradientTo: theme.white,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        propsForDots: {
          r: "4",
          strokeWidth: "2",
          stroke: "#ffa726",
        },
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 10,
      }}
    />
  </ScrollView>
) : (
  <Text style={{ color: theme.textColor }}>No data available</Text>
)}
{/* Subject Legends */}
<View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
  {chartData.map((subject, index) => (
    <View key={index} style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
      <View
        style={{
          width: 10,
          height: 10,
          backgroundColor: subjectColors[index % subjectColors.length],
          marginRight: 5,
        }}
      />
      <Text style={{ color: theme.textColor }}>{subject.name}</Text>
    </View>
  ))}
</View>
          </React.Fragment>
          ) : (
            <Image source={{ uri: "https://mocktest.rizee.in/static/media/take-the-test1.e09ad0cac0e111c3b6d7.png" }} style={{ width: windowWidth, height: windowWidth*0.75, resizeMode: "cover" }} />
          )}
       
      </View>
    );
  };

  const MockTestss = () => {


    return (
      <View style={[styles.performanceCard, { backgroundColor: theme.conbk, marginTop: 20, height: windowHeight * .6 }]}>
        
        <Text style={[styles.performanceTitle, { color: theme.textColor }]}>Mock Tests</Text>
        <Text style={styles.subText}>Select your preferred exam and start practicing</Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', paddingHorizontal: -5, height: 60, paddingBottom: 15, }}
        >
          <View
            style={{
              flexDirection: 'row',
              minWidth: '100%',
              alignItems: 'center'
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: theme.textColor1,
                padding: 8,
                borderBottomWidth: selectedType === 'mock' ? 1 : 0,
                borderBottomColor: selectedType === 'mock' ? theme.tx1 : "transparent"
              }}
              onPress={() => {
                setMock(mocklist);
                handleSetMockType('mock');
              }}
            >
              <Text style={{ color: selectedType === 'mock' ? theme.tx1 : theme.textColor, fontSize: 13 }}>Curated Tests</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: theme.textColor1,
                padding: 8,
                marginLeft: 10,
                borderBottomWidth: selectedType === 'previous' ? 1 : 0,
                borderBottomColor: selectedType === 'previous' ? theme.tx1 : "transparent"
              }}
              onPress={() => {
                handleSetMockType('previous');
                setMock(pre);
              }}
            >
              <Text style={{ color: selectedType === 'previous' ? theme.tx1 : theme.textColor, fontSize: 13 }}>Previous Year Tests</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: theme.textColor1,
                padding: 8,
                marginLeft: 10,
                borderBottomWidth: selectedType === 'custom' ? 1 : 0,
                borderBottomColor: selectedType === 'custom' ? theme.tx1 : "transparent"
              }}
              onPress={() => {
                handleSetMockType('custom');
                setMock(customExams);
              }}
            >
              <Text style={{ color: selectedType === 'custom' ? theme.tx1 : theme.textColor, fontSize: 13 }}>Custom Tests</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {selectedType === "custom" && <TouchableOpacity
          style={{ display: "flex", justifyContent: `${customExams.legth> 0 ? "flex-end":"center"}`, alignItems:  `${customExams.legth> 0 ? "flex-end":"center"}`, width: "100%" }}
          activeOpacity={0.8}
          onPress={() => setShowCustom(true)}
        >
          <LinearGradient
            colors={[theme.tx1, theme.tx2]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
            style={styles.startButtonGradients}
          >
            <Text
              style={[
                styles.startButtonTexts,
                { color: theme.textColor1, fontFamily: "CustomFont" },
              ]}
            >
              + CREATE CUSTOM
            </Text>
          </LinearGradient>
        </TouchableOpacity>}
        <FlatList
          data={selectedType==="mock" ? mocklist : selectedType==="previous" ? pre : customExams}
          renderItem={renderItemMock}
          keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
          nestedScrollEnabled={true}
          ListEmptyComponent={<Text style={{ color: theme.textColor, textAlign: 'center' }}>No mock tests available.</Text>}
        />
      </View>
    );
  };
  
  const Leaderboard = () => {
    const [leaderBoardValue, setLeaderBoardValue] = useState(1);
    const [leadData, setLeadData] = useState([]);
  
  
    const options = [
      { value: 1, label: "Weekly" },
      { value: 0, label: "Daily" }
    ];
  
    // ✅ Handle Dropdown Change
    const handleChangeFormat = (item) => {
      setLeaderBoardValue(item.value);
    };
  
    // ✅ Filter Data Based On Dropdown Selection
    useEffect(() => {
       if(champ) {
        const filteredData = champ.filter((item) => item.report_level === leaderBoardValue);
        setLeadData(filteredData);
       }
    }, [leaderBoardValue]);
  
 
  
    return (
      <View  style={[
        styles.performanceCard,
        {
          backgroundColor: theme.conbk,
          marginTop: 20,
          height: windowHeight * 0.5,
          marginBottom: 10,
        },
      ]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={[styles.performanceTitle, { color: theme.textColor }]}>LeaderBoard</Text>
            <Text style={[styles.subText, { marginBottom: 10 }]}>Checkout your leaderboard score</Text>
          </View>
          <View style={{ zIndex: 1000 }}>
            <Dropdown
              style={{
                backgroundColor: theme.background,
                borderColor: theme.tx1,
                borderWidth: 1,
                minHeight: 35,
                width: 100,
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
                fontSize: 12,
              }}
              selectedTextStyle={{
                color: theme.textColor,
                fontSize: 12,
              }}
              itemTextStyle={{
                fontSize: 11,
                color: theme.textColor,
              }}
              data={options}
              labelField="label"
              valueField="value"
              value={leaderBoardValue}
              onChange={(item) => handleChangeFormat(item)}
              placeholder="Select"
            />
          </View>
        </View>
  
        <FlatList
      data={leadData}
      renderItem={renderItem}
      keyExtractor={(item) => item.value}
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ flex: 1 }} // ✅ Allows FlatList to take up available space
      ListEmptyComponent={
        <Text style={{ color: theme.textColor, textAlign: 'center' }}>
          No leaderboard data available.
        </Text>
      }
    />
      </View>
    );
  };
  const Achievements = () => {
    return (
      <View style={[styles.performanceCard, { backgroundColor: theme.conbk, marginTop: 20 }]}>
        <Text style={[styles.performanceTitle, { color: theme.textColor }]}>Achievements</Text>
        <FlatList
          data={ach}
          renderItem={renderItems}
          keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
          ListEmptyComponent={<Text style={{ alignSelf: 'center', color: theme.textColor }}>No Data Found</Text>}
        />
      </View>

    );
  }


console.log(items, "itemsvaluses")
  const handleSelect = (item) => {
    if (item.value === "add") {
      setAddExam(true);
    } else {
    
      setSelectedOption(item);
      setStudentExamId(item.stUserExamId);
    }
  };

  console.log(addExam, "modalstatus")
  return (
    <View style={[styles.container, { backgroundColor: theme.textbgcolor }]}>
      {/* Header */}
      <View style={styles.header}>
      {/* Hamburger Menu */}
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828859.png' }}
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
  data={items}
  labelField="label"
  valueField="value"
  value={selectedOption}
  onChange={(item) => handleSelect(item)}
  placeholder="Select"
/>

    </View>
    </View>

      {/* Welcome Message */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.textColor} />
        }
      >
     
        <ExamModalComponent show={addExam} setShow={setAddExam} studentUserId={studentUserId} />

        {/* <Text style={[styles.welcome, { color: theme.textColor }]}>Good morning 🔥</Text>
        <Text style={[styles.username, { color: theme.textColor }]}>Welcome {name},</Text> */}


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
                  <Image source={require("../images/delete.png")} style={{ height: 30, width: 30 }} />
                </Pressable>
              </View>

              {/* Separator Line */}
              <View style={styles.separator} />

              {/* Modal Content */}

              <CustomExamCreation id={studentExamId} onClose={setShowCustom} />

            </View>
          </Modal>
        </SafeAreaView>

        <WeeklyPerformance />
        <MockTestss />
        <Achievements />
        <Leaderboard />
        {/* <View style={styles.tabScreen}><Text>Performance</Text></View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    justifyContent: 'space-between',
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#6A5ACD', flex: 1, textAlign: 'center' },
  icon: { width: 25, height: 25, tintColor: 'black' },
  examTypeContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: '#E9EAEB',
    padding: 5,
    justifyContent: 'space-evenly',
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
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 2,
    width: 100,
    alignItems: 'center',
  },
  examType: { fontSize: 16, color: 'gray' },
  selectedExam: { color: 'black', fontWeight: 'bold' },
  welcome: { marginTop: 10, fontSize: 16 },
  username: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  performanceCard: { padding: 10, borderRadius: 10, elevation: 1 },
  performanceTitle: { fontSize: 18, fontWeight: 'bold' },
  subText: { color: 'gray' },
  bigText: { fontSize: 30, fontWeight: 'bold', marginTop: 5 },
  chart: { height: 150, marginTop: 10 },
  tabScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontWeight: '600',
    color: 'black'
  },
  containertext: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Pushes text & dropdown to opposite sides

  },
  textContainer: {
    flex: 1, // Takes up available space
  },
  dropdownContainer: {
    width: 150, // Set width for dropdown to avoid shrinking
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
    color: 'gray',
  },
  bigText: {
    fontSize: 24,
    fontWeight: 'bold',
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
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: 'white',
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
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
  detailsContainer: {
    flexDirection: "row",
    padding: 8,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  examName: {
    fontSize: 12,
    marginBottom: 3,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  clockIcon: {
    height: 18,
    width: 18,
    resizeMode: "contain",
    marginRight: 5,
  },
  timeText: {
    fontSize: 12,
  },
  startButton: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    width: 70,
    height: 30,
  },
  startText: {
    fontWeight: "500",
    fontSize: 12,
  },
  marksContainer: {
    flexDirection: "row",
    marginTop: 5,
    marginLeft: 8,
  },
  markButton: {
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  markText: {
    fontWeight: "600",
    fontSize: 11,
    color: "#000004",
  },
  // Dynamic Colors for Mark Buttons
  borderColor0: { borderColor: "#1ABE1733" },
  borderColor1: { borderColor: "#2A42A533" },
  borderColor2: { borderColor: "#DCAA0933" },
  borderColor3: { borderColor: "#F0F8FF" },
  bgColor0: { backgroundColor: "#1ABE171A" },
  bgColor1: { backgroundColor: "#2A42A51A" },
  bgColor2: { backgroundColor: "#DCAA091A" },
  bgColor3: { backgroundColor: "#F0F8FF" },
  startExamBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  textExamBtn: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  replayButton: {
    backgroundColor: "rgb(240, 235, 242)",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  resultsButton: {
    borderWidth: 2,
    borderColor: "#B465DA",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#B465DA",
    fontWeight: "bold",
    fontSize: 14,
  },
  icon: {
    width: 17,
    height: 17,
    marginLeft: 5,
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
// const pickerSelectStyles = {
//   inputIOS: {
//     fontSize: 16,
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 5,
//     color: 'black',
//     width: 150, // Ensure width remains consistent
//   },
//   inputAndroid: {
//     fontSize: 16,
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 5,
//     color: 'black',
//     width: 150,
//   },
//   chartContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 20,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   subText: {
//     fontSize: 14,
//     color: "gray",
//   },
//   bigText: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   performanceCard: { backgroundColor: "#fff", padding: 15, borderRadius: 10, margin: 10 },
//   containertext: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   textContainer: {},
//   performanceTitle: { fontSize: 16, fontWeight: "bold" },
//   subText: { fontSize: 14, color: "#888" },
//   bigText: { fontSize: 22, fontWeight: "bold", marginTop: 5 },
//   dropdownContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 5 },
//   toggleContainer: { flexDirection: "row", marginTop: 10 },
//   toggleButton: { flex: 1, padding: 10, alignItems: "center", borderRadius: 5, borderWidth: 1, borderColor: "#ddd" },
//   selectedToggle: { backgroundColor: "#ddd" },

// };

export default DashboardContent;