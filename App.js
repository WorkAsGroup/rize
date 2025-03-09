import React, { useState, useEffect, useCallback,useRef } from 'react';
import {  NavigationContainer, useNavigationState } from '@react-navigation/native';import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet, Image, useColorScheme ,BackHandler} from 'react-native';
import { darkTheme, lightTheme } from './src/theme/theme';

import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import AccountCreated from './src/screens/AccountCreated';
import ResetPassword from './src/screens/ResetPassword';
import ResetLink from './src/screens/ResetLink';
import CreateAccount from './src/screens/CreateAccount';
import Intro from './src/screens/Intro';
import Form from './src/screens/Form';
import OTPScreen from './src/screens/OTPScreen';
import DashboardDrawer from './src/screens/DashboardDrawer'; 
import Instruction from './src/screens/Instruction';
import MockTest from './src/screens/MockTest';
import Instruct from './src/screens/Instruct';
import EmailVerification from './src/screens/EmailVerification';


import ResultMainComponent from './src/screens/ResultsMainConponent';
import InstructionAuth from './src/screens/InstructionAuth';
import StartExam from './src/screens/StartExam';
import PerformanceAnalasys from './src/screens/PerformanceAnalasys';
import DashboardContent from './src/screens/DashboardContent';
import ResetPasswordOTP from './src/screens/ResetPasswordOTP';

const Stack = createStackNavigator();

const AuthNavigator = ({ onChangeAuth }) => {
  

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="Login" component={Login} initialParams={{ onChangeAuth: onChangeAuth }} 
      options={{
          gestureEnabled: false, 
        }}/>
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="AccountCreated" component={AccountCreated} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="ResetLink" component={ResetLink} />
      <Stack.Screen name="Form" component={Form} />
      <Stack.Screen name="OTPScreen" component={OTPScreen} />
      <Stack.Screen name="Instruction" component={Instruction} />
      <Stack.Screen name="Instruct" component={Instruct} />
      <Stack.Screen name="MockTest" component={MockTest} />
      <Stack.Screen name="EmailVerification" component={EmailVerification} />
      <Stack.Screen name="ResetPasswordOTP" component={ResetPasswordOTP} />


    </Stack.Navigator> 
  );
};

const AppNavigator = ({ onChangeAuth }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
     <Stack.Screen name="Intro" component={Intro} />
            <Stack.Screen
                name="Login"
                component={Login}
                initialParams={{ onChangeAuth: onChangeAuth }}
                options={{ gestureEnabled: false }}
            />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="AccountCreated" component={AccountCreated} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="ResetLink" component={ResetLink} />
            <Stack.Screen name="Form" component={Form} />
            <Stack.Screen name="OTPScreen" component={OTPScreen} />
            <Stack.Screen name="Instruction" component={Instruction} />
            <Stack.Screen name="Instruct" component={Instruct} />
            <Stack.Screen name="MockTest" component={MockTest} />
            <Stack.Screen name="ResetPasswordOTP" component={ResetPasswordOTP} />
            <Stack.Screen name="EmailVerification" component={EmailVerification} /> 


            {/* App Screens (Previously in AppNavigator) */}
            <Stack.Screen name="DashboardContent" component={DashboardContent}/>
  {/* {(props) => <DashboardDrawer {...props} onChangeAuth={onChangeAuth} />}  */}
{/* </Stack.Screen> */}

            <Stack.Screen name="resultsPage">
                {(props) => <ResultMainComponent {...props} route={{ params: { onChangeAuth: onChangeAuth } }} />}
            </Stack.Screen>
            <Stack.Screen name="PerformanceAnalasys" component={PerformanceAnalasys} />
            <Stack.Screen name="InstructionAuth" component={InstructionAuth} />
            <Stack.Screen name="StartExam" component={StartExam} />
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
  const navigationRef = useRef(null);
  const [authToken, setAuthToken] = useState(null);
  const [isAppReady, setIsAppReady] = useState(false);
  const routeNameRef = useRef();
 
  useEffect(() => {
    const backAction = () => {
      const currentRoute = navigationRef.current?.getCurrentRoute(); 

      if (currentRoute?.name === 'Login') {
        BackHandler.exitApp();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  const handleAuthChange = useCallback(async (token) => {
    try {
      if (token) {
        await AsyncStorage.setItem('authToken', token);
        setAuthToken(token);
      } else {
        await AsyncStorage.removeItem('authToken');
        setAuthToken(null);
      }
    } catch (e) {
      console.log("Error during auth change:", e);
    } 
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
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

 


  return (
   <NavigationContainer
      ref={navigationRef}
      onReady={() => setIsAppReady(true)} 
    >
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