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
import Svg, { Path } from "react-native-svg";
import { darkTheme, lightTheme } from "../theme/theme";
import { getLoginDetails,reSendOTP,  getOTPSubmittedDetails } from "../core/CommonService";
import Toast from 'react-native-toast-message';
import OTPTextInput from './OTPTextInput'; 


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function ResetLink({ navigation, route }) {
    const colorScheme = useColorScheme();
    const[errorMsg, setErrorMsg] = useState("")
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;
    const mobile = route?.params?.mobile;
    const email = route?.params?.email;
    const [reSend, setReSend] = useState(false)
    const [studentId, setStudentId ]= useState(route?.params?.studentId);
    const [otp, setOtp] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(1 * 120);
    const [isTimerActive, setIsTimerActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const OTP_LENGTH = 6;
    const otpInputRef = useRef(null); 

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
    if (!otp || otp.length !== OTP_LENGTH) {
        showToast(`Please enter a ${OTP_LENGTH}-digit OTP !!`, "error");
        return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
        const data = {
            student_user_id: studentId,
            otp: otp,
        };

        const response = await getOTPSubmittedDetails(data);
        console.log("OTP Verification API Response:", response);

        if (response.statusCode === 200) {
            showToast("OTP verified successfully!", "success");

            const updatedStudentId = response.data?.student_user_id || studentId; 

                navigation.navigate("ResetPasswordOTP", { 
                    mobile: mobile,
                    email: email,
                    studentId: updatedStudentId,
                    data: response.data,
                });
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
                    <View style={{ top: -200, padding: 20 }}>
                        <Text style={[styles.welcomeText, { color: theme.wb }]}>
                            Welcome {mobile}!
                        </Text>
                        <Text style={[styles.instructionsText, { color: theme.wb, paddingBottom: 20 }]}>
                            If you need to update any information, click the button below.
                        </Text>
                        <TouchableOpacity
                            style={[styles.actionButton, { borderColor: theme.wb, padding: 10, }]}
                            onPress={handleUpdateInfo}
                            disabled={loading}
                        >
                            <Text style={[styles.instructionsText, { color: theme.wb, fontWeight: 600 }]}>
                                Update Information
                            </Text>
                        </TouchableOpacity>

                        {/* Custom OTP Input */}
                        <OTPTextInput
                            length={OTP_LENGTH}
                            onOTPEntered={(otpValue) => setOtp(otpValue)}
                            theme={theme}
                            ref={otpInputRef}
                        />
                       {errorMsg!==""&&<Text style={{color: "red"}}>{errorMsg}*</Text>}
                        {reSend===true ? 
                        <TouchableOpacity 
                        style={[
                            styles.resendButton,
                            { backgroundColor: theme.buttonBackground },{width: 120}, {padding: 5}
                        ]}
                        onPress={handleResendOTP}>
                             <Text
                                style={[
                                    styles.submitButtonText,
                                    { color: theme.textColor1 },
                                ]}
                            >
                                Resend OTP
                            </Text>
                        </TouchableOpacity>: <Text style={[styles.timerText, { color: theme.wb, paddingTop: 20, marginBottom: 10 }]}>
                            Time Remaining: {formatTime(timeRemaining)}
                        </Text>
                    }

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
                                {loading ? "Verifying..." : "Submit OTP"}
                            </Text>
                        </TouchableOpacity>
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
    }
});