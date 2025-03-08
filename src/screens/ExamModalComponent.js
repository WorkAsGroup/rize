import React, { useEffect, useState } from "react";
import { View, Text, Modal, StyleSheet, ActivityIndicator } from "react-native";
import { Button, IconButton } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import { getExamType, addExam } from "../core/CommonService";

const ExamModalComponent = ({ show, setShow, studentUserId }) => {
  const [state, setState] = useState({
    examId: "",
    examIdError: "",
    yearId: "",
    yearIdError: "",
  });

  const [loading, setLoading] = useState(false);
  const [examsData, setExamsData] = useState([]);

console.log(examsData, "errfir")
  // Dropdown states
  const [openExam, setOpenExam] = useState(false);
  const [openYear, setOpenYear] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [years, setYears] = useState([{ label: "2025", value: "2025" }]);

  const getExamData = async() => {
        const exams = await getExamType();
        console.log(exams.data)
        setExamsData(exams.data)
  }

  useEffect(() => {
    getExamData()
  },[])
  const handleFormChange = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
      [`${key}Error`]: "",
    }));
  };

  const handleSubmit = async () => {
    console.log("calleds", selectedExam, selectedYear)
 
    let hasError = false;

    if (!selectedExam) {
        setState((prevState) => ({
            ...prevState,
            examIdError: "Please Select Exam",
        }));
        hasError = true;
    };
    if (!selectedYear) {
        setState((prevState) => ({
            ...prevState,
            yearIdError: "Please Select Year",
        }));
        hasError = true;
    };
    if (!hasError) {
        
        const payload = {
            student_user_id: studentUserId,
            exam_id: parseInt(selectedExam),
            target_year: parseInt(selectedYear)
        }

        const response  = addExam(payload)
        console.log(response)
        if(response) {
            setShow(false)
        }
        
    };
};

  return (
    <Modal visible={show} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Add New</Text>
            <IconButton icon="close" onPress={() => setShow(false)} />
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#2575FC" />
          ) : (
            <>
             

              <Text style={styles.label}>Year</Text>
              <DropDownPicker
                open={openYear}
                setOpen={setOpenYear}
                value={selectedYear}
                setValue={(value) => {handleFormChange("yearId", value); setSelectedYear(value)}}
                items={years}
                placeholder="Select Year"
                containerStyle={{ marginBottom: 10 }}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
              />
              {state.yearIdError && <Text style={styles.errorText}>{state.yearIdError}</Text>}
              <Text style={styles.label}>Exam</Text>
              <DropDownPicker
                open={openExam}
                setOpen={setOpenExam}
                value={selectedExam}
                setValue={(value) => {handleFormChange("examId", value); setSelectedExam(value)}}
                items={examsData.map((item) => ({
                  label: item.exam_type,
                  value: item.exam_id,
                }))}
                placeholder="Select Exam"
                containerStyle={{ marginBottom: 10 }}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
              />
              {state.examIdError && <Text style={styles.errorText}>{state.examIdError}</Text>}
              <Button
                mode="contained"
                loading={loading}
                style={styles.button}
                onPress={handleSubmit}
              >
                {loading ? "Updating..." : "Add Details"}
              </Button>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#F3F6FA",
    padding: 20,
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  button: {
    marginTop: 15,
    backgroundColor: "#2575FC",
  },
  dropdown: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  dropdownContainer: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
});

export default ExamModalComponent;
