import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  avgScoringTime,
  weekAvgScoringTime,
  getAutoLogin,
  chapterWiseAvgScores,
  getDashboardExamResult,
  addAnalytics,
} from "../core/CommonService";
import React, { useEffect, useMemo, useState } from "react";
import { darkTheme, lightTheme } from "../theme/theme";
import RNPickerSelect from "react-native-picker-select";
import PerformanceStatusGraph from "./PerformanceAvgTimeGraph";

import { useNavigation } from "@react-navigation/native";
import Header from "../common/Header";
import WeeklyPerformance from "./dashboardItems/WeeklyPeroformance";
import AnimationWithImperativeApi from "../common/LoadingComponent";
import { useSelector } from "react-redux";

const windowWidth  = Dimensions.get("screen").width;
const windowHeight =Dimensions.get("screen").height;
const PerformanceAnalasys = ({ route }) => {
  // console.log(route.params);
  const navigation = useNavigation();
  const [selectedSubject, setSelectedSubject] = useState(1);
  const [selectedValue, setSelectedValue] = useState(1);
  const { onChangeAuth } = route.params;
  const [weeksAvgScoringTime, setWeekAvgTimeResults] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const selectedExam = useSelector((state) => state.header.selectedExam);
  const [selectedPerformanceType, setSelectedPerformanceType] =
    useState("score");
  const [dateRange, setDateRange] = useState("-");
  const [totalExamCount, setTotalExamCount] = useState(0);
  const colorScheme = useColorScheme();
  const [studentExamId, setStudentExamId] = useState("");
  const [avgTimeResults, setAvgTimeResults] = useState([]);
  const [chaperWiseData, setChapteriseData] = useState([]);
  const [loading, setLoading] = useState(true);
  // const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const theme =  darkTheme;
  const [token, setToken] = useState("");
  const handleLogout = async () => {
    onChangeAuth(null);
  };
   const uniqueId = useSelector((state) => state.header.deviceId);
  
  
    useEffect(() => {
      if(uniqueId) {
        handleAnalytics();
      }
    }, [])
  
      const handleAnalytics = async () => {
          console.log("hey Um called")
          try {
              // Define your params correctly
              const params = {
                  "student_user_exam_id": 0,
                  "type": 0,
                  "source": 0,
                  "testonic_page_id": 42,
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


  const options = [
    { label: "30 Days", value: 1 },
    { label: "2 Months", value: 2 },
  ];
  // const subjects = [
  //   { label: "Overall", value: 1 },
  //   { label: "Botany", value: 2 },
  //   { label: "Physics", value: 3 },
  //   { label: "Chemistry", value: 4 },
  //   { label: "Zoology", value: 5 },
  // ];

  const performanceSubOptions =
    avgTimeResults?.periods?.[0]?.subjects?.map((subject, index) => ({
      value: index + 1,
      label: subject.subject_name,
    })) || [];


    const performanceGraph = useMemo(() => {
      console.log(avgTimeResults, "resultsssss")
      if (avgTimeResults?.periods?.length > 0) {
        return (
          <PerformanceStatusGraph
            performanceSubOptions={performanceSubOptions}
            type={selectedSubject}
            data={avgTimeResults}
            weekData={weeksAvgScoringTime}
            chaperWiseData={chaperWiseData}
         
          />
        );
      } else {
        return (
          <View>
          <Image source={require("../images/2.jpg")} style={{ width: windowWidth * 0.85, height: windowHeight * 0.20, resizeMode: "contain" }} />
      </View>
        )
      }
      return null;
    }, [examResults ,avgTimeResults, selectedSubject, weeksAvgScoringTime, chaperWiseData, performanceSubOptions]);
    
    
  const WeeklyPerformancess = () => {
    return (
      <View
        style={[
          styles.performanceCard,
          { marginTop: 10 },
          { backgroundColor: theme.conbk },
        ]}
      >
    
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 5 }}
        >
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            {performanceSubOptions &&
              performanceSubOptions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: theme.textColor1,
                    padding: 8,
                    marginRight: 10,
                    borderBottomWidth: selectedSubject === index + 1 ? 1 : 0,
                    borderBottomColor:
                      selectedSubject === index + 1 ? theme.tx1 : "transparent",
                  }}
                  onPress={() => {
                    setSelectedSubject(item.value);
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedSubject === index + 1
                          ? theme.tx1
                          : theme.textColor,
                    }}
                  >
                    {item.label+" "}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </ScrollView>

        {/* Graph */}
        {performanceGraph}
      </View>
    );
  };
  useEffect(() => {
    console.log(selectedExam, studentExamId, selectedValue, "aidiydqwyidqiwyd")
    if (studentExamId && selectedValue) {
      getExamResults();
    }
  }, [selectedExam, studentExamId, selectedValue]);
console.log(selectedValue, "selectedValue")
const getUser = async () => {
  setLoading(true);
  try {
    const response = await getAutoLogin();
    if (response.data) {
      const examId = response.data.examsData[0].student_user_exam_id;
      setToken(response.data.token);
      setStudentExamId(examId); // trigger the effects
      setLoading(false);
    } else {
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    console.error("Error fetching user data:", error);
  }
};


  const getAvgScoreTime = async (id) => {
    const fields = {
      student_user_exam_id: id ? id : studentExamId,
      duration_id: selectedValue,
      token: token,
    };
    // console.log("called", fields)
    const result = await avgScoringTime(fields);
    // console.log(result, "hellooo")
    setAvgTimeResults(result?.data?.data);
  };

  const getWeekAvgScoreTime = async (id) => {
    const fields = {
      student_user_exam_id: id ? id : studentExamId,
      duration_id: selectedValue,
      token: token,
    };
    console.log("called", fields);
    const result = await weekAvgScoringTime(fields);
    // console.log(result, "hellooo")
    setWeekAvgTimeResults(result?.data?.data);
  };

  const getChapterAvgScore = async (id) => {
    const fields = {
      student_user_exam_id: id ? id : studentExamId,
      duration_id: selectedValue,
      token: token,
    };
    // console.log("calledfwefwe", fields)
    const result = await chapterWiseAvgScores(fields);
    // console.log(result, "helloooiiiiiiii")
    setChapteriseData(result?.data?.data);
  };
  const getExamResults = async () => {
    setLoading(true);
    const data = {
      student_user_exam_id: selectedExam,
      duration_id: selectedValue,
    };
console.log(data, "peojwiejowiej")
    try {
      const response = await getDashboardExamResult(data);
      console.log("exam response", response);
      setTotalExamCount(response.data.total_test_count);
      setExamResults(response.data.periods);
      setDateRange(response.data.duration_dates);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching mock exams:", error);
      // Alert.alert(
      //   "Error",
      //   "Failed to get mock exams. Please check your connection and try again."
      // );
    }
  };

  console.log(avgTimeResults, "results");

  useEffect(() => {
    console.log(studentExamId, selectedExam, token, selectedValue, "valueas")
    if (studentExamId && selectedExam  && selectedValue) {
      getAvgScoreTime(selectedExam);
      getWeekAvgScoreTime(selectedExam);
      getChapterAvgScore(selectedExam);
    }
  }, [studentExamId, selectedExam, token, selectedValue]);
  const memoizedWeeklyPerformance = useMemo(() => {
    return (
      <View>

{(loading||examResults?.length<1)&& 
    <View style={styles.loadingContainer}>
    <AnimationWithImperativeApi />
   </View>}
        {examResults && examResults.length > 0 ? (
          <WeeklyPerformance
            examResults={examResults}
            performanceSubOptions={performanceSubOptions}
            selectedPerformanceType={selectedPerformanceType}
            dateRange={dateRange}
            setSelectedPerformanceType={setSelectedPerformanceType}
            totalExamCount={totalExamCount}
            options={options}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
          />
        ) : (
          <View>
                              <Image source={require("../images/2.jpg")} style={{ width: windowWidth * 0.85, height: windowHeight * 0.20, resizeMode: "contain" }} />
                          </View>
        )}
      </View>
    );
  }, [
    loading,
    selectedExam,
    examResults,
    selectedPerformanceType,
    dateRange,
    totalExamCount,
    selectedValue,
    options
  ]);
  
  if(loading||examResults?.length<1) {
    <View style={styles.loadingContainer}>
    <AnimationWithImperativeApi />
   </View>
  }
   

  return (
    <View style={[styles.container, { backgroundColor: theme.textbgcolor }]}>
      {/* Header */}
      <Header setId={setStudentExamId} />
      <ScrollView>
        <Text
          style={[
            styles.performanceTitle,
            { color: theme.textColor, marginBottom: 10 },
          ]}
        >
          Performance Analasys
        </Text>
     
      
           {memoizedWeeklyPerformance}
            <WeeklyPerformancess />
           
       
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
    shadowOffset: 1,
  },
  performanceCard: { padding: 20, borderRadius: 10, elevation: 1 },
  performanceTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  containertext: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Pushes text & dropdown to opposite sides
  },
  textContainer: {
    flex: 1, // Takes up available space
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6A5ACD",
    flex: 1,
    textAlign: "center",
  },
  icon: { width: 25, height: 25, tintColor: "black" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 500,
    justifyContent: "center",
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    color: "#ffffff",
    width: 150, // Ensure width remains consistent
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    color: "#ffffff",
    width: 150,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  title: {
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
  performanceCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    margin: 10,
  },
  containertext: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {},
  performanceTitle: { fontSize: 16, fontWeight: "bold" },
  subText: { fontSize: 14, color: "#888" },
  bigText: { fontSize: 22, fontWeight: "bold", marginTop: 5 },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
  },
  toggleContainer: { flexDirection: "row", marginTop: 10 },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedToggle: { backgroundColor: "#ddd" },
};

export default PerformanceAnalasys;
