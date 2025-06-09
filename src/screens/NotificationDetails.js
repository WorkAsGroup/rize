import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Linking,
} from "react-native";
import { darkTheme } from "../theme/theme";
import { useNavigation, useRoute } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import LinearGradient from "react-native-linear-gradient";
import { setLoading } from "../store/slices/NotificationSlice";
import RenderHtml from "react-native-render-html";
import { useDispatch, useSelector } from "react-redux";
import {
  getNotificationData,
  updateNotification,
} from "../store/thunks/notificationThunk";
import AnimationWithImperativeApi from "../common/LoadingComponent";

const NotificationDetails = () => {
  const theme = darkTheme;
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [webViewHeight, setWebViewHeight] = useState(100);
  // const selectedExam = useSelector((state) => state.header.selectedExam);
  const loading = useSelector((state) => state.notifications.loading);
  const webViewRef = useRef(null);
  const entireData = useSelector((state) => state.notifications.data);
  const notificationData = route.params?.notificationData;
  const [notification, setNotification] = useState(route?.params?.data);
  // const { title, description, long_description, image, timestamp } = route.params.data;
  const [isReady, setIsReady] = useState(true);
  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (notificationData) {
      console.log("Notification data received:", notificationData);
      // Do something like scroll or open a specific view
      const selectedExam = Number(notificationData?.student_user_exam_id);
      const paramsData = {
        selectedExam,
      };
      dispatch(getNotificationData(paramsData));
    }
  }, []);

  useEffect(() => {
    console.log(entireData, notificationData, ";alsdfoelwnfwej");
    if (entireData?.length > 0 && notificationData) {
      const res = entireData.filter(
        (item) =>
          Number(item?.notification_history_id) ===
          Number(notificationData?.notification_history_id)
      );
      console.log(res, "resresres");
      if (res.length > 0 && !notification?.notification_id) {
        setNotification(res[0]);
        setIsReady(true);

        const fields = {
          notification_history_id: res[0]?.notification_history_id,
        };
        const selectedExam = Number(notificationData?.student_user_exam_id);
        const paramsData = { selectedExam };

        dispatch(updateNotification(fields));
        dispatch(getNotificationData(paramsData));
        setIsReady(false);
      }
    }
  }, [entireData]);

  useEffect(() => {
    if (notification?.length > 0) {
      setIsReady(false);
    }

    setTimeout(() => {
      setIsReady(false);
    }, 5000);
  }, [notification]);

  const formattedDate =
    notification?.timestamp && !isNaN(notification.timestamp)
      ? new Date(Number(notification.timestamp) * 1000).toLocaleString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }
        )
      : "";

  const handleMessage = (event) => {
    const height = Number(event.nativeEvent.data);
    if (!isNaN(height)) {
      setWebViewHeight(height);
    }
  };

  function sanitizeHtml(rawHtml) {
    if (!rawHtml) return "<p>No data</p>";

    // Remove <html>, <head>, <body>, styles, scripts, and media queries
    let cleaned = rawHtml
      .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
      .replace(/<html[\s\S]*?>/gi, "")
      .replace(/<\/html>/gi, "")
      .replace(/<head[\s\S]*?>[\s\S]*?<\/head>/gi, "")
      .replace(/<body[^>]*>/gi, "")
      .replace(/<\/body>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/class=["'].*?["']/gi, "") // remove class attributes
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");

    // Fix image tags: make sure they have width:100%
    cleaned = cleaned.replace(
      /<img /gi,
      '<img style="width:100%;height:auto;" '
    );

    // Fix anchor/button styles
    cleaned = cleaned.replace(
      /<a /gi,
      '<a style="display:inline-block;padding:12px 16px;background:#232F73;color:#fff;border-radius:20px;text-decoration:none;font-weight:bold;" '
    );

    return `<div style="font-size:14px;font-family:'Times New Roman';color:#000;">${cleaned}</div>`;
  }

  const cleanedHtml = useMemo(() => {
    return sanitizeHtml(notification?.long_description);
  }, [notification]);

  // console.log(cleanedHtml, "notification?.long_description");
  const contentWidth = Dimensions.get("window").width;
  return (
    <View style={[styles.container, { backgroundColor: theme.textbgcolor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Image
            source={require("../images/arrow.png")}
            tintColor={"#fff"}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notification Details</Text>
      </View>
      {loading || isReady ? (
        <View style={styles.loadingContainer}>
          <AnimationWithImperativeApi />
        </View>
      ) : (
        <ScrollView style={{ marginTop: 20 }}>
          <LinearGradient
            colors={["#e614e1", "#8b51fe"]}
            style={{
              padding: 1, // thickness of the border
              borderRadius: 10, // match with inner view radius
              marginTop: 10,
            }}
          >
            <View
              style={[
                styles.itemContainer,
                {
                  backgroundColor: theme.textColor1,
                  paddingTop: 10,
                  borderRadius: 8, // should be slightly smaller than outer border if padding is small
                },
              ]}
            >
              {/* Title */}
              <Text style={styles.title}>{notification?.title}</Text>

              {/* Timestamp */}
              <Text style={styles.timestamp}>{formattedDate}</Text>

              {/* Image */}
              {/* {image ? (
              <Image
                source={{ uri: image }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : null} */}

              {/* Description */}
              {/* <Text style={styles.description}>{long_description}</Text> */}

              {/* Long Description */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#ffffff",
                }}
              >
                <ScrollView contentContainerStyle={{ padding: 16 }}>
                  <RenderHtml
                    contentWidth={contentWidth - 32}
                    source={{ html: cleanedHtml }}
                    tagsStyles={{
                      img: { width: "100%", height: "auto" },
                      p: { fontSize: 14, color: "#000" },
                      li: { fontSize: 14, color: "#000", marginBottom: 4 },
                      a: { color: "#fff", textDecorationLine: "underline" },
                    }}
                  />
                </ScrollView>

                {/* {notification?.long_description ? (
                  <WebView
                    ref={webViewRef}
                    originWhitelist={["*"]}
                    source={{
                      html: sanitizeHtml(notification?.long_description || ""),
                    }}
                    style={{ flex: 1, backgroundColor: "#fffff" }}
                    javaScriptEnabled={true}
                    // injectedJavaScript={injectedJS}
                    onMessage={handleMessage}
                    scrollEnabled={false} // disable WebView scroll; outer ScrollView will handle it
                    injectedJavaScript={`
                      const style = document.createElement('style');
                      style.innerHTML = '* { background: #ffffff !important; font-size: 10px !important; } body { background-color: transparent !important; }';
                      document.head.appendChild(style);
                      true; // required for Android
                    `}
                  />
                ) : null} */}
              </View>
            </View>
          </LinearGradient>
        </ScrollView>
      )}
    </View>
  );
};

export default NotificationDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 500,
    justifyContent: "center",
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    marginLeft: 20,
    flexShrink: 1, // Ensures text doesn't overflow
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  timestamp: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  description: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 20,
  },
  webviewWrapper: {
    height: "auto",
    borderRadius: 10,
    overflow: "hidden",
    color: "#fff",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
    color: "#fff",
  },
  itemContainer: {
    width: "100%",
    // margin: 1,
    padding: 10,
    borderRadius: 15,
    alignContent: "flex-start",
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
  },
});
