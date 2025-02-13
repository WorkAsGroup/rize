import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardContent from './DashboardContent'; // Import the content component

const Drawer = createDrawerNavigator();

const SettingsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Settings</Text>
  </View>
);

const AboutScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>About</Text>
  </View>
);


const DashboardDrawer = ({ route }) => {
  const { onChangeAuth } = route.params; // Pass onChangeAuth

  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen name="Dashboard" options={{ title: 'Home' }}>
        {(props) => <DashboardContent {...props} navigation={props.navigation} route={{ params: { onChangeAuth: onChangeAuth } }} />}
      </Drawer.Screen>
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
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
});

export default DashboardDrawer;