import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const DashboardContent = ({ navigation, route }) => { // Receive navigation prop
  const { onChangeAuth } = route.params;

  const handleLogout = async () => {
    onChangeAuth(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Dashboard!</Text>
      <Button title="Logout" onPress={handleLogout} />
      <Button
        title="Open Drawer"
        onPress={() => navigation.openDrawer()} // Open the drawer
      />
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

export default DashboardContent;