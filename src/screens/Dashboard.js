import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { removeToken } from '../auth'; // Adjust path if needed

const Dashboard = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    // Remove the token
    await removeToken();

    // Navigate to the login screen and clear the navigation history
    navigation.reset({
      index: 0,
      routes: [{ name: 'Intro' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Dashboard!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
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

export default Dashboard;