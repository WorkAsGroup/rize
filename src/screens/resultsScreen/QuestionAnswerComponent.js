import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Switch,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import HTML from "react-native-render-html";
import RenderHtml from 'react-native-render-html';
import { Picker } from "@react-native-picker/picker";
import { useWindowDimensions } from "react-native";
var striptags = require('striptags');

const QuestionAndAnswerComponent = ({ questionAndAnwerData }) => {
  const [state, setState] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    inCorrectAnswers: 0,
    skipped: 0,
    filteredQuestions: [],
    selectedSubjects: [],
    selectedDifficulty: [],
    isAccordianExpand: false,
    isAllSelect: true,
    isLoading: false,
  });
  const [filteredAnswers, setFilteredAnswers] = useState(questionAndAnwerData);
  console.log(filteredAnswers, "received");
  const examSubjects = filteredAnswers
    ? filteredAnswers[0]?.examSubjects
    : [];
  const difficultyLevels = filteredAnswers
    ? filteredAnswers[0]?.difficulty
    : [];
  const questionsAndAnswers = filteredAnswers
    ? filteredAnswers[0]?.questions
    : [];

  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (filteredAnswers && filteredAnswers.length > 0) {
      setState((prev) => ({
        ...prev,
        totalQuestions: questionsAndAnswers.length,
        correctAnswers: questionsAndAnswers?.filter((item) => item.status === 2)
          .length,
        inCorrectAnswers: questionsAndAnswers?.filter(
          (item) => item.status === 1
        ).length,
        skipped: questionsAndAnswers?.filter((item) => item.status === 0)
          .length,
        selectedSubjects: examSubjects,
        isAllSelect: true,
        selectedDifficulty: difficultyLevels,
      }));
    }
  }, [filteredAnswers]);

  useEffect(() => {
    if (
      state.selectedSubjects.length > 0 ||
      state.selectedDifficulty.length > 0
    ) {
      const filteredQuestions = questionsAndAnswers.filter((question) => {
        const isSubjectSelected = state.selectedSubjects?.some(
          (subject) => subject.subject_id === question.subject
        );
        const isDifficultySelected = state.selectedDifficulty?.some(
          (difficulty) => {
            if (difficulty.id === 3) {
              return [3, 5].includes(question.difficulty);
            }
            return difficulty.id === question.difficulty;
          }
        );
        return isSubjectSelected && isDifficultySelected;
      });

      setState((prev) => ({
        ...prev,
        totalQuestions: filteredQuestions.length,
        correctAnswers: filteredQuestions.filter((item) => item.status === 2)
          .length,
        inCorrectAnswers: filteredQuestions.filter((item) => item.status === 1)
          .length,
        skipped: filteredQuestions.filter((item) => item.status === 0).length,
        filteredQuestions: filteredQuestions,
      }));
    }
  }, [state.selectedSubjects, state.selectedDifficulty]);

  const handleMultiChange = (value, name) => {
    console.log(value, name, "bhenchod")
    if (name === "subject") {
      if (value === "all") {
        const allSelected =
          state.selectedSubjects.length === examSubjects.length;
        setState((prev) => ({
          ...prev,
          selectedSubjects: allSelected ? [] : [...examSubjects],
        }));
      } else {
        const selected = examSubjects.filter((subject) =>
            value === subject.subject_id
        );
        setState((prev) => ({
          ...prev,
          selectedSubjects: selected,
        }));
      }
    } else if (name === "levels") {
      if (value ==="all") {
        const allSelected =
          state.selectedDifficulty.length === difficultyLevels.length;
        setState((prev) => ({
          ...prev,
          selectedDifficulty: allSelected ? [] : [...difficultyLevels],
        }));
      } else {
        const selected = difficultyLevels.filter((level) =>
            value === level.id
        );
        setState((prev) => ({
          ...prev,
          selectedDifficulty: selected,
        }));
      }
    }
  };

  const handleChange = (panel) => {
    setState((prev) => ({
      ...prev,
      isAccordianExpand: prev.isAccordianExpand === panel ? false : panel,
    }));
  };

  const renderQuestionItem = ({ item, index }) => {
// console.log(item, "searchomgforooption")
const sanitizeHtml = (text) =>{
  if (text.length > 0) {
      text = text.replace("&nbsp;", " ");
      text = striptags(text, '<p><img>');
  }
  
  return { html: text };
}
const renderersProps = {
  img: {
    initialDimensions :{width: 20, height: 20 },
    enableExperimentalPercentWidth : true
  }
};

    return(
    <View key={item.slno} style={styles.accordion}>
      <TouchableOpacity onPress={() => handleChange(index)}>
        <View style={styles.accordionHeader}>
          <View style={styles.headerContent}>
            {item.status === 0 ? (
              <Image
                source={require("../../images/play.png")}
                style={{ height: 19, width: 19 }}
              />
            ) : item.status === 1 ? (
              <Image
                source={require("../../images/delete2.png")}
                style={{ height: 19, width: 19 }}
              />
            ) : item.status === 2 ? (
              <Image
                source={require("../../images/check.png")}
                style={{ height: 19, width: 19 }}
              />
            ) : null}
            <Text style={styles.questionNumber}>Question No: {item.slno}</Text>
          </View>
          {state.isAccordianExpand === index ? (
            <Image
              source={require("../../images/up.png")}
              style={{ height: 19, width: 19 }}
            />
          ) : (
            <Image
              source={require("../../images/down.png")}
              style={{ height: 19, width: 19 }}
            />
          )}
        </View>
      </TouchableOpacity>
      {state.isAccordianExpand === index && (
        <View style={styles.accordionContent}>
          {/* <HTML source={{ html: item?.question }} contentWidth={width} /> */}
          <RenderHtml
            source={sanitizeHtml(item?.question || "<p>No question provided.</p>",)}
            renderersProps={renderersProps}
            // baseFontStyle={baseFontStyle}
            // {...DEFAULT_PROPS}
            contentWidth={width}
            />
          {/* Add more content rendering here */}
          {/* <Text>{item.question}</Text> */}
          {item?.question?.qtype !== 8 ? (
          <View style={styles.container2}>
          {['A', 'B', 'C', 'D'].map((option, i) => {
            const isCorrect = item?.answer.includes(`${option},`);
            const isAttempted = option === item?.attempt_answer;
    
            const borderColor = isCorrect ? "#1ABE1733" : isAttempted ? "#E5000433" : "#ddd";
            const backgroundColor = isCorrect ? "#1ABE171A" : isAttempted ? "#E500041A" : "#fff";
    
            return (
              <View key={i} style={[styles.optionContainer, { width: "100%" }]}>
                <View style={[styles.paper, { borderColor, backgroundColor }]}>
                  <View style={styles.optionContent}>
                    {/* Aligning Text and Image/Icon in a row */}
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                      
                      {/* Option Text */}
                      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.optionText}>
                          <Text style={styles.optionLabel}>{option}</Text>
                          <Text style={styles.optionSpacer}> . </Text>
                        </Text>
                        {item?.question && (
                          <RenderHtml
                            source={sanitizeHtml(item?.[`option${i + 1}`] || "<p>No option provided.</p>")}
                            renderersProps={renderersProps}
                            contentWidth={width}
                          />
                        )}
                      </View>
            
                      {/* Correct/Wrong Icon or Radio Button */}
                      {isCorrect ? (
                        <Image
                          source={require("../../images/check.png")}
                          style={{ height: 19, width: 19 }}
                        />
                      ) : isAttempted ? (
                        <Image
                          source={require("../../images/delete2.png")}
                          style={{ height: 19, width: 19 }}
                        />
                      ) : (
                        <View style={styles.radioRounded} />
                      )}
                    </View>
                  </View>
                </View>
              </View>
            );
            
          })}
        </View>
          ):<View>
             {item?.question?.status === 2 ? (
                  <View
                  style={[
                    styles.statusContainer,
                    { width: '100%', backgroundColor: '#1ABE171A', borderColor: '#1ABE1733' },
                  ]}
                >
                  <Text style={styles.statusText}>{question?.attempt_answer}</Text>
                  <View style={styles.iconContainer}>
                    <Icon name="check-circle" size={18} color="#00c596" />
                  </View>
                </View>
             ) : (<View>{item?.question?.status === 2 ? (
                <View style={styles.rowContainer}>
          <View
            style={[
              styles.statusContainer,
              { width: '100%', backgroundColor: '#E500041A', borderColor: '#E5000433' },
            ]}
          >
            <Text style={styles.statusText}>{question?.attempt_answer}</Text>
            <View style={styles.iconContainer}>
              <Icon name="cancel" size={18} color="#c52e00" />
            </View>
          </View>
          <View
            style={[
              styles.statusContainer,
              { width: '48%', backgroundColor: '#1ABE171A', borderColor: '#1ABE1733' },
            ]}
          >
            <Text style={styles.statusText}>{question?.answer}</Text>
            <View style={styles.iconContainer}>
              <Icon name="check-circle" size={18} color="#00c596" />
            </View>
          </View>
        </View>
             ) : ( <View
                style={[
                  styles.statusContainer,
                  { width:'48%', backgroundColor: '#1ABE171A', borderColor: '#1ABE1733' },
                ]}
              >
                <Text style={styles.statusText}>{question?.answer}</Text>
                <View style={styles.iconContainer}>
                  <Icon name="check-circle" size={18} color="#00c596" />
                </View>
              </View>)}</View>)}
            </View>}
          <View
            style={{
              marginTop: 10,
              backgroundColor: "#0355E11A",
              borderWidth: 1,
              borderColor: "#0355E11A",
              padding: 15,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 5 }}>
              Explanation:
            </Text>
            <RenderHtml
            source={sanitizeHtml(item?.explanation || "<p>No explanation provided.</p>",)}
            renderersProps={renderersProps}
            // baseFontStyle={baseFontStyle}
            // {...DEFAULT_PROPS}
            contentWidth={width}
            />
            {/* <HTML
              contentWidth={width}
              source={{
                html: item?.explanation || "<p>No explanation provided.</p>",
              }}
            /> */}
          </View>
        </View>
      )}
    </View>
  )};

  const handleAnswers = (type) => () => {

    let updatedResult = [];
  
    if (type === "correct") {
      updatedResult = questionAndAnwerData[0]?.questions?.filter((item) => item.status === 2);
    } else if (type === "incorrect") {
      updatedResult = questionAndAnwerData[0]?.questions?.filter((item) => item.status === 1);
    } else if (type === "skipped") {
      updatedResult = questionAndAnwerData[0]?.questions?.filter((item) => item.status === 0);
    } else {
      updatedResult = questionAndAnwerData[0]?.questions || [];
    }
  
    setState((prev) => ({
      ...prev,
      filteredQuestions: updatedResult,
    }));
  };
  

  return (
    <ScrollView style={styles.container}>
      {filteredAnswers && filteredAnswers.length > 0 ? (
        <>
          <View style={styles.filterContainer}>
            <Picker
              selectedValue={state.selectedSubjects.map(
                (subject) => subject.subject_id
              )}
              onValueChange={(itemValue) =>
                handleMultiChange(itemValue, "subject")
              }
              mode="dropdown"
              style={styles.picker}
            >
              <Picker.Item label="All Subjects" value="all" />
              {examSubjects.map((subject) => (
                <Picker.Item
                  key={subject.subject_id}
                  label={subject.subject_name}
                  value={subject.subject_id}
                />
              ))}
            </Picker>
            <Picker
              selectedValue={state.selectedDifficulty.map(
                (difficulty) => difficulty.id
              )}
              onValueChange={(itemValue) =>
                handleMultiChange(itemValue, "levels")
              }
              mode="dropdown"
              style={styles.picker}
            >
              <Picker.Item label="All Levels" value="all" />
              {difficultyLevels.map((difficulty) => (
                <Picker.Item
                  key={difficulty.id}
                  label={difficulty.type}
                  value={difficulty.id}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.analysisContainer}>
            <Text style={styles.analysisTitle}>
              Analysis breakdown of answers
            </Text>
            <View style={styles.analysisRow}>
            <TouchableOpacity onPress={handleAnswers("total")} style={styles.analysisItem}>
                <Text style={styles.analysisValue}>{state.totalQuestions}</Text>
                <Text style={styles.analysisLabel}>Total Questions</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAnswers("correct")} style={styles.analysisItem}>
                <Text style={[styles.analysisValue, { color: "#28A745" }]}>
                  {state.correctAnswers}
                </Text>
                <Text style={styles.analysisLabel}>Correct answers</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAnswers("incorrect")} style={styles.analysisItem}>
                <Text style={[styles.analysisValue, { color: "#E50004" }]}>
                  {state.inCorrectAnswers}
                </Text>
                <Text style={styles.analysisLabel}>Incorrect answers</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAnswers("skipped")} style={styles.analysisItem}>
                <Text style={[styles.analysisValue, { color: "#FFC107" }]}>
                  {state.skipped}
                </Text>
                <Text style={styles.analysisLabel}>Skipped</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={state.filteredQuestions}
            renderItem={renderQuestionItem}
            keyExtractor={(item) => item.slno.toString()}
          />
        </>
      ) : (
        <Text style={styles.noDataText}>No data found</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  picker: {
    width: "48%",
    height: 50,
    borderRadius: 9,
  },
  analysisContainer: {
    marginBottom: 16,
  },
  analysisTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
  },
  analysisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  analysisItem: {
    alignItems: "center",
  },
  analysisValue: {
    fontSize: 23,
    fontWeight: "400",
  },
  analysisLabel: {
    fontSize: 12,
    fontWeight: "400",
  },
  accordion: {
    marginBottom: 16,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  accordionContent: {
    padding: 16,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
  },
  container2: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionContainer: {
    marginBottom: 8,
  },
  paper: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 4,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignContent: "center",
    width: '100%',
  },
  optionText: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: "wrap",
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#707070',
    width: 20,
    textAlign: 'center',
    borderRadius: 32,
  },
  optionSpacer: {
    marginLeft: 10,
  },
  optionTextContent: {
    fontSize: 15,
    fontWeight: '500',
  },
  radioRounded: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#707070',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
  },
  statusText: {
    fontWeight: 'bold',
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

export default QuestionAndAnswerComponent;