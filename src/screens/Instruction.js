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
import RenderHtml from "react-native-render-html";
import { darkTheme, lightTheme } from "../theme/theme";
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from "react-native-svg";
var striptags = require("striptags");

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Instruction({ navigation,route }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;
    const obj = route?.params?.obj;
    const examIdData = route?.params?.exam_id_Data
    console.log("mocktest1", obj );


      const sanitizeHtml = (text) => {
        if (text.length > 0) {
          text = text.replace("&nbsp;", " ");
          text = text.replace("<title>Hello, world!</title>", "");
          text = text.replace(
            `p{
    padding:10px auto;
    }`,
            ""
          );
          text = striptags(text, "<p><img>");
        }
    
        return { html: text };
      };
    

    const renderersProps = {
        img: {
          initialDimensions: { width: 20, height: 20 },
          enableExperimentalPercentWidth: true,
        },
      };

    return (
        <LinearGradient
            colors={theme.bmc}
            style={styles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', width: windowWidth, paddingStart: 15, marginTop: 10 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image
                            style={{ height: 36, width: 36, justifyContent: 'flex-start' }}
                            source={require("../images/back.png")}
                        />
                    </TouchableOpacity>

                    {/* <View style={{ flexDirection: 'row', alignItems: "flex-end", width: windowWidth / 1.12, justifyContent: 'flex-end', paddingEnd: 15 }}>
                        <Image
                            style={{ height: 36, width: 36 }}
                            source={require("../images/bell.png")}
                        />
                        <Image
                            style={{ height: 36, width: 36, marginLeft: 10 }}
                            source={require("../images/profile.png")}
                        />
                        <Image
                            style={{ height: 36, width: 36, marginLeft: 10 }}
                            source={require("../images/option.png")}
                        />
                    </View> */}
                </View>
                <ScrollView style={{marginBottom:10}}>
                    <View style={[styles.mockTestWrapper, { borderColor: theme.tx1 }]}>
                        <View style={[styles.mockTestBorder]} />
                        <LinearGradient
                            colors={theme.mcb}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.mockTestContainer}
                        >
                           
   <View style={{ marginTop: 10 }}>
                <Svg height="50" width={windowWidth * 0.9}>
                  <Defs>
                    <SvgLinearGradient id="grad" x1="0" y1="1" x2="1" y2="1">
                      <Stop offset="0" stopColor={theme.bg1} stopOpacity="1" />
                      <Stop offset="1" stopColor={theme.bg2} stopOpacity="1" />
                    </SvgLinearGradient>
                  </Defs>
                  <SvgText
                    fill="url(#grad)"
                    fontSize="24"
                    fontWeight="bold"
                    x="60"
                    y="20"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontFamily="CustomFont"
                  >
                    {" "}
                    Instructions
                  </SvgText>
                </Svg>

                <View style={{ marginTop: -20 }}>
                  <View style={{ flexDirection: "row", padding: 10 }}>
                    <Text
                      style={{
                        height: 10,
                        width: 10,
                        backgroundColor: theme.textColor,
                        borderRadius: 10,
                        borderWidth: 1,
                        marginRight: 5,
                        marginTop: 3,
                      }}
                    />
                    <Text
                      style={{
                        color: theme.textColor,
                        marginTop: -2,
                        width: "85%",
                        fontWeight: "700",
                        fontSize: 16,
                        marginLeft: 3,
                      }}
                    >
                      for the "{obj.examName}"
                    </Text>
                  </View>
       
                  <View>
                    <View style={styles.container1}>
                      {/* Total Questions Card */}
                      <View style={styles.frameBox}>
                        <LinearGradient
                          colors={[
                            "rgb(180, 101, 218)",
                            "rgb(207, 108, 201)",
                            "rgb(238, 96, 156)",
                            "rgb(238, 96, 156)",
                          ]}
                          start={{ x: 0, y: 1 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.frameIconBox}
                        >
                          <Image
                            source={require("../images/question-mark.png")}
                            style={{ height: 20, width: 20 }}
                          />
                        </LinearGradient>
                        <View style={styles.textContainer}>
                          <Text
                            style={[
                              styles.frameDesc,
                              { fontWeight: "600", fontSize: 14 },
                            ]}
                          >
                            {obj?.no_of_ques}
                          </Text>
                          <Text style={[styles.frameDesc, { fontSize: 12 }]}>
                            Total Questions
                          </Text>
                        </View>
                      </View>

                      {/* Total Duration Card */}
                      <View style={styles.frameBox}>
                        <LinearGradient
                          colors={[
                            "rgb(180, 101, 218)",
                            "rgb(207, 108, 201)",
                            "rgb(238, 96, 156)",
                            "rgb(238, 96, 156)",
                          ]}
                          start={{ x: 0, y: 1 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.frameIconBox}
                        >
                          <Image
                            source={require("../images/time.png")}
                            style={{ height: 20, width: 20 }}
                          />
                        </LinearGradient>
                        <View style={styles.textContainer}>
                          <Text
                            style={[
                              styles.frameDesc,
                              { fontWeight: "600", fontSize: 14 },
                            ]}
                          >
                            {obj?.duration ? obj?.duration : "-"}{" "}
                          </Text>
                          <Text style={[styles.frameDesc, { fontSize: 12 }]}>
                            Total duration
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                   <RenderHtml
                                  source={sanitizeHtml(
                                    obj.instructions || "<p>No instructions provided.</p>"
                                  )}
                                  renderersProps={renderersProps}
                                  // baseFontStyle={baseFontStyle}
                                  // {...DEFAULT_PROPS}
                                  contentWidth={windowWidth}
                                />
               
             
              </View>
                            <Svg height="50" width={windowWidth * 0.9}>
                                <Defs>
                                    <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                                        <Stop offset="0" stopColor={theme.bg1} stopOpacity="1" />
                                        <Stop offset="1" stopColor={theme.bg2} stopOpacity="1" />
                                    </SvgLinearGradient>
                                </Defs>
                                <SvgText
                                    fill="url(#grad)"
                                    fontSize="16"
                                    fontWeight="bold"
                                    x="140"
                                    y="20"
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                >
                                    Actions you can take during exam
                                </SvgText>
                            </Svg>

                            <View style={{ marginTop: -20 }}>
                                <View style={{ flexDirection: 'row', padding: 10 }}>
                                <Image
                            style={{ height: 20, width: 20, justifyContent: 'flex-start',resizeMode:'contain',tintColor:theme.textColor }}
                            source={require("../images/caution.png")}
                        />
                                    <Text style={{ color: theme.textColor, marginTop: -2, width: "85%", fontWeight: '400', fontSize: 18, marginLeft: 5 }}>
                                        Report Question                                    
                                        </Text>
                                </View>
                                <View style={{ flexDirection: 'row', paddingStart: 10, }}>
                                <Image
                            style={{ height: 20, width: 20, justifyContent: 'flex-start',resizeMode:'contain',tintColor:theme.textColor }}
                            source={require("../images/tag.png")}
                        />
                                    <Text style={{ color: theme.textColor, marginTop: -2, width: "85%", fontWeight: '400', fontSize: 18, marginLeft: 8 }}>
                                        Save Question</Text>                                    
                                        </View>
                                <View style={{ flexDirection: 'row', paddingStart: 10, marginTop: 10 }}>
                                <Image
                            style={{ height: 20, width: 20, justifyContent: 'flex-start',resizeMode:'contain',tintColor:theme.textColor }}
                            source={require("../images/eye.png")}
                        />
                                    <Text style={{ color: theme.textColor, marginTop: -2, width: "85%", fontWeight: '400', fontSize: 18, marginLeft: 8 }}>
                                        Mark for Review                                       
                                        </Text>
                                </View>

                                {/* <TouchableOpacity onPress={()=>{navigation.navigate("Signup")}}> */}
                                
                                <View>
                                  <View style={{ padding: 8,marginLeft:10, marginTop: 10,borderWidth:1,borderColor:theme.textColor,width:150,borderRadius:30 }}>
                                
                                    <Text style={{ color: theme.textColor, marginTop: -2, width: "85%", fontWeight: '400', fontSize: 18, marginLeft: 8 }}>
                                        Skip Question                                    
                                        </Text>
                                </View>
                                </View>


                            </View>

                            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                navigation.navigate("MockTest",{obj : obj, examIdData: examIdData})
                            }}> 
                                <LinearGradient
                                    colors={[theme.tx1, theme.tx2]}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.startButtonGradient}
                                >
                                    <Text style={[styles.startButtonText, { color: theme.textColor1 }]}>Start Test</Text>
                                </LinearGradient>
                            </TouchableOpacity>


                        </LinearGradient>
                    </View>
                </ScrollView>
            </View>
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
        height: windowHeight,
    },
    header: {
        alignItems: "center",
        marginTop: 20,
        width: windowWidth,
        padding: 10
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
        fontWeight: 'bold'
    },
    mockTitle: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#303F9F",
    },
    mockSubtitle: {
        fontSize: 20,
        color: "#464646",
        fontWeight: 'bold',
        paddingStart: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "500",
        marginTop: 10,
        width: "100%",
        paddingStart: 20,
    },
    tagsContainer: {
        flexDirection: "row",
        marginTop: 8,
        width: '100%',
        paddingStart: 20
    },
    tag: {
        borderRadius: 10,
        padding: 6,
        borderWidth: 1,
        marginHorizontal: 5,
    },
    startButton: {
        backgroundColor: "#512DA8",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 15,
        width: windowWidth,
        marginBottom: 20
    },
    startButtonText: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 18,
        alignSelf: 'center'
    },
    footerText: {
        fontSize: 16,
        textAlign: "center",
        color: "#464646",
        padding: 20
    },
    startButtonGradient: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        width: windowWidth * 0.85,
        marginTop: 15,
        marginBottom:15
    },
    mockTestWrapper: {
        width: windowWidth * 0.9,
        marginLeft: 20,
        marginTop: 20,
        position: 'static',
        borderWidth: 1,
        borderRadius: 30
    },

    mockTestBorder: {
        position: "absolute",
        borderRadius: 30,
        width: "100%",
        zIndex: -1,

    },

    mockTestContainer: {
        borderRadius: 30,
        width: "100%",
        padding: 8,
    },
    container1: {
        flexDirection: "row",
        justifyContent: "center",
    
        paddingHorizontal: 10,
        paddingVertical: 15,
      },
      frameBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F6FA",
        borderRadius: 10,
        padding: 12,
        marginHorizontal: 8,
        minWidth: 140,
        maxWidth: 180,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      frameIconBox: {
        backgroundColor: "#2575FC",
        borderRadius: 50,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
      },
      textContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
      },
      frameDesc: {
        color: "#000",
        paddingVertical: 1,
        fontWeight: "400",
      },
});