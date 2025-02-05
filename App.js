import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import AccountCreated from './src/screens/AccountCreated';
import ResetPassword from './src/screens/ResetPassword';
import ResetLink from './src/screens/ResetLink';
import CreateAccount from './src/screens/CreateAccount';
import Intro from './src/screens/Intro';
import Form from './src/screens/Form';
import Instruction from './src/screens/Instruction';
import MockTest from './src/screens/MockTest';

const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false,
      }}>

        <Stack.Screen name="Intro" component={Intro} />
        <Stack.Screen name="Form" component={Form} />
        <Stack.Screen name="Instruction" component={Instruction} />
        <Stack.Screen name="MockTest" component={MockTest} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="ResetLink" component={ResetLink} />
        <Stack.Screen name="AccountCreated" component={AccountCreated} />

        <Stack.Screen name="CreateAccount" component={CreateAccount} />



      </Stack.Navigator>
    </NavigationContainer>
  );
}
