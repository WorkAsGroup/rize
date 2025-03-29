import React, { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, useColorScheme, FlatList, ActivityIndicator, ScrollView, RefreshControl, Alert, Modal, Pressable } from 'react-native';
import { darkTheme, lightTheme } from "../../theme/theme";
import LinearGradient from "react-native-linear-gradient";


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const MockTests = ({selectedType, mocklist, handleStartTest,pre,handleCheckResults,  customExams,setMock,setShowCustom, setSelectedType}) => {

      const colorScheme = useColorScheme();

    const theme = colorScheme === "dark" ? darkTheme : lightTheme;


    const handleSetMockType = (type) => {
        setSelectedType(type);
    
      };


      const renderItemMock = ({ item }) => {
        console.log(item, "exam status")
        return (
          <View style={[styles.itemContainer, { backgroundColor: theme.textColor1 }]} key={item?.exam_paper_id}>
            {/* Exam Details */}
            <View style={styles.detailsContainer}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.examName, { color: theme.textColor }]}>{item.exam_name}</Text>
                <View style={styles.timeContainer}>
                  <Image source={require("../../images/clock.png")} style={[styles.clockIcon, { tintColor: theme.textColor }]} />
                  <Text style={[styles.timeText, { color: theme.textColor }]}>{item.exam_duration} Mins </Text>
                </View>
              </View>
              {/* Start Button */}
              <View style={{ marginTop: 10 }}>
                {item.exam_session_id === 0 && item.auto_save_id === 0 ? (
                  // Start Button
                  <TouchableOpacity
                    style={[styles.startExamBtn, { marginRight: 10 }]}
                    // onPress={() => handleStartExam(item, "mockTest")}
                    onPress={() => handleStartTest(item)}
                  >
                    <LinearGradient
                      colors={["#B465DA", "#CF6CC9", "#EE609C", "#EE609C"]}
                      style={styles.gradientButton}
                    >
                      <Text style={styles.textExamBtn}>Start ➡</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : item.exam_session_id !== 0 && item.auto_save_id === 0 ? (
                  // Replay & Results Button
                  <View style={[styles.startExamBtn, { flexDirection: "row", marginRight: 10 }]}>
                   {selectedType !== "custom" && <TouchableOpacity
                      onPress={() => handleStartTest(item, "mockTest")}
                      style={[styles.textExamBtn, styles.replayButton]}
                    >
                      <Text style={styles.buttonText}>🔄</Text>
                    </TouchableOpacity>}
                    <TouchableOpacity
                      onPress={() => handleCheckResults(item, "schedule_exam")}
                      style={[styles.textExamBtn, styles.resultsButton]}
                    >
                      <Text style={styles.buttonText}>Results</Text>
                      <Image source={require("../../images/pie-chart.png")} style={styles.icon} />
                    </TouchableOpacity>
                  </View>
                ) : item.exam_session_id !== 0 && item.auto_save_id !== 0 ? (
                  // Resume & Results Button
                  <View style={[styles.startExamBtn, { flexDirection: "row", marginRight: 10 }]}>
                    <LinearGradient
                      colors={["#B465DA", "#CF6CC9", "#EE609C", "#EE609C"]}
                      style={[styles.gradientButton, { marginRight: 10 }]}
                    >
                      <TouchableOpacity onPress={() => handleStartTest(item, "mockTest")}>
                        <Text style={styles.textExamBtn}>Resume</Text>
                      </TouchableOpacity>
                    </LinearGradient>
                    <TouchableOpacity
                      onPress={() => handleCheckResults(item, "schedule_exam")}
                      style={[styles.textExamBtn, styles.resultsButton]}
                    >
                      <Text style={styles.buttonText}>Results</Text>
                      <Image source={require("../../images/pie-chart.png")} style={styles.icon} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  // Resume Button Only
                  <LinearGradient
                    colors={["#B465DA", "#CF6CC9", "#EE609C", "#EE609C"]}
                    style={[styles.gradientButton, { marginRight: 10 }]}
                  >
                    <TouchableOpacity onPress={() => handleStartTest(item)}          >
                      <Text style={styles.textExamBtn}>Resume</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                )}
              </View>
            </View>
    
            {/* Exam Marks List */}
            {item.marks?.length > 0 && (<ScrollView showsHorizontalScrollIndicator={false}
    
              horizontal contentContainerStyle={styles.marksContainer} >
               <TouchableOpacity 
      key={0} 
      style={[styles.markButton, styles[`bgColor${0}`], styles[`borderColor${0}`]]}
    >
      <Text style={[styles.markText, { color: theme.textColor }]}>
        Total: {item.marks.reduce((total, mark) => total + Number(mark.subject_score || 0), 0)}
      </Text>
    </TouchableOpacity>
    
              {item.marks.map((mark, index) => (
                <TouchableOpacity key={index} style={[styles.markButton, styles[`bgColor${index+1}`], styles[`borderColor${index}`]]}>
                  <Text style={[styles.markText, { color: theme.textColor }]}>{mark.subject}: {mark.subject_score}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            )}
          </View>
        );
      };
    

    return (
      <View style={[styles.performanceCard, { backgroundColor: theme.conbk, marginTop: 20, height: windowHeight * .6 }]}>
        
        <Text style={[styles.performanceTitle, { color: theme.textColor }]}>Mock Tests</Text>
        <Text style={styles.subText}>Select your preferred exam and start practicing</Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, flexDirection: 'row', paddingHorizontal: -5, height: 60, paddingBottom: 15, }}
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
              <Text style={{ color: selectedType === 'mock' ? theme.tx1 : theme.textColor, fontSize: 13 }}>Curated Tests</Text>
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
              <Text style={{ color: selectedType === 'previous' ? theme.tx1 : theme.textColor, fontSize: 13 }}>Previous Year Tests</Text>
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
                setMock(customExams);
              }}
            >
              <Text style={{ color: selectedType === 'custom' ? theme.tx1 : theme.textColor, fontSize: 13 }}>Custom Tests</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {selectedType === "custom" && <TouchableOpacity
          style={{ display: "flex", justifyContent: `${customExams.legth> 0 ? "flex-end":"center"}`, alignItems:  `${customExams.legth> 0 ? "flex-end":"center"}`, width: "100%" }}
          activeOpacity={0.8}
          onPress={() => setShowCustom(true)}
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
              + CREATE CUSTOM
            </Text>
          </LinearGradient>
        </TouchableOpacity>}
        <FlatList
          data={selectedType==="mock" ? mocklist : selectedType==="previous" ? pre : customExams}
          renderItem={renderItemMock}
          keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
          nestedScrollEnabled={true}
          ListEmptyComponent={<Text style={{ color: theme.textColor, textAlign: 'center' }}>No mock tests available.</Text>}
        />
      </View>
    );
  };

export default MockTests

const styles = StyleSheet.create({
    itemContainer: {
        width: "98%",
        margin: 5,
        padding: 5,
        borderRadius: 15,
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
  startExamBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
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
})