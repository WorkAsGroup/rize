import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useExam } from "../ExamContext";
import { getSubjects, getChapters, createCustomExams } from "../core/CommonService";
import Svg, { Path } from "react-native-svg";

const CheckCircleIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8z" />
  </Svg>
);

const CustomExamCreation = ({ id,fetchData,selectedOption, onClose }) => {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState({});
        const { selectedExam, setSelectedExam } = useExam();
  const [loading, setLoading] = useState(false); // Loader state
console.log(selectedChapters, "wijdoiqedjoiqw")
  useEffect(() => {
    getSubjectNames();
  }, [id]);

  const getSubjectNames = async () => {
    const response = await getSubjects({ student_user_exam_id: id });
    setSubjects(response.data);
  };

  const getChaptersNames = async (subId) => {
    const response = await getChapters({ student_user_exam_id: id, subject_id: subId });
    setChapters(response.data);
    setFilteredChapters(response.data);
  };

  const handleSubjectClick = (id) => {

    console.log(id, selectedSubjects, "epofwpef", selectedSubjectId)
    const isCheckedSubject = selectedSubjects?.filter((item) => parseInt(item) == id);
    console.log()

//    if(id== selectedSubjectId) {
// setSelectedSubjects(selectedSubjects.filter((item) => parseInt(item.id) !== id));
// // setSelectedChapters((prev) => {
// //   const newChapters = { ...prev }; // Create a shallow copy
// //   delete newChapters[id]; // Remove the key corresponding to `id`
// //   return newChapters; // Update state with modified object
// // });
//    } else {
    setSelectedSubjects((prev) => {
      // Check if the ID already exists
      if (!prev.some((subject) => subject.id === id)) {
        return [...prev, { id }]; // Create a new array with the new subject
      }
      return prev; // Return the previous state unchanged if ID already exists
    });
  //  }
    if(selectedSubjectId !== id) {
      setSelectedSubjectId(id);
      setSelectedId(id);
      getChaptersNames(id);
    } else {
      setSelectedSubjectId(selectedSubjectId == id ? '': id);
      setSelectedId(selectedSubjectId == id ? '': id);
      getChaptersNames(selectedSubjectId == id ? '': id);
    }
    if(['9', '10', '11'].includes(selectedOption?.value?.toString())) {
      setSelectedChapters({})
    }

  };

  const handleSearch = (text) => {
    setSearchValue(text);
    chapters.length>0&& setFilteredChapters(
      chapters.filter((chapter) =>
        chapter.chapter.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const handleChapterClick = (chapterId) => {
    setSelectedChapters((prev) => {
      const updated = { ...prev };
      if (!updated[selectedSubjectId]) updated[selectedSubjectId] = [];

      if (updated[selectedSubjectId].includes(chapterId)) {
        updated[selectedSubjectId] = updated[selectedSubjectId].filter((id) => id !== chapterId);
      } else {
        updated[selectedSubjectId].push(chapterId);
      }

      if (updated[selectedSubjectId].length === 0) {
        delete updated[selectedSubjectId]; // Remove subject if no chapters selected
      }

      return updated;
    });
  };

  const handleSubmitExamData = async (syllabus) => {
    setLoading(true);
    try {
      const response = await createCustomExams({ student_user_exam_id: id, syllabus });

      setLoading(false);
      if (response?.data?.exam_session_id) {
        Alert.alert("Success", "Exam created successfully!", [{ text: "OK", onPress: () => {fetchData() ;onClose(false)} }]);
      } else {
        Alert.alert("Error", "Something went wrong, please try again.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to create exam. Please try again.");
    }
  };

  const handleCreate = () => {
    const syllabus = Object.entries(selectedChapters).map(([subject_id, chapters]) => ({
      subject_id: Number(subject_id),
      chapters,
    }));

    handleSubmitExamData(syllabus);
  };

  const isCreateEnabled = Object.keys(selectedChapters).length > 0; // Check if chapters are selected
console.log(selectedOption, "selectedOption")
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your subjects</Text>
      <View style={styles.subjectsContainer}>
        {subjects.map((item) => {
                          const isRestrictedExam = ['9', '10', '11'].includes(selectedOption?.value?.toString());
                          const isDisabled =
                              isRestrictedExam  && selectedSubjectId &&selectedSubjectId!== item.id;
                              console.log(isRestrictedExam, selectedSubjectId, item.id, isDisabled , "panipani")
                              return (
          <TouchableOpacity
            key={item.id}
            // disabled={isDisabled}
            onPress={() => !isDisabled&&handleSubjectClick(item.id)}
            style={[
              styles.subjectCard,
              { borderColor: item.id === selectedId ? "#D37DB5" : "#E8E6E6" },
            ]}
          >
            <Text style={styles.subjectText}>{item.subject}{" "}</Text>
            <View>
            {(item.id === selectedId || selectedSubjects.some(i => i.id === item.id)) && <CheckCircleIcon />}
  </View>
          </TouchableOpacity>)
})}
      </View>

      {selectedSubjectId && (
        <View style={styles.chaptersContainer}>
          <Text style={styles.title}>Chapters</Text>
          {chapters&&chapters.length > 0 && (
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchValue}
              onChangeText={chapters.length>0&&handleSearch}
            />
          )}

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.chaptersList}>
            {filteredChapters&&filteredChapters.length>0&&filteredChapters.map((item) => {


              const isChecked = selectedChapters[selectedSubjectId]?.includes(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.chapterItem,
                    {
                      backgroundColor: isChecked ? "#6c757d" : "#fff",
                      borderColor: isChecked ? "#6c757d" : "#E8E6E6",
                    },
                  ]}
                  onPress={() => handleChapterClick(item.id)}
                >
                  <Text style={[styles.chapterText, { color: isChecked ? "#fff" : "#333" }]}>{item.chapter}{" "}</Text>
                  {isChecked && <View  >
                    <CheckCircleIcon /></View>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Create Button with Validation */}
      {isCreateEnabled && (
        <TouchableOpacity style={styles.createButton} onPress={handleCreate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createButtonText}>Create</Text>}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subjectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  subjectCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 10,
    marginTop: 5,
    height: 45,
    minWidth: 100,
  },
  subjectText: {
    fontSize: 14,
    color: "#333",
  },
  chaptersContainer: {
    flex: 1,
    marginTop: 5,
  },
  searchInput: {
    height: 46,
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E8E6E6",
  },
  chaptersList: {
    flexGrow: 1,
    paddingBottom: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chapterItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 6,
    borderRadius: 10,
    marginRight: 5,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  chapterText: {
    fontSize: 14,
  },
  createButton: {
    marginTop: 10,
    backgroundColor: "#D37DB5",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomExamCreation;
