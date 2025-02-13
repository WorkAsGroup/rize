import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Dimensions,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { darkTheme, lightTheme } from "../theme/theme";
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from "react-native-svg";
import { theme } from "../core/theme";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Intro({ navigation }) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <LinearGradient
      colors={theme.bmc}
      style={styles.container}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} >
        <View style={{flexDirection:'row',width:windowWidth,paddingStart:15}}>
        <Image
            style={{height:36,width:36,justifyContent:'flex-start',tintColor:'transparent'}}
            source={require("../images/back.png")}
          />
        <View style={{flexDirection:'row',alignItems:"flex-end",width:windowWidth/1.12,justifyContent:'flex-end',paddingEnd:15}}>
        <Image
            style={{height:36,width:36}}
            source={require("../images/bell.png")}
          />
           <Image
            style={{height:36,width:36,marginLeft:10}}
            source={require("../images/profile.png")}
          />
           <Image
            style={{height:36,width:36,marginLeft:10}}
            source={require("../images/option.png")}
          />
          </View>
        </View>
        <View style={styles.header}>
        <Svg height="50" width={windowWidth * 0.9}>
    <Defs>
      <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor={theme.bg1} stopOpacity="1" />
        <Stop offset="1" stopColor={theme.bg2} stopOpacity="1" />
      </SvgLinearGradient>
    </Defs>
    <SvgText
      fill="url(#grad)"
      fontSize="40"
      fontWeight="bold"
      x="180"
      y="20"
      textAnchor="middle"
      alignmentBaseline="middle"
      fontFamily="CustomFont" 
    >
      Ace Your EAMCET,
    </SvgText>
  </Svg>
        <Svg height="50" width={windowWidth * 0.9}>
    <Defs>
      <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor={theme.bg1} stopOpacity="1" />
        <Stop offset="1" stopColor={theme.bg2} stopOpacity="1" />
      </SvgLinearGradient>
    </Defs>
    <SvgText
      fill="url(#grad)"
      fontSize="40"
      fontWeight="bold"
      x="180"
      y="20"
      textAnchor="middle"
      alignmentBaseline="middle"
      fontFamily="CustomFont" 
    >
      KCET, JEE, or NEET
    </SvgText>
  </Svg>
        </View>
        <View style={{width:windowWidth/1.2,marginBottom:20}}>
          <Text style={[styles.feature,{color:theme.textColor}]}>📊 Track your progress</Text>
          <Text style={[styles.feature,{color:theme.textColor}]}>⚡ Improve speed & accuracy</Text>
          <Text style={[styles.feature,{color:theme.textColor}]}>🎯 Identify weak topics instantly</Text>
          </View>

          <View style={[styles.mockTestWrapper,{borderColor:theme.tx1}]}>
          <View style={[styles.mockTestBorder, { borderColor: theme.brad }]} />
  <LinearGradient
    colors={theme.mcb}
    start={{ x: 0, y: 1 }}
    end={{ x: 1, y: 1 }}
    style={styles.mockTestContainer}
  >
            <View style={{marginTop:10}}>
            {/* <Text style={styles.mockTitle}>Prepare smarter, not just harder!</Text> */}
            <Svg height="50" width={windowWidth * 0.9}>
    <Defs>
      <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor={theme.tx1} stopOpacity="1" />
        <Stop offset="1" stopColor={theme.tx2} stopOpacity="1" />
      </SvgLinearGradient>
    </Defs>
    <SvgText
      fill="url(#grad)"
      fontSize="38"
      fontWeight="bold"
      x="160"
      y="20"
      textAnchor="middle"
      alignmentBaseline="middle"
      fontFamily="CustomFont" 
    >
     Prepare smarter,
    </SvgText>
  </Svg>
  <Svg height="50" width={windowWidth * 0.9}>
    <Defs>
      <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor={theme.tx1} stopOpacity="1" />
        <Stop offset="1" stopColor={theme.tx2} stopOpacity="1" />
      </SvgLinearGradient>
    </Defs>
    <SvgText
      fill="url(#grad)"
      fontSize="38"
      fontWeight="bold"
      x="150"
      y="20"
      textAnchor="middle"
      alignmentBaseline="middle"
      fontFamily="CustomFont" 
    >
      not just harder!
    </SvgText>
  </Svg>
            </View>
            <View style={{width:"92%"}}>
            <Text style={[styles.mockSubtitle,{color:theme.textColor}]}>
            Take our AI-powered, time-based mock tests designed for EAMCET, KCET, JEE, and NEET.
          </Text>
            </View>
        
          
          <Text style={[styles.sectionTitle,{color:theme.textColor}]}>Subjects Covered:</Text>
          <View style={styles.tagsContainer}>
            <Text style={[styles.tag,{color:theme.textColor,borderColor:theme.textColor}]}>Physics</Text>
            <Text style={[styles.tag,{color:theme.textColor,borderColor:theme.textColor}]}>Chemistry</Text>
            <Text style={[styles.tag,{color:theme.textColor,borderColor:theme.textColor}]}>Math</Text>
            <Text style={[styles.tag,{color:theme.textColor,borderColor:theme.textColor}]}>Biology</Text>
          </View>

          <Text style={[styles.sectionTitle,{color:theme.textColor}]}>Duration:</Text>
          <View style={styles.tagsContainer}>
            <Text style={[styles.tag,{color:theme.textColor,borderColor:theme.textColor}]}>30 min</Text>
            <Text style={[styles.tag,{color:theme.textColor,borderColor:theme.textColor}]}>45 min</Text>
            <Text style={[styles.tag,{color:theme.textColor,borderColor:theme.textColor}]}>60 min</Text>
          </View>

          <TouchableOpacity style={{alignItems:'center'}} activeOpacity={0.8} onPress={()=>{
                navigation.navigate("Form")
              }}>
  <LinearGradient
    colors={[theme.tx1, theme.tx2]}
    start={{ x: 0, y: 1 }}
    end={{ x: 1, y: 1 }}
    style={styles.startButtonGradient}
  >
    <Text style={[styles.startButtonText,{color:theme.textColor1,fontFamily:"CustomFont"}]}>Start Your Mock Test! It's Free</Text>
  </LinearGradient>
