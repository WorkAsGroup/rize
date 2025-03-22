import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
  ScrollView,
  Alert,
} from "react-native";
import { avgScoringTime, weekAvgScoringTime, getAutoLogin, chapterWiseAvgScores } from "../core/CommonService"
import React, { useEffect, useState } from "react";
import { darkTheme, lightTheme } from "../theme/theme";
import RNPickerSelect from "react-native-picker-select";
import PerformanceStatusGraph from "./PerformanceAvgTimeGraph";
import { useNavigation } from "@react-navigation/native";

const PerformanceAnalasys = ({ route }) => {
  console.log(route.params)
  const navigation = useNavigation();
  const [selectedSubject, setSelectedSubject] = useState(1);
  const [selectedValue, setSelectedValue] = useState(1);
  const { onChangeAuth } = route.params;
  const [weeksAvgScoringTime, setWeekAvgTimeResults] = useState([])
  const colorScheme = useColorScheme();
  const [studentExamId, setStudentExamId] = useState("");
  const [avgTimeResults, setAvgTimeResults] = useState([]);
  const [chaperWiseData, setChapteriseData] = useState([]);
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const [token, setToken] = useState("")
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

  const performanceSubOptions = avgTimeResults?.periods?.[0]?.subjects?.map((subject, index) => ({
    value: index+1,
    label: subject.subject_name,
})) || [];


  const WeeklyPerformance = () => {
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
    {performanceSubOptions && performanceSubOptions.map((item, index) => (
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
              selectedSubject === index + 1 ? theme.tx1 : theme.textColor,
          }}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</ScrollView>

        {/* Graph */}
        {/* {avgTimeResults&&avgTimeResults?.periods?.length>0 && <PerformanceStatusGraph performanceSubOptions={performanceSubOptions} type={selectedSubject} data={avgTimeResults} weekData={weeksAvgScoringTime} chaperWiseData={chaperWiseData} />} */}
        <PerformanceStatusGraph performanceSubOptions={performanceSubOptions} type={selectedSubject} data={avgTimeResults} weekData={weeksAvgScoringTime} chaperWiseData={chaperWiseData} />
      </View>
    );
  };


  useEffect(() => {
    // const fetchUser = async () => {
       getUser();
    // };
    // fetchUser();
  }, []);
  
  const getUser = async () => {
      try {
        const response = await getAutoLogin();
        if (response.data) {
          const nm = response.data.name;
          const id = response.data.student_user_id;
          const examId = response.data.examsData[0].student_user_exam_id;
          console.log("auto-login", response);
          console.log("auto-login_user_exam_id", examId);

        //   setName(nm);
        //   setStudentId(id);
        setToken(response.data.token)
          setStudentExamId(examId);
          getAvgScoreTime(examId)
          getWeekAvgScoreTime(examId)
          getChapterAvgScore(examId)
        } else {
          console.warn("No user data received from API");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to get user data. Please check your connection and try again.");
      }
    };

  const getAvgScoreTime = async(id) => {
    const fields = {
        student_user_exam_id: id ? id : studentExamId,
        duration_id:selectedValue,
        token: token,

    }
    // console.log("called", fields)
    const result = await avgScoringTime(fields)
    console.log(result, "avgScoringTime")
    setAvgTimeResults(result?.data?.data);
    
  }

  
  const getWeekAvgScoreTime = async(id) => {
    const fields = {
        student_user_exam_id: id ? id : studentExamId,
        duration_id:selectedValue,
        token: token,

    }
    console.log("called", fields)
    const result = await weekAvgScoringTime(fields)
    console.log(result, "weekAvgScoringTime")
    setWeekAvgTimeResults(result?.data?.data);
    
  }
  
  const getChapterAvgScore = async(id) => {
    const fields = {
      student_user_exam_id: id ? id : studentExamId,

    }
    const result = await chapterWiseAvgScores(fields)
    console.log(result?.data?.data, "chapterWiseAvgScores")
    setChapteriseData(result?.data?.data);
    
  }

  console.log(avgTimeResults, "results")
  return (
    <View style={[styles.container, { backgroundColor: theme.textbgcolor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/1828/1828859.png",
            }}
            style={[styles.icon, { tintColor: theme.textColor }]}
          />
        </TouchableOpacity>
        <Image
          source={require("../images/title.png")}
          style={{
            height: 60,
            width: 160,
            tintColor: theme.textColor,
            resizeMode: "contain",
            marginLeft: 10,
          }}
        />
        <TouchableOpacity onPress={handleLogout} style={{ marginLeft: "auto" }}>
          <Image
            source={require("../images/logout.png")}
            style={[styles.icon, { tintColor: theme.textColor }]}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Text style={[styles.performanceTitle, { color: theme.textColor,marginBottom:10 }]}>
          Performance Analasys
        </Text>
        <WeeklyPerformance />
      
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
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    color: "black",
    width: 150, // Ensure width remains consistent
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    color: "black",
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
