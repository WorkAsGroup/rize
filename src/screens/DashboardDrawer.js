import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useColorScheme, Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import DashboardContent from './DashboardContent';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { darkTheme, lightTheme } from '../theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Intro from './Intro';
import Achivements from './dashboardItems/Achivements';
import PerformanceAnalasys from './PerformanceAnalasys';
import { useDispatch } from 'react-redux';
import { setSelectedExam } from '../store/slices/headerSlice';
import DeviceInfo from 'react-native-device-info';


const Drawer = createDrawerNavigator();

const Settings = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Settings</Text>
  </View>
);

const CustomDrawerContent = (props) => {
  const colorScheme = useColorScheme();
  // const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const theme =darkTheme;
  const navigation = useNavigation();
  const route = useRoute();
  const currentRouteName = route?.name;
  const activeRoute = props.state.routes[props.state.index].name;
  // console.log(activeRoute, "currentRouteName")
  const getIconSource = (routeName) => {
    switch (routeName) {
      case 'Dashboard':
        return require('../images/man.png');
      case 'MockTests':
        return require('../images/test.png');
      case 'Performance':
        return require('../images/performance-metrics.png');
        case 'Achivements':
          return require('../images/star-badge.png');
      case 'Settings':
        return require('../images/settings.png');
      default:
        return null;
    }
  };

  const handleNavigation = (routeName) => {
    props.navigation.navigate(routeName);
    props.navigation.closeDrawer(); 
  };

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: theme.textbgcolor }}>
      <View style={[styles.drawerHeader]}>
        <Image source={require("../images/logo.png")} style={{ height: 100, width: 160,  resizeMode: 'contain', marginLeft: 10 }} />
      </View>

      <TouchableOpacity style={[styles.drawerItem, activeRoute == 'Dashboard'? styles.selectedDrawerItem: ""]} onPress={() => handleNavigation('Dashboard')}>
        <Image source={getIconSource('Dashboard')} style={[styles.drawerIcon, { tintColor: theme.textColor }]} />
        <Text style={[styles.drawerItemText, { color: theme.textColor }]}>Test Zone</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.drawerItem, activeRoute === 'PerformanceAnalasys' && styles.selectedDrawerItem]} onPress={() => handleNavigation('PerformanceAnalasys')}>
        <Image source={getIconSource('Performance')} style={[styles.drawerIcon, { tintColor: theme.textColor }]} />
        <Text style={[styles.drawerItemText, { color: theme.textColor }]}>Performance Analytics</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.drawerItem, activeRoute === 'Achivements' && styles.selectedDrawerItem]} onPress={() => handleNavigation('Achivements')}>
        <Image source={getIconSource('Achivements')} style={[styles.drawerIcon, { tintColor: theme.textColor }]} />
        <Text style={[styles.drawerItemText, { color: theme.textColor }]}>Achivements</Text>
      </TouchableOpacity>
      {/* ✅ LOGOUT BUTTON */}
      <TouchableOpacity onPress={props.onLogout} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginTop: 20 }}>
        <Image source={require("../images/logout.png")} style={[styles.icon, { tintColor: theme.textColor, width: 22, height: 22 }]} />
        <Text style={[styles.drawerItemText, { color: theme.textColor }]}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const DashboardDrawer = ({ route }) => {
  console.log(route, "route")
  const { onChangeAuth } = route?.params;
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const theme = darkTheme;
  const userId = useSelector((state) => state.header.studentUid) 
  // ✅ FIXED LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await dispatch(setSelectedExam(null))
      onChangeAuth(null);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "An error occurred during logout.");
    }
  };

  const isVersionOlder = (current, latest) => {
    const curr = current.split('.').map(Number);
    const api = latest.split('.').map(Number);
    for (let i = 0; i < Math.max(curr.length, api.length); i++) {
      const a = curr[i] || 0;
      const b = api[i] || 0;
      if (a < b) return true;
      if (a > b) return false;
    }
    return false;
  };
  

  
  useEffect(() => {
    if(userId) {
      checkAppVersion(userId)
    }
    },[navigation, userId])
  
    const checkAppVersion = async (userId) => {
      console.log("call ayyaaaa")
      try {
        const response = await fetch('https://mocktestapi.rizee.in/api/v1/general/app-version', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_user_id: userId })
        });
        const data = await response.json();
    console.log(data, "dataedwd")
        const currentVersion = DeviceInfo.getVersion(); // e.g. '1.2'
        
        if  (isVersionOlder(currentVersion, data?.[0]?.user_version || "0.0")) {
          // Prompt user to update
          Alert.alert(
            "Update Available",
            "A new version is available. Please update the app for the best experience.",
            [
              { text: "Update Now", onPress: () => Linking.openURL('https://play.google.com/apps/internaltest/4701724673225179262') }
            ],
            { cancelable: false }
          );
        } else {
          // Optionally update backend with current version
          await fetch('https://mocktestapi.rizee.in/api/v1/general/update-app-version', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              student_user_id: userId,
              app_version: parseFloat(currentVersion),
            })
          });
        }
      } catch (error) {
        console.error("Version check failed", error);
      }
    };
  

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} onLogout={handleLogout} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Drawer.Screen name="Dashboard">
        {(props) => <DashboardContent {...props} onChangeAuth={route.params.onChangeAuth} />}
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
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  drawerHeader: {
    paddingVertical: 20,
  },
  drawerItem: {
    paddingVertical: 15,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 5,
  },
  selectedDrawerItem: {
    backgroundColor: '#BC30ED',
  },
  drawerItemText: {
    fontSize: 16,
    fontFamily: 'CustomFont',
    fontWeight: '900',
    marginLeft: 8,
  },
  drawerIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

export default DashboardDrawer;
