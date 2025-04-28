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
    ImageBackground,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { darkTheme, lightTheme } from "../theme/theme";
import Toast from 'react-native-toast-message';
import { getResetDetails } from "../core/CommonService";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function ResetPassword({ navigation }) {
    const colorScheme = useColorScheme();
    const [check, setCheck] = useState(false);
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;
    const [inputText, setInputText] = useState("");
    const [isMobile, setIsMobile] = useState(false);

    const scrollRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const accessOptions = [
        "Personalized dashboard",
        "Track your progress",
        "Conquer competitive exams",
        "Access exclusive resources",
        "Personalised Dashboard"
    ];

    const isValidInput = (text) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/; 
        return {
            isEmail: emailRegex.test(text),
            isPhone: phoneRegex.test(text),
            isValid: emailRegex.test(text) || phoneRegex.test(text),
        };
    };


    const showToast = (message) => {
        Toast.show({
          type: 'info',
          text1: message,
          position: 'top',
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
        });
      };

    const Reset = async () => {

        const validationResult = isValidInput(inputText);

        if (!validationResult.isValid) {
            showToast("Invalid Input");
            return;
        }

        const data = {
            mobile: validationResult.isPhone ? inputText : null,
            email: validationResult.isEmail ? inputText : null,
        };

        try {
            const response = await getResetDetails(data);
            console.log("Reset API Response:", response);

            if (response?.statusCode === 200) {
                navigation.navigate("ResetLink", {
                    mobile: data.mobile, 
                    email: data.email,  
                    studentId: response?.data?.student_user_id,
                });
                showToast("OTP sent successfully");
            } else if (response?.statusCode === 404) {
                showToast("User not found."); 
            } else {
                let errorMessage = "Reset failed. Please try again.";
                if (response?.message) {
                    errorMessage = response.message;
                } else if (response?.data && typeof response.data === 'string') {
                    errorMessage = response.data;
                } else if (response?.data && response?.data?.message) {
                    errorMessage = response.data.message;
                } else {
                    errorMessage = "An unexpected error occurred.";
                }

                console.error("Reset API Error:", response);
                showToast(errorMessage);
            }

        } catch (error) {
            console.error("Error during Reset:", error);
            let errorMessage = "Could not connect to server. Please check your internet connection."; 
             if (error.response) { 
                if (error.response?.data && error.response?.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response?.data && typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.status === 404) {
                   errorMessage = "User not found."; 
                }
             } else if (error.message) {
                  errorMessage = error.message;  
             }
            
            showToast(errorMessage);
        }
    };


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
           <ImageBackground
            source={require("../images/commonBack.jpg")}  // Or a URI: { uri: 'https://...' }
            style={{ width: '100%', height: '100%',}}
            // imageStyle={{ }}  // optional: for rounded corners
          >
            <View contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Image
                        style={[styles.logo,]}
                        source={require("../images/logo.png")}
                    />
                   <Text style={[styles.tagline, { color: "#ffffff" }]}>
                  <Text style={{ fontWeight: 'bold',fontSize: 25, color: '#e614e1' }}>Unlock</Text> the Gateway to{" "}
                  
                </Text>
                <Text style={[styles.tagline, { color: "#e614e1", marginLeft: 120, marginTop: 5 }]}>
                                     Better Learning !{" "}
                                    </Text>
                </View>


                <View
                    style={[
                        styles.formContainer,
                        { backgroundColor: 'transparent',  },
                    ]}
                >
                    <View style={{ top: 10, padding: 20 }}>
                        <Text style={[styles.welcomeText, { color: theme.white }]}>
                            Reset Password
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                { color: "#ffffff" ,marginTop:20},
                            ]}
                            placeholder="Email / Phone Number"
                            placeholderTextColor="#ffffff"
                            value={inputText}
                            onChangeText={text => setInputText(text)}
                            keyboardType="email-address" 
                            borderColor ="#e614e1"

                        />

                        <TouchableOpacity
                            
                            onPress={Reset}
                        >
                                 <LinearGradient
                         colors={["#e614e1", "#8b51fe"]}
                        style={[
                            styles.loginButton,
                          
                        ]}
                        >
                            <Text
                                style={[
                                    styles.loginButtonText,
                                    { color: theme.buttonText },
                                ]}
                            >
                                Reset Password
                            </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    
                        {/* Footer Section */}
                        <View style={styles.footer}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text
                                    style={[styles.newHereText, { color: theme.white }]}
                                >
                                    New User ? {" "}
                                </Text>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate("Signup")
                                }}>
                                    <Text
                                        style={[
                                            styles.signUpText,
                                            { color: theme.accentText, },
                                        ]}
                                    >
                                        Sign Up
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <Text
                                style={[
                                    styles.accessText,
                                    {
                                        color: theme.white,
                                        alignSelf: "flex-start",
                                        marginLeft: 20,
                                    },
                                ]}
                            >
                                Login to access:{" "}
                            </Text>
                            <View style={{ justifyContent: 'flex-end', height: 50 }}>
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
                                                    height: 35
                                                },
                                            ]}
                                        >
                                            {option}
                                        </Text>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </View>
                <Toast  />
            </View>
           
            </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        justifyContent: "center",
    },
    header: {
        alignItems: "center",
        marginTop: 100,
        height: windowHeight / 10,
    },
    logo: {
        width: 250,
        height: 150,
        resizeMode: "contain",
    },
    tagline: {
        fontSize: 12,
        marginTop: 0,
    },
    formContainer: {
        width: windowWidth,
        height: windowHeight / 1 / 1,
        backgroundColor: "#4f9deb",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        top: -90,
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        fontSize: 14,
        marginHorizontal: 10,
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        marginHorizontal: 10,
    },
    checkboxText: {
        fontSize: 12,
    },
    loginButton: {
        borderRadius: 30,
        paddingVertical: 15,
        alignItems: "center",
        marginBottom: 15,
        marginHorizontal: 10,
    },
    loginButtonText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    forgotPasswordText: {
        textAlign: "right",
        fontSize: 14,
        marginHorizontal: 10,
    },
    footer: {
        alignItems: "center",
        marginTop: 20,
    },
    newHereText: {
        fontSize: 14,
    },
    signUpText: {
        fontWeight: "bold",
    },
    accessText: {
        fontSize: 14,
        marginTop: 20,
    },
    accessOptions: {
        flexDirection: "row",
        marginTop: 10,
    },
    accessOption: {
        backgroundColor: "transparent",
        padding: 10,
        borderRadius: 5,
        textAlign: "center",
        fontSize: 12,
        marginHorizontal: 10,

    },

});