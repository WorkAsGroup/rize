import React, { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, useColorScheme, FlatList, ActivityIndicator, ScrollView, RefreshControl, Alert, Modal, Pressable } from 'react-native';
import { darkTheme } from "../theme/theme";
import LinearGradient from "react-native-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import Header from "../common/Header";
import { addAnalytics, getPreviousPapers, getScheduleExams } from "../core/CommonService";
import AnimationWithImperativeApi from "../common/LoadingComponent";
import { useNavigation } from "@react-navigation/native";
import { resetState, setActiveQuestionIndex, setActiveSubjectId, setAutoSaveId, setExamDuration, setExamQuestions, setExamSessionId, setQuestionDetails } from "../store/slices/examSlice";


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const ScheduleExams = ({ selecteditem,mocklist,  pre,   setMock, setShowCustom,  }) => {
  // console.log( mocklist, pre, selectedExam,customExams, "weioufgwoeyuyewfuywe")
  const colorScheme = useColorScheme();
  const navigation = useNavigation()
  const[selectedType, setSelectedType] = useState("available")
  const [expiredExams, setExpiredExams] = useState([]);
  const [availableExams, setAvailableExams] = useState([])
  const [completedExams,setCompletedExams] = useState([]);
  const selectedExam = useSelector((state) => state.header.selectedExam);
     const uniqueId = useSelector((state) => state.header.deviceId);
  const examLabel = useSelector((state) => state.header.examLabel);
    const [studentExamId, setStudentExamId] = useState(selectedExam);
  const [selectedPYQExam, setSelectedPYQExam] = useState('mains')
    const [loading, setLoading] = useState(true);
  const [mains, setMains] = useState([]);
  const [advance, setAdvance] = useState([]);
    const [addExam, setAddExam] = useState(false);
    const dispatch = useDispatch();
  // const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const theme = darkTheme;

  const handleSetMockType = (type) => {
    setSelectedType(type);

  };


  const handleStartTest = async (item, type) => {
    console.log(item, type, "item, type");
    dispatch(resetState());
    
    try {
      setLoading(true);
  
      // ✅ Convert current time to Unix timestamp in seconds
      const currentTime = Math.floor(Date.now() / 1000);
  
      // ✅ Check if exam hasn't started yet
      if (item?.start_time && currentTime < item.start_time) {
        const startDate = new Date(item.start_time * 1000);
        const formattedDate = startDate.toLocaleString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
  
        Alert.alert("Exam Not Started Yet !", `Exam Starts on ${formattedDate}`);
        setLoading(false);
        return;
      }
  
      const previousExam = availableExams.find((p) => p.exam_name === item.exam_name);
      let previousPaperId = previousExam ? previousExam.exam_paper_id : null;
      let sessionId = null;
  
      dispatch(setExamQuestions([]));
      dispatch(setQuestionDetails([]));
      dispatch(setActiveQuestionIndex(0));
      dispatch(setActiveSubjectId(null));
  
      if (type === "replay") {
        dispatch(setExamSessionId(sessionId));
      }
  
      dispatch(setAutoSaveId(item?.auto_save_id || 0));
  
      if (!item?.auto_save_id) {
        dispatch(setExamDuration(item?.exam_duration));
      }
  
      setLoading(false);
  
      if (type === "replay") {
        navigation.navigate("StartExam", {
          obj: item,
          studentExamId: selectedExam,
          examtype: "schedule_exam",
          type: selectedType,
          session_id: sessionId || item.previous_session_id || item.custom_exam_id || 0,
        });
      } else {
        navigation.navigate("InstructionAuth", {
          obj: item,
          studentExamId: selectedExam,
          examtype: "schedule_exam",
          type: selectedType,
          session_id: sessionId || item.previous_session_id || item.custom_exam_id || 0,
        });
      }
  
    } catch (error) {
      console.error("❌ Error in handleStartTest:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleCheckResults = async (data, type) => {
    setLoading(true);
    const examObject = {
      ...data,
      type: type,
      from: "scheduleexams",
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
  setLoading(false);
    navigation.navigate("resultsPage", { state: examObject });
  };
  // console.log(selectedExam, examLabel, "weioufgwoeyuyewfuywe")
  useEffect(() => {
    getExams()
  }, []);
  const getExams = async() => {
    setLoading(true)
    const fields = {
      student_user_exam_id: selectedExam
    }
   const response =  await getScheduleExams(fields);
   console.log(response, "wefkwbefkwjhbef")
   if(response?.data?.length>0) {
    setExpiredExams(response?.data?.[2]?.expired)
    setAvailableExams(response?.data?.[0]?.available)
    setCompletedExams(response?.data?.[1]?.completed)
    setLoading(false)
   }
   setLoading(false)
  }



  const renderItemMock = ({ item }) => {
    // console.log(item, selecteditem,"exam status")
    const startTime = item?.start_time; // Unix timestamp in seconds
const endTime = item?.end_time;
    const formatDateTime = (timestamp) => {
      const date = new Date(timestamp * 1000); // Convert to milliseconds
      const options = {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      };
    
      const datePart = date.toLocaleDateString('en-US', options);
      const timePart = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    
      return { datePart, timePart };
    };
    
    const { datePart: date1, timePart: time1 } = formatDateTime(startTime);
    const { timePart: time2 } = formatDateTime(endTime);
    return (
      <LinearGradient
  colors={["#e614e1", "#8b51fe"]}
  style={{
    padding: 1, // thickness of the border
    borderRadius: 10, // match with inner view radius
    marginTop: 10,
  }}
  key={item?.exam_paper_id}
>
  <View style={[styles.itemContainer, { 
    backgroundColor: theme.textColor1, 
    borderRadius: 8, // should be slightly smaller than outer border if padding is small
  }]}>
      <View style={styles.detailsContainer}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.examName, { color: theme.textColor }]}>{item.exam_name}{" "}({date1})</Text>
            <View style={styles.timeContainer}>
              <Image source={require("../images/clock.png")} style={[styles.clockIcon, { tintColor: theme.textColor }]} />
              <Text style={[styles.timeText, { color: theme.textColor }]}>{" "}{`${time1} - ${time2}`}  </Text>
            </View>
          </View>
          {/* Start Button */}
           {selectedType!=="expired"&& <View style={{ marginTop: 10 }}>
            {item.exam_session_id === 0 && item.auto_save_id === 0 ? (
              // Start Button
              <TouchableOpacity
                style={[styles.startExamBtn, { marginRight: 10 }]}
                // onPress={() => handleStartExam(item, "mockTest")}
                onPress={() => handleStartTest(item, selectedType)}
          
              >
                <LinearGradient
                  colors={["#e614e1", "#8b51fe",]}
                  style={styles.gradientBorder}
                >{
                  (loading&&(selecteditem?.exam_paper_id==item?.exam_paper_id)&&item?.exam_paper_id!=="0") ? <View style={styles.innerButton}>
                       <ActivityIndicator size="small" color="#ffffff" /> 
                  </View>
              :
                  <View style={styles.innerButton}>
                    <Text style={styles.textExamBtn}>Start ➡</Text>
                  </View>  }
                </LinearGradient>
              </TouchableOpacity>
            ) : item.exam_session_id !== 0 && item.auto_save_id === 0 ? (
              // Replay & Results Button
              <View style={[styles.startExamBtn, { flexDirection: "row", marginRight: 10 }]}>
                {selectedType !== "completed" && <TouchableOpacity
                  onPress={() => handleStartTest(item, selectedType)}
                  style={[styles.textExamBtn, styles.resultsButton, , { marginRight: 5 }]}
                >
                 
                  {/* <Text style={styles.buttonText}>Results</Text> */}
                  <Image source={require("../images/synchronize.png")} style={[styles.icon]} />
                </TouchableOpacity>}
                <TouchableOpacity
                  onPress={() => handleCheckResults(item, selectedType)}
                  style={[styles.textExamBtn, styles.resultsButton]}
                >
                  {/* <Text style={styles.buttonText}>Results</Text> */}
                  <Image source={require("../images/pie-chart.png")} style={styles.icon} />
                </TouchableOpacity>
              </View>
            ) : item.exam_session_id !== 0 && item.auto_save_id !== 0 ? (
              // Resume & Results Button
              <View style={[styles.startExamBtn, { flexDirection: "row", marginRight: 10 }]}>
                {/* <LinearGradient
                      colors={["#B465DA", "#CF6CC9", "#EE609C", "#EE609C"]}
                      style={[styles.gradientButton, { marginRight: 10 }]}
                    >
                      <TouchableOpacity onPress={() => handleStartTest(item, "mockTest")}>
                      <Image source={require("../../images/replay.png")} style={{height: 18, width: 18}} />
                      </TouchableOpacity>
                    </LinearGradient> */}
               <TouchableOpacity onPress={() => handleStartTest(item, "replay")}          >
                <View style={styles.innerButton}>
             
                    <Image source={require("../images/replay.png")} style={{ height: 18, width: 18 }} />
             
                </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleCheckResults(item, selectedType)}
                  style={[styles.textExamBtn, styles.resultsButton]}
                >
                  {/* <Text style={styles.buttonText}>Results</Text> */}
                  <Image source={require("../images/pie-chart.png")} style={styles.icon} />
                </TouchableOpacity>
              </View>
            ) : (
              // Resume Button Only

              <LinearGradient
                colors={["#e614e1", "#8b51fe",]}
                style={styles.gradientBorder}
              >
                     <TouchableOpacity onPress={() => handleStartTest(item, "replay")}          >
                <View style={styles.innerButton}>
             
                    <Image source={require("../images/replay.png")} style={{ height: 18, width: 18 }} />
             
                </View>
                </TouchableOpacity>
              </LinearGradient>
            )}
          </View>}
        </View>

        {/* Exam Marks List */}
        {item.marks?.length > 0 && (<ScrollView showsHorizontalScrollIndicator={false}

          horizontal contentContainerStyle={styles.marksContainer} >
          <TouchableOpacity
            key={0}
            style={[styles.markButton, styles[`bgColor${0}`], styles[`borderColor${0}`]]}
          >
            <Text style={[styles.markText, { color: "#000" }]}>
              Total: {item.marks.reduce((total, mark) => total + Number(mark.subject_score || 0), 0)}
            </Text>
          </TouchableOpacity>

          {item.marks.map((mark, index) => (
            <TouchableOpacity key={index} style={[styles.markButton, styles[`bgColor${index + 1}`], styles[`borderColor${index}`]]}>
              <Text style={[styles.markText, { color: "#000" }]}>{mark.subject}: {mark.subject_score}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        )}
  </View>
</LinearGradient>
 
    );
  };



  return (
        <View style={[styles.container, { backgroundColor: theme.textbgcolor }]}>
          {/* Header */}
       
    <Header setAddExam={setAddExam} addExam={addExam} setId={setStudentExamId}  />
    <View style={[styles.performanceCard, { backgroundColor: theme.conbk, marginTop: 20, height: windowHeight * .85 }]}>

 
    
  {loading ? ( <View style={styles.loadingContainer}>
       <AnimationWithImperativeApi />
      </View>) : <View>
        <View
        style={{
          flexDirection: 'row',
          minWidth: '100%',
          alignItems: 'center'
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "transparent",
            padding: 8,
            borderBottomColor: selectedType == 'available' ? theme.tx1 : "transparent"
          }}
          onPress={() => {
            // setMock(mocklist);
            handleSetMockType('available');
          }}
        >
          <Text style={{ color: selectedType === 'available' ? theme.tx1 : theme.textColor, fontSize: 16 }}>Available </Text>
          {selectedType === 'available' && (
    <LinearGradient
      colors={["#6A11CB", "#2575FC"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        height: 2,
        width: '100%',
        marginTop: 2,
        borderRadius: 1,
      }}
    />
  )}
        </TouchableOpacity>


        <TouchableOpacity
onPress={() => {
  handleSetMockType('completed');
  // setMock(pre);
}}
style={{ padding: 8 }}
>
<View style={{ alignItems: 'center' }}>
  <Text
    style={{
      color: selectedType === 'completed' ? "#6A11CB" : theme.textColor,
      fontSize: 16,
      backgroundColor: 'transparent',
    }}
  >
    {"  "}Completed{"  "}
  </Text>

  {selectedType === 'completed' && (
    <LinearGradient
      colors={["#6A11CB", "#2575FC"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        height: 2,
        width: '100%',
        marginTop: 2,
        borderRadius: 1,
      }}
    />
  )}
</View>
</TouchableOpacity>

        {/* </LinearGradient> */}


        <TouchableOpacity
          style={{
            backgroundColor: "transparent",
            padding: 8,
            marginLeft: 10,
            borderBottomColor: selectedType === 'expired' ? theme.tx1 : "transparent"
          }}
          onPress={() => {
            handleSetMockType('expired');
            // setMock(expiredExams);
          }}
        >
    <Text style={{ color: selectedType === 'expired' ? theme.tx1 : theme.textColor, fontSize: 16 }}>Expired </Text>
          {selectedType === 'expired' && (
    <LinearGradient
      colors={["#6A11CB", "#2575FC"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        height: 2,
        width: '100%',
        marginTop: 2,
        borderRadius: 1,
      }}
    />
  )}
        </TouchableOpacity>
      </View>


   
    <FlatList
      data={selectedType === "available" ? availableExams : selectedType === "completed" ?completedExams: expiredExams}
      renderItem={renderItemMock}

      keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
      nestedScrollEnabled={true}
      ListEmptyComponent={<Text style={{ color: theme.textColor, textAlign: 'center' }}>No tests available.</Text>}
    />
  </View>
}
    </View>
    </View>
  );
};

export default ScheduleExams;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  itemContainer: {
    width: "99.3%",
    margin: 1,
    padding: 5,
    borderRadius: 15,
    alignContent: 'flex-start',
  },
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
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  clockIcon: {
    height: 18,
    width: 18,
    resizeMode: "contain",
    marginRight: 5,
  },
  timeText: {
    fontSize: 12,
  },
  // Dynamic Colors for Mark Buttons
  borderColor0: { borderColor: "#1ABE1733" },
  borderColor1: { borderColor: "#2A42A533" },
  borderColor2: { borderColor: "#DCAA0933" },
  borderColor3: { borderColor: "#F0F8FF" },
  bgColor0: { backgroundColor: "#B888D7" },
  bgColor1: { backgroundColor: "#FFDAC1" },
  bgColor2: { backgroundColor: "#C5E6C3" },
  bgColor3: { backgroundColor: "#BFD7EA" },
  bgColor4: { backgroundColor: "#B888D7" },
  startExamBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
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
  gradientBorder: {
    padding: 2, // this is the thickness of the border
    borderRadius: 25,
  },
  innerButton: {
    backgroundColor: 'black', // or your background color
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
  },
  textExamBtn: {
    color: 'white',
    fontWeight: 'bold',
  },
})