import React, { useEffect, useState } from "react";
import { View, Text, Modal, StyleSheet, ActivityIndicator, DeviceEventEmitter, Image, TouchableOpacity } from "react-native";
import { Button, IconButton } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import { getExamType, addExams } from "../core/CommonService";
import { useSelector } from "react-redux";

const ExamModalComponent = ({ show, setShow,studentUserId,  onRefresh, existingExams }) => {
  const [loading, setLoading] = useState(false);
  const [examsData, setExamsData] = useState([]);

  const [openExam, setOpenExam] = useState(false);
  const [openYear, setOpenYear] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [years] = useState([{ label: "2025", value: "2025" }]);
  // const studentUserId = useSelector((state) => state.header.selectedExam)
  const [errors, setErrors] = useState({ examId: "", yearId: "" });
console.log(studentUserId, "weifweiufbwi")
  useEffect(() => {
    if (show) {
      setSelectedExam(null);
      setSelectedYear(null);
      setErrors({ examId: "", yearId: "" });
    }
  }, [show]);

  const getExamData = async () => {
    try {
      const exams = await getExamType();
      let filteredExamsData = [];
  
      console.log(existingExams, exams, "existingExams, examsData");
  
      if (!existingExams || existingExams.length === 0) {
        filteredExamsData = exams.data;
      } else {
        // Extract only valid numeric IDs from existingExams
        const existingExamIds = new Set(
          existingExams
            .map((exam) => Number(exam.value))
            .filter((id) => !isNaN(id))
        );
  
        // Filter out exams that already exist in existingExamIds
        filteredExamsData = exams.data.filter(
          (exam) => !existingExamIds.has(Number(exam.exam_id))
        );
  
        // Optional: If nothing left after filtering, you can skip resetting to all
        // If you want to strictly return only non-existing ones, remove this block:
        /*
        if (filteredExamsData.length === 0) {
          filteredExamsData = exams.data;
        }
        */
      }
  
      console.log("Filtered Exams Data (Non-Existing):", filteredExamsData);
      setExamsData(filteredExamsData || []);
    } catch (error) {
      console.error("Error fetching exam types:", error);
      setExamsData([]);
    }
  };
  
  


  useEffect(() => {
    getExamData();
  }, [show]);

  const handleSubmit = async () => {
    if (loading) return;

    let newErrors = { examId: "", yearId: "" };

    if (!selectedExam) newErrors.examId = "Please select an exam";
    // if (!selectedYear) newErrors.yearId = "Please select a year";

    if (newErrors.examId) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        student_user_id: studentUserId,
        exam_id: parseInt(selectedExam),
        target_year:2025,
      };

      const response = await addExams(payload);
console.log(response, "response")
      if (response) {
        // setTimeout(async () => {
          // await onRefresh();
          setShow(false);
          setLoading(false);
        // }, 2000);

         if(response.statusCode==200) {
        setTimeout(() => {
          DeviceEventEmitter.emit('allExamsSubmitted');
        },1000)
         }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <Modal visible={show} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Add New Exam</Text>
            {(existingExams?.length > 0) && <TouchableOpacity onPress={() => setShow(false)} style={styles.closeButton}>
  <Image source={require('../images/delete.png')} style={styles.closeIcon} />
</TouchableOpacity>
}
          </View>



        

          <Text style={styles.label}>Exam</Text>
          <DropDownPicker
            open={openExam}
            value={selectedExam}
            items={examsData.map((item) => ({
              label: item.exam_type,
              value: item.exam_id,
            }))}
            setOpen={(isOpen) => {
              setOpenExam(isOpen);
              setOpenYear(false); // Close the other dropdown
            }}
            setValue={(callback) => {
              const value = callback(selectedExam);
              setSelectedExam(value);
              setErrors((prevErrors) => ({ ...prevErrors, examId: "" })); // Clear error
            }}
            placeholder="Select Exam"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            disabled={loading}
          />

          {errors.examId && <Text style={styles.errorText}>{errors.examId}</Text>}
          {/* <Text style={styles.label}>Year</Text>
          <DropDownPicker
            open={openYear}
            value={selectedYear}
            items={years}
            setOpen={(isOpen) => {
              setOpenYear(isOpen);
              setOpenExam(false); // Close the other dropdown
            }}
            setValue={(callback) => {
              const value = callback(selectedYear);
              setSelectedYear(value);
              setErrors((prevErrors) => ({ ...prevErrors, yearId: "" })); // Clear error
            }}
            placeholder="Select Year"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            disabled={loading}
          />

          {errors.yearId && <Text style={styles.errorText}>{errors.yearId}</Text>} */}
          <Button mode="contained" disabled={loading} style={styles.button} onPress={handleSubmit}>
            {loading ? <ActivityIndicator color="#fff" size="small" /> : "Add Details"}
          </Button>
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
    closeIcon: {
      width: 25,
      height: 25,
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
