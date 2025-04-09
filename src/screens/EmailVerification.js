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
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function EmailVerification({navigation,route}) {
  const colorScheme = useColorScheme();
  const [check, setCheck] = useState(false);
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const token = route?.params?.token;
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const accessOptions = [
    "Personalized dashboard",
    "Track your progress",
    "Conquer competitive exams",
    "Access exclusive resources",
    "Personalised Dashboard"
  ];

 

  const handleSkip = () => {
    if (route.params?.onChangeAuth ) {
        route.params.onChangeAuth(token);
    } else {
      console.warn("onChangeAuth function not provided in navigation params.");
    //  navigation.navigate('Dashboard'); 
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
          <View style={{ top: -180,padding:20 }}>
          <Text style={[ { color: theme.wb,fontSize:20,marginBottom:10 ,textAlign: "center",fontWeight:'700'}]}>
                            Add Email
                        </Text>

                      
            <Text style={[styles.welcomeText, { color: theme.white }]}>
             Please provide your email ID to recover your
            </Text>
            <Text style={[styles.welcomeText, { color: theme.white }]}>
             account in case you lose access to your phone
            </Text>
            <Text style={[styles.welcomeText, { color: theme.white }]}>
            number and to receive results over email.
            </Text>
            <TextInput
                            style={[
                                styles.input,
                                {
                                    borderColor: theme.inputBorder,
                                    backgroundColor: "#fff",
                                    borderWidth:  0,
                                    color: "#000",
                                    marginTop:20
                                },
                            ]}
                            placeholder="Email ID"
                            placeholderTextColor={theme.gray}
                            // value={email}
                            // onChangeText={(text) => {
                            //     setEmail(text);
                            //     // if (errors.email) {
                            //     //     setErrors((prevErrors) => ({ ...prevErrors, email: null }));
                            //     // }
                            // }}
                        />
            <TouchableOpacity
                            style={[
                                styles.loginButton,
                                { backgroundColor: theme.buttonBackground },
                            ]}

                        >
                            <Text
                               style={[
                                    styles.loginButtonText,
                                    { color: theme.textColor1 },
                                ]}
                            >
                                SUBMIT
                            </Text>
                        </TouchableOpacity>

         <View style={{justifyContent:'center',alignItems:'center',marginBottom:120,marginTop:30}}>
         <TouchableOpacity style={{flexDirection:'row'}} onPress={handleSkip}>
         <Text style={[styles.welcomeText, { color: theme.white,textDecorationLine: "underline",fontSize:18,top:-3,left:-3 }]}>
                Skip
            </Text>
         <Text style={[styles.welcomeText, { color: theme.white }]}>
            and proceed to dashboard
            </Text>
         </TouchableOpacity>
      
         </View>
          

            {/* Footer Section */}
            <View style={styles.footer}>
            <View style={{flexDirection:'row'}}>
                <Text
                style={[styles.newHereText, { color: theme.white }]}
              >
                New here? 
              </Text>
              <TouchableOpacity onPress={()=>{
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
                Login to access:
              </Text>
              <View style={{justifyContent:'flex-end',height:50}}>
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
                        height:35
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
    fontSize: 15,
    fontWeight: "300",
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