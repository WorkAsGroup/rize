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
} from "react-native";
import {
  avgScoringTime,
  weekAvgScoringTime,
  getAutoLogin,
  chapterWiseAvgScores,
  getDashboardExamResult,
} from "../core/CommonService";
import React, { useEffect, useMemo, useState } from "react";
import { darkTheme, lightTheme } from "../theme/theme";
import RNPickerSelect from "react-native-picker-select";
import PerformanceStatusGraph from "./PerformanceAvgTimeGraph";

import { useNavigation } from "@react-navigation/native";
import Header from "../common/Header";
import WeeklyPerformance from "./dashboardItems/WeeklyPeroformance";
import { useExam } from "../ExamContext";

const PerformanceAnalasys = ({ route }) => {
  // console.log(route.params);
  const navigation = useNavigation();
  const [selectedSubject, setSelectedSubject] = useState(1);
  const [selectedValue, setSelectedValue] = useState(1);
  const { onChangeAuth } = route.params;
  const [weeksAvgScoringTime, setWeekAvgTimeResults] = useState([]);
  const [examResults, setExamResults] = useState([]);
      const { selectedExam, setSelectedExam } = useExam();
  const [selectedPerformanceType, setSelectedPerformanceType] =
    useState("score");
  const [dateRange, setDateRange] = useState("-");
  const [totalExamCount, setTotalExamCount] = useState(0);
  const colorScheme = useColorScheme();
  const [studentExamId, setStudentExamId] = useState("");
  const [avgTimeResults, setAvgTimeResults] = useState([]);
  const [chaperWiseData, setChapteriseData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const theme =  darkTheme;
  const [token, setToken] = useState("");
  const handleLogout = async () => {
    onChangeAuth(null);
  };



  const options = [
    { label: "Last 30 Days", value: 1 },
    { label: "Last 2 Months", value: 2 },
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
      }
      return null;
    }, [avgTimeResults, selectedSubject, weeksAvgScoringTime, chaperWiseData, performanceSubOptions]);
    
    
  const WeeklyPerformancess = () => {
    return (
      <View
        style={[
          styles.performanceCard,
          { marginTop: 10 },
          { backgroundColor: theme.conbk },
        ]}
      >
        <View style={styles.containertext}>
          {/* Left Side: Texts */}
          <View style={styles.textContainer}>
            <Text style={[styles.performanceTitle, { color: theme.textColor }]}>
              Avg test scrore & time
            </Text>
            {/* <Text style={styles.subText}>Total tests this week</Text> */}
            {/* <Text style={[styles.bigText, { color: theme.textColor }]}>{totalExamCount? totalExamCount: 0}</Text> */}
          </View>

          {/* Right Side: Dropdown */}
          <View style={styles.dropdownContainer}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedValue(value)}
              items={options}
              value={selectedValue}
              style={pickerSelectStyles}
            />
          </View>
        </View>
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
    const fetchUser = async () => {
      await getUser();
      await getExamResults();
    };
    fetchUser();
  }, [selectedExam]);

  const getUser = async () => {
    setLoading(true);
    try {
      const response = await getAutoLogin();
      // console.log("auto-login", response);
      if (response.data) {
        const nm = response.data.name;
        const id = response.data.student_user_id;
        const examId = response.data.examsData[0].student_user_exam_id;
        //   setName(nm);
        //   setStudentId(id);
        setToken(response.data.token);
        // setStudentExamId(examId);
        getAvgScoreTime(selectedExam);
        getWeekAvgScoreTime(selectedExam);
        getChapterAvgScore(selectedExam);
        setLoading(false);
      } else {
        setLoading(false);
        console.warn("No user data received from API");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching user data:", error);
      // Alert.alert(
      //   "Error",
      //   "Failed to get user data. Please check your connection and try again."
      // );
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
      student_user_exam_id: studentExamId,
      duration_id: 1,
    };

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
    setSelectedExam(selectedExam)
    if (token && selectedExam) {
      getAvgScoreTime(selectedExam);
      getWeekAvgScoreTime(selectedExam);
      getChapterAvgScore(selectedExam);
    }
  }, [token, selectedExam, selectedValue]);
  
  const memoizedWeeklyPerformance = useMemo(() => {
    return (
      <WeeklyPerformance
        examResults={examResults}
        performanceSubOptions={performanceSubOptions}
        selectedPerformanceType={selectedPerformanceType}
        dateRange={dateRange}
        setSelectedPerformanceType={setSelectedPerformanceType}
        totalExamCount={totalExamCount}
      />
    );
  }, [selectedExam,
    examResults,
    selectedPerformanceType,
    dateRange,
    setSelectedPerformanceType,
    totalExamCount
  ]);
  

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
     
        {loading ? 
             (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6A5ACD" />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ): ( <View >
           {memoizedWeeklyPerformance}
            <WeeklyPerformancess />
            </View>)}
       
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