</TouchableOpacity>

         
</LinearGradient>
</View>
        <Text style={[styles.footerText,{color:theme.textColor}]}>
        Get actionable insights and a personalized learning plan to maximize your score. Start now and get exam-ready faster!
          </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
    height:windowHeight,
  },
  header: {
    alignItems: "center",
    marginTop:20,
    width:windowWidth,
    padding:10,
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
    fontWeight:'bold',
    fontFamily:"CustomFont" 
  },
  mockTestWrapper: {
    width: windowWidth * 0.9,
    alignItems: "center",
    justifyContent: "center",
    position:'static',
    borderWidth:1,
    borderRadius:30
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
  },
  mockSubtitle: {
    fontSize: 20,
    color:"#464646",
    fontWeight:'bold',
    paddingStart:10,
    fontFamily:"nun_sans" 
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
    width:"100%",
    paddingStart:10,
  },
  tagsContainer: {
    flexDirection: "row",
    marginTop: 8,
    width:'100%',
    paddingStart:10
  },
  tag: {
    borderRadius: 10,
    padding: 6,
    borderWidth:1,
    marginHorizontal: 5,
  },
  startButton: {
    backgroundColor: "#512DA8",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 15,
    width: windowWidth * .75,
    marginBottom:20
  },
  startButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
    alignSelf:'center',
  },
  footerText: {
    fontSize: 16,
    textAlign: "center",
    color: "#464646",
    padding:20
  },
  startButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: windowWidth * 0.8,
    marginBottom: 20,
    marginTop:15
  },
});