import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { navigate } from "./NavigationService"; // import your helper

const useNotificationHandler = () => {
  useEffect(() => {
    // App was opened from a quit state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage?.data?.type === "notification") {
          navigate("NotificationDetails", {
            data: JSON.parse(remoteMessage.data.payload),
          });
        }
      });

    // App was in background
    const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage?.data?.type === "notification") {
        navigate("NotificationDetails", {
          data: JSON.parse(remoteMessage.data.payload),
        });
      }
    });

    return unsubscribe;
  }, []);
};

export default useNotificationHandler;
