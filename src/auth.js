//auth.js 

import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'authToken';

const storeToken = async (token) => {
    try {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (error) {
        console.error('Error storing token:', error);
    }
};

const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        return token;
    } catch (error) {
        console.error('Error retrieving token:', error);
        return null;
    }
};

const removeToken = async () => {
    try {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (error) {
        console.error('Error removing token:', error);
    }
};

export { storeToken, getToken, removeToken };