import React, { useEffect, useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { getExamResult, getAttempts } from "../core/CommonService";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import SubmitTestModal from "./resultsScreen/SubmitTestModal";
import ReportComponent from "./resultsScreen/ReportComponent";
import QuestionAndAnswerComponent from "./resultsScreen/QuestionAnswerComponent";

const ResultMainComponent = () => {
  const [state, setState] = useState({
    defaultActiveBlock: "1",
    attemptId: 0,
  });

  const navigation = useNavigation();
  const route = useRoute();
  console.log(route, "routerer");
  const { exam_session_id, isTimeUp,studentExamUID,exam_paper_id,type, exam_name } = route.params.state || {};

  const [examResult, setExamResults] = useState([]);
  const [attemptsData, setAttemptsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [finishTest, setFinishTest] = useState(false);
  
  useEffect(() => {
    if (attemptsData.length > 0 && exam_session_id && state.attemptId === 0) {
      const attemptId = attemptsData.find((item) => item.id === exam_session_id)?.id;
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
        exam_session_id: state.attemptId ? state.attemptId : exam_session_id,
        student_user_exam_id: studentExamUID,
      });
      const updated = JSON.parse(response.data)
      setExamResults(updated);
      console.log(updated, "wefwiefwoei")
     
    } catch (error) {
      console.error("Error fetching exam results:", error);
    }
    setLoading(false);
  };

  const getExamAttempts = async () => {
    if (!exam_session_id) return;
    try {
      const response = await getAttempts({
        exam_paper_id: exam_paper_id,
        previous_paper_id: 0,
        student_user_exam_id: studentExamUID,
      });
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

  useEffect(() => {
    if (exam_session_id) {
        getExamAttempts();
        getExamResults();
      }
  },[state.attemptId])

  const reportData = useMemo(() => {
    return examResult?.[0]?.report || [];
  }, [examResult]);
  
  const questionAndAnswerData = useMemo(() => {
    return examResult?.[0]?.answers || [];
  }, [examResult]);

  console.log(questionAndAnswerData, 'skfweknf')
  
  const handleResultBack = () => navigation.navigate("Dashboard");

  return (
    <View>
      {finishTest ? (
        <SubmitTestModal examType={type} setFinishTest={setFinishTest} finishTest={finishTest} isTimeUp={isTimeUp} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {loading ? (
            <ActivityIndicator size="large" color="#2575FC" />
          ) : (
            <>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 0 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subHeading}>Test Results</Text>
                  <Text style={styles.heading}>{exam_name}</Text>
                </View>
                <Picker
                  selectedValue={state.attemptId}
                  onValueChange={(value) => setState((prev) => ({ ...prev, attemptId: value }))}
                  style={styles.picker}
                >
                  {attemptsData&&attemptsData.map((item) => (
                    <Picker.Item key={item.id} label={item.name} value={item.id} />
                  ))}
                </Picker>
              </View>

              <View style={{ flexDirection: "row", marginBottom: 10 }}>
                <TouchableOpacity
                  style={[styles.tab, state.defaultActiveBlock === "1" && styles.activeTab]}
                  onPress={() => setState((prev) => ({ ...prev, defaultActiveBlock: "1" }))}
                >
                  <Text style={styles.tabText}>Report</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, state.defaultActiveBlock === "2" && styles.activeTab]}
                  onPress={() => setState((prev) => ({ ...prev, defaultActiveBlock: "2" }))}
                >
                  <Text style={styles.tabText}>Answers</Text>
                </TouchableOpacity>
              </View>

              {state.defaultActiveBlock === "1" ? (
                <ReportComponent reportData={reportData} />
              ) : (
                <QuestionAndAnswerComponent questionAndAnwerData={questionAndAnswerData} />
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
};

export default ResultMainComponent;
