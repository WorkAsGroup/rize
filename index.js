/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

// Handle background notifications (when app is in killed/background state)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Notification received in background (killed state):', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);