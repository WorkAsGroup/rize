import React, { useState, useEffect, useCallback } from "react";
import {
  NavigationContainer,
  useNavigationState,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import {
  View,
  StyleSheet,
  Image,
  useColorScheme,
  BackHandler,
  Alert,
} from "react-native";
import { darkTheme, lightTheme } from "./src/theme/theme";
import Notifications from "./src/screens/Notifications";
import NotificationDetails from "./src/screens/NotificationDetails";
import Login from "./src/screens/Login";
import Signup from "./src/screens/Signup";
import AccountCreated from "./src/screens/AccountCreated";
import ResetPassword from "./src/screens/ResetPassword";
import ResetLink from "./src/screens/ResetLink";
import CreateAccount from "./src/screens/CreateAccount";
import Intro from "./src/screens/Intro";
import Form from "./src/screens/Form";
import OTPScreen from "./src/screens/OTPScreen";
import DashboardDrawer from "./src/screens/DashboardDrawer";
import Instruction from "./src/screens/Instruction";
import MockTest from "./src/screens/MockTest";
import Instruct from "./src/screens/Instruct";
import EmailVerification from "./src/screens/EmailVerification";
import { Provider } from "react-redux";
import store from "./src/store/store";
import DeviceInfo, { getUniqueId } from "react-native-device-info";
import ResultMainComponent from "./src/screens/ResultsMainConponent";
import InstructionAuth from "./src/screens/InstructionAuth";
import StartExam from "./src/screens/StartExam";
import PerformanceAnalasys from "./src/screens/PerformanceAnalasys";
import ResetPasswordOTP from "./src/screens/ResetPasswordOTP";
import usePushNotification from "./android/app/PushNotifications";
import { addNotificationToken, getAutoLogin } from "./src/core/CommonService";
import { Linking } from "react-native";
import { navigationRef } from "./src/common/NavigationService";
import InternetStatusBar from "./src/common/NetworkConnection";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";
import ForceUpdateScreen from "./src/common/ForceUpdateScreen";
// import useNotificationHandler from "./src/common/HandleNotification";

const Stack = createStackNavigator();

const AuthNavigator = ({ onChangeAuth }) => {
  const { routes, index } = useNavigationState((state) => ({
    routes: state?.routes,
    index: state?.index,
  }));

  const handleBackPress = useCallback(() => {
    const prevRoute = routes[index - 1];

    if (prevRoute?.name === "StartExam") {
      // Block back press if previous screen is StartExam
      return true;
    }

    // Allow back press in other cases
    return false;
  }, [routes, index]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );
    return () => backHandler.remove();
  }, [handleBackPress]);

  return (
    <Provider store={store}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Intro" component={Intro} />
        <Stack.Screen
          name="Login"
          component={Login}
          initialParams={{ onChangeAuth: onChangeAuth }}
        />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen
          name="OTPScreen"
          component={OTPScreen}
          initialParams={{ onChangeAuth: onChangeAuth }}
        />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="ResetLink" component={ResetLink} />
        <Stack.Screen
          name="AccountCreated"
          component={AccountCreated}
          initialParams={{ onChangeAuth: onChangeAuth }}
        />
        <Stack.Screen name="Instruction" component={Instruction} />
        <Stack.Screen name="Instruct" component={Instruct} />
        <Stack.Screen name="MockTest" component={MockTest} />
        <Stack.Screen name="Form" component={Form} />
        <Stack.Screen name="EmailVerification" component={EmailVerification} />
        <Stack.Screen name="ResetPasswordOTP" component={ResetPasswordOTP} />
      </Stack.Navigator>
    </Provider>
  );
};

