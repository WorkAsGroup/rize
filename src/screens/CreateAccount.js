import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    useColorScheme,
    Dimensions,
    Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { darkTheme, lightTheme } from "../theme/theme";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function CreateAccount() {
    const colorScheme = useColorScheme();
    const [check, setCheck] = useState(false);
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;

    const scrollRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const accessOptions = [
        "Personalized dashboard",
        "Track your progress",
        "Conquer competitive exams",
        "Access exclusive resources",
        "Personalised Dashboard"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            scrollRef.current?.scrollTo({
                x: (currentIndex + 1) % accessOptions.length * 200,
                animated: true,
            });
            setCurrentIndex((prev) => (prev + 1) % accessOptions.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [currentIndex, accessOptions.length]);

    return (
        <LinearGradient
            colors={theme.background}
            style={styles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={styles.scrollContainer}>
                <View style={styles.header}>
                    <Image
                        style={[styles.logo, { tintColor: theme.textColor1 }]}
                        source={require("../images/title.png")}
                    />
                    <Text style={[styles.tagline, { color: theme.textColor1 }]}>
                        Your path to success starts here!
                    </Text>
                </View>


                <View style={[styles.formContainer, { backgroundColor: "transparent"  }]}>
                    <View style={{ top: 80, padding: 20 }}>
                        <Text style={[styles.welcomeText, { color: theme.textColor }]}>
                            Uh Oh! No account found with the
                        </Text>
                        <Text style={[styles.welcomeText, { color: theme.textColor }]}>
                            email / phone number.
                        </Text>
                        <Text style={[styles.welcomeText, { color: theme.textColor }]}>
                            Try Again or Create Account
                        </Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity>
                                <LinearGradient
                                    colors={theme.background1}
                                    style={styles.loginButton}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Text style={[styles.loginButtonText, { color: theme.textColor1 }]}>
                                        Try Again
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <LinearGradient
                                    colors={theme.background1}
                                    style={styles.loginButton}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Text style={[styles.loginButtonText, { color: theme.textColor1 }]}>
                                        Create Account
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Text style={[styles.forgotPasswordText, { color: theme.accentText }]}>
                                    Forgot password?
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            {/* Footer Fixed at Bottom */}
            <View style={styles.footer}>
                <Text style={[styles.newHereText, { color: theme.textColor }]}>
                    New here?{" "}
                    <Text style={[styles.signUpText, { color: theme.accentText }]}>
                        Sign Up
                    </Text>
                </Text>
                <Text style={[styles.accessText, { color: theme.textColor }]}>
                    Login to access:{" "}
                </Text>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.accessOptions}
                >
                    {accessOptions.map((option, index) => (
                        <Text
                            key={index}
                            style={[
                                styles.accessOption,
                                {
                                    color: theme.accentText,
                                    backgroundColor: theme.textbgcolor,
                                },
                            ]}
                        >
                            {option}
                        </Text>
                    ))}
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
        flexGrow: 1,
    },
    header: {
        alignItems: "center",
        marginTop: 100,
    },
    logo: {
        width: 250,
        height: 50,
        resizeMode: "contain",
    },
    tagline: {
        fontSize: 12,
    },
    formContainer: {
        width: windowWidth,
        backgroundColor: "#4f9deb",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 100, // Ensure space for footer
    },
    welcomeText: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    buttonContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        marginTop: 30,
    },
    loginButton: {
        borderRadius: 30,
        paddingVertical: 8,
        alignItems: "center",
        marginBottom: 15,
        width: "80%",
        height: 40,
    },
    loginButtonText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    forgotPasswordText: {
        fontSize: 12,
        marginTop: 5,
    },
    footer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.05)", 
        paddingVertical: 15,
        alignItems: "center",
    },
    newHereText: {
        fontSize: 14,
    },
    signUpText: {
        fontWeight: "bold",
    },
    accessText: {
        fontSize: 14,
        marginTop: 10,
    },
    accessOptions: {
        flexDirection: "row",
        marginTop: 10,
    },
    accessOption: {
        padding: 10,
        borderRadius: 5,
        textAlign: "center",
        fontSize: 12,
        marginHorizontal: 5,
    },
});