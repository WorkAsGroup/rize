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
  Alert,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { darkTheme, lightTheme } from "../theme/theme";
import { getUpdatedEmail } from "../core/CommonService";
import Toast from 'react-native-toast-message'; 
import { ImageBackground } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function AccountCreated({ navigation, route }) {
  // console.log(route?.params, "route")
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const mobile = route?.params?.mobile;
  const studentId = route?.params?.studentId;
  const data= route?.params?.from == "signUp" ? route?.params?.data : route?.params
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState(""); 
  const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
  const accessOptions = [
    "Personalized dashboard",
    "Track your progress",
    "Conquer competitive exams",
    "Access exclusive resources",
    "Personalised Dashboard"
  ];

    const validate = () => {
        let valid = true;
        let errors = {};

        if (!email.trim()) {
            errors.email = "Email is required";
            valid = false;
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            errors.email = "Enter valid email";
            valid = false;
        }

        setErrors(errors);
        return valid;
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

// console.log(data, "data")
const submitEmail = async () => {
  if(validate()){
      setLoading(true);
      try {
          const data = {
              "student_user_id": studentId,
              "mobile": mobile,
              "email": email
          };

          const response = await getUpdatedEmail(data);
          console.log("Response:", response);

          if (parseInt(response?.statusCode) == 409) { 
            showToast(response?.message || "something went wrong !")
            setLoading(false);
            return;
          }
          if (response.statusCode == 200) {
            navigation.navigate("OTPScreen", { 
                mobile:  response.data?.mobile, 
                email: response.data?.email,
                studentId: response?.data?.student_user_id,
                from: "verification", 
            });
          }
          setLoading(false);

          if (response.statusCode === 200) {
            const tkn = data?.token;
            route.params.onChangeAuth(tkn);
              showToast("Email updated successfully!", "success");
              setTimeout(() => {
                navigation.navigate("DashboardContent");
            },1000)
          } else {
              let errorMessage = "Failed to update email. Please try again.";
              if (response.data && response.data.message) {
                  errorMessage = response.data.message;
              }
              showToast(errorMessage, "error");
          }
      } catch (error) {
          console.error("Error updating email:", error);
          setLoading(false);
          showToast("An error occurred while updating email. Please check your internet connection and try again.", "error");
      }
  }
};

const showToast = (message, type = "info") => {
  Toast.show({
      type: type,
      text1: type === "success" ? "Success" : type === "error" ? "Error" : "Info",
      text2: message,
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
  });
};

  const skipEmail = () => {
    const tkn = data?.token;
    // Alert.alert(data);
    if(tkn){
      console.log(tkn, route.params, "cheking")
      route.params.onChangeAuth(tkn);
      console.log(tkn, "eerigneroin")
      // navigation.navigate("DashboardContent");
    }
     
  };

  

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
            { backgroundColor: "transparent" },
          ]}
        >
          <View style={{ top: 40, padding: 20 }}>
        
            <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ color: "#ffffff", textAlign: 'center',paddingStart:20,paddingEnd:20 }}>
                Please provide your email ID to recover your
                account in case you lose access to your phone
                number and to receive results over email.
              </Text>
            </View>

            <TextInput
              style={[
                styles.input,
                {
                  borderColor: errors.email ? theme.red : '#e614e1',
                  backgroundColor: "transparent",
                  color:"#ffffff"
                },
              ]}
              placeholder="Email ID"
              placeholderTextColor="#ffffff"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                      setErrors((prevErrors) => ({ ...prevErrors, email: null }));
                  }
              }}
            />
              {errors.email && <Text style={[styles.errorText, { color: theme.red }]}>{errors.email}</Text>}


            <TouchableOpacity
             
              onPress={submitEmail}
              disabled={loading}
            >
                    <LinearGradient
               style={[
                styles.loginButton,
               
              ]}
                     
              
              colors={["#e614e1", "#8b51fe"]}

              >
              <Text
                style={[
                  styles.loginButtonText,
                  { color: "#ffffff" },
                ]}
              >
                {loading ? "Submitting..." : "Submit"}
              </Text>
              </LinearGradient>
            </TouchableOpacity>


            {/* Footer Section */}
            <View style={styles.footer}>
            
                     <View style={{justifyContent:'center',alignItems:'center',marginBottom:10,marginTop:30}}>
                     <TouchableOpacity style={{flexDirection:'row'}} onPress={skipEmail}>
                     <Text style={[styles.skipText, { color: theme.white,textDecorationLine: "underline",fontSize:18,top:-3,left:-3 }]}>
                            Skip
                        </Text>
                     <Text style={[styles.skipText, { color: theme.white }]}>
                        and proceed to dashboard
                        </Text>
                     </TouchableOpacity>
                  
                     </View>
              <Text
                style={[
                  styles.accessText,
                  {
                    color: "#ffffff",
                    alignSelf: "flex-start",
                    marginLeft: 20,
                  
                  },
                ]}
              >
                Login to access:{" "}
              </Text>
              <View style={{ justifyContent: 'flex-end', height: 50,  }}>
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
  skipText: {
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
    errorText: {
        fontSize: 12,
        marginLeft: 10,
        marginBottom: 5,
    },

});