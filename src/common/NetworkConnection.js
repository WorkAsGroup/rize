import React, { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";

const InternetChecker = () => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isConnected = state.isConnected && state.isInternetReachable;

      if (!isConnected) {
        Toast.show({
          type: "error",
          text1: "No Internet Connection",
          position: "top",
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 50,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
};

export default InternetChecker;
