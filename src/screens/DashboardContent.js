import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, useColorScheme, FlatList, ActivityIndicator, ScrollView, RefreshControl, Alert } from 'react-native';
// import { LineChart } from 'react-native-svg-charts';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getAutoLogin, getYearsData, getMockExams, getAchievements, getLeaderBoards, getPreviousPapers, getDashboardExamResult } from '../core/CommonService';
import { darkTheme, lightTheme } from '../theme/theme';
import LinearGradient from "react-native-linear-gradient";
import RNPickerSelect from 'react-native-picker-select';
import { AreaChart, Grid, XAxis, YAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { LineChart } from "react-native-chart-kit";
import { Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg";


const Tab = createBottomTabNavigator();

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const DashboardContent = ({ route }) => {
  const navigation = useNavigation();
  const { onChangeAuth } = route.params;
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const [examResults, setExamResults] = useState([]);
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentExamId, setStudentExamId] = useState("");
  const [champ, setChamp] = useState([]);
  const [mocklist, setMocklist] = useState([]);
  const [pre, setPre] = useState([]);
  const [mock, setMock] = useState([]); // This will hold the filtered/displayed mock tests
  const [loading, setLoading] = useState(true);
  const [ach, setAch] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalExamCount, setTotalExamCount] = useState(0)
  const [dateRange, setDateRange] = useState("-")
  const data = [50, 70, 60, 90, 80];
  const [selectedType, setSelectedType] = useState('mock');
  const [selectedPerformanceType, setSelectedPerformanceType] = useState('score');
  const chartData = [
    { data: [50, 70, 60, 90, 80], color: '#6A5ACD', strokeWidth: 2 },
    { data: [90, 50, 20, 50, 50], color: 'green', strokeWidth: 2 },
    { data: [10, 90, 20, 80, 50], color: 'red', strokeWidth: 2 },
  ];
  const [selectedValue, setSelectedValue] = useState(1);

  const options = [
    { label: 'Last 30 Days', value: 1 },
    { label: 'Last 2 Months', value: 2 },
  ];
  const handleSetMockType = (type) => {
    setSelectedType(type);

  };

  

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await getUser();
      await getYears();
      await getMock();
     
      await getAchieve();
      await getLeaders();
      await getPrevious();
      if(studentExamId) {
        await getExamResults();
      }
    } catch (error) {
      console.error("Error fetching data in useEffect:", error);
      Alert.alert("Error", "Failed to refresh data. Please check your connection and try again.");  // More user-friendly error handling
    } finally {
      setLoading(false);
    }
  }, [studentExamId]);  // Add studentExamId as a dependency - important!

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {

    setMock(mocklist);

  }, [mocklist, pre]);

  const handleLogout = async () => {
    onChangeAuth(null);
  };

  const getUser = async () => {
    try {
      const response = await getAutoLogin();
      console.log("auto-login", response);
      if (response.data) {
        const nm = response.data.name;
        const id = response.data.student_user_id;
        const examId = response.data.examsData[0].student_user_exam_id;
        setName(nm);
        setStudentId(id);
        setStudentExamId(examId);
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
        setChamp([]);
        console.warn("No leaderboard data received or data is not an array.");
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      setChamp([]);
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

          {item.is_increase && (<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require("../images/up_arrow.png")} style={{ height: 30, width: 15, tintColor: "green", resizeMode: 'contain', marginRight: 5 }} />
            <Text style={{ color: "#000", justifyContent: 'flex-end', color: "green" }}>{item.count}</Text>
          </View>
          )}
          {!item.is_increase && (<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require("../images/down_arrow.png")} style={{ height: 30, width: 15, tintColor: "red", resizeMode: 'contain', marginRight: 5 }} />
            <Text style={{ color: "#000", justifyContent: 'flex-end', color: "red" }}>{item.count}</Text>
          </View>
          )}
        </View>

      </View>
    );
  };

  const renderItemMock = ({ item }) => {
    return (
      <View style={{ width: "98%", margin: 5, flexDirection: 'row', padding: 5, backgroundColor: theme.textColor1, borderRadius: 15 }}>
        <View style={{ flexDirection: 'row', padding: 8, width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.textColor, fontSize: 12, marginBottom: 3 }}>
              {item.exam_name}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{ height: 18, width: 18, tintColor: theme.textColor, resizeMode: 'contain', marginRight: 5 }}
                source={require("../images/clock.png")}
              />
              <Text style={[styles.sectionTitle, { color: theme.textColor, fontSize: 12 }]}>3 Hours 0 minutes</Text>
            </View>
          </View>
          <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.tx1, borderRadius: 10, width: 70, height: 30 }}>
            <Text style={{ color: theme.textColor, fontWeight: '500', fontSize: 12 }}>
              Start
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    );
  };

  const renderItems = ({ item }) => {
    return (
      <View style={{ width: "98%", margin: 5, flexDirection: 'row', padding: 5, backgroundColor: theme.textColor1, borderRadius: 15, justifyContent: 'space-evenly' }}>

        <Text style={{ color: theme.white }}>
          {item.name}
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
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: theme.textColor }}>Weekly Performance</Text>
            <Text style={{ fontSize: 14 }}>Total tests this week</Text>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: theme.textColor }}>
              {totalExamCount ? totalExamCount : 0}
            </Text>
          </View>
  
          <View>
            <Text>{dateRange}</Text>
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
          data: subject.data || [], // Ensure data is never undefined
          color: () => subjectColors[index % subjectColors.length],
          strokeWidth: 2,
        })),
      }}
      width={Dimensions.get("window").width}
      height={250}
      yAxisLabel=""
      chartConfig={{
        backgroundColor: theme.conbk,
        backgroundGradientFrom: theme.conbk,
        backgroundGradientTo: theme.conbk,
        decimalPlaces: 0,
        color: (opacity = 1) => ⁠ rgba(0, 0, 0, ${opacity}) ⁠,
        labelColor: (opacity = 1) => ⁠ rgba(0, 0, 0, ${opacity}) ⁠,
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
  <Text>No data available</Text>
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
              <Text style={{ color: "black" }}>{subject.name}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const MockTestss = () => {


    return (
      <View style={[styles.performanceCard, { backgroundColor: theme.conbk, marginTop: 20, height:windowHeight * .4 }]}>
        <Text style={[styles.performanceTitle, { color: theme.textColor }]}>Mock Tests</Text>
        <Text style={styles.subText}>Select your preferred exam and start practicing</Text>
        <ScrollView 
  horizontal={true} 
  showsHorizontalScrollIndicator={false} 
  contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', paddingHorizontal: 10, height: 100, }}
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
      <Text style={{ color: selectedType === 'mock' ? theme.tx1 : theme.textColor }}>Mock Tests</Text>
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
      <Text style={{ color: selectedType === 'previous' ? theme.tx1 : theme.textColor }}>Previous years exam</Text>
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
        setMock(pre);
      }}
    >
      <Text style={{ color: selectedType === 'custom' ? theme.tx1 : theme.textColor }}>Custom Tests</Text>
    </TouchableOpacity>
  </View>
</ScrollView>

        <FlatList
          data={mock}
          renderItem={renderItemMock}
          keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
          nestedScrollEnabled={true}
          ListEmptyComponent={<Text style={{ color: theme.textColor, textAlign: 'center' }}>No mock tests available.</Text>}
        />
      </View>
    );
  };

  const Leaderboard = () => {
    return (
      <View style={[styles.performanceCard, { backgroundColor: theme.conbk, marginTop: 20, height: windowHeight * .4 }]}>
        <Text style={[styles.performanceTitle, { color: theme.textColor }]}>LeaderBoard</Text>
        <Text style={[styles.subText, { marginBottom: 10 }]}>Checkout your leader board score</Text>
        <FlatList
          data={champ}
          renderItem={renderItem}
          keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
          ListEmptyComponent={<Text style={{ color: theme.textColor, textAlign: 'center' }}>No leaderboard data available.</Text>}
        />
      </View>
    );
  }

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

  return (
    <View style={[styles.container, { backgroundColor: theme.textbgcolor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828859.png' }} style={[styles.icon, { tintColor: theme.textColor }]} />
        </TouchableOpacity>
        <Image source={require("../images/title.png")} style={{ height: 60, width: 160, tintColor: theme.textColor, resizeMode: 'contain', marginLeft: 10 }} />
        <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 'auto' }}>
          <Image source={require("../images/logout.png")} style={[styles.icon, { tintColor: theme.textColor }]} />
        </TouchableOpacity>
      </View>

      {/* Welcome Message */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.textColor} />
        }
      >
        <Text style={[styles.welcome, { color: theme.textColor }]}>Good morning 🔥</Text>
        <Text style={[styles.username, { color: theme.textColor }]}>Welcome {name},</Text>

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
  performanceCard: { padding: 20, borderRadius: 10, elevation: 1 },
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
});
const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
    width: 150, // Ensure width remains consistent
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
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
  performanceCard: { backgroundColor: "#fff", padding: 15, borderRadius: 10, margin: 10 },
  containertext: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  textContainer: {},
  performanceTitle: { fontSize: 16, fontWeight: "bold" },
  subText: { fontSize: 14, color: "#888" },
  bigText: { fontSize: 22, fontWeight: "bold", marginTop: 5 },
  dropdownContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 5 },
  toggleContainer: { flexDirection: "row", marginTop: 10 },
  toggleButton: { flex: 1, padding: 10, alignItems: "center", borderRadius: 5, borderWidth: 1, borderColor: "#ddd" },
  selectedToggle: { backgroundColor: "#ddd" },
};

export default DashboardContent;