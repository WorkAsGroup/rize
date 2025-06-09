import React from "react";
import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";
import { PermissionsAndroid, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../../src/common/NavigationService";

const usePushNotification = () => {
  const requestUserPermission = async () => {
    if (Platform.OS === "ios") {
      //Request iOS permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log("Authorization status:", authStatus);
      }
    } else if (Platform.OS === "android") {
      //Request Android permission (For API level 33+, for 32 or below is not required)
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    }
  };
  const createNotificationChannel = async () => {
    await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });
  };

  const getFCMToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log("Your Firebase Token is:", fcmToken);
      await AsyncStorage.setItem("fcmToken", fcmToken);
    } else {
      console.log("Failed", "No token received");
    }
  };

  const listenToForegroundNotifications = async () => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log(
        "A new message arrived! (FOREGROUND)",
        JSON.stringify(remoteMessage)
      );

      const { title, body, android } = remoteMessage.notification || {};
      const imageUrl = android?.imageUrl;

      // Ensure channel is created
      await notifee.createChannel({
        id: "default",
        name: "Default Channel",
        importance: AndroidImportance.HIGH,
      });

      // Show local notification manually
      await notifee.displayNotification({
        title: title || "New Notification",
        body: body || "",
        android: {
          channelId: "default",
          largeIcon: imageUrl,
          style: imageUrl
            ? {
                type: notifee.AndroidStyle.BIGPICTURE,
                picture: imageUrl,
              }
            : undefined,
          pressAction: {
            id: "default",
          },
        },
      });
    });

    return unsubscribe;
  };

  const listenToBackgroundNotifications = async () => {
    const unsubscribe = messaging().setBackgroundMessageHandler(
      async (remoteMessage) => {
        console.log(
          "A new message arrived! (BACKGROUND)",
          JSON.stringify(remoteMessage)
        );
      }
    );
    return unsubscribe;
  };

  const onNotificationOpenedAppFromBackground = async () => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "App opened from BACKGROUND by tapping notification:",
        remoteMessage
      );

      // const activity = remoteMessage?.data?.activity;

      navigate("NotificationDetials", {
        notificationData: remoteMessage.data,
      });
    });
  };

  const onNotificationOpenedAppFromQuit = async () => {
    const remoteMessage = await messaging().getInitialNotification();

    if (remoteMessage) {
      console.log(
        "App opened from QUIT by tapping notification:",
        remoteMessage
      );

      navigate("NotificationDetials", {
        notificationData: remoteMessage.data,
      });
    }
  };

  return {
    requestUserPermission,
    getFCMToken,
    listenToForegroundNotifications,
    listenToBackgroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  };
};

export default usePushNotification;
