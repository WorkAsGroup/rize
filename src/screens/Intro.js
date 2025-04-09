import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  useColorScheme,
  Dimensions,
  Image,
  Platform,
  ActivityIndicator ,
  StatusBar,
  TouchableWithoutFeedback,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { darkTheme, lightTheme } from "../theme/theme";
import DropDownPicker from "react-native-dropdown-picker";
import { Dropdown } from 'react-native-element-dropdown';
import { getExamType, getPreExamOptions } from "../core/CommonService";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

import AsyncStorage from "@react-native-async-storage/async-storage";
const COMPLETED_EXAMS_KEY = "completedExams";

export default function Intro({ navigation }) {
  const colorScheme = useColorScheme();
  // const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const theme = darkTheme;
  const [completedExams, setCompletedExams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [opt, setOpt] = useState([]);
  const [examId, setExamId] = useState(null);
  const [examOpt, setExamOpt] = useState([]);
  const [mockTests, setMockTests] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      await getExam();
    };

    initialize();
  }, []);

  useEffect(() => {
    const loadCompletedExams = async () => {
      try {
        const completedExamsString = await AsyncStorage.getItem(COMPLETED_EXAMS_KEY);
        console.log(JSON.parse(completedExamsString), "completed")
        if (completedExamsString) {
          setCompletedExams(JSON.parse(completedExamsString));
        }
      } catch (error) {
        console.error("Error loading completed exams:", error);
      }
    };

    loadCompletedExams(); // Load when component mounts
  }, []);


  console.log(options, "oreiu3rfiwu")
  useEffect(() => {
    if (options.length > 0) {
      setSelectedOption(options[0]);
    }
  }, [options]);

  useEffect(() => {
    if (selectedOption && opt.length > 0) {
      const selectedExam = opt.find((exam) => exam.exam_type === selectedOption);
      if (selectedExam) {
        setExamId(selectedExam.exam_id);
      } else {
        setExamId(null);
      }
    } else {
      setExamId(null);
    }
  }, [selectedOption, opt]);

  useEffect(() => {
    if (examId) {
      getPreExam();
    } else {
      setMockTests([]);
    }
  }, [examId]);

  const toggleDropdown = () => {
    setIsOpen(true);
  };

  const handleOptionSelect = (option) => {
    setIsLoading(true);
    setSelectedOption(option);
    setIsOpen(false);
    setIsLoading(false);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const getExam = async () => {
    try {
      setIsLoading(true)
      const exams = await getExamType();
      console.log(exams, "exams")
      setOpt(exams.data);
      const type = exams.data.map((exam) => exam.exam_type);
      setOptions(type);
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error("Error fetching exams:", error);
    }
  };

  const getPreExam = async () => {
    try {
      setIsLoading(true)
      const exams = await getPreExamOptions();
      console.log(exams, 'inital exams')
      const filteredExams = exams.data.filter(
        (exam) => exam.exam_id === examId
      );

      const mockData = filteredExams.map((exam, index) => {
        const durationInMinutes = exam.exam_duration || 180;
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = durationInMinutes % 60;
        const formattedDuration = `${hours} hours ${minutes < 10 ? "0" : ""}${minutes} minutes`;

        return {
          id: index,
          examName: exam.exam_name || "Mock Test",
          marks: exam.exam_marks || 720,
          duration: formattedDuration,
          exam_id: exam.exam_id,
          exam_pattern_id: exam.exam_pattern_id,
          exam_paper_id: exam.exam_paper_id,
          instructions: exam.exam_instructions,
          no_of_ques: exam.no_of_ques
        };
      });

      setMockTests(mockData);
      console.log("Mock Data:", mockData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching pre-exam options:", error);
    }
  };

  const handleStartTest = (item) => {
    const examData = opt.filter((ex) => ex.exam_id == item.exam_id)
    // console.log(item, examData, opt, "woefhwiufiwuebfiwe")
    navigation.navigate("Instruction", { obj: item, exam_id_Data: examData });
  };

  const renderMockTest = ({ item }) => {
    const isExamCompleted = completedExams?.some((ex) => ex.exam_paper_id === item.exam_paper_id);

    return (
      <View
        style={[styles.mockTestWrapper, { borderColor: theme.tx1, marginTop: 20 }]}
      >
        <View style={[styles.mockTestBorder, { borderColor: theme.brad }]} />
        <LinearGradient
          colors={theme.mcb}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={styles.mockTestContainer}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.sectionTitle, { color: theme.textColor, marginStart: 7 }]}>
                Exam Name:
              </Text>
              <Text style={[styles.tag, { color: theme.textColor }]}>
                {item.examName}
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginEnd: 10 }}>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                Marks:
              </Text>
              <Text style={[styles.tag, { color: theme.textColor }]}>
                {item.marks}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row" }}>
              <Image
                style={{
                  height: 20,
                  width: 20,
                  tintColor: theme.textColor,
                  resizeMode: "contain",
                  marginTop: 12,
                  marginLeft: 10,
                }}
                source={require("../images/clock.png")}
              />
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                {item.duration}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            activeOpacity={0.8}
            onPress={() => {
              if (isExamCompleted) {
                navigation.navigate("Login");
              } else {
                handleStartTest(item);
              }
            }}
          >
            <LinearGradient
              colors={[theme.tx1, theme.tx2]}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              style={styles.startButtonGradient}
            >
              <Text
                style={[
                  styles.startButtonText,
                  { color: theme.textColor1, fontFamily: "CustomFont" },
                ]}
              >
                {isExamCompleted ? "View Results" : "Start Test"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    )
  };

   // 🔹 Render Loading Indicator
   const renderLoading = () => (
    <View style={{ alignItems: "center", justifyContent: "center", marginTop: 20 }}>
      <ActivityIndicator size="large" color={theme.tx1} />
      <Text style={{ color: theme.textColor, marginTop: 10 }}>Loading...</Text>
    </View>
  );

  const renderItem = useCallback(() => {
    return (
      <View style={styles.itemContainer}>
     
        <View style={{ width: windowWidth / 1.2, marginTop: 20, marginLeft: "auto", }}>
          <Text style={[styles.feature, { color: theme.textColor }]}>
            Select Exam
          </Text>
          <Dropdown
            style={{
              backgroundColor: theme.background,
              borderColor: theme.tx1,
              borderWidth: 1,
              minHeight: 40,
              width: 220,
              // paddingH2rizontal: 10,
              borderRadius: 10,
            }}
            containerStyle={{
              backgroundColor: theme.textColor1,
              borderColor: theme.brad,
              maxHeight: 150,
            }}
            // placeholderStyle={{
            //   color: theme.textColor,
            //   fontSize: 12, // Smaller font size for placeholder
            // }}
            selectedTextStyle={{
              color: theme.textColor,
              padding: 10, // Smaller font size for selected value
            }}
            itemTextStyle={{
              // fontSize: 11, ✅ Decreased font size for dropdown items
              color: theme.textColor,
            }}
            data={options.map((exam) => ({ label: exam, value: exam }))}
            labelField="label"
            valueField="value"
            value={selectedOption}
            onChange={(item) => handleOptionSelect(item.value)}
            placeholder="Select"
          />

        </View>
        {/* <View style={{ width: windowWidth / 1.2, marginTop: 20, marginBottom: 10 }}>
          <Text style={[styles.feature, { color: theme.textColor, alignSelf: "center", fontSize: 18 }]}>
            Mock Test
          </Text>
        </View> */}

        {isLoading ? (
        renderLoading()
      ) : (
        <FlatList data={mockTests} renderItem={renderMockTest} keyExtractor={(item) => item.id.toString()} />
      )}

      </View>
    );
  }, [theme, selectedOption, isOpen, options, mockTests]);

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
        },
        scrollContainer: {
          alignItems: "center",
          paddingBottom: 20,
          width: Dimensions.get("window").width,
        },
        headerContainer: {
          flexDirection: "row",
          width: Dimensions.get("window").width,
          paddingLeft: 15,
          paddingRight: 15,
          marginTop: 10,
          justifyContent: "space-between",
          // alignContent: "center",
          alignItems: "center",
        },
        title: {
          fontSize: 40,
          fontWeight: "bold",
          color: "#7B1FA2",
          textAlign: "center",
        },
        feature: {
          fontSize: 16,
          marginTop: 5,
          color: "#333",
          fontWeight: "bold",
          fontFamily: "CustomFont",
        },
        mockTestWrapper: {
          width: Dimensions.get("window").width * 0.9,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderRadius: 30,
          marginBottom: 10,
        },
        mockTestWrappers: {
          width: 200,
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          position: "static",
          borderWidth: 1,
          borderRadius: 15,
          marginBottom: 20,
        },

        mockTestBorder: {
          position: "absolute",
          borderRadius: 30,
          borderWidth: 2,
          zIndex: -1,
        },

        mockTestContainer: {
          borderRadius: 30,
          width: "100%",
          padding: 8,
        },

        gradientContainer: {
          flex: 1,
          borderRadius: 30,
          padding: 8,
          width: "100%",
        },
        mockTitle: {
          fontSize: 40,
          fontWeight: "bold",
          color: "#303F9F",
          marginTop: 10,
        },
        mockSubtitle: {
          fontSize: 20,
          color: "#464646",
          fontWeight: "bold",
          paddingStart: 10,
          fontFamily: "nun_sans",
        },
        sectionTitle: {
          fontSize: 16,
          fontWeight: "500",
          marginTop: 10,
          paddingStart: 5,
        },
        tagsContainer: {
          flexDirection: "row",
          marginTop: 8,
          width: "100%",
          paddingStart: 8,
          alignItems: "center",
          marginLeft: -6,
        },
        tag: {
          marginTop: 12,
          marginLeft: 4,
        },
        startButton: {
          backgroundColor: "#512DA8",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 25,
          marginTop: 15,
          width: Dimensions.get("window").width * 0.75,
          marginBottom: 20,
        },
        startButtonText: {
          color: "#FFF",
          fontWeight: "bold",
          fontSize: 18,
          alignSelf: "center",
        },
        footerText: {
          fontSize: 16,
          textAlign: "center",
          color: "#464646",
          padding: 20,
          marginBottom: 10,
        },
        startButtonGradient: {
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 25,
          alignItems: "center",
          justifyContent: "center",
          width: Dimensions.get("window").width * 0.8,
          marginBottom: 20,
          marginTop: 15,
        },
        startButtonGradients: {
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 25,
          alignItems: "center",
          justifyContent: "center",
        },
        startButtonTexts: {
          color: "#FFF",
          fontWeight: "bold",
          fontSize: 14,
          alignSelf: "center",
        },
        dropdownContainer: {
          width: Dimensions.get("window").width / 1.2,
          marginBottom: 10,
          marginTop: 10,
          overflow: "hidden",
          zIndex: 1000,
        },
        dropdownStyle: {
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderWidth: 0,
          borderRadius: 30,
          overflow: "hidden",
          backgroundColor: "transparent",
          color: theme.textColor,
        },
        dropdownLinearGradient: {
          borderRadius: 15,
        },
        itemContainer: {
          width: Dimensions.get("window").width,
          alignItems: "center",
          paddingBottom: 10,
        },
        pickerIcon: {
          position: "absolute",
          top: 10,
          right: 15,
          borderTopWidth: 10,
          borderTopColor: theme.textColor,
          borderLeftWidth: 5,
          borderLeftColor: "transparent",
          borderRightWidth: 5,
          borderRightColor: "transparent",
          width: 0,
          height: 0,
          backgroundColor: "transparent",
        },

        title: {
          fontSize: 18,
          marginBottom: 10,
        },
        dropdownButton: {
          padding: 10,
          borderColor: "#ccc",
          borderRadius: 5,
          width: 200,
          flexDirection: "row",
          justifyContent: "space-between",
        },
        dropdownButtonText: {
          fontSize: 16,
        },
        dropdown: {
          position: "absolute",
          left: 20,
          right: 20,
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          zIndex: 2,
        },
        option: {
          padding: 10,
          width: 200,
        },
      }),
    [theme]
  );

  return (
    <LinearGradient
      colors={theme.bmc}
      style={styles.container}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
    >
      <FlatList
        contentContainerStyle={styles.scrollContainer}
        data={[{},]}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Image
              style={{
                height: 100,
                width: 100,
                justifyContent: "flex-start",
                // tintColor: theme.textColor,
                resizeMode: "contain",
                marginRight: 20,
              }}
              source={require("../images/logo.png")}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity
                style={{ alignItems: "center", marginRight: 10 }}
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate("Login");
                }}
              >
                <LinearGradient
                  colors={[theme.tx1, theme.tx2]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.startButtonGradients}
                >
                  <Text
                    style={[
                      styles.startButtonTexts,
                      { color: theme.textColor1, fontFamily: "CustomFont" },
                    ]}
                  >
                    Login
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignItems: "center" }}
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate("Signup");
                }}
              >
                <LinearGradient
                  colors={[theme.tx1, theme.tx2]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.startButtonGradients}
                >
                  <Text
                    style={[
                      styles.startButtonTexts,
                      { color: theme.textColor1, fontFamily: "CustomFont" },
                    ]}
                  >
                    Register
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    </LinearGradient>
  );
}