import React, { useEffect, useState } from "react";
import {
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../common/Header";
import { darkTheme } from "../theme/theme";
import { useDispatch, useSelector } from "react-redux";

import {
  getNotificationData,
  updateNotification,
} from "../store/thunks/notificationThunk";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AnimationWithImperativeApi from "../common/LoadingComponent";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { setLoading } from "../store/slices/NotificationSlice";

const windowHeight = Dimensions.get("screen").height;
const Notifications = () => {
  const selectedExam = useSelector((state) => state.header.selectedExam);
  const storeUserData = useSelector((state) => state.user.data);
  const [addExam, setAddExam] = useState(false);
  const [studentExamId, setStudentExamId] = useState(selectedExam);
  const loading = useSelector((state) => state.notifications.loading);
  const notificationsData = useSelector((state) => state.notifications.data);
  const [uid, setUid] = useState("");
  const theme = darkTheme;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  console.log(notificationsData);
  useEffect(() => {
    const paramsData = {
      selectedExam,
    };
    dispatch(getNotificationData(paramsData));
  }, []);

  const renderItemMock = ({ item }) => {
    // console.log(item, selecteditem,"exam status")

    const navigateToDetailsScreen = async () => {
      const userDataString = await AsyncStorage.getItem("userdata");
      const userData = userDataString ? JSON.parse(userDataString) : null;
      const userId = userData?.student_user_id;

      const studentId = storeUserData?.student_user_id || userId;
      setUid(studentId);
      setLoading(true);
      try {
        const fields = {
          notification_history_id: item?.notification_history_id,
        };

        if (item?.status !== 1) {
          console.log(fields, "fields");
          dispatch(updateNotification(fields));
          // console.log(response, "response");
          const paramsData = {
            selectedExam,
          };
          dispatch(getNotificationData(paramsData));
        }

        navigation.navigate("NotificationDetials", {
          data: item,
        });
      } catch (error) {
        console.error("Error updating notification:", error);
        // Optionally show a toast or alert
        // Toast.show({ type: 'error', text1: 'Failed to update notification' });
      } finally {
        setLoading(false);
      }
    };

    const date = new Date(item?.timestamp * 1000);

    const options = {
      year: "numeric",
      month: "short", // use 'long' for full month name
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const formattedDate = date.toLocaleString("en-US", options);
    return (
      <TouchableOpacity onPress={navigateToDetailsScreen}>
        <LinearGradient
          colors={["#e614e1", "#8b51fe"]}
          style={{
            padding: 1, // thickness of the border
            borderRadius: 10, // match with inner view radius
            marginTop: 10,
          }}
          key={item?.notification_history_id}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              // alignItems: "center",
              justifyContent: "space-between",
              padding: 2,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 10 }}>
              {/* {item.title} */} {formattedDate}{" "}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                paddingRight: 10,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 10 }}>
                {item.status == 1 ? "Read  " : "Unread  "}
              </Text>
              {item.status == 1 ? (
                <Image
                  source={require("../images/read.png")}
                  x
                  tintColor={"#fff"}
                  style={{ height: 10, width: 10 }}
                />
              ) : (
                <Image
                  source={require("../images/unread.png")}
                  tintColor={"#fff"}
                  style={{ height: 10, width: 10 }}
                />
              )}
            </View>
          </View>
          <View
            style={[
              styles.itemContainer,
              {
                backgroundColor: theme.textColor1,
                borderRadius: 8, // should be slightly smaller than outer border if padding is small
              },
            ]}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../images/notificationLogo.png")}
                style={styles.logo}
              />
              <Text style={{ color: "#fff", width: "80%" }} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.textbgcolor }]}>
      {/* Header */}

      {/* <Header
        setAddExam={setAddExam}mm
        addExam={addExam}
        setId={setStudentExamId}
      /> */}
      <View
        style={[
          styles.performanceCard,
          {
            backgroundColor: theme.conbk,
            marginTop: 20,
            height: windowHeight * 0.85,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginBottom: -10,
            padding: 10,
          }}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <AnimationWithImperativeApi />
            </View>
          ) : (
            <View>
              <Text
                style={[styles.performanceTitle, { color: theme.textColor }]}
              >
                Notifications{" "}
              </Text>
              {notificationsData && notificationsData.length > 0 ? (
                <View style={{ height: windowHeight * 0.8 }}>
                  <FlatList
                    data={notificationsData}
                    renderItem={renderItemMock}
                    keyExtractor={(item) =>
                      item.notification_history_id
                        ? item.notification_history_id.toString()
                        : Math.random().toString()
                    }
                    onRefresh={getNotificationData}
                    refreshing={loading} // You need to track this in state
                    nestedScrollEnabled={true}
                    contentContainerStyle={{
                      flexGrow: 1,
                      paddingBottom: 20,
                    }}
                    ListEmptyComponent={
                      <Text
                        style={{
                          color: theme.textColor,
                          textAlign: "center",
                          marginTop: 100,
                          fontSize: 16,
                        }}
                      >
                        No Notifications!
                      </Text>
                    }
                  />
                </View>
              ) : (
                <View
                  style={{
                    display: "flex",
                    height: Dimensions.get("screen").height * 0.7,
                    width: Dimensions.get("screen").width * 0.9,
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.performanceTitle,
                      { color: theme.textColor },
                    ]}
                  >
                    No Notifications !{" "}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  performanceCard: { borderRadius: 10, elevation: 1 },
  performanceTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 500,
    justifyContent: "center",
  },
  itemContainer: {
    width: "100%",
    // margin: 1,
    padding: 10,
    borderRadius: 15,
    alignContent: "flex-start",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    height: 45,
    width: 56,
    marginLeft: 20,
  },
  description: {
    marginTop: 5,
    fontSize: 12,
    color: "gray",
  },
});
