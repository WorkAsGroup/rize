import React, { useState, useEffect } from "react";
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
import { getExamType } from "../core/CommonService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from "react-native-svg";
import { theme } from "../core/theme";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SELECTED_YEAR_KEY = 'selectedYear';
const SELECTED_EXAM_KEY = 'selectedExam';
const SELECTED_SUBJECTS_KEY = 'selectedSubjects';
const SELECTED_LEVEL_KEY = 'selectedLevel';
const SELECTED_DURATION_KEY = 'selectedDuration';

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
        loadStoredData();
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

    const loadStoredData = async () => {
        try {
            const storedYear = await AsyncStorage.getItem(SELECTED_YEAR_KEY);
            const storedExam = await AsyncStorage.getItem(SELECTED_EXAM_KEY);
            const storedSubjects = await AsyncStorage.getItem(SELECTED_SUBJECTS_KEY);
            const storedLevel = await AsyncStorage.getItem(SELECTED_LEVEL_KEY);
            const storedDuration = await AsyncStorage.getItem(SELECTED_DURATION_KEY);

            if (storedYear) setSelectedYear(storedYear);
            if (storedExam) setSelectedExam(storedExam);
            if (storedSubjects) setSelectedSubjects(JSON.parse(storedSubjects));
            if (storedLevel) setSelectedLevel(storedLevel);
            if (storedDuration) setSelectedDuration(storedDuration);

        } catch (error) {
            console.error('Error loading data from AsyncStorage:', error);
        }
    };

    useEffect(() => {
        const saveData = async () => {
            try {
                await AsyncStorage.setItem(SELECTED_YEAR_KEY, selectedYear || '');
                await AsyncStorage.setItem(SELECTED_EXAM_KEY, selectedExam || '');
                await AsyncStorage.setItem(SELECTED_SUBJECTS_KEY, JSON.stringify(selectedSubjects));
                await AsyncStorage.setItem(SELECTED_LEVEL_KEY, selectedLevel || '');
                await AsyncStorage.setItem(SELECTED_DURATION_KEY, selectedDuration || '');
            } catch (error) {
                console.error('Error saving data to AsyncStorage:', error);
            }
        };

        saveData();
    }, [selectedYear, selectedExam, selectedSubjects, selectedLevel, selectedDuration]);


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
                <View>
                    <View style={[styles.mockTestWrapper, { borderColor: theme.tx1 }]}>
                        <View style={[styles.mockTestBorder, { borderColor: theme.brad }]} />
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
                                <View style={{ paddingStart: 10, flexDirection: 'row', marginTop: -8 }}>

                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            {
                                                flexDirection: 'row',
                                                borderRadius: 25,
                                                borderWidth: 1,
                                                width: 90,
                                                padding: 10,
                                                borderColor: selectedYear === '1st Year' ? theme.bg1 : theme.textColor, 
                                            },
                                        ]}
                                        onPress={() => setSelectedYear('1st Year')}
                                    >
                                        <View
                                            style={{ height: 10, width: 10, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3,backgroundColor: selectedYear === '1st Year' ? theme.bg1 : "transparent", borderColor: selectedYear === '1st Year' ? theme.bg1 : theme.textColor }}

                                        />
                                        <Text style={{ color: selectedYear === '1st Year' ? theme.bg1 : theme.textColor, }}>
                                            1st Year
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            {
                                                flexDirection: 'row',
                                                borderRadius: 25,
                                                borderWidth: 1,
                                                width: 90,
                                                padding: 10,
                                                marginLeft: 10,
                                                borderColor: selectedYear === '2nd Year' ? theme.bg1 : theme.textColor,
                                            },
                                        ]}
                                        onPress={() => setSelectedYear('2nd Year')}
                                    >
                                        <View
                                            style={{ height: 10, width: 10, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3,backgroundColor: selectedYear === '2nd Year' ? theme.bg1 : "transparent", borderColor: selectedYear === '2nd Year' ? theme.bg1 : theme.textColor }}

                                        />
                                        <Text style={{ color: selectedYear === '2nd Year' ? theme.bg1 : theme.textColor, }}>
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
                                <View style={{ paddingStart: 10, flexDirection: 'row', marginTop: -8 }}>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            {
                                                flexDirection: 'row',
                                                borderColor: theme.textColor,
                                                borderRadius: 25,
                                                borderWidth: 1,
                                                width: 90,
                                                padding: 10,
                                                borderColor: selectedExam === 'EAMCET' ? theme.bg1 : theme.textColor,
                                            },
                                        ]}
                                        onPress={() => setSelectedExam('EAMCET')}
                                    >
                                        <View
                                            style={{ height: 10, width: 10, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3,backgroundColor: selectedExam === 'EAMCET' ? theme.bg1 : "transparent", borderColor: selectedExam === 'EAMCET' ? theme.bg1 : theme.textColor }}

                                        />
                                        <Text style={{ color: selectedExam === 'EAMCET' ? theme.bg1 : theme.textColor }}>
                                            EAMCET
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            {
                                                flexDirection: 'row',
                                                borderColor: theme.textColor,
                                                borderRadius: 25,
                                                borderWidth: 1,
                                                width: 75,
                                                padding: 10,
                                                marginLeft: 10,
                                                borderColor: selectedExam === 'KCET' ? theme.bg1 : theme.textColor,
                                            },
                                        ]}
                                        onPress={() => setSelectedExam('KCET')}
                                    >
                                        <View
                                            style={{ height: 10, width: 10, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3,backgroundColor: selectedExam === 'KCET' ? theme.bg1 : "transparent", borderColor: selectedExam === 'KCET' ? theme.bg1 : theme.textColor }}

                                        />
                                        <Text style={{ color: selectedExam === 'KCET' ? theme.bg1 : theme.textColor }}>
                                            KCET
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            {
                                                flexDirection: 'row',
                                                borderColor: theme.textColor,
                                                borderRadius: 25,
                                                borderWidth: 1,
                                                width: 65,
                                                padding: 10,
                                                marginLeft: 10,
                                                borderColor: selectedExam === 'JEE' ? theme.bg1 : theme.textColor,
                                            },
                                        ]}
                                        onPress={() => setSelectedExam('JEE')}
                                    >
                                        <View
                                            style={{ height: 10, width: 10, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3,backgroundColor: selectedExam === 'JEE' ? theme.bg1 : "transparent", borderColor: selectedExam === 'JEE' ? theme.bg1 : theme.textColor }}

                                        />
                                        <Text style={{ color: selectedExam === 'JEE' ? theme.bg1 : theme.textColor }}>
                                            JEE
                                        </Text>
                                    </TouchableOpacity>


                                </View>
                                <TouchableOpacity
                                        style={[
                                            styles.button,
                                            {
                                                flexDirection: 'row',
                                                borderColor: theme.textColor,
                                                borderRadius: 25,
                                                borderWidth: 1,
                                                width: 65,
                                                padding: 10,
                                                marginLeft: 10,
                                                borderColor: selectedExam === 'NEET' ? theme.bg1 : theme.textColor,
                                            },
                                        ]}
                                        onPress={() => setSelectedExam('NEET')}
                                    >       
                                    <View
                                            style={{ height: 10, width: 10, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3,backgroundColor: selectedExam === 'NEET' ? theme.bg1 : "transparent", borderColor: selectedExam === 'NEET' ? theme.bg1 : theme.textColor }}

                                        />
                                        <Text style={{ color: selectedExam === 'NEET' ? theme.bg1 : theme.textColor }}>
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
                                <View style={{ paddingStart: 10, flexDirection: 'row', marginTop: -8 }}>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            {
                                                flexDirection: 'row',
                                                borderColor: theme.textColor,
                                                borderRadius: 25,
                                                borderWidth: 1,
                                                width: 90,
                                                padding: 10,
                                                borderColor: selectedSubjects.includes('Physics') ? theme.bg1 : theme.textColor,
                                            },
                                        ]}
                                        onPress={() => toggleSubject('Physics')}
                                    >
                                        <View
                                            style={{
                                                height: 10,
                                                width: 10,
                                                borderRadius: 10,
                                                borderWidth: 1,
                                                marginRight: 5,
                                                marginTop: 3,
                                                borderColor: selectedSubjects.includes('Physics') ? theme.bg1 : theme.textColor,
                                                backgroundColor: selectedSubjects.includes('Physics') ? theme.bg1 : 'transparent', // Fill color
                                            }}
                                        />
                                        <Text style={{ color: selectedSubjects.includes('Physics') ? theme.bg1 : theme.textColor, }}>
                                            Physics
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            {
                                                flexDirection: 'row',
                                                borderColor: theme.textColor,
                                                borderRadius: 25,
                                                borderWidth: 1,
                                                width: 70,
                                                padding: 10,
                                                marginLeft: 10,
                                                borderColor: selectedSubjects.includes('Math') ? theme.bg1 : theme.textColor,
                                            },
                                        ]}
                                        onPress={() => toggleSubject('Math')}
                                    >
                                        <View
                                            style={{
                                                height: 10,
                                                width: 10,
                                                borderRadius: 10,
                                                borderWidth: 1,
                                                marginRight: 5,
                                                marginTop: 3,
                                                borderColor: selectedSubjects.includes('Math') ? theme.bg1 : theme.textColor,
                                                backgroundColor: selectedSubjects.includes('Math') ? theme.bg1 : 'transparent', // Fill color
                                            }}
                                        />
                                        <Text style={{ color: selectedSubjects.includes('Math') ? theme.bg1 : theme.textColor, }}>
                                            Math
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            {
                                                flexDirection: 'row',
                                                borderRadius: 25,
                                                borderColor: theme.textColor,
                                                borderWidth: 1,
                                                width: 85,
                                                padding: 10,
                                                marginLeft: 10,
                                                borderColor: selectedSubjects.includes('Biology') ? theme.bg1 : theme.textColor,
                                            },
                                        ]}
                                        onPress={() => toggleSubject('Biology')}
                                    >
                                        <View
                                            style={{
                                                height: 10,
                                                width: 10,
                                                borderRadius: 10,
                                                borderWidth: 1,
                                                marginRight: 5,
                                                marginTop: 3,
                                                borderColor: selectedSubjects.includes('Biology') ? theme.bg1 : theme.textColor,
                                                backgroundColor: selectedSubjects.includes('Biology') ? theme.bg1 : 'transparent', // Fill color
                                            }}
                                        />
                                        <Text style={{ color: selectedSubjects.includes('Biology') ? theme.bg1 : theme.textColor, }}>
                                            Biology
                                        </Text>
                                    </TouchableOpacity>


                                </View>
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        {
                                            flexDirection: 'row',
                                            borderRadius: 25,
                                            borderWidth: 1,
                                            width: 100,
                                            padding: 10,
                                            marginLeft: 10,
                                            marginTop: 10,
                                            borderColor: selectedSubjects.includes('Chemistry') ? theme.bg1 : theme.textColor,
                                        },
                                    ]}
                                    onPress={() => toggleSubject('Chemistry')}
                                >
                                    <View
                                        style={{
                                            height: 10,
                                            width: 10,
                                            borderRadius: 10,
                                            borderWidth: 1,
                                            marginRight: 5,
                                            marginTop: 3,
                                            borderColor: selectedSubjects.includes('Chemistry') ? theme.bg1 : theme.textColor,
                                            backgroundColor: selectedSubjects.includes('Chemistry') ? theme.bg1 : 'transparent', // Fill color
                                        }}
                                    />
                                    <Text style={{ color: selectedSubjects.includes('Chemistry') ? theme.bg1 : theme.textColor, }}>
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
                                <View style={{ paddingStart: 10, flexDirection: 'row', marginTop: -8 }}>
                                    <TouchableOpacity
                                     style={[
                                        styles.button,
                                        {
                                            flexDirection: 'row',
                                            borderRadius: 25,
                                            borderWidth: 1,
                                            width: 70,
                                            padding: 10,
                                            borderColor: selectedLevel === 'Easy' ? theme.bg1 : theme.textColor,
                                        },
                                      ]}
                                        onPress={() => setSelectedLevel('Easy')}
                                    >
                                        <View
                                            style={{ height: 10, width: 10, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3,backgroundColor: selectedLevel === 'Easy' ? theme.bg1 : "transparent", borderColor: selectedLevel === 'Easy' ? theme.bg1 : theme.textColor }}

                                        />
                                        <Text style={{ color: selectedLevel === 'Easy' ? theme.bg1 : theme.textColor}}>
                                            Easy
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                         style={[
                                        styles.button,
                                        {
                                            flexDirection: 'row',
                                            borderRadius: 25,
                                            borderWidth: 1,
                                            width: 90,
                                            padding: 10,
                                            marginLeft: 10,
                                            borderColor: selectedLevel === 'Medium' ? theme.bg1 : theme.textColor,
                                        },
                                      ]}
                                        onPress={() => setSelectedLevel('Medium')}>
                                        <Text
                                            style={{ height: 10, width: 10, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3,backgroundColor: selectedLevel === 'Medium' ? theme.bg1 : "transparent", borderColor: selectedLevel === 'Medium' ? theme.bg1 : theme.textColor }}

                                        />
                                        <Text style={{ color: selectedLevel === 'Medium' ? theme.bg1 : theme.textColor }}>
                                            Medium
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                     style={[
                                        styles.button,
                                        {
                                            flexDirection: 'row',
                                            borderRadius: 25,
                                            borderWidth: 1,
                                            width: 70,
                                            padding: 10,
                                            marginLeft: 10,
                                            borderColor: selectedLevel === 'Hard' ? theme.bg1 : theme.textColor,
                                        },
                                      ]}
                                        onPress={() => setSelectedLevel('Hard')}>
                                        <Text
                                            style={{ height: 10, width: 10, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3,backgroundColor: selectedLevel === 'Hard' ? theme.bg1 : "transparent", borderColor: selectedLevel === 'Hard' ? theme.bg1 : theme.textColor }}

                                        />
                                        <Text style={{ color:  selectedLevel === 'Hard' ? theme.bg1 : theme.textColor  }}>
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
                                <View style={{ paddingStart: 10, flexDirection: 'row', marginTop: -8 }}>
                                    <TouchableOpacity 
                                          style={[
                                        styles.button,
                                        {
                                            flexDirection: 'row',
                                            borderRadius: 25,
                                            borderWidth: 1,
                                            width: 85,
                                            padding: 10,
                                            borderColor: selectedDuration === '30 Min' ? theme.bg1 : theme.textColor,
                                        },
                                      ]}
                                        onPress={() => setSelectedDuration('30 Min')}>
                                        <Text
                                            style={{ height: 10, width: 10, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3,backgroundColor: selectedDuration === '30 Min'  ? theme.bg1 : "transparent", borderColor: selectedDuration === '30 Min' ? theme.bg1 : theme.textColor }}

                                        />
                                        <Text style={{ color: selectedDuration === '30 Min' ? theme.bg1 : theme.textColor }}>
                                            30 Min
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                     style={[
                                        styles.button,
                                        {
                                            flexDirection: 'row',
                                            borderRadius: 25,
                                            borderWidth: 1,
                                            width: 85,
                                            padding: 10,
                                            marginLeft: 10,
                                            borderColor: selectedDuration === '45 Min' ? theme.bg1 : theme.textColor,
                                        },
                                      ]}
                                        onPress={() => setSelectedDuration('45 Min')}>
                                        <Text
                                            style={{ height: 10, width: 10, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3,backgroundColor: selectedDuration === '45 Min'  ? theme.bg1 : "transparent", borderColor: selectedDuration === '45 Min' ? theme.bg1 : theme.textColor }}

                                        />
                                        <Text style={{ color:  selectedDuration === '45 Min' ? theme.bg1 : theme.textColor }}>
                                            45 Min
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                     style={[
                                        styles.button,
                                        {
                                            flexDirection: 'row',
                                            borderRadius: 25,
                                            borderWidth: 1,
                                            width: 85,
                                            padding: 10,
                                            marginLeft: 10,
                                            borderColor: selectedDuration === '60 Min' ? theme.bg1 : theme.textColor,
                                        },
                                      ]}
                                        onPress={() => setSelectedDuration('60 Min')}>
                                        <Text
                                            style={{ height: 10, width: 10, borderRadius: 10, borderWidth: 1, marginRight: 5, marginTop: 3,backgroundColor: selectedDuration === '60 Min'  ? theme.bg1 : "transparent", borderColor: selectedDuration === '60 Min' ? theme.bg1 : theme.textColor }}

                                        />
                                        <Text style={{ color:  selectedDuration === '60 Min' ? theme.bg1 : theme.textColor }}>
                                            60 Min
                                        </Text>
                                    </TouchableOpacity>

                                </View>

                                 {/* {isFormComplete && (
                                        <View style={{backgroundColor:'green',padding:20}}>
                                             <Text>Form is Completed</Text>
                                        </View>
                                     )} */}
                                     
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
        position: 'static',
        borderWidth: 1,
        borderRadius: 30
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
    button: {
       marginBottom:5
    }

});