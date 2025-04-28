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
    ImageBackground,
    ActivityIndicator
} from "react-native";
import Toast from 'react-native-toast-message'; 
import { getUniqueId } from 'react-native-device-info';
import LinearGradient from "react-native-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { darkTheme, lightTheme } from "../theme/theme";
import { addAnalytics, getLoginDetails } from "../core/CommonService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from "axios";
import { globalAnalyticsThunk } from "../store/thunks/questionsThunk";
import { useDispatch, useSelector } from "react-redux";


GoogleSignin.configure({
    webClientId: '657776415952-0upum9rpsfnslfmfuldlnr6r208e92fu.apps.googleusercontent.com', // must match the "web" client ID in Firebase
    offlineAccess: false,
  });
  



export default function Login({ route }) {
    const dispatch = useDispatch();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
    const colorScheme = useColorScheme();
    const [check, setCheck] = useState(true);
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
   const uniqueId = useSelector((state) => state.header.deviceId);


  

    const handleAnalytics = async () => {
        console.log("hey Um called")
        try {
            // Define your params correctly
            const params = {
                "student_user_exam_id": 0,
                "type": 0,
                "source": 0,
                "testonic_page_id": 2,
            };
    
            console.log(uniqueId,  "payloaddlscknl");
    
            // Create payload
            const payload = {
                ...params,
                ip_address: uniqueId ? uniqueId: "",
                location: "Hyderabad", // Ensure location is correctly handled (but you should pass the location data properly here)
            };
    
            console.log(payload, "payload");
    
            // Send analytics request
            const response = await addAnalytics(payload); // Assuming addAnalytics is an API call function
            console.log("Analytics Response:", response);
    
        } catch (error) {
            // Handle errors gracefully
            const errorMessage = error.response?.data?.message || error.message;
            dispatch(setError(errorMessage)); // Assuming setError is a Redux action
            console.error("Error:", errorMessage);
        }
    };


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
            setLoading(true);
            const response = await getLoginDetails(data);
            console.log("Response", response);
          

            if(response.statusCode == 200||response.statusCode == 403){
             
                if(response.data.email_verified == 1){
                    await handleAnalytics();
                    const tkn = response.data.token;
                    setLoading(false);
                    route.params.onChangeAuth(tkn);
                    navigation.navigate("DashboardContent"); 
                } else {
                   if(response?.data?.token) {
                    await handleAnalytics();
                    setLoading(false);
                navigation.navigate("AccountCreated", {
                    token: response.data.token,
                    onChangeAuth: route.params.onChangeAuth,
                    exam: route.params.exam,
                    from: "login",
                    studentId: response.data.student_user_id
                });
                   } else {
                    setLoading(false);
                    navigation.navigate("OTPScreen", { 
                        mobile:email, 
                        studentId: response?.data?.student_user_id,
                        from: "signUp",
                    });
                   }
            }
            } else if(response.statusCode == 404){
                setLoading(false);
                showToastError("User not found.");
            }else if(response.statusCode == 401){
                setLoading(false);
                showToastError(response.message);
            } else {
                // showToast("Uh Oh! No account found with the email / phone number.")
                setLoading(false);
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
        <ImageBackground
        source={require("../images/commonBack.jpg")}  // Or a URI: { uri: 'https://...' }
        style={{ width: '100%', height: '100%',}}
        // imageStyle={{ }}  // optional: for rounded corners
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
                        { backgroundColor: "transparent", top: 100 },
                    ]}
                >
                    <View style={{ top: -180, padding: 20 }}>
                       

                        <TextInput
                            style={[
                                styles.input,
                                {
                                    borderColor: "#e614e1",
                                    backgroundColor: "transparent",
                                    borderWidth: errors.email ? 1 : 1,
                                    color: "#ffffff",
                                },
                            ]}
                            placeholder="Email / Phone Number"
                            placeholderTextColor="#ffffff"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (errors.email) {
                                    setErrors((prevErrors) => ({ ...prevErrors, email: null }));
                                }
                            }}
                        />
                        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                        <View style={[styles.passwordContainer, { borderColor: errors.password ? theme.red : "#e614e1" }]}>
                            <TextInput
                                style={[
                                    styles.passwordInput,
                                    {
                                        color: "#ffffff", 
                                    },
                                ]}
                                placeholder="Password"
                               placeholderTextColor="#ffffff"
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
                                    tintColor="#ffffff"  // Option if you want to tint the image
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

                            <Text style={[styles.checkboxText, { color: "#ffffff"}]}>
                                I have read and agree to the privacy policy, terms and service {" "}
                            </Text>
                        </View>

                        {/* Login Button */}
      
                        <TouchableOpacity
                           
                            onPress={!loading&&handleLogin}
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
                                    { color: theme.textColor1 },
                                ]}
                            >
                                {loading ? <View style={{display:"flex", flexDirection: "row", alignItems: "center"}}>
                                    <Text  style={[
                                   
                                    { color: theme.textColor1 },
                                ]}>Login...</Text>
                                 <ActivityIndicator size="small" color={theme.textColor1} /> 
                                </View>: "Login "}
                            </Text>
                         
                            </LinearGradient>
                        </TouchableOpacity>
                      
                        {/* Forgot Password Link */}
                        <TouchableOpacity onPress={() => {
                            navigation.navigate("ResetPassword")
                        }}>
                            <Text
                                style={[
                                    styles.forgotPasswordText,
                                    { color: "#ffffff" },
                                ]}
                            >
                                Forgot password?
                            </Text>
                        </TouchableOpacity>
                        {/* <View style={{justifyContent:'center',alignItems:'center'}}>
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
                        </View> */}

                      

                        {/* Footer Section */}
                        <View style={styles.footer}>
                            <View style={{ flexDirection: 'row' }}>
                             
                                <Text
                                    style={[styles.newHereText, {  color: "#ffffff"  }]}
                                >
                                    New user ?{"    "}
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
        fontSize: 11,
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
        backgroundColor: 'transparent',
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