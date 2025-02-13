import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet, Image, useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from './src/theme/theme';

// Import your screens
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import AccountCreated from './src/screens/AccountCreated';
import ResetPassword from './src/screens/ResetPassword';
import ResetLink from './src/screens/ResetLink';
import CreateAccount from './src/screens/CreateAccount';
import Intro from './src/screens/Intro';
import Form from './src/screens/Form';
import OTPScreen from './src/screens/OTPScreen';
import DashboardDrawer from './src/screens/DashboardDrawer'; // Import the Drawer
import Instruction from './src/screens/Instruction';
import MockTest from './src/screens/MockTest';

const Stack = createStackNavigator();

const AuthNavigator = ({ onChangeAuth }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Intro" component={Intro} />
    <Stack.Screen name="Login" component={Login} initialParams={{ onChangeAuth: onChangeAuth }} />
    <Stack.Screen name="Signup" component={Signup} />
    <Stack.Screen name="OTPScreen" component={OTPScreen} />
    <Stack.Screen name="ResetPassword" component={ResetPassword} />
    <Stack.Screen name="ResetLink" component={ResetLink} />
    <Stack.Screen name="AccountCreated" component={AccountCreated} />
    <Stack.Screen name="Instruction" component={Instruction} />
    <Stack.Screen name="MockTest" component={MockTest} />
    <Stack.Screen name="Form" component={Form} />
  </Stack.Navigator>
);

const AppNavigator = ({ onChangeAuth }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" >
       {(props) => <DashboardDrawer {...props} route={{ params: { onChangeAuth: onChangeAuth } }} />}
    </Stack.Screen>
  </Stack.Navigator>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 250,
    width: 200,
    resizeMode: 'contain',
  },
});

export default function App() {
  const [authToken, setAuthToken] = useState(null);
  const [isAppReady, setIsAppReady] = useState(false);

  const handleAuthChange = useCallback(async (token) => {
    try {
      if (token) {
        await AsyncStorage.setItem('authToken', token);
      } else {
        await AsyncStorage.removeItem('authToken');
      }
      setAuthToken(token);
    } catch (e) {
      console.log("Error during auth change:", e);
    } finally {
    }
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        setAuthToken(token);
      } catch (e) {
        console.log(e);
      } finally {
        setIsAppReady(true)
      }
    };

    setTimeout(() => {
      checkToken();
    }, 1000);
  }, [handleAuthChange]);

  return (
    <NavigationContainer>
      {isAppReady ? (
        authToken ? (
          <AppNavigator onChangeAuth={handleAuthChange} />
        ) : (
          <AuthNavigator onChangeAuth={handleAuthChange} />
        )
      ) : (
        <SplashScreen />
      )}
    </NavigationContainer>
  );
}