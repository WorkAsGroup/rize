import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    useColorScheme,
    Dimensions,
    Image,
    ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { darkTheme, lightTheme } from "../theme/theme";
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from "react-native-svg";
import { getPreExam } from "../core/CommonService";
import { WebView } from 'react-native-webview';

const windowWidth = Dimensions.get("window").width;

export default function MockTest({ navigation }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;

    const [selectedSubject, setSelectedSubject] = useState("Physics");
    const [selectedNumber, setSelectedNumber] = useState(1);
    const scrollRef = useRef(null);
    const [exams, setExams] = useState([]);
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const handleSubjectSelect = (subject) => {
        setSelectedSubject(subject);
    };

    const scrollX = useRef(0);

    const scrollLeft = () => {
        scrollX.current = Math.max(0, scrollX.current - exams.length);
        scrollRef.current?.scrollTo({ x: scrollX.current, animated: true });
    };

    const scrollRight = () => {
        scrollX.current += exams.length;
        scrollRef.current?.scrollTo({ x: scrollX.current, animated: true });
    };

    useEffect(() => {
        getExam();
    }, []);

    const getExam = async () => {
        const examsResponse = await getPreExam();
        console.log("exams", examsResponse.data[0]);
        setExams(examsResponse.data);

    }
    const RenderContent = ({ html }) => {
        const contentArray = extractContent(html);
    
        return (
            <View style={[styles.question, { color: theme.textColor }]}>
                {contentArray.map((item, index) => {
                    if (item.type === 'text') {
                        return (
                            <Text key={`text-${index}`} style={{ color: '#000' }}>
                                {item.content}
                            </Text>
                        );
                    } else if (item.type === 'image') {
                        return (
                            <Image
                                key={`image-${index}`}
                                source={{ uri: item.content }}
                                style={{ height: 30, width: 100, resizeMode: 'contain' }}
                            />
                        );
                    }
                    return null;
                })}
            </View>
        );
    };
    
    const extractContent = (html) => {
        const imageRegex = /<img[^>]+src="([^">]+)"/g;
        let contentArray = [];
        let lastIndex = 0;
        let match;
    
        html = html.replace(/<\/?p[^>]*>/g, '')  
        .replace(/\/>?>/g, '>')        
        .replace(/&nbsp;/g, ' ')      
        .trim();
        while ((match = imageRegex.exec(html)) !== null) {
            const textBeforeImage = html.slice(lastIndex, match.index).trim();
            if (textBeforeImage) {
                contentArray.push({ type: 'text', content: textBeforeImage });
            }
            contentArray.push({ type: 'image', content: match[1] });
    
            lastIndex = match.index + match[0].length;
        }
    
        const remainingText = html.slice(lastIndex).trim();
        if (remainingText) {
            contentArray.push({ type: 'text', content: remainingText });
        }
    
        return contentArray;
    };
    
    const removeHtmlTags = (html) => {
        if (!html) return "";
        let cleanedHtml = html.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '\n');
        cleanedHtml = cleanedHtml.replace(/<img[^>]*src="[^"]*"[^>]*>/g, '');
        cleanedHtml = cleanedHtml.replace(/&nbsp;/g, " ");
        return cleanedHtml;
    };
    
    const extractImages = (html) => {
        const imageRegex = /<img[^>]+src="([^">]+)"/g;
        let images = [];
        let match;
        while ((match = imageRegex.exec(html)) !== null) {
            images.push(match[1]);
        }
        return images;
    };

    const questionHtml = exams.length > 0 ? exams[selectedNumber - 1]?.question : "";
    const questionHtml1 = exams.length > 0 ? exams[selectedNumber - 1]?.compquestion : "";

    const cleanedText = removeHtmlTags(questionHtml);
    const images = extractImages(questionHtml);

    const cleanedText1 = removeHtmlTags(questionHtml1);
    const images1 = extractImages(questionHtml1);
    const removeHtmlTagsForOptions = (html) => {
        if (!html) return "";
        let cleanedHtml = html.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '\n');
        cleanedHtml = cleanedHtml.replace(/<img[^>]*src="[^"]*"[^>]*>/g, '');
        cleanedHtml = cleanedHtml.replace(/&nbsp;/g, " ");

        return cleanedHtml;
    };

    const extractImagesForOptions = (html) => {
        const imageRegex = /<img[^>]+src="([^">]+)"/g;
        let images = [];
        let match;
        while ((match = imageRegex.exec(html)) !== null) {
            images.push(match[1]);
        }
        return images;
    };

    // const MockTestTimer = ({ theme }) => {
    //     const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
    
    //     useEffect(() => {
    //         if (timeLeft <= 0) return;
    
    //         const timer = setInterval(() => {
    //             setTimeLeft(prevTime => prevTime - 1);
    //         }, 1000);
    
    //         return () => clearInterval(timer); // Cleanup interval on unmount
    //     }, [timeLeft]);
    
    //     // Function to format seconds into HH:MM:SS
    //     const formatTime = (seconds) => {
    //         const hrs = Math.floor(seconds / 3600);
    //         const mins = Math.floor((seconds % 3600) / 60);
    //         const secs = seconds % 60;
    //         return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    //     };
    
    //     return (
    //         <View style={{ flexDirection: 'row', marginTop: 10 }}>
    //             <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>EAMCET Mock Test</Text>
    //             <Text style={[styles.mockSubtitle, { color: theme.textColor, marginLeft: 25 }]}>Remaining Time</Text>
    //             <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>{formatTime(timeLeft)}</Text>
    //         </View>
    //     );
    // };
    const QuestionTimer = ({ questionId }) => {
        const [timeElapsed, setTimeElapsed] = useState(120); 
        const colorScheme = useColorScheme();
        const theme = colorScheme === "dark" ? darkTheme : lightTheme;
    
        useEffect(() => {
            const loadTimer = async () => {
                try {
                    const savedStartTime = await AsyncStorage.getItem(`questionStartTime_${questionId}`);
                    if (savedStartTime) {
                        const elapsedTime = Math.floor((Date.now() - parseInt(savedStartTime, 10)) / 1000);
                        setTimeElapsed(Math.max(60 - elapsedTime, 0)); 
                    } else {
                        await AsyncStorage.setItem(`questionStartTime_${questionId}`, Date.now().toString());
                        setTimeElapsed(60); 
                    }
                } catch (error) {
                    console.error('Error loading question timer:', error);
                }
            };
    
            loadTimer(); 
        }, [questionId]); 
    
        useEffect(() => {
            const timer = setInterval(() => {
                setTimeElapsed(prevTime => {
                    if (prevTime <= 0) {
                        clearInterval(timer); 
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
    
            return () => clearInterval(timer);
        }, []);
    
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        };
    
        const resetTimer = async () => {
            await AsyncStorage.setItem(`questionStartTime_${questionId}`, Date.now().toString());
            setTimeElapsed(60); 
        };
    
        return (
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>Question Timer:</Text>
                <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>{formatTime(timeElapsed)}</Text>
            </View>
        );
    };

    return (
        <LinearGradient
            colors={theme.back}
            style={styles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
        >
            <ScrollView style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>EAMCET Mock Test</Text>
                    <Text style={[styles.mockSubtitle, { color: theme.textColor, marginLeft: 25 }]}>Remaining Time</Text>
                    <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>24:60:60</Text>
                </View>

                <View style={{ paddingHorizontal: 20 }}>
                    <LinearGradient
                        colors={theme.mcb1}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.header}
                    >
                        <View style={styles.headerline}>
                            {["Physics", "Chemistry", "Maths"].map((subject) => (
                                <TouchableOpacity key={subject} onPress={() => handleSubjectSelect(subject)}>
                                    <LinearGradient
                                        colors={selectedSubject === subject ? [theme.bg1, theme.bg2] : theme.bmc}
                                        style={[
                                            styles.headerline1,
                                            {
                                                borderWidth: selectedSubject === subject ? 0 : 1,
                                                borderColor: selectedSubject === subject ? theme.textColor1 : theme.textColor,
                                            },
                                        ]}
                                        start={{ x: 0, y: 1 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        <Text style={[styles.headtext, { color: selectedSubject === subject ? theme.textColor1 : theme.textColor }]}>
                                            {subject}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Section A Info */}
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <Text style={[styles.mockSubtitle, { color: theme.textColor, marginRight: 100 }]}>Section A</Text>
                            <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>Total Questions :</Text>
                            <Text style={[styles.mockSubtitle, { color: theme.textColor, marginLeft: -8 }]}>{exams.length}</Text>
                        </View>

                        {/* Number Selection Scroll */}
                        <View style={styles.numberContainer}>
                            <TouchableOpacity onPress={scrollLeft}>
                                <Image
                                    style={[styles.img, { tintColor: theme.textColor, marginRight: 10 }]}
                                    source={require("../images/to.png")}
                                />
                            </TouchableOpacity>

                            <ScrollView
                                horizontal
                                ref={scrollRef}
                                showsHorizontalScrollIndicator={false}
                            >
                                {Array.from({ length: 60 }, (_, i) => i + 1).map((num) => (
                                    <TouchableOpacity key={num} onPress={() => setSelectedNumber(num)}>
                                        <View
                                            style={[
                                                styles.numberCircle,
                                                {
                                                    backgroundColor: num === selectedNumber ? "#04A953" : theme.gray,
                                                },
                                            ]}
                                        >
                                            <Text style={{ color: "#FFF", fontSize: 16 }}>{num}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <TouchableOpacity onPress={scrollRight}>
                                <Image
                                    style={[styles.img, { tintColor: theme.textColor, marginLeft: 10 }]}
                                    source={require("../images/fro.png")}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginTop: 15, flexDirection: 'row', marginBottom: 15 }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.res, { color: theme.textColor }]}>
                                    Not Seen
                                </Text>
                                <Text style={[styles.res, { color: theme.textColor }]}>
                                    45
                                </Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.res, { color: "#04A953" }]}>
                                    Answered
                                </Text>
                                <Text style={[styles.res, { color: "#04A953" }]}>
                                    1
                                </Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.res, { color: "#DE6C00" }]}>
                                    Skipped
                                </Text>
                                <Text style={[styles.res, { color: "#DE6C00" }]}>
                                    1
                                </Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.res, { color: "#36A1F5" }]}>
                                    Review
                                </Text>
                                <Text style={[styles.res, { color: "#36A1F5" }]}>
                                    1
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
                    <LinearGradient
                        colors={theme.mcb1}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.header}
                    >
                        <View style={{ flexDirection: 'row', marginTop: 8 }}>
                            <Svg height="35" width={windowWidth * 0.3}>
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
                                    y="15"
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                >
                                    {selectedNumber && `Question # ${selectedNumber}`}
                                </SvgText>
                            </Svg>
                           <QuestionTimer/>
                            </View>
                        <View>
                            {/* <Text style={[styles.question, { color: theme.textColor }]}>
                                {exams.length > 0 ? removeHtmlTags(exams[selectedNumber - 1]?.compquestion) : "Loading question..."}
                            </Text> */}
                            <RenderContent html={questionHtml1}  />
                            {images.length > 0 && images.map((imageUrl, index) => (
                                <View style={{ backgroundColor: '#FFF' }}>
                                    <Image
                                        key={index}
                                        source={{ uri: imageUrl }}
                                        style={{ height: 70, width: windowWidth * 0.5, resizeMode: 'contain' }}
                                    />
                                </View>
                            ))}
                            <Text style={[styles.question, { color: theme.textColor }]}>
                                {exams.length > 0 ? removeHtmlTags(exams[selectedNumber - 1]?.question) : "Loading question..."}
                            </Text>
                        </View>
                        <View>
                            {["A", "B", "C", "D"].map((option, index) => {
                                const optionText = index === 0 ? exams[selectedNumber - 1]?.option1 :
                                    index === 1 ? exams[selectedNumber - 1]?.option2 :
                                        index === 2 ? exams[selectedNumber - 1]?.option3 :
                                            exams[selectedNumber - 1]?.option4;

                                const cleanedOptionText = removeHtmlTagsForOptions(optionText);

                                const imagesInOption = extractImagesForOptions(optionText);

                                const isImageUrl = imagesInOption.length > 0;

                                const handleImageError = (e) => {
                                    e.target.src = "path/to/default-image.png";
                                };

                                return (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.opt,
                                            { borderColor: theme.textColor, borderRadius: 25 }
                                        ]}
                                        onPress={() => setSelectedOption(option)}
                                    >
                                        <View style={[styles.optbg, { backgroundColor: theme.gray }]}>
                                            <Text style={[styles.option, { color: "#FFF" }]}>
                                                {option}
                                            </Text>
                                        </View>
                                        <View>
                                            {isImageUrl ? (
                                                <View style={{ backgroundColor: '#fff' }}>
                                                    <Image
                                                        source={{ uri: imagesInOption[0] }}
                                                        style={{ width: 80, height: 40, borderRadius: 25, resizeMode: 'contain' }}
                                                        onError={handleImageError}
                                                    />
                                                </View>
                                            ) : (
                                                <Text style={[styles.option, { color: theme.textColor }]}>
                                                    {cleanedOptionText || "Option not available"}
                                                </Text>
                                            )}
                                        </View>

                                        <View
                                            style={[
                                                styles.select,
                                                {
                                                    borderColor: theme.textColor,
                                                    backgroundColor: selectedOption === option ? theme.textColor : "transparent"
                                                }
                                            ]}
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <View style={{ marginTop: 10, width: windowWidth * 0.8, paddingStart: 10 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={[styles.ins, { backgroundColor: theme.textColor1, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }]}>
                                    <Image
                                        style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: theme.textColor }}
                                        source={require("../images/caution.png")}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.ins, { backgroundColor: theme.textColor1, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }]}>
                                    <Image
                                        style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: theme.textColor }}
                                        source={require("../images/tag.png")}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.ins, { backgroundColor: theme.textColor1, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }]}>
                                    <Image
                                        style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: theme.textColor }}
                                        source={require("../images/eye.png")}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: 130, height: 36, borderWidth: 1, borderColor: theme.textColor, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: 15 }}>
                                    <Text style={[styles.ans, { color: theme.textColor, }]}>
                                        Skip Question
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </LinearGradient>

                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity style={{ width: 130, height: 36, borderWidth: 1, borderColor: theme.textColor, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: 15 }}>
                            <Text style={[styles.ans, { color: theme.textColor, fontWeight: '700' }]}>
                                Submit Test
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity >
                            <LinearGradient
                                colors={theme.background}
                                style={{ width: 150, height: 36, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: 15 }} start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={[styles.ans, { color: theme.textColor1, fontWeight: '700' }]}>
                                    Submit Selection
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={{ alignItems: 'flex-start', marginLeft: 15, marginTop: 15 }} onPress={() => navigation.navigate("Instruction")}>
                        <Text style={[styles.ans, { color: theme.textColor, fontWeight: '700', textDecorationLine: "underline" }]}>
                            View Test Rules
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: "center",
        marginTop: 10,
        padding: 10,
        borderRadius: 30,
    },
    headerline: {
        flexDirection: "row",
        marginTop: 10
    },
    headtext: {
        fontSize: 16,
        fontWeight: "700",
        fontFamily: "CustomFont",
    },
    headerline1: {
        width: 100,
        height: 30,
        alignItems: "center",
        borderRadius: 20,
        marginHorizontal: 6,
        justifyContent: 'center'
    },
    mockSubtitle: {
        fontSize: 16,
        fontWeight: "bold",
        paddingStart: 10,
    },
    numberContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
    },
    numberCircle: {
        width: 60,
        height: 36,
        borderRadius: 20,
        marginHorizontal: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    img: {
        height: 20,
        width: 20,
        resizeMode: "contain",
    },
    res: {
        fontWeight: '700',
        fontSize: 16,
        marginLeft: 8,
        marginRight: 8
    },
    question: {
        fontWeight: '400',
        fontSize: 16,
        marginHorizontal: 10,
        lineHeight: 26
    },
    ans: {
        fontWeight: '400',
        fontSize: 16,
    },
    option: {
        fontWeight: '400',
        fontSize: 14,
    },
    optbg: {
        height: 38,
        width: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        marginRight: 10,
    },
    select: {
        height: 16,
        width: 16,
        borderWidth: 1,
        borderRadius: 8,
        position: "absolute",
        right: 15,
    },
    opt: {
        flexDirection: "row",
        width: windowWidth * 0.8,
        marginTop: 8,
        height: 54,
        alignItems: "center",
        paddingStart: 10,
        paddingEnd: 10,
        borderWidth: 0.6,
        position: "relative",
    },
    ins: {
        height: 32,
        width: 32,
        marginLeft: 8,
        marginRight: 8
    },
});