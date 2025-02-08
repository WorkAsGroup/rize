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
import { getExamType } from "../core/CommonService";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Form({ navigation }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;

    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(null);

    useEffect(() => {
        getExam();
    }, []);

    const getExam = async () => {
        const exams = await getExamType();
        console.log("response", exams);
    };

    const toggleSubject = (subject) => {
        setSelectedSubjects((prev) =>
            prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
        );
    };

    const isFormComplete = selectedYear && selectedExam && selectedSubjects.length > 0 && selectedLevel && selectedDuration;


    return (
        <LinearGradient
            colors={theme.bmc}
            style={styles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', width: windowWidth, paddingStart: 15, marginTop: 10 }}>
                   <TouchableOpacity onPress={()=>{navigation.goBack()}}>
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
                <View>
                    <View style={[styles.mockTestWrapper,{borderColor:theme.tx1}]}>
                        <View style={[styles.mockTestBorder, { borderColor: theme.brad }]} />
                        <LinearGradient
                            colors={theme.mcb}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.mockTestContainer}
                        >
                            <View style={{ marginTop: 10 }}>
                                <Text style={[styles.feature, { color: theme.textColor, marginBottom: 5,paddingStart:10 }]}>Free Mock test</Text>

                                <Svg height="50" width={windowWidth * 0.9}>
                                    <Defs>
                                        <SvgLinearGradient id="grad" x1="0" y1="1" x2="1" y2="1">
                                            <Stop offset="0" stopColor={theme.bg1} stopOpacity="1" />
                                            <Stop offset="1" stopColor={theme.bg2} stopOpacity="1" />
                                        </SvgLinearGradient>
                                    </Defs>
                                    <SvgText
                                        fill="url(#grad)"
                                        fontSize="38"
                                        fontWeight="bold"
                                        x="153"
                                        y="20"
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                        fontFamily="CustomFont" 

                                    >
                                        Let's get started
                                    </SvgText>
                                </Svg>

                                <Svg height="50" width={windowWidth * 0.9}>
                                    <Defs>
                                        <SvgLinearGradient id="grad" x1="0" y1="1" x2="1" y2="1">
                                            <Stop offset="0" stopColor={theme.bg1} stopOpacity="1" />
                                            <Stop offset="1" stopColor={theme.bg2} stopOpacity="1" />
                                        </SvgLinearGradient>
                                    </Defs>
                                    <SvgText
                                        fill="url(#grad)"
                                        fontSize="16"
                                        fontWeight="bold"
                                        x="70"
                                        y="20"
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                    >
                                        Current Education
                                    </SvgText>
                                </Svg>
                                <View style={{ paddingStart: 10, flexDirection: 'row',marginTop:-8 }}>
                                    
                                    <TouchableOpacity style={{ flexDirection: 'row', borderRadius: 25,borderColor:theme.textColor, borderWidth: 1, width: 90, padding: 10 }}>
                                        <Text
                                            style={{ height: 10, width: 10,borderColor:theme.textColor, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3 }}

                                        />
                                        <Text style={{color:theme.textColor}}>
                                            1st Year
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ borderColor:theme.textColor,flexDirection: 'row', borderRadius: 25, borderWidth: 1, width: 90, padding: 10, marginLeft: 10 }}>
                                        <Text
                                            style={{ height: 10, width: 10,borderColor:theme.textColor, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3 }}

                                        />
                                        <Text style={{color:theme.textColor}}>
                                            2nd Year
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                                <Svg height="50" width={windowWidth * 0.9}>
                                    <Defs>
                                        <SvgLinearGradient id="grad" x1="0" y1="1" x2="1" y2="1">
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
                                        Select Exam
                                    </SvgText>
                                </Svg>
                                <View style={{ paddingStart: 10, flexDirection: 'row',marginTop:-8 }}>
                                    <TouchableOpacity style={{ flexDirection: 'row',borderColor:theme.textColor, borderRadius: 25, borderWidth: 1, width: 90, padding: 10 }}>
                                        <Text
                                            style={{ height: 10, width: 10,borderColor:theme.textColor, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3 }}

                                        />
                                        <Text style={{color:theme.textColor}}>
                                        EAMCET
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row', borderColor:theme.textColor,borderRadius: 25, borderWidth: 1, width: 75, padding: 10, marginLeft: 10 }}>
                                        <Text
                                            style={{ height: 10, width: 10, borderRadius: 10, borderColor:theme.textColor,borderWidth: 1, marginRight: 5, marginTop: 3 }}

                                        />
                                        <Text style={{color:theme.textColor}}>
                                        KCET
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row', borderColor:theme.textColor,borderRadius: 25, borderWidth: 1, width: 65, padding: 10, marginLeft: 10 }}>
                                        <Text
                                            style={{ height: 10, width: 10, borderRadius: 10,borderColor:theme.textColor, borderWidth: 1, marginRight: 5, marginTop: 3 }}

                                        />
                                        <Text style={{color:theme.textColor}}>
                                        JEE
                                        </Text>
                                    </TouchableOpacity>
                                   

                                </View>
                                <TouchableOpacity style={{ flexDirection: 'row',borderColor:theme.textColor, borderRadius: 25, borderWidth: 1, width: 75, padding: 10, marginLeft: 10,marginTop:10 }}>
                                        <Text
                                            style={{ height: 10, width: 10,borderColor:theme.textColor, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3 }}

                                        />
                                        <Text style={{color:theme.textColor}}>
                                        NEET
                                        </Text>
                                    </TouchableOpacity>

                                    <Svg height="50" width={windowWidth * 0.9}>
                                    <Defs>
                                        <SvgLinearGradient id="grad" x1="0" y1="1" x2="1" y2="1">
                                            <Stop offset="0" stopColor={theme.bg1} stopOpacity="1" />
                                            <Stop offset="1" stopColor={theme.bg2} stopOpacity="1" />
                                        </SvgLinearGradient>
                                    </Defs>
                                    <SvgText
                                        fill="url(#grad)"
                                        fontSize="16"
                                        fontWeight="bold"
                                        x="60"
                                        y="20"
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                    >
                                        Select Subjects
                                    </SvgText>
                                </Svg>
                                <View style={{ paddingStart: 10, flexDirection: 'row',marginTop:-8 }}>
                                    <TouchableOpacity style={{ flexDirection: 'row',borderColor:theme.textColor, borderRadius: 25, borderWidth: 1, width: 90, padding: 10 }}>
                                        <Text
                                            style={{ height: 10, width: 10, borderRadius: 10,borderColor:theme.textColor, borderWidth: 1, marginRight: 5, marginTop: 3 }}

                                        />
                                        <Text style={{color:theme.textColor}}>
                                        Physics
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row',borderColor:theme.textColor, borderRadius: 25, borderWidth: 1, width: 70, padding: 10, marginLeft: 10 }}>
                                        <Text
                                            style={{ height: 10, width: 10, borderRadius: 10,borderColor:theme.textColor, borderWidth: 1, marginRight: 5, marginTop: 3 }}

                                        />
                                        <Text style={{color:theme.textColor}}>
                                        Math
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row', borderRadius: 25,borderColor:theme.textColor, borderWidth: 1, width: 85, padding: 10, marginLeft: 10 }}>
                                        <Text
                                            style={{ height: 10, width: 10, borderRadius: 10, borderWidth: 1,borderColor:theme.textColor, marginRight: 5, marginTop: 3 }}

                                        />
                                        <Text style={{color:theme.textColor}}>
                                        Biology
                                        </Text>
                                    </TouchableOpacity>
                                   

                                </View>
                                <TouchableOpacity style={{ flexDirection: 'row', borderRadius: 25, borderWidth: 1,borderColor:theme.textColor, width: 100, padding: 10, marginLeft: 10,marginTop:10 }}>
                                        <Text
                                            style={{ height: 10, width: 10, borderRadius: 10, borderWidth: 1,borderColor:theme.textColor, marginRight: 5, marginTop: 3 }}

                                        />
                                        <Text style={{color:theme.textColor}}>
                                        Chemistry
                                        </Text>
                                    </TouchableOpacity>
                                   

                                    <Svg height="50" width={windowWidth * 0.9}>
                                    <Defs>
                                        <SvgLinearGradient id="grad" x1="0" y1="1" x2="1" y2="1">
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
                                        Select Level
                                    </SvgText>
                                </Svg>
                                <View style={{ paddingStart: 10, flexDirection: 'row',marginTop:-8 }}>
                                    <TouchableOpacity style={{ flexDirection: 'row',borderColor:theme.textColor, borderRadius: 25, borderWidth: 1, width: 70, padding: 10 }}>
                                        <Text
                                            style={{ height: 10, width: 10, borderRadius: 10,borderColor:theme.textColor, borderWidth: 1, marginRight: 5, marginTop: 3 }}

                                        />
                                        <Text style={{color:theme.textColor}}>
                                        Easy
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row', borderRadius: 25, borderColor:theme.textColor,borderWidth: 1, width: 90, padding: 10, marginLeft: 10 }}>
                                        <Text
                                            style={{ height: 10, width: 10, borderRadius: 10, borderWidth: 1,borderColor:theme.textColor, marginRight: 5, marginTop: 3 }}

                                        />
                                        <Text style={{color:theme.textColor}}>
                                        Medium
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row', borderRadius: 25,borderColor:theme.textColor, borderWidth: 1, width: 70, padding: 10, marginLeft: 10 }}>
                                        <Text
                                            style={{ height: 10, width: 10, borderRadius: 10, borderWidth: 1,borderColor:theme.textColor, marginRight: 5, marginTop: 3 }}

                                        />
                                        <Text style={{color:theme.textColor}}>
                                        Hard
                                        </Text>
                                    </TouchableOpacity>


                                </View>

                                <Svg height="50" width={windowWidth * 0.9}>
                                    <Defs>
                                        <SvgLinearGradient id="grad" x1="0" y1="1" x2="1" y2="1">
                                            <Stop offset="0" stopColor={theme.bg1} stopOpacity="1" />
                                            <Stop offset="1" stopColor={theme.bg2} stopOpacity="1" />
                                        </SvgLinearGradient>
                                    </Defs>
                                    <SvgText
                                        fill="url(#grad)"
                                        fontSize="16"
                                        fontWeight="bold"
                                        x="70"
                                        y="20"
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                    >
                                        Select Duration
                                    </SvgText>
                                </Svg>
                                <View style={{ paddingStart: 10, flexDirection: 'row',marginTop:-8 }}>
                                    <TouchableOpacity style={{ flexDirection: 'row', borderRadius: 25,borderColor:theme.textColor, borderWidth: 1, width: 85, padding: 10 }}>
                                        <Text
                                            style={{ height: 10, width: 10, borderRadius: 10, borderWidth: 1,borderColor:theme.textColor, marginRight: 5, marginTop: 3 }}

                                        />
                                        <Text style={{color:theme.textColor}}>
                                        30 Min
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row', borderRadius: 25, borderWidth: 1,borderColor:theme.textColor, width: 85, padding: 10, marginLeft: 10 }}>
                                        <Text
                                            style={{ height: 10, width: 10, borderRadius: 10, borderWidth: 1, marginRight: 5,borderColor:theme.textColor, marginTop: 3 }}

                                        />
                                        <Text style={{color:theme.textColor}}>
                                        45 Min
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flexDirection: 'row', borderRadius: 25, borderColor:theme.textColor,borderWidth: 1, width: 85, padding: 10, marginLeft: 10 }}>
                                        <Text
                                            style={{ height: 10, width: 10, borderRadius: 10, borderWidth: 1,borderColor:theme.textColor, marginRight: 5, marginTop: 3 }}

                                        />
                                        <Text style={{color:theme.textColor}}>
                                        60 Min
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                             
                            </View>

                            <TouchableOpacity activeOpacity={0.8} onPress={() => {
                                navigation.navigate("Instruction")
                            }}>
                                <LinearGradient
                                    colors={[theme.tx1, theme.tx2]}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.startButtonGradient}
                                >
                                    <Text style={[styles.startButtonText, { color: theme.textColor1 }]}>Next</Text>
                                </LinearGradient>
                            </TouchableOpacity>


                        </LinearGradient>
                    </View>
                </View>
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
        marginBottom: 20,
        marginTop: 15,
        
    },
    mockTestWrapper: {
        width: windowWidth * 0.9,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 20,
        marginTop: 20,
        position:'static',
        borderWidth:1,
        borderRadius:30
    },

    mockTestBorder: {
        position: "absolute",
        borderRadius: 30,
        borderWidth: 2,
        width: "100%",
        zIndex: -1,

    },

    mockTestContainer: {
        borderRadius: 30,
        width: "100%",
        padding: 8,
    },

});