const AppNavigator = ({ onChangeAuth }) => (
  <Provider store={store}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardContent">
        {(props) => (
          <DashboardDrawer
            {...props}
            route={{ params: { onChangeAuth: onChangeAuth } }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="resultsPage">
        {(props) => (
          <ResultMainComponent
            {...props}
            route={{ params: { onChangeAuth: onChangeAuth } }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="PerformanceAnalasys"
        component={PerformanceAnalasys}
        initialParams={{ onChangeAuth }}
      />

      <Stack.Screen name="InstructionAuth" component={InstructionAuth} />
      <Stack.Screen name="StartExam" component={StartExam} />

      <Stack.Screen
        name="NotificationDetials"
        component={NotificationDetails}
      />
      <Stack.Screen name="Notifications" component={Notifications} />
    </Stack.Navigator>
  </Provider>
);

const SplashScreen = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  return (
    <View style={[splashStyles.container, { backgroundColor: theme.black }]}>
      <Image
        style={[splashStyles.logo]}
        source={require("./src/images/logo.png")}
      />
    </View>
  );
};

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 250,
    width: 200,
    resizeMode: "contain",
  },
});

export default function App() {
  const [authToken, setAuthToken] = useState(null);
  const [isAppReady, setIsAppReady] = useState(false);
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState("");
  const [forceUpdate, setForceUpdate] = useState(false);
  const handleAuthChange = useCallback(async (token) => {
    try {
      if (token) {
        await AsyncStorage.setItem("authToken", token);
      } else {
        await AsyncStorage.removeItem("authToken");
      }
      setAuthToken(token);
    } catch (e) {
      console.log("Error during auth change:", e);
    } finally {
    }
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isConnected = state.isConnected && state.isInternetReachable;

      if (!isConnected) {
        Toast.show({
          type: "error",
          text1: "No Internet Connection",
          position: "top",
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 50,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const addFCMToken = async () => {
    try {
      const fcmToken = await AsyncStorage.getItem("fcmToken");
      const userDataString = await AsyncStorage.getItem("userdata");
      const userData = userDataString ? JSON.parse(userDataString) : null;
      const userId = userData?.student_user_id; // ✅ ensure this line exists
      const uniqueId = await getUniqueId();

      console.log("FCM:", fcmToken, "UserID:", userId, "DeviceID:", uniqueId);

      if (fcmToken && userId && uniqueId) {
        const fields = {
          student_user_id: userId,
          notification_token: fcmToken,
          device_id: uniqueId,
        };

        const response = await addNotificationToken(fields);
        console.log("Token Response:", response);
        // Alert.alert("Success", JSON.stringify(fields));
      } else {
        console.warn("Missing one or more required values", {
          fcmToken,
          userId,
          uniqueId,
        });
      }
    } catch (err) {
      console.error("Error in addFCMToken:", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const fcmToken = await AsyncStorage.getItem("fcmToken");
      const userDataString = await AsyncStorage.getItem("userdata");
      if (fcmToken && userDataString) {
        clearInterval(interval);
        addFCMToken();
      }
    }, 5000); // check every second

    return () => clearInterval(interval);
  }, []);

  const {
    requestUserPermission,
    getFCMToken,
    listenToForegroundNotifications,
    listenToBackgroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();

  useEffect(() => {
    requestUserPermission();
    getFCMToken();
    listenToForegroundNotifications();
    listenToBackgroundNotifications();
    onNotificationOpenedAppFromBackground();

    const timeout = setTimeout(() => {
      if (navigationRef.isReady()) {
        onNotificationOpenedAppFromQuit(); // ✅ now navigation is ready
      }
    }, 500); // slight delay ensures navigation is ready

    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        console.log("Token retrieved:", token);

        if (token) {
          setAuthToken(token);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsAppReady(true);
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
    getUserId();
  }, []);
  const getUserId = async () => {
    const response = await getAutoLogin();
    console.log("auto-login-", response);

    if (!response?.data) {
      console.warn("No user data received from API");
      return; // Early exit if no data
    }
    console.log(response.data, "response");
    const { name: nm, student_user_id: id, examsData } = response.data;

    setUserId(id);
    // setInstituteId(data?.institute_id)
    setUserData(response.data);
  };

  console.log(userData, "userData");

  const isVersionOlder = (current, latest) => {
    const curr = current.split(".").map(Number);
    const api = latest.split(".").map(Number);
    for (let i = 0; i < Math.max(curr.length, api.length); i++) {
      const a = curr[i] || 0;
      const b = api[i] || 0;
      if (a < b) return true;
      if (a > b) return false;
    }
    return false;
  };

  useEffect(() => {
    if (userId) {
      checkAppVersion(userId);
    }
  }, []);

  const checkAppVersion = async (userId) => {
    console.log("call ayyaaaa");
    try {
      const response = await fetch(
        "https://mocktestapi.rizee.in/api/v1/general/app-version",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_user_id: userId }),
        }
      );
      const data = await response.json();

      const currentVersion = DeviceInfo.getVersion(); // e.g. '1.2'
      console.log(currentVersion, data?.data, "dataedwd");
      if (
        isVersionOlder(currentVersion, data?.data?.[0]?.latest_version || "0.0")
      ) {
        // Prompt user to update
        setForceUpdate(true);
      } else {
        // Optionally update backend with current version
        try {
          const res = await fetch(
            "https://mocktestapi.rizee.in/api/v1/general/update-app-version",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                student_user_id: userId,
                app_version: currentVersion,
              }),
            }
          );

          const json = await res.json(); // Convert the response to JSON
          console.log("📦 Update app version response:", json); // Log the full response
        } catch (error) {
          console.error("❌ Failed to update app version:", error);
        }
      }
    } catch (error) {
      console.error("Version check failed", error);
    }
  };

  if (forceUpdate) {
    return <ForceUpdateScreen />;
  }
  return (
    <NavigationContainer ref={navigationRef}>
      <Toast />
      {isAppReady ? (
        authToken ? (
          <AppNavigator
            onChangeAuth={handleAuthChange}
            initialRouteName={"DashboardContent"}
          />
        ) : (
          <AuthNavigator onChangeAuth={handleAuthChange} />
        )
      ) : (
        <SplashScreen />
      )}
    </NavigationContainer>
  );
}
