//src/screens/Login.js

import React, { useState, useRef, useEffect, useCallback } from "react";
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
    Alert,
    BackHandler,
    ActivityIndicator
} from "react-native";
import Toast from 'react-native-toast-message'; 
import LinearGradient from "react-native-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { darkTheme, lightTheme } from "../theme/theme";
import { getLoginDetails } from "../core/CommonService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from "axios";

GoogleSignin.configure({
    webClientId: '657776415952-0upum9rpsfnslfmfuldlnr6r208e92fu.apps.googleusercontent.com', // must match the "web" client ID in Firebase
    offlineAccess: false,
  });
  



export default function Login({ route }) {
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
    const colorScheme = useColorScheme();
    const [check, setCheck] = useState(false);
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;

    const scrollRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);

    };
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                BackHandler.exitApp();
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );
 
    const showToastError = (message) => {
        Toast.show({
          type: 'error',
          text1: message,
          position: 'top',
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
          bottomOffset: 40,
        });
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
    const accessOptions = [
        "Personalized dashboard",
        "Track your progress",
        "Conquer competitive exams",
        "Access exclusive resources",
        "Personalised Dashboard"
    ];

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [passwordVisible, setPasswordVisible] = useState(false);
   

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const validateFields = () => {
        let valid = true;

        if (!email && !password) { 
            showToastError("Please enter your login details.");
            valid = false;
            return valid;
        }

       
        if (!email) {
            showToastError("Enter your email or phone number");
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/^[0-9]{10}$/.test(email)) {
            showToastError("Enter a valid email or phone number");
            valid = false;
        }

        if (!password) {
            showToastError("Enter your password");
            valid = false;
        } else if (password.length < 6) {
            showToastError("Password must be at least 6 characters");
            valid = false;
        }

        return valid;
    };

    const handleLogin = async () => {
        
        const data = {
            [validateEmailOrPhone(email) ? "email" : "mobile"]: email,
            password: password
        };

        if(route.params.exam){
            const examValue = JSON.stringify(route.params.exam);
            await AsyncStorage.setItem("exam", examValue);
        }

        if (validateFields()) {

            if (!check) {
                showToast("Please agree to the privacy policy and terms of service.")
                return;
            }
            const response = await getLoginDetails(data);
            console.log("Response", response);

            if(response.statusCode == 200||response.statusCode == 403){
                if(response.data.email_verified == 1){
                    const tkn = response.data.token;
                    route.params.onChangeAuth(tkn);
                    navigation.navigate("DashboardContent"); 
                } else {
                   if(response?.data?.token) {
                    
                navigation.navigate("AccountCreated", {
                    token: response.data.token,
                    onChangeAuth: route.params.onChangeAuth,
                    exam: route.params.exam,
                    from: "login",
                    studentId: response.data.student_user_id
                });
                   } else {
                    navigation.navigate("OTPScreen", { 
                        mobile:email, 
                        studentId: response?.data?.student_user_id,
                        from: "signUp",
                    });
                   }
            }
            } else if(response.statusCode == 404){
                showToastError("User not found.");
            }else if(response.statusCode == 401){
                showToastError(response.message);
            } else {
                // showToast("Uh Oh! No account found with the email / phone number.")
                showToastError("Uh Oh! No account found.");
                toggleModal();
                // showToastError("Login failed. Please check your credentials.");
                        }

        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
      
          const payload = {
            idToken: userInfo.idToken,
            email: userInfo.user.email,
            name: userInfo.user.name,
          };
      
          const response = await axios.post("https://mocktestapi.rizee.in/api/v1/auth/google-auth", payload);
      
          if (response.data.success) {
            // Store token globally (e.g., in AsyncStorage or context)
            // Avoid passing functions through navigation
            navigation.navigate("DashboardContent");
          } else {
            showToastError("Google Login failed");
          }
      
        } catch (error) {
          console.error("Google Sign-In Error:", error);
          showToastError("Google Sign-In failed");
        } finally {
          setLoading(false);
        }
      };
    

    const validateEmailOrPhone = (input) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        return emailRegex.test(input);
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
        <LinearGradient
            colors={theme.background}
            style={styles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
        >
            <View contentContainerStyle={styles.scrollContainer}>
            <TouchableOpacity onPress={() => { navigation.navigate("Intro") }}>
                                            <Image
                                                style={{ height: 36, width: 36, margin: 15,marginBottom: -10,justifyContent: 'flex-start' }}
                                                source={require("../images/back.png")}
                                            />
                                        </TouchableOpacity>
            <Modal isVisible={isModalVisible}
                   onBackdropPress={toggleModal} 
                   onSwipeComplete={toggleModal}
                   swipeDirection={['up', 'down']}
                   style={styles.modal}>
                <View style={[styles.modalContent,{backgroundColor:theme.textColor1}]}>
                    <Text style={[styles.modalTitle,{color:theme.textColor}]}>Account Not Found</Text>
                    <Text style={[styles.modalMessage,{color:theme.textColor}]}>No account found with this email / phone number</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={[styles.modalButton,{backgroundColor:theme.buttonBackground,marginLeft:10}]} onPress={toggleModal}>
                            <Text style={[styles.modalButtonText,{color:theme.textColor1}]}>Try Again</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton,{backgroundColor:theme.buttonBackground,marginLeft:10}]} onPress={() => {
                            toggleModal();
                            navigation.navigate("Signup");
                        }}>
                            <Text style={[styles.modalButtonText,{color:theme.textColor1}]}>Create Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
                <View style={styles.header}>
                    
                    <Image
                        style={[styles.logo, { tintColor: theme.textColor1 }]}
                        source={require("../images/title.png")}
                    />
                    <Text style={[styles.tagline, { color: theme.textColor1 }]}>
                        Your path to success starts here!
                    </Text>
                </View>

                <Svg height="180" width="100%" viewBox="145 140 320 320">
                    <Path fill={theme.path} d="M 80 300 c 150 -180 690 -180 830 0" />
                </Svg>

                <View
                    style={[
                        styles.formContainer,
                        { backgroundColor: theme.path },
                    ]}
                >
                    <View style={{ top: -180, padding: 20 }}>
                        <Text style={[styles.welcomeText, { color: theme.wb }]}>
                            Welcome back!
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                {
                                    borderColor: errors.email ? theme.red : theme.inputBorder,
                                    backgroundColor: "#fff",
                                    borderWidth: errors.email ? 1 : 0,
                                    color: "#000",
                                },
                            ]}
                            placeholder="Email / Phone Number"
                            placeholderTextColor={theme.gray}
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (errors.email) {
                                    setErrors((prevErrors) => ({ ...prevErrors, email: null }));
                                }
                            }}
                        />
                        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                        <View style={[styles.passwordContainer, { borderColor: errors.password ? theme.red : theme.inputBorder }]}>
                            <TextInput
                                style={[
                                    styles.passwordInput,
                                    {
                                        color: "#000",
                                    },
                                ]}
                                placeholder="Password"
                                placeholderTextColor={theme.gray}
                                secureTextEntry={!passwordVisible}  // Toggle secureTextEntry
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    if (errors.password) {
                                        setErrors((prevErrors) => ({ ...prevErrors, password: null }));
                                    }
                                }}
                            />
                            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
                                <Image
                                    source={passwordVisible ? require('../images/eye_open.png') : require('../images/eye_close.png')}
                                    style={styles.eyeIcon}
                                    tintColor={theme.gray}  // Option if you want to tint the image
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                        {/* Checkbox */}
                        <View style={styles.checkboxContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    setCheck(!check);
                                }}
                            >
                                <Image
                                    style={{
                                        tintColor: check ? theme.green : "#fff",
                                        marginRight: 5,
                                        height:25,
                                        width:25,
                                    }}
                                    source={require("../images/check_box.png")}
                                />
                            </TouchableOpacity>

                            <Text style={[styles.checkboxText, { color: theme.wb }]}>
                                I have read and agree to the privacy policy, terms of service
                            </Text>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={[
                                styles.loginButton,
                                { backgroundColor: theme.buttonBackground },
                            ]}
                            onPress={handleLogin}
                        >
                            <Text
                               style={[
                                    styles.loginButtonText,
                                    { color: theme.textColor1 },
                                ]}
                            >
                                Login
                            </Text>
                        </TouchableOpacity>

                        {/* Forgot Password Link */}
                        <TouchableOpacity onPress={() => {
                            navigation.navigate("ResetPassword")
                        }}>
                            <Text
                                style={[
                                    styles.forgotPasswordText,
                                    { color: theme.accentText },
                                ]}
                            >
                                Forgot password?
                            </Text>
                        </TouchableOpacity>
                        <View style={{justifyContent:'center',alignItems:'center'}}>
                        <TouchableOpacity onPress={handleGoogleLogin} disabled={loading}>
                                {loading ? (
                                    <ActivityIndicator size="small" color={theme.textColor1} /> 
                                ) : (
                                    <Image
                                        style={{ height: 30, width: 30 }}
                                        source={require("../images/google.png")}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>

                      

                        {/* Footer Section */}
                        <View style={styles.footer}>
                            <View style={{ flexDirection: 'row' }}>
                             
                                <Text
                                    style={[styles.newHereText, { color: theme.wb }]}
                                >
                                    New here?{" "}
                                </Text>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate("Signup")
                                }}>
                                    <Text
                                        style={[
                                            styles.signUpText,
                                            { color: theme.accentText },
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
                                        color: theme.wb,
                                        alignSelf: "flex-start",
                                        marginLeft: 20,
                                    },
                                ]}
                            >
                                Login to access:
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
                </View>
                <Toast ref={(ref) => Toast.setRef(ref)} />

        </LinearGradient>
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
        height: 50,
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
        marginBottom: 10,
        paddingHorizontal: 10,
        fontSize: 14,
        marginHorizontal: 10,
        marginVertical: 8,
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
        paddingVertical: 8,
        alignItems: "center",
        marginBottom: 15,
        marginHorizontal: 10,
        height: 40,
    },
    loginButtonText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    forgotPasswordText: {
        textAlign: "right",
        fontSize: 14,
        marginHorizontal: 10,
        marginBottom: 20,
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
    errorText: {
        fontSize: 12,
        marginLeft: 10,
        marginBottom: 5,
        color: 'red'
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        marginHorizontal: 10,
        marginVertical: 8,
        backgroundColor: '#fff',
        paddingRight: 10,
        borderColor: '#8e8e8e', 
    },
    passwordInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        fontSize: 14,
        color: '#000',
    },
    eyeIconContainer: {
        padding: 5,
        height: 40,
    },
    eyeIcon: {
        width: 20,
        height: 20,
        marginTop:4,
        resizeMode: 'contain',
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        paddingHorizontal:20,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around', 
    },
    modalButton: {
        backgroundColor: '#2196F3', 
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 15,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight:"500"
    },
});