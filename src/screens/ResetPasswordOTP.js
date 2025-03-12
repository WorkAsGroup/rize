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
    TextInput,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { darkTheme, lightTheme } from "../theme/theme";
import { getLoginDetails,reSendOTP,  getOTPSubmittedDetails, getResetPasswordConfirmation } from "../core/CommonService";
import Toast from 'react-native-toast-message';
import OTPTextInput from './OTPTextInput'; 


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function ResetPasswordOTP({ navigation, route }) {
    const mobile = route?.params?.mobile;
    const email = route?.params?.email;  
    const colorScheme = useColorScheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const[errorMsg, setErrorMsg] = useState("")
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;
    const [reSend, setReSend] = useState(false)
    const [studentId, setStudentId ]= useState(route?.params?.studentId);
    const [otp, setOtp] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(1 * 120);
    const [password1, setPassword1] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ password1: "", password: "" });
    const [passwordVisible1, setPasswordVisible1] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const scrollRef = useRef(null);

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
   
    const [isTimerActive, setIsTimerActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const OTP_LENGTH = 6;
    const otpInputRef = useRef(null); 

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const togglePasswordVisibility1 = () => {
        setPasswordVisible1(!passwordVisible1);
    };

    useEffect(() => {
        let timerId;
        if (isTimerActive && timeRemaining > 0) {
            timerId = setTimeout(() => {
                setTimeRemaining(timeRemaining - 1);
            }, 1000);
        } else if (timeRemaining === 0) {
            setIsTimerActive(false);
            setReSend(true)
            // showToast("OTP Expired. Please request a new OTP.", "error");
        }

        return () => clearTimeout(timerId);
    }, [timeRemaining, isTimerActive]);

useEffect(() => {
if(route?.params?.exist===true){
    handleResendOTP();
}
},[route?.params?.exist])

const handleSubmitOTP = async () => {
    setLoading(true);
    setErrorMsg("");
    let isValid = true;
    let newErrors = {};

    if (!password) {
        newErrors.password = "Password is required";
        isValid = false;
    } else if (password.length < 8) {  
        newErrors.password = "Password must be at least 8 characters";
        isValid = false;
    }


    if (!password1) {
        newErrors.password1 = "Confirm Password is required";
        isValid = false;
    } else if (password1 !== password) {
        newErrors.password1 = "Passwords do not match";
        isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
        setLoading(false);
        return; 
    }

    if (password === password1) {  
        try {
            const data = {
                confirmPassword: password,
                password:password,
                student_user_id: studentId,
            };
    
            const response = await getResetPasswordConfirmation(data);
            console.log("OTP Verification API Response:", response);
    
            if (response.statusCode === 200) {
                showToast("OTP verified successfully!", "success");
    
                if (response.data && response.data.email_verified === 1) {
                    if (route.params?.onChangeAuth) { 
                        route.params.onChangeAuth(response.data.token); 
                    }
    
                     navigation.navigate("Login");
                } else {
                    // navigation.navigate("AccountCreated", { 
                    //     mobile: mobile,
                    //     studentId: response.data?.student_user_id || studentId,
                    //     data: response.data,
                    // });
                    navigation.navigate("Login");

                }
            } else {
                let errorMessage = "OTP verification failed. Please try again.";
                if (response.data && response.data.message) {
                    errorMessage = response.data.message;
                } else if (typeof response.data === 'string') {
                    errorMessage = response.data;
                }
                // setErrorMsg(errorMessage);
                showToast(errorMessage, "error");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            showToast("An error occurred while verifying OTP. Please check your internet connection and try again.", "error");
        } finally {
            setLoading(false);
        }
    }
};

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleUpdateInfo = () => {
        navigation.goBack();
    };

    const showToast = (message, type = "default") => {
        Toast.show({
            type: type,
            text1: message,
            position: 'top',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
        });
    };

    const resend =async() => {

        let fields = {};
        if (/^[6-9]{1}[0-9]{9}$/.test(mobile)) { 
            fields = {
                "mobile": mobile,
                "email": "",
            };
        } else {
            fields = {
                "mobile": "", 
                "email": mobile, 
            };
        }

        try {
            const res = await reSendOTP(fields);
            if (res && res.data && res.data.student_user_id) {
                setStudentId(res.data.student_user_id);
                showToast("OTP resent successfully!", "success"); 
            } else {
                showToast("Failed to resend OTP. Please try again.", "error");
            }

        } catch (error) { 
            console.error("Error resending OTP:", error);
            showToast("An error occurred while resending OTP. Please check your internet connection.", "error");
        }
    }
    const handleResendOTP = () => {
        setErrorMsg("")
        setReSend(false);
        setTimeRemaining(1*120);
        setIsTimerActive(true);
        resend();
        if (otpInputRef.current) {
            otpInputRef.current.clear();
        }
        setOtp("");
    }

    return (
        <LinearGradient
            colors={theme.background}
            style={styles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
        >
            <View contentContainerStyle={styles.scrollContainer}>
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
                    <View style={{ top: -200, padding: 20,width:windowWidth*0.9 }}>
                        <Text style={[styles.welcomeText, { color: theme.wb }]}>
                            Reset Password !
                        </Text>
                        

                     

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
                                secureTextEntry={!passwordVisible}  
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
                                    tintColor={theme.gray}  
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                        
                        <View style={[styles.passwordContainer, { borderColor: errors.password1 ? theme.red : theme.inputBorder }]}>
                            <TextInput
                                style={[
                                    styles.passwordInput,
                                    {
                                        color: "#000",
                                    },
                                ]}
                                placeholder="Password"
                                placeholderTextColor={theme.gray}
                                secureTextEntry={!passwordVisible1} 
                                value={password1}
                                onChangeText={(text) => {
                                    setPassword1(text);
                                    if (errors.password1) {
                                        setErrors((prevErrors) => ({ ...prevErrors, password1: null }));
                                    }
                                }}
                            />
                            <TouchableOpacity onPress={togglePasswordVisibility1} style={styles.eyeIconContainer}>
                                <Image
                                    source={passwordVisible1 ? require('../images/eye_open.png') : require('../images/eye_close.png')}
                                    style={styles.eyeIcon}
                                    tintColor={theme.gray}  
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password1 ? <Text style={styles.errorText}>{errors.password1}</Text> : null}
                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                { backgroundColor: theme.buttonBackground },
                            ]}
                            onPress={handleSubmitOTP}
                            disabled={loading}
                        >
                            <Text
                                style={[
                                    styles.submitButtonText,
                                    { color: theme.textColor1 },
                                ]}
                            >
                                Reset
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={[styles.newHereText, { color: theme.wb }]}>
                                    Already have an account?
                                </Text>
                                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                    <Text style={[styles.signUpText, { color: theme.accentText }]}>
                                        {" "} Login
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <Text
                                style={[
                                    styles.accessText,
                                    { color: theme.wb, alignSelf: "flex-start", marginLeft: 20 },
                                ]}
                            >
                                Login to access:
                            </Text>
                            <View style={{ justifyContent: "flex-end", height: 50 }}>
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
                                                { color: theme.accentText, backgroundColor: theme.textbgcolor, height: 35 },
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
        marginBottom: 10,
        textAlign: "center",
    },
    instructionsText: {
        fontSize: 16,
        textAlign: "center",
    },

    timerText: {
        fontSize: 16,
        textAlign: 'center',
    },
    submitButton: {
        borderRadius: 30,
        paddingVertical: 8,
        alignItems: "center",
        marginBottom: 15,
        marginHorizontal: 10,
        marginTop:20,
        height: 40,
    },
    resendButton: {
        borderRadius: 30,
        paddingVertical: 4,
        alignItems: "center",
        marginBottom: 15,
        marginHorizontal: 10,
        height: 30,
    },
    submitButtonText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    actionButton: {
        borderRadius: 30,
        paddingVertical: 8,
        alignItems: "center",
        marginBottom: 15,
        marginHorizontal: 10,
        height: 40,
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
    signUpText: {
        fontWeight: "bold",
    },
    footer: {
        alignItems: "center",
        marginTop: 20,
    },
    newHereText: {
        fontSize: 14,
    },
});