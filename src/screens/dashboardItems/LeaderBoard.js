import React, { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, useColorScheme, FlatList, ActivityIndicator, ScrollView, RefreshControl, Alert, Modal, Pressable } from 'react-native';
import { darkTheme, lightTheme } from "../../theme/theme";
import LinearGradient from "react-native-linear-gradient";
import { Dropdown } from 'react-native-element-dropdown';
import { getLeaderBoards } from "../../core/CommonService";
import { useSelector } from "react-redux";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const LeaderBoard = ({studentExamId}) => {
  const selectedExam = useSelector((state) => state.header.selectedExam);
    const [leaderBoardValue, setLeaderBoardValue] = useState(0);
    const [leadData, setLeadData] = useState([]);
   const colorScheme = useColorScheme();
   const [champ, setChamp] = useState([]);
          // const theme = colorScheme === "dark" ? darkTheme : lightTheme;
        const theme =  darkTheme;
    const getLeaders = async () => {
      const data = {
        student_user_exam_id: selectedExam,
      };
      try {
        // console.log("getLeader Boards fields", data);
        const response = await getLeaderBoards(data);
        console.log("getLeaderBoards", JSON.stringify(response));
        if (response.data && Array.isArray(response.data)) {
          setChamp(response.data);
        } else {
          setChamp();
          console.warn("No leaderboard data received or data is not an array.");
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        setChamp();
        Alert.alert(
          "Error",
          "Failed to get leaderboard data. Please check your connection and try again."
        );
      }
    };

    useEffect(() => {
      getLeaders();
    }, [studentExamId]);
    
    // ✅ Run filtering whenever `champ` updates
    useEffect(() => {
      if (champ&&champ.length > 0) {
        const filteredData = champ.filter((item) => item.report_level === leaderBoardValue);
        setLeadData(filteredData);
      } else {
        setLeadData([]); // Reset when there is no data
      }
    }, [champ, leaderBoardValue]); // ✅ Now runs whenever `champ` updates
    
    const options = [
   
      { value: 0, label: "Daily" },
      { value: 1, label: "Weekly" },
    ];
  
    // ✅ Handle Dropdown Change
    const handleChangeFormat = (item) => {
      setLeaderBoardValue(item.value);
    };
  
    // ✅ Filter Data Based On Dropdown Selection
    useEffect(() => {
       if(champ) {
        const filteredData = champ.filter((item) => item.report_level === leaderBoardValue);
        setLeadData(filteredData);
       }
    }, [leaderBoardValue, studentExamId]);
  
   const renderItem = ({ item, index  }) => {
     return (
       <LinearGradient
       colors={index===0 ? [
         'rgba(184, 203, 184, 0.1)',
         'rgba(180, 101, 218, 0.1)',
         'rgba(207, 108, 201, 0.1)',
         'rgba(238, 96, 156, 0.1)',
       ] : [theme.textColor1, theme.textColor1]} 
       start={{ x: 0, y: 0 }}
       end={{ x: 1, y: 0 }}
       style={{
         width: "98%",
         margin: 5,
         flexDirection: 'row',
         padding: 5,
         borderRadius: 15,
         left: -5,
       }}
     >
         <LinearGradient
           colors={[theme.tx1, theme.tx2]}
           start={{ x: 0, y: 1 }}
           end={{ x: 1, y: 1 }}
           style={styles.startButtonGradient}
         >
           <Text style={[{ color: theme.black, fontFamily: "CustomFont", fontWeight: '800' }]}>{item.rank}</Text>
         </LinearGradient>
         <View style={{ height: 35, width: 35, backgroundColor: theme.gray, borderRadius: 20, alignItems: 'center', justifyContent: "center", borderWidth: 1, borderColor: theme.white, alignSelf: 'center', left: -10 }}>
           <Text style={{ color: theme.white }}>
             {item.name[0]}
           </Text>
         </View>
         <View style={{ height: 40, width: 50 }}>
         </View>
         <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 200, left: -55 }}>
           <Text style={{ color: "#000", color: theme.textColor }}>{item.name}</Text>
 
           <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
   {item.count === 0 ? (
     <Text style={{fontSize: 21, color: "#2575FC", marginRight: 5 }} >=</Text>
   ) : item.is_increase ? (
     <>
       <Image source={require("../../images/up_arrow.png")} style={{ height: 30, width: 15, tintColor: "green", resizeMode: 'contain', marginRight: 5 }} />
       <Text style={{ color: "green" }}>{item.count}</Text>
     </>
   ) : (
     <>
       <Image source={require("../../images/down_arrow.png")} style={{ height: 30, width: 15, tintColor: "red", resizeMode: 'contain', marginRight: 5 }} />
       <Text style={{ color: "red" }}>{item.count}</Text>
     </>
   )}
 </View>
 
         </View>
 
       </LinearGradient>
     );
   };
  
    return (
      <View
        style={[
          styles.performanceCard,
          {
            backgroundColor: theme.conbk,
            marginTop: 20,
            flex: 1, // 🔹 Allow it to take available space
          },
        ]}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={[styles.performanceTitle, { color: theme.textColor }]}>LeaderBoard</Text>
            <Text style={[styles.subText, { marginBottom: 10 }]}>Checkout your leaderboard score</Text>
          </View>
          <View style={{ zIndex: 1000 }}>
    
                    
            <Dropdown
                         style={{
                          backgroundColor: "#000",
                          borderColor: "#E614E1",
                          borderWidth: 1,
                          minHeight: 35,
                          width: 100,
                          paddingHorizontal: 10,
                          borderRadius: 10,
                        }}
                        containerStyle={{
                          backgroundColor: "#000",
                          borderColor: theme.brad,
                          maxHeight: 150,
                        }}
                        placeholderStyle={{
                          color: "#E614E1",
                          fontSize: 12, // Smaller font size for placeholder
                        }}
                        selectedTextStyle={{
                          color: "#E614E1",
                          fontSize: 12, // Smaller font size for selected value
                        }}
                        itemTextStyle={{
                          fontSize: 11, // ✅ Decreased font size for dropdown items
                          color: "#E614E1",
                        }}
                        data={options}
                        labelField="label"
                        valueField="value"
                        value={leaderBoardValue}
              onChange={(item) => handleChangeFormat(item)}
                        placeholder="Select"
            />
          </View>
        </View>
    
        {/* 🔹 Use ScrollView or Flex to ensure scrolling */}
        <View style={{ flex: 1 }}>
          <FlatList
            data={leadData}
            nestedScrollEnabled={true}
            renderItem={renderItem}
            keyExtractor={(item) => item.value}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} // 🔹 Added padding for spacing
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={{ color: theme.textColor, textAlign: "center" }}>
                No leaderboard data available.
              </Text>
            }
          />
        </View>
      </View>
    );
    
  };


export default LeaderBoard;

const styles = StyleSheet.create({
    performanceCard: { padding: 10, borderRadius: 10, elevation: 1 },
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
})