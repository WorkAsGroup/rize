import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  BackHandler,
  Image,
  Dimensions,
} from "react-native";
import { getExamResult, getAttempts } from "../core/CommonService";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import SubmitTestModal from "./resultsScreen/SubmitTestModal";
import ReportComponent from "./resultsScreen/ReportComponent";
import { Dropdown } from "react-native-element-dropdown";
import QuestionAndAnswerComponent from "./resultsScreen/QuestionAnswerComponent";
import { useDispatch, useSelector } from "react-redux";
import AnimationWithImperativeApi from "../common/LoadingComponent";
import { setActiveTab } from "../store/slices/userSlice";

const ResultMainComponent = () => {
  const [state, setState] = useState({
    defaultActiveBlock: "1",
    attemptId: 0,
  });

  const navigation = useNavigation();
  const route = useRoute();
  console.log(route, "routerer");
  const {
    exam_session_id,
    isTimeUp,
    studentExamUID,
    exam_paper_id,
    previous_paper_id,
    type,
    exam_name,
    from,
  } = route.params.state || {};
  const [examResult, setExamResults] = useState([]);
  const [attemptsData, setAttemptsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [finishTest, setFinishTest] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (
      attemptsData &&
      attemptsData.length > 0 &&
      exam_session_id &&
      state.attemptId === 0
    ) {
      const attemptId = attemptsData.find(
        (item) => item.id === exam_session_id
      )?.id;
      if (attemptId) {
        setState((prevState) => ({ ...prevState, attemptId }));
      }
    }
  }, [attemptsData, exam_session_id]);

  const getExamResults = async () => {
    if (!exam_session_id) return;
    setLoading(true);
    try {
      const response = await getExamResult({
        exam_session_id:
          state.attemptId !== 0 ? state.attemptId : exam_session_id,
        student_user_exam_id: studentExamUID,
      });
      const updated = JSON.parse(response.data);
      setExamResults(updated);
      console.log(updated, "wefwiefwoei");
    } catch (error) {
      console.error("Error fetching exam results:", error);
    }
    setLoading(false);
  };

  const getExamAttempts = async () => {
    if (!exam_session_id) return;
    try {
      const response = await getAttempts({
        exam_paper_id: Number(exam_paper_id),
        previous_paper_id: previous_paper_id ? Number(previous_paper_id) : 0,
        student_user_exam_id: studentExamUID,
      });

      console.log(
        "prevresdata",
        response.data,
        previous_paper_id,
        exam_paper_id
      );
      setAttemptsData(response.data);
    } catch (error) {
      console.error("Error fetching attempts:", error);
    }
  };

  useEffect(() => {
    if (exam_session_id) {
      getExamAttempts();
      getExamResults();
    }
  }, [exam_session_id]);

  const handleBackPress = React.useCallback(() => {
    navigation.navigate("DashboardContent");
  }, [navigation]);
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [handleBackPress]);

  useEffect(() => {
    if (exam_session_id) {
      getExamAttempts();
      getExamResults();
    }
  }, [state.attemptId]);

  const reportData = useMemo(() => {
    return examResult?.[0]?.report || [];
  }, [examResult]);

  const questionAndAnswerData = useMemo(() => {
    return examResult?.[0]?.answers || [];
  }, [examResult]);

  console.log(questionAndAnswerData, "skfweknf");

  const handleResultBack = () => {
    console.log(from, "from");
    if (from === "ScheduleExams") {
      dispatch(setActiveTab("ScheduleExams")); // Note: Make sure the spelling matches your route name
      navigation.navigate("DashboardContent"); // Navigate to the drawer screen directly
    } else {
      dispatch(setActiveTab("Dashboard"));
      navigation.navigate("DashboardContent"); // Navigate to the drawer screen directly
    }
  };

  console.log(type, "soiefnweonf");
  return (
    <View>
      {finishTest ? (
        <SubmitTestModal
          examType={type}
          setFinishTest={setFinishTest}
          finishTest={finishTest}
          isTimeUp={isTimeUp}
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <AnimationWithImperativeApi />
            </View>
          ) : (
            <>
              <View>
                <TouchableOpacity onPress={handleResultBack}>
                  <Image
                    style={{ height: 25, width: 25 }}
                    source={require("../images/arrow.png")}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 0,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.subHeading}>Test Results</Text>
                  <Text style={styles.heading}>{exam_name}</Text>
                </View>
                {type &&
                  type !== "custom" &&
                  from !== "finishTest" &&
                  from !== "scheduleexams" && (
                    <Dropdown
                      data={attemptsData?.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))}
                      labelField="label"
                      valueField="value"
                      value={state.attemptId}
                      onChange={(item) =>
                        setState((prev) => ({ ...prev, attemptId: item.value }))
                      }
                      style={{
                        backgroundColor: "#fff",
                        width: 150,
                        borderWidth: 1,
                        padding: 5,
                        borderColor: "#ccc",
                        borderRadius: 5,
                      }}
                      placeholderStyle={{ color: "#000" }}
                      selectedTextStyle={{ color: "#000" }}
                      itemTextStyle={{ color: "#000" }}
                      containerStyle={{ backgroundColor: "#fff" }}
                    />
                  )}
              </View>

              <View style={{ flexDirection: "row", marginBottom: 10 }}>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    state.defaultActiveBlock === "1" && styles.activeTab,
                  ]}
                  onPress={() =>
                    setState((prev) => ({ ...prev, defaultActiveBlock: "1" }))
                  }
                >
                  <Text style={styles.tabText}>Report</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    state.defaultActiveBlock === "2" && styles.activeTab,
                  ]}
                  onPress={() =>
                    setState((prev) => ({ ...prev, defaultActiveBlock: "2" }))
                  }
                >
                  <Text style={styles.tabText}>Answers</Text>
                </TouchableOpacity>
              </View>

              {state.defaultActiveBlock === "1" ? (
                <ReportComponent reportData={reportData} />
              ) : (
                <QuestionAndAnswerComponent
                  questionAndAnwerData={questionAndAnswerData}
                />
              )}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = {
  backButton: {
    borderWidth: 1,
    borderColor: "#0355E11A",
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  loadingCoatiner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 500,
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 20,
    color: "black",
  },
  subHeading: {
    fontSize: 13,
    fontWeight: "400",
    color: "#555",
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  picker: {
    height: 100,
    width: 150,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  activeTab: {
    borderColor: "#6A11CB",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("screen").height * 0.9,
  },
};

export default ResultMainComponent;
