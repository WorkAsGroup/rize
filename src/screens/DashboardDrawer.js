import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useColorScheme, Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import DashboardContent from './DashboardContent';
import { useNavigation, useRoute } from '@react-navigation/native';
import { darkTheme, lightTheme } from '../theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Intro from './Intro';
import PerformanceAnalasys from './PerformanceAnalasys';

const Drawer = createDrawerNavigator();

const Settings = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Settings</Text>
  </View>
);

const CustomDrawerContent = (props) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const navigation = useNavigation();
  const route = useRoute();
  const currentRouteName = route.name;
  
  const getIconSource = (routeName) => {
    switch (routeName) {
      case 'Dashboard':
        return require('../images/dashboard.png');
      case 'MockTests':
        return require('../images/test.png');
      case 'Performance':
        return require('../images/performance.png');
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
        <Image source={require("../images/title.png")} style={{ height: 100, width: 160, tintColor: theme.textColor, resizeMode: 'contain', marginLeft: 10 }} />
      </View>

      <TouchableOpacity style={[styles.drawerItem, currentRouteName === 'Dashboard' && styles.selectedDrawerItem]} onPress={() => handleNavigation('Dashboard')}>
        <Image source={getIconSource('Dashboard')} style={[styles.drawerIcon, { tintColor: theme.textColor }]} />
        <Text style={[styles.drawerItemText, { color: theme.textColor }]}>Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.drawerItem, currentRouteName === 'PerformanceAnalasys' && styles.selectedDrawerItem]} onPress={() => handleNavigation('PerformanceAnalasys')}>
        <Image source={getIconSource('Performance')} style={[styles.drawerIcon, { tintColor: theme.textColor }]} />
        <Text style={[styles.drawerItemText, { color: theme.textColor }]}>Performance Analysys</Text>
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
  const { onChangeAuth } = route.params;
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  // ✅ FIXED LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
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
    backgroundColor: '#f0f0f0',
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
