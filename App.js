import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import AccountCreated from './src/screens/AccountCreated';
import ResetPassword from './src/screens/ResetPassword';
import ResetLink from './src/screens/ResetLink';
import CreateAccount from './src/screens/CreateAccount';
import Intro from './src/screens/Intro';
import Form from './src/screens/Form';
import OTPScreen from './src/screens/OTPScreen';
import Dashboard from './src/screens/Dashboard';
import Instruction from './src/screens/Instruction';
import MockTest from './src/screens/MockTest';

const Stack = createStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Intro" component={Intro} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="OTPScreen" component={OTPScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="ResetLink" component={ResetLink} />
            <Stack.Screen name="CreateAccount" component={CreateAccount} />
            <Stack.Screen name="AccountCreated" component={AccountCreated} />
            <Stack.Screen name="Instruction" component={Instruction} />
            <Stack.Screen name="MockTest" component={MockTest} />
            <Stack.Screen name="Form" component={Form} />
        </Stack.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Form" component={Form} />
            <Stack.Screen name="Instruction" component={Instruction} />
            <Stack.Screen name="MockTest" component={MockTest} />
        </Stack.Navigator>
    );
};

export default function App() {
    const [authToken, setAuthToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem('authToken');
                setAuthToken(token);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        checkToken();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="blue" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {authToken ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}