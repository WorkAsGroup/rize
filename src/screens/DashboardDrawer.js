import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import DashboardContent from './DashboardContent';
import { useNavigation, useRoute } from '@react-navigation/native';
import { darkTheme, lightTheme } from '../theme/theme';
import Intro from './Intro';
import PerformanceAnalasys from './PerformanceAnalasys';

const Drawer = createDrawerNavigator();

const Settings = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Settings</Text>
  </View>
);

// Custom Drawer Content without Icons
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
      {/* App Title */}
      <View style={[styles.drawerHeader]}>
      <Image source={require("../images/title.png")} style={{width:160,tintColor:theme.textColor,resizeMode:'contain',marginLeft:10}} />
      </View>

      {/* Drawer Items */}
      <TouchableOpacity style={[styles.drawerItem, currentRouteName === 'Dashboard' && styles.selectedDrawerItem]} onPress={() => handleNavigation('Dashboard')}>
        <Image
          source={getIconSource('Dashboard')}
          style={[styles.drawerIcon, { tintColor: theme.textColor }]}
        />
        <Text style={[styles.drawerItemText, { color: theme.textColor }]}>Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.drawerItem, currentRouteName === 'PerformanceAnalasys' && styles.selectedDrawerItem]} onPress={() => handleNavigation('PerformanceAnalasys')}>
        <Image
          source={getIconSource('Performance')}
          style={[styles.drawerIcon, { tintColor: theme.textColor }]}
        />
        <Text style={[styles.drawerItemText, { color: theme.textColor }]}>Performance Analysys</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={[styles.drawerItem, currentRouteName === 'Settings' && styles.selectedDrawerItem]} onPress={() => handleNavigation('Settings')}>
        <Image
          source={getIconSource('Settings')}
          style={[styles.drawerIcon, { tintColor: theme.textColor }]}
        />
        <Text style={[styles.drawerItemText, { color: theme.textColor }]}>Settings</Text>
      </TouchableOpacity> */}
      {/* <TouchableOpacity style={[styles.drawerItem, currentRouteName === 'MockTests' && styles.selectedDrawerItem]} onPress={() => handleNavigation('MockTests')}>
        <Image
          source={getIconSource('MockTests')}
          style={[styles.drawerIcon, { tintColor: theme.textColor }]}
        />
        <Text style={[styles.drawerItemText, { color: theme.textColor }]}>Mock Tests</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.drawerItem, currentRouteName === 'Settings' && styles.selectedDrawerItem]} onPress={() => handleNavigation('Settings')}>
        <Image
          source={getIconSource('Settings')}
          style={[styles.drawerIcon, { tintColor: theme.textColor }]}
        />
        <Text style={[styles.drawerItemText, { color: theme.textColor }]}>Settings</Text>
      </TouchableOpacity> */}
    </DrawerContentScrollView>
  );
};

const DashboardDrawer = ({ route }) => {
  const { onChangeAuth } = route.params;
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme.background,
        },
      }} 
    >
      <Drawer.Screen name="Dashboard" >
        {(props) => (
          <DashboardContent
            {...props}
            route={{ params: { onChangeAuth: onChangeAuth } }}
          />
        )}
      </Drawer.Screen>
      {/* <Drawer.Screen name="Introv2" component={Intro} /> */}
      <Drawer.Screen name="PerformanceAnalasys"> 
      {(props) => (
          <PerformanceAnalasys
            {...props}
            route={{ params: { onChangeAuth: onChangeAuth } }}
          />
        )}
      </Drawer.Screen>
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
  
  drawerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    //color: '#6A5ACD',
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
  drawerItemTextInactive: {
    fontSize: 18,
    fontFamily: 'CustomFont',
    top: 5,
    marginLeft: 8
  },
  drawerIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export default DashboardDrawer;