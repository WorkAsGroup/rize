import React, { useEffect, useState } from 'react';
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

import ScheduleExams from './ScheduleExams';


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
    const [instituteId, setInstituteId] = useState(0)
  // const userData = useSelector((state) => state.user.data)
  const navigation = useNavigation();
  const route = useRoute();
  const currentRouteName = route?.name;
  const activeRoute = props.state.routes[props.state.index].name;
  

  const uId = useSelector((state) => state.header.studentUid);
 
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
        {/* <Text style={{color: "#fff",  textDecorationLine: 'underline', fontSize: 16, textAlign: 'center'}}>{userData?.name}</Text> */}
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
      {instituteId!==0&&
        <TouchableOpacity style={[styles.drawerItem, activeRoute === 'SheduleExams' && styles.selectedDrawerItem]} onPress={() => handleNavigation('SheduleExams')}>
        <Image source={getIconSource('Achivements')} style={[styles.drawerIcon, { tintColor: theme.textColor }]} />
        <Text style={[styles.drawerItemText, { color: theme.textColor }]}>Schedule Exams</Text>
      </TouchableOpacity>
      }
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
  const activeRoute = useSelector((state) => state.user.activeTab)
  const navigation = useNavigation();
  const [instituteId, setInstituteId] = useState(0)
  const theme = darkTheme;
  const uId = useSelector((state) => state.header.studentUid);
  const [userId, setUserId] = useState();
  const [userData, setUserData] = useState("");
  useEffect(() => {
    
    getInstituteId();
  }, [])
  const getInstituteId = async () => {
     const data = await AsyncStorage.getItem("userdata")
    console.log(data, "userData")
    setUserId(data?.student_user_id)
    setInstituteId(data?.institute_id)
    setUserData(data)
  }

  console.log(instituteId, "instituteId")
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

 
    const allowedRoutes = ["Dashboard", "PerformanceAnalasys", "Achivements"];
    if (instituteId !== 0) {
      allowedRoutes.push("SheduleExams");
    }
    
    const validInitialRoute = allowedRoutes.includes(activeRoute) ? activeRoute : "Dashboard";
    

  return (
    <Drawer.Navigator
    initialRouteName={validInitialRoute}
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
{instituteId!==0&&<Drawer.Screen
  name="SheduleExams"
  component={ScheduleExams}
  initialParams={{ onChangeAuth: route?.params?.onChangeAuth }}
/>}

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
