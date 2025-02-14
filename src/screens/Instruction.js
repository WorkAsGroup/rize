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

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Instruction({ navigation }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;

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

                    <View style={{ flexDirection: 'row', alignItems: "flex-end", width: windowWidth / 1.12, justifyContent: 'flex-end', paddingEnd: 15 }}>
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
                    </View>
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
                                <Text style={[styles.feature, { color: theme.textColor, marginBottom: 5, paddingStart: 10 }]}>Free Mock test</Text>

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
                                        Syllabus
                                    </SvgText>
                                </Svg>


                                <View style={{ marginTop: -20 }}>
                                    <View style={{ flexDirection: 'row', padding: 10 }}>
                                        <Text
                                            style={{ height: 10, width: 10, backgroundColor: theme.textColor, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3 }}

                                        />
                                        <Text style={{ color: theme.textColor, marginTop: -2, width: "85%", fontWeight: '400', fontSize: 16, marginLeft: 3 }}>
                                            Total 11th & 12th class syllabus as per latest notification with 70%.
                                        </Text>
                                    </View>


                                </View>

                                <Svg height="40" width={windowWidth * 0.9}>
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
                                        x="150"
                                        y="20"
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                        fontFamily="CustomFont"

                                    >
                                        Please read the following
                                    </SvgText>
                                </Svg>

                                <Svg height="40" width={windowWidth * 0.9} marginTop={-10}>
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
                                        x="130"
                                        y="20"
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                        fontFamily="CustomFont"

                                    >
                                        instructions carefully
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
                                        fontSize="16"
                                        fontWeight="bold"
                                        x="50"
                                        y="20"
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                    >
                                        For MCQs -
                                    </SvgText>
                                </Svg>
                                <View style={{ marginTop: -20 }}>
                                    <View style={{ flexDirection: 'row', padding: 10 }}>
                                        <Text
                                            style={{ height: 10, width: 10, backgroundColor: theme.textColor, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3 }}

                                        />
                                        <Text style={{ color: theme.textColor, marginTop: -2, width: "85%", fontWeight: '400', fontSize: 16, marginLeft: 3 }}>
                                            1 Mark will be awarded for every correct answer and 0 Mark will be deducted for every incorrect answer
                                        </Text>
                                    </View>


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
                                        x="95"
                                        y="20"
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                    >
                                        Do's while taking the test
                                    </SvgText>
                                </Svg>
                                <View style={{ marginTop: -20 }}>
                                    <View style={{ flexDirection: 'row', padding: 10 }}>
                                        <Text
                                            style={{ height: 10, width: 10, backgroundColor: theme.textColor, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3 }}

                                        />
                                        <Text style={{ color: theme.textColor, marginTop: -2, width: "85%", fontWeight: '400', fontSize: 16, marginLeft: 3 }}>
                                            Make sure you begin the test with a plan. Start with your strongest section.                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingStart: 10, }}>
                                        <Text
                                            style={{ height: 10, width: 10, backgroundColor: theme.textColor, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3 }}

                                        />
                                        <Text style={{ color: theme.textColor, marginTop: -2, width: "85%", fontWeight: '400', fontSize: 16, marginLeft: 3 }}>
                                            Go through the entire paper and attempt the questions you know first.</Text>                                    </View>
                                    <View style={{ flexDirection: 'row', paddingStart: 10, marginTop: 10 }}>
                                        <Text
                                            style={{ height: 10, width: 10, backgroundColor: theme.textColor, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3 }}

                                        />
                                        <Text style={{ color: theme.textColor, marginTop: -2, width: "85%", fontWeight: '400', fontSize: 16, marginLeft: 3 }}>
                                            Make sure you save at least 20-30 mins in the end to revisit your answers in an online test, you can change your answer at any time.                                       </Text>
                                    </View>

                                </View>

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
                                    x="105"
                                    y="20"
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                >
                                    Don'ts while taking the test
                                </SvgText>
                            </Svg>
                            <View style={{ marginTop: -20 }}>
                                <View style={{ flexDirection: 'row', padding: 10 }}>
                                    <Text
                                        style={{ height: 10, width: 10, backgroundColor: theme.textColor, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3 }}

                                    />
                                    <Text style={{ color: theme.textColor, marginTop: -2, width: "85%", fontWeight: '400', fontSize: 16, marginLeft: 3 }}>
                                        Don't change the date and time of the device in between the test otherwise ,it will get auto submitted.                                        </Text>
                                </View>
                                <View style={{ flexDirection: 'row', paddingStart: 10, }}>
                                    <Text
                                        style={{ height: 10, width: 10, backgroundColor: theme.textColor, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3 }}

                                    />
                                    <Text style={{ color: theme.textColor, marginTop: -2, width: "85%", fontWeight: '400', fontSize: 16, marginLeft: 3 }}>
                                        Don't switch to web or app for the same test once you started in the current app.</Text>                                    </View>
                                <View style={{ flexDirection: 'row', paddingStart: 10, marginTop: 10 }}>
                                    <Text
                                        style={{ height: 10, width: 10, backgroundColor: theme.textColor, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3 }}

                                    />
                                    <Text style={{ color: theme.textColor, marginTop: -2, width: "85%", fontWeight: '400', fontSize: 16, marginLeft: 3 }}>
                                        Don't submit the test before time. Try to use the entire duration of the test wisely.                                       </Text>
                                </View>


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
                                    x="130"
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
                                navigation.navigate("MockTest")
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

});