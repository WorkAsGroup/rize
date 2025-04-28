import React, { useState } from "react";
import { View, Text, Modal, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { setFinishTest } from "../../store/slices/examSlice";
// import { getInstructions } from "../../examInstructions/instructionsSelectors";
import congratsLogo from "../../images/congratsLogo.png";
import timeOverLogo from "../../images/timeOverLogo.png";
import { useDispatch } from "react-redux";

const SubmitTestModal = ({studentExamId,data, finishTest, isTimeUp, examType }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
// console.log(studentExamId,data, finishTest, isTimeUp, examType, "submit")
 const [loading, setLoading] = useState(false);
  // const examInstructionDetails = useSelector(getInstructions);

  const backToHome = () => {
    // if (examType === "guestMockTest") {
      // navigation.navigate(APP_ROUTES.GUEST_MOCKTEST);
    // } else {
    //   // navigation.navigate(APP_ROUTES.DASHBOARD);
    // }
   dispatch(setFinishTest(false))
    navigation.navigate("DashboardContent")
 
  };

  const handleCheckScore = () => {
    // if (examType === "guestMockTest") {
      // navigation.navigate(APP_ROUTES.LOGIN);
    // }
    const examObject = {
      ...data,
      type: examType,
      studentExamUID: studentExamId,
    }
    // dispatch(setExamSessionId(data.exam_session_id));
    navigation.navigate("resultsPage", { state: examObject });
    dispatch(setFinishTest(false));
  };
 
  return (
    <Modal visible={finishTest} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image source={isTimeUp ? timeOverLogo : congratsLogo} style={styles.image} />
          <Text style={styles.title}>{isTimeUp ? "Oops! Your exam time is over" : "Congratulations! You have completed your test."}</Text>
          <Text style={styles.description}>{
            isTimeUp
              ? "Your exam session has ended. Best wishes for the results ahead! 🌟"
              : "Celebrate this milestone and keep striving for more success ahead! 🚀"
          }</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={backToHome}>
              <Text style={styles.backButtonText}>Back to home</Text>
            </TouchableOpacity>
            {/* {submitLoader && examInstructionDetails[0]?.exam_type === "guestMockTest" ? (
              <TouchableOpacity style={styles.disabledButton} disabled>
                <ActivityIndicator size="small" color="#fff" />
              </TouchableOpacity>
            ) : ( */}
              <TouchableOpacity style={styles.scoreButton} onPress={handleCheckScore}>
                <Text style={styles.scoreButtonText}>Check score →</Text>
              </TouchableOpacity>
            {/* // )} */}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  backButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#DCDCDC",
    borderRadius: 8,
    alignItems: "center",
    marginRight: 5,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  scoreButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#6A11CB",
    borderRadius: 8,
    alignItems: "center",
  },
  scoreButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  disabledButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "gray",
    borderRadius: 8,
    alignItems: "center",
  },
};

export default SubmitTestModal;
