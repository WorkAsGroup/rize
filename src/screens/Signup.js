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
import { getSignUpDetails } from "../core/CommonService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message'; 
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
	webClientId: "212625122753-o36nkar4vhepdof16e7ge3gmuaed2kio.apps.googleusercontent.com",
});

const GoogleLogin = async () => {
	await GoogleSignin.hasPlayServices();
	const userInfo = await GoogleSignin.signIn();
	return userInfo;
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Signup({ navigation }) {
    const colorScheme = useColorScheme();
    const [check, setCheck] = useState(false);
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;

    const scrollRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false); 
    const [mobileOrEmail,setMobileOrEmail] = useState("mobile");
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const [email, setEmail] = useState("");

    const handleMobileEmailToggle = () => {
        setMobileOrEmail(mobileOrEmail === "mobile" ? "email" : "mobile");
        if (mobileOrEmail === "mobile") {
            setMobile("");
        } else {
            setEmail("");
        }
    };


    const handleGoogleLogin = async () => {
		setLoading(true);
		try {
			const response = await GoogleLogin();
			const { idToken, user } = response;

			if (idToken) {
				const resp = await authAPI.validateToken({
					token: idToken,
					email: user.email,
				});
				await handlePostLoginData(resp.data);
			}
		} catch (apiError) {
			setError(
				apiError?.response?.data?.error?.message || 'Something went wrong'
			);
		} finally {
			setLoading(false);
		}
	};

    const validate = () => {
        let isValid = true;
        let errors = {};
    
        if (!name.trim()) {
            errors.name = "Name is required";
            isValid = false;
        }
    
        if (mobileOrEmail === "mobile") {
            if (!mobile.trim()) {
                errors.mobile = "Mobile number is required";
                isValid = false;
            } else if (!/^[6-9]{1}[0-9]{9}$/.test(mobile)) {
                errors.mobile = "Invalid mobile number";
                isValid = false;
            }
        } else { 
            if (!email.trim()) {
                errors.email = "Email is required";
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { // Basic email validation
                errors.email = "Invalid email address";
                isValid = false;
            }
        }
    
    
    
        if (!password.trim()) {
            errors.password = "Password is required";
            isValid = false;
        } else if (password.length < 8) {
            errors.password = "Password must be at least 8 characters";
            isValid = false;
        }

        if (Object.keys(errors).length === 0 && !name.trim() && !mobile.trim() && !email.trim() && !password.trim()) {
            showToastError("Please enter your signup details.");
            isValid = false;
        }
    
        return { isValid, errors }; 
    };

    const handleSignup = async () => {
        let mobileValue = mobile;
        let emailValue = email;

        if (mobileOrEmail === "email") {
            mobileValue = "";
        } else {
            emailValue = "";
        }
        const { isValid, errors } = validate();

        if (!isValid) {
            showToastError(Object.values(errors).join('\n'));
            return; 
        }
        if (!check) {
            showToast("Please agree to the privacy policy and terms of service.")
            return;
        }

        const data = {
            name: name,
            mobile: mobileValue,
            email: emailValue,
            password: password,
        };
    
    
        try {
           

            const response = await getSignUpDetails(data);
            console.log("Signup API Response:", response.statusCode);
    
            if (response.statusCode === 201) {
                navigation.navigate("OTPScreen", { 
                    mobile: mobileValue || emailValue, 
                    studentId: response?.data?.student_user_id,
                    from: "signUp",
                });
                showToast("OTP Sent Successfully");
            } else if (response.statusCode === 409) {
                const existingUserIdentifier = mobileValue ? mobileValue: emailValue;
    
                // navigation.navigate("OTPScreen", { 
                //     mobile: existingUserIdentifier, 
                //     studentId: response?.data?.student_user_id 
                // });
                showToast("User already exists.");
    
            } else {
                let errorMessage = "Signup failed. Please try again.";
                if (response.data && response.data.message) {
                    errorMessage = response.data.message;
                } else if (typeof response.data === 'string') {
                    errorMessage = response.data;
                }
                showToastError(errorMessage);
            }
        } catch (error) {
            console.error("Signup API Error:", error); 
            showToastError("Something went wrong. Please try again later."); 
        }
    
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
            <View contentContainerStyle={styles.scrollContainer}>
                            <TouchableOpacity onPress={() => { navigation.navigate("Intro") }}>
                                                            <Image
                                                                style={{ height: 36, width: 36, margin: 15,marginBottom: -10,justifyContent: 'flex-start' }}
                                                                source={require("../images/back.png")}
                                                            />
                                                        </TouchableOpacity>
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
                            Hi, Let's get started!
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                {
                                    borderColor: errors.name ? theme.red : theme.inputBorder,
                                    backgroundColor: "#fff",
                                    borderWidth: errors.password ? 1 : 0,
                                    color: "#000"

                                },
                            ]}
                            placeholder="Name"
                            placeholderTextColor={theme.gray}
                            value={name}
                            onChangeText={(text) => {
                                // const filteredText = text.replace(/[^A-Za-z\s]/g, "");
                                setName(text);
                                if (errors.name) {
                                    setErrors((prevErrors) => ({ ...prevErrors, name: null }));
                                }
                            }}
                        />
                        {errors.name && <Text style={[styles.errorText, { color: theme.red }]}>{errors.name}</Text>}

                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            {mobileOrEmail === "mobile" ? (
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            borderColor: errors.mobile ? theme.red : theme.inputBorder,
                                            backgroundColor: "#fff",
                                            borderWidth: errors.mobile ? 1 : 0,
                                            color: "#000",
                                            flex: 1, // Take up remaining space
                                        },
                                    ]}
                                    placeholder="Mobile"
                                    placeholderTextColor={theme.gray}
                                    keyboardType="number-pad"
                                    maxLength={10}
                                    value={mobile}
                                    onChangeText={(text) => {
                                        const filteredText = text.replace(/[^0-9]/g, "");
                                        setMobile(filteredText);
                                        if (errors.mobile) {
                                            setErrors((prevErrors) => ({ ...prevErrors, mobile: null }));
                                        }
                                    }}
                                />

                            ) : (
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            borderColor: errors.email ? theme.red : theme.inputBorder,
                                            backgroundColor: "#fff",
                                            borderWidth: errors.email ? 1 : 0,
                                            color: "#000",
                                            flex: 1,
                                        },
                                    ]}
                                    placeholder="Email"
                                    placeholderTextColor={theme.gray}
                                    keyboardType="email-address"
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        if (errors.email) {
                                            setErrors((prevErrors) => ({ ...prevErrors, email: null }));
                                        }
                                    }}
                                />
                            )}

                         
                        </View>
                        {errors.mobile && <Text style={[styles.errorText, { color: theme.red }]}>{errors.mobile}</Text>}
                        {errors.email && <Text style={[styles.errorText, { color: theme.red }]}>{errors.email}</Text>}

                        <View style={[styles.passwordContainer, { borderColor: errors.password ? theme.red : theme.inputBorder }]}>
                            <TextInput
                                style={[
                                    styles.passwordInput,
                                    {
                                        color: "#000",
                                    },
                                ]}
                                placeholder="New Password"
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
                        {errors.password && <Text style={[styles.errorText, { color: theme.red }]}>{errors.password}</Text>}

                        <View style={styles.checkboxContainer}>
                            <TouchableOpacity onPress={() => setCheck(!check)}>
                                <Image
                                    style={{
                                        tintColor: check ? "#fff" : "#000",
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

                        <TouchableOpacity
                            style={[styles.loginButton, { backgroundColor: theme.buttonBackground }]}
                            onPress={handleSignup}
                        >
                            <Text style={[styles.loginButtonText, { color: theme.textColor1 }]}>
                                Sign Up
                            </Text>
                        </TouchableOpacity>

                        <View style={{display:"flex", flexDirection: "row",justifyContent:'center',alignItems:'center'}}>
                        
                        <TouchableOpacity onPress={handleGoogleLogin}>
                                <Image
                        style={{ height:30,width:30 }}
                        source={require("../images/google.png")}
                    />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                onPress={handleMobileEmailToggle} 
                                style={{marginLeft:20,left:10}}
                                >
                                    <Image
                                     style={[styles.logo1, { tintColor: "#fff" }]}
                                     source={mobileOrEmail === "mobile" ? require("../images/email.png") : require("../images/phone.png")}/>
                            </TouchableOpacity>
                        </View>

                        {/* Footer Section */}
                        <View style={styles.footer}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={[styles.newHereText, { color: theme.wb }]}>
                                    Already have an account?{" "}
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
    logo1: {
        width: 30,
        height: 30,
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
    errorText: {
        fontSize: 12,
        marginLeft: 10,
        marginBottom: 5,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        marginHorizontal: 10,
        backgroundColor: '#fff',
        paddingRight: 10,
      },
    passwordInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        fontSize: 14,
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
        tintColor:'#8e8e8e'
    },
 
    toggleButtonText: {
        fontSize: 12,
        color: "#000"
    },
});