import React, { useState, useRef } from "react";
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

const windowWidth = Dimensions.get("window").width;

export default function MockTest({ navigation }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;

    const [selectedSubject, setSelectedSubject] = useState("Physics");
    const [selectedNumber, setSelectedNumber] = useState(1);
    const scrollRef = useRef(null);

    const handleSubjectSelect = (subject) => {
        setSelectedSubject(subject);
    };

    // Scroll Left (Previous)
    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ x: (selectedNumber - 2) * 50, animated: true });
            if (selectedNumber > 1) setSelectedNumber(selectedNumber - 1);
        }
    };

    // Scroll Right (Next)
    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ x: selectedNumber * 50, animated: true });
            if (selectedNumber < 60) setSelectedNumber(selectedNumber + 1);
        }
    };

    return (
        <LinearGradient
            colors={theme.back}
            style={styles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={{ flex: 1 }}>
                {/* Mock Test Info */}
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>EAMCET Mock Test</Text>
                    <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>Remaining Time</Text>
                    <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>24:60:60</Text>
                </View>

                {/* Subject Selection */}
                <View style={{ paddingHorizontal: 20 }}>
                    <View style={[styles.header, { backgroundColor: theme.bmc1 }]}>
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
                            <Text style={[styles.mockSubtitle, { color: theme.textColor, marginRight: 60 }]}>Section A</Text>
                            <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>Total Questions :</Text>
                            <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>60</Text>
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
                                                    backgroundColor: num === selectedNumber ? "#04A953" : "gray",
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

                        <View style={{marginTop:15,flexDirection:'row',marginBottom:15}}>
                            <View style={{alignItems:'center'}}>
                                <Text style={[styles.res,{color:theme.textColor}]}>
                                    Not Seen
                                </Text>
                                <Text style={[styles.res,{color:theme.textColor}]}>
                                    45
                                </Text>
                            </View>
                            <View style={{alignItems:'center'}}>
                                <Text style={[styles.res,{color:"#04A953"}]}>
                                    Answered
                                </Text>
                                <Text style={[styles.res,{color:"#04A953"}]}>
                                    1
                                </Text>
                            </View>
                            <View style={{alignItems:'center'}}>
                                <Text style={[styles.res,{color:"#DE6C00"}]}>
                                    Skipped
                                </Text>
                                <Text style={[styles.res,{color:"#DE6C00"}]}>
                                    1
                                </Text>
                            </View>
                            <View style={{alignItems:'center'}}>
                                <Text style={[styles.res,{color:"#36A1F5"}]}>
                                   Review
                                </Text>
                                <Text style={[styles.res,{color:"#36A1F5"}]}>
                                    1
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ paddingHorizontal: 20 }}>
                    <View style={[styles.header, { backgroundColor: theme.bmc1 }]}>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Svg height="50" width={windowWidth * 0.8}>
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
                                        x="180"
                                        y="20"
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                    >
                                        Question # 1
                                    </SvgText>
                                </Svg>                    <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>Question Timer:</Text>
                    <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>00:00:01</Text>
                </View>                   
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
    header: {
        alignItems: "center",
        marginTop: 20,
        padding: 10,
        borderRadius: 30,
    },
    headerline: {
        flexDirection: "row",
        marginTop:15
    },
    headtext: {
        fontSize: 16,
        fontWeight: "700",
        fontFamily: "CustomFont",
    },
    headerline1: {
        width: 100,
        padding: 10,
        alignItems: "center",
        borderRadius: 20,
        marginHorizontal: 6,
    },
    mockSubtitle: {
        fontSize: 18,
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
    res:{
        fontWeight:'700',
        fontSize:16,
        marginLeft:8,
        marginRight:8
    },
});