import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  FlatList,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { darkTheme, lightTheme } from "../../theme/theme";
import LinearGradient from "react-native-linear-gradient";
import Header from "../../common/Header";
import AchievementsModal from "../models/AchivementsModel";
import LeaderBoard from "./LeaderBoard";
import { addAnalytics, getAchievements } from "../../core/CommonService";
import { List } from "react-native-paper";
import AnimationWithImperativeApi from "../../common/LoadingComponent";
import { useSelector } from "react-redux";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Achivements = () => {
  const colorScheme = useColorScheme();
  const selectedExam = useSelector((state) => state.header.selectedExam);
  const [loading, setLoading] = useState(false); // ✅ Added state for loading indicator
  const [studentExamId, setStudentExamId] = useState(null); // ✅ Added state for student exam id
  const [ach, setAch] = useState([]); // ✅ Added state for achievements
  const [achivementShow, setAchivementShow] = useState(false); // ✅ Added state for modal visibility
  // const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const theme = darkTheme;
  const [refreshing, setRefreshing] = useState(false);
  const uniqueId = useSelector((state) => state.header.deviceId);

  const [expanded, setExpanded] = useState(false);

  const handlePress = () => setExpanded(!expanded);
  useEffect(() => {
    if (uniqueId) {
      handleAnalytics();
    }
  }, []);

  const handleAnalytics = async () => {
    console.log("hey Um called");
    try {
      // Define your params correctly
      const params = {
        student_user_exam_id: selectedExam,
        type: 1,
        source: 0,
        testonic_page_id: 43,
      };

      console.log(uniqueId, "payloaddlscknl");

      // Create payload
      const payload = {
        ...params,
        ip_address: uniqueId ? uniqueId : "",
        location: "Hyderabad", // Ensure location is correctly handled (but you should pass the location data properly here)
      };

      console.log(payload, "payload");

      // Send analytics request
      const response = await addAnalytics(payload); // Assuming addAnalytics is an API call function
      console.log("Analytics Response:", response);
    } catch (error) {
      // Handle errors gracefully
      const errorMessage = error.response?.data?.message || error.message;

      console.error("Error:", errorMessage);
    }
  };

  const getAchieve = async () => {
    const data = {
      student_user_exam_id: selectedExam,
    };

    console.log(selectedExam, data, "eldoeiwlndoweinfweoj");
    setLoading(true); // ✅ Loading indicator is shown when fetching data
    try {
      const response = await getAchievements(data);
      console.log("getAchievements", JSON.stringify(response?.data));
      if (response?.data) {
        setAch(response.data);
        setLoading(false); // ✅ Loading indicator is hidden after fetching data
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching achievements:", error);
      Alert.alert(
        "Error",
        "Failed to get achievements. Please check your connection and try again."
      );
    }
  };

  useEffect(() => {
    if (studentExamId || selectedExam) {
      getAchieve();
    }
  }, [studentExamId, selectedExam]);
  useEffect(() => {
    setStudentExamId(selectedExam);
  }, [selectedExam]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAchieve().then(() => setRefreshing(false));
  }, []);
  return (
    <View style={[styles.container, { backgroundColor: theme.textbgcolor }]}>
      {achivementShow && (
        <AchievementsModal
          visible={achivementShow}
          onClose={() => setAchivementShow(false)} // ✅ Corrected this
        />
      )}
      {/* Header Section */}
      {/* <Header setId={setStudentExamId} /> */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          marginBottom: -10,
          padding: 10,
        }}
      >
        <Text style={[styles.performanceTitle, { color: theme.textColor }]}>
          Your Achievements
        </Text>
      </View>
      {/* Make sure ScrollView is within a flexible container */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <AnimationWithImperativeApi />
        </View>
      ) : (
        <View
          style={[styles.secConatiner, { backgroundColor: theme.textbgcolor }]}
        >
          <ScrollView
            nestedScrollEnabled={true} // ✅ Allows internal scrolling
            style={[
              { maxHeight: windowHeight * 0.3 },
              styles.performanceCard,
              { backgroundColor: theme.conbk, marginTop: 20 },
            ]}
            contentContainerStyle={{
              flexDirection: "row",
              flexWrap: "wrap",
              // justifyContent: "space-between",
              flexGrow: 1,
              gap: 10,
            }}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={refreshing}
            //     onRefresh={onRefresh}
            //     tintColor={theme.textColor}
            //   />}
            showsVerticalScrollIndicator={false}
          >
            {ach !== undefined && ach.length > 0 ? (
              ach.map((item, index) => (
                <LinearGradient
                  key={index}
                  colors={[
                    "rgba(106, 17, 203, 0.15)",
                    "rgba(37, 117, 252, 0.15)",
                  ]}
                  style={{
                    width: "30%", // 3 items per row
                    marginBottom: 10,
                    padding: 5,
                    backgroundColor: theme.textColor1,
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    maxHeight: 100,
                  }}
                >
                  <Image
                    source={{ uri: item.badge_logo }}
                    style={{ height: 75, width: 70, resizeMode: "contain" }}
                  />
                </LinearGradient>
              ))
            ) : (
              <Text
                style={{
                  display: "flex",
                  color: theme.textColor,
                  height: 150,
                  padding: 15,
                  alignItems: "center",
                }}
              >
                📝 Take a Test to Earn a Badge🏅
              </Text>
            )}
          </ScrollView>
          <View
            style={[
              { height: `${expanded ? 400 : 50}` },
              { flexDirection: "column" },
              { borderColor: "deeppink" },
              { borderWidth: 1 },
              { alignContent: "center" },
              { gap: 5 },
              { marginBottom: 0 },
              { marginTop: 10 },
              { borderRadius: 10 },
              { padding: 10 },
              { backgroundColor: theme.conbk },
            ]}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={[styles.performanceTitle, { color: theme.textColor }]}
              >
                Yet to Achive !{" "}
              </Text>
              <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                {!expanded ? (
                  <Image
                    source={require("../../images/down_arrow.png")}
                    style={{
                      height: 15,
                      width: 15,
                      tintColor: "#fff",
                      marginTop: 10,
                    }}
                  />
                ) : (
                  <Image
                    source={require("../../images/up_arrow.png")}
                    style={{
                      height: 15,
                      width: 15,
                      tintColor: "#fff",
                      marginTop: 10,
                    }}
                  />
                )}
              </TouchableOpacity>
            </View>
            {expanded && <AchievementsModal achived={ach} />}
          </View>
          <LeaderBoard studentExamId={selectedExam} />{" "}
          {/* Passing studentExamId */}
        </View>
      )}
      ;
    </View>
  );
};

export default Achivements;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  secConatiner: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 45,
    justifyContent: "space-between",
    shadowOffset: 1,
  },
  performanceCard: { padding: 10, borderRadius: 10, elevation: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 500,
    justifyContent: "center",
  },
  performanceTitle: { fontSize: 18, fontWeight: "bold" },
});
