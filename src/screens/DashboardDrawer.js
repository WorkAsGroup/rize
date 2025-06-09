import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
  Alert,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import DashboardContent from "./DashboardContent";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "../theme/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Intro from "./Intro";
import Achivements from "./dashboardItems/Achivements";
import PerformanceAnalasys from "./PerformanceAnalasys";
import { useDispatch } from "react-redux";
import { setSelectedExam } from "../store/slices/headerSlice";
import Notifications from "./Notifications";
import ScheduleExams from "./ScheduleExams";
import { getAutoLogin, getNotificationHistory } from "../core/CommonService";
import DeviceInfo from "react-native-device-info";
import { Linking } from "react-native";
import Header from "../common/Header";
import ForceUpdateScreen from "../common/ForceUpdateScreen";

const Drawer = createDrawerNavigator();

const Settings = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Settings</Text>
  </View>
);

const CustomDrawerContent = (props) => {
  const colorScheme = useColorScheme();
  // const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const theme = darkTheme;
  const [instituteId, setInstituteId] = useState(0);
  const notificationCount = useSelector((state) => state.notifications.count);
  const [userData, setUserData] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const currentRouteName = route?.name;
  const activeRoute = props.state.routes[props.state.index].name;
  const scheduleRoute = useSelector((state) => state.user.activeTab);

  const uId = useSelector((state) => state.header.studentUid);
  useEffect(() => {
    getInstituteId();
  }, []);

  const getInstituteId = async () => {
    const response = await getAutoLogin();
    const data = await AsyncStorage.getItem("userdata");

    if (
      response?.data?.institute_id !== 0 &&
      response?.data?.institute_id !== null &&
      response?.data?.institute_id !== undefined
    ) {
      setInstituteId(response?.data?.institute_id);
    }
  };

  console.log(activeRoute, "currentRouteName");
  const getIconSource = (routeName) => {
    switch (routeName) {
      case "Dashboard":
        return require("../images/man.png");
      case "MockTests":
        return require("../images/test.png");
      case "Performance":
        return require("../images/performance-metrics.png");
      case "Achivements":
        return require("../images/star-badge.png");
      case "Notifications":
        return require("../images/notificationIcon.png");
      case "ScheduleExams":
        return require("../images/test.png");
      case "Settings":
        return require("../images/settings.png");
      default:
        return null;
    }
  };

  const handleNavigation = (routeName) => {
    props.navigation.navigate(routeName);
    props.navigation.closeDrawer();
  };

  useEffect(() => {
    if (scheduleRoute === "ScheduleExams") {
      handleNavigation("ScheduleExams");
    }
  }, [scheduleRoute]);
  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: theme.textbgcolor }}
    >
      <View style={[styles.drawerHeader]}>
        <Image
          source={require("../images/logo.png")}
          style={{
            height: 100,
            width: 160,
            resizeMode: "contain",
            marginLeft: 10,
          }}
        />
        <Text
          style={{
            color: "#fff",
            textDecorationLine: "underline",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          {userData?.name}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.drawerItem,
          activeRoute == "Dashboard" ? styles.selectedDrawerItem : "",
        ]}
        onPress={() => handleNavigation("Dashboard")}
      >
        <Image
          source={getIconSource("Dashboard")}
          style={[styles.drawerIcon, { tintColor: theme.textColor }]}
        />
        <Text style={[styles.drawerItemText, { color: theme.textColor }]}>
          Test Zone
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.drawerItem,
          activeRoute === "PerformanceAnalasys" && styles.selectedDrawerItem,
        ]}
        onPress={() => handleNavigation("PerformanceAnalasys")}
      >
        <Image
          source={getIconSource("Performance")}
          style={[styles.drawerIcon, { tintColor: theme.textColor }]}
        />
        <Text style={[styles.drawerItemText, { color: theme.textColor }]}>
          Performance Analysis
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.drawerItem,
          activeRoute === "Achivements" && styles.selectedDrawerItem,
        ]}
        onPress={() => handleNavigation("Achivements")}
      >
        <Image
          source={getIconSource("Achivements")}
          style={[styles.drawerIcon, { tintColor: theme.textColor }]}
        />
        <Text style={[styles.drawerItemText, { color: theme.textColor }]}>
          Achivements
        </Text>
      </TouchableOpacity>
      {instituteId && instituteId !== null && instituteId !== 0 && (
        <TouchableOpacity
          style={[
            styles.drawerItem,
            activeRoute === "ScheduleExams" && styles.selectedDrawerItem,
          ]}
          onPress={() => handleNavigation("ScheduleExams")}
        >
          <Image
            source={getIconSource("ScheduleExams")}
            style={[styles.drawerIcon, { tintColor: theme.textColor }]}
          />
          <Text style={[styles.drawerItemText, { color: theme.textColor }]}>
            Schedule Exams
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[
          styles.drawerItem,
          activeRoute === "Notifications" && styles.selectedDrawerItem,
        ]}
        onPress={() => handleNavigation("Notifications")}
      >
        <View style={{ position: "relative" }}>
          <Image
            source={getIconSource("Notifications")}
            style={[styles.drawerIcon, { tintColor: theme.textColor }]}
          />
          {notificationCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.drawerItemText, { color: theme.textColor }]}>
          Notifications
        </Text>
      </TouchableOpacity>

      {/* ✅ LOGOUT BUTTON */}
      <TouchableOpacity
        onPress={props.onLogout}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: 20,
          marginTop: 20,
        }}
      >
        <Image
          source={require("../images/logout.png")}
          style={[
            styles.icon,
            { tintColor: theme.textColor, width: 22, height: 22 },
          ]}
        />
        <Text style={[styles.drawerItemText, { color: theme.textColor }]}>
          Logout
        </Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const DashboardDrawer = ({ route }) => {
  console.log(route, "route");
  const { onChangeAuth } = route?.params;
  const selectedExam = useSelector((state) => state.header.selectedExam);
  const [forceUpdate, setForceUpdate] = useState(false);
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const activeRoute = useSelector((state) => state.user.activeTab);
  const navigation = useNavigation();
  const [instituteId, setInstituteId] = useState(0);
  const theme = darkTheme;
  const [addExam, setAddExam] = useState(false);
  const [studentExamId, setStudentExamId] = useState(selectedExam);
  const uId = useSelector((state) => state.header.studentUid);
  const [userId, setUserId] = useState();
  const [userData, setUserData] = useState("");
  const [allowedRoutes, setAllowedRoutes] = useState([
    "Dashboard",
    "PerformanceAnalasys",
    "Achivements",
    "Notifications",
    "ScheduleExams",
  ]);
  useEffect(() => {
    getInstituteId();
  }, []);
  const getInstituteId = async () => {
    const response = await getAutoLogin();
    const data = await AsyncStorage.getItem("userdata");
    console.log(response?.data, "userDatawede");
    if (
      (response?.data?.institute_id !== 0 &&
        response?.data?.institute_id !== null &&
        response?.data?.institute_id !== undefined) ||
      (data?.institute_id !== 0 &&
        data?.institute_id !== null &&
        data?.institute_id !== undefined)
    ) {
      setAllowedRoutes((prev) => [...prev, "ScheduleExams"]);
    } else {
      setAllowedRoutes([
        "Dashboard",
        "PerformanceAnalasys",
        "Achivements",
        "Notifications",
      ]);
    }
    setUserId(response?.data?.student_user_id || data?.student_user_id);
    setInstituteId(response?.data?.institute_id || data?.institute_id);
    setUserData(response?.data || data);
  };

  const isVersionOlder = (current, latest) => {
    const currParts = current.split(".").map(Number);
    const latestParts = latest.split(".").map(Number);

    const length = Math.max(currParts.length, latestParts.length);

    for (let i = 0; i < length; i++) {
      const curr = currParts[i] || 0;
      const latestVal = latestParts[i] || 0;

      if (curr < latestVal) return true;
      if (curr > latestVal) return false;
    }

    return false; // versions are equal
  };

  useEffect(() => {
    if (userId) {
      checkAppVersion(userId);
    }
  }, [userData, userId, navigation]);

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
  console.log(allowedRoutes, "allowedRoutes");
  // ✅ FIXED LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await dispatch(setSelectedExam(null));
      await AsyncStorage.removeItem("userdata");
      onChangeAuth(null);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "An error occurred during logout.");
    }
  };

  console.log(allowedRoutes, "allowedRoutes");
  const validInitialRoute = useMemo(() => {
    return allowedRoutes.includes(activeRoute) ? activeRoute : "Dashboard";
  }, [allowedRoutes, activeRoute]);

  if (forceUpdate) {
    return <ForceUpdateScreen />;
  }

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ navigation, route }) => ({
        header: () => (
          <View style={{ backgroundColor: "#000", padding: 2 }}>
            <Header
              navigation={navigation}
              route={route}
              setAddExam={setAddExam}
              addExam={addExam}
              setId={setStudentExamId}
            />
          </View>
        ),
        drawerStyle: {
          backgroundColor: "#000", // ✅ correct place
        },
      })}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} onLogout={handleLogout} />
      )}
    >
      <Drawer.Screen name="Dashboard">
        {(props) => (
          <DashboardContent
            {...props}
            onChangeAuth={route.params.onChangeAuth}
          />
        )}
      </Drawer.Screen>

      <Drawer.Screen
        name="PerformanceAnalasys"
        component={PerformanceAnalasys}
        initialParams={{ onChangeAuth: route?.params?.onChangeAuth }}
      />
      <Drawer.Screen
        name="Achivements"
        component={Achivements}
        initialParams={{ onChangeAuth: route?.params?.onChangeAuth }}
      />
      {instituteId !== 0 && (
        <Drawer.Screen
          name="ScheduleExams"
          component={ScheduleExams}
          initialParams={{ onChangeAuth: route?.params?.onChangeAuth }}
        />
      )}
      <Drawer.Screen
        name="Notifications"
        component={Notifications}
        initialParams={{ onChangeAuth: route?.params?.onChangeAuth }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  drawerHeader: {
    paddingVertical: 20,
  },
  drawerItem: {
    paddingVertical: 15,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 5,
  },
  selectedDrawerItem: {
    backgroundColor: "#BC30ED",
  },
  drawerItemText: {
    fontSize: 16,
    fontFamily: "CustomFont",
    fontWeight: "900",
    marginLeft: 8,
  },
  drawerIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  badgeContainer: {
    position: "absolute",
    right: -6,
    top: -4,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default DashboardDrawer;
