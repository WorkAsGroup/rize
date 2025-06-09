import {
  DeviceEventEmitter,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { theme } from "../core/theme";
import {
  getAutoLogin,
  getExamType,
  getNotificationHistory,
} from "../core/CommonService";
import ExamModalComponent from "../screens/ExamModalComponent";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedExam,
  setExamLabel,
  setExamData,
} from "../store/slices/headerSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setStudentUid } from "../store/slices/headerSlice";
import { setNotificationCount } from "../store/slices/NotificationSlice";
import { getNotificationData } from "../store/thunks/notificationThunk";

let exams = [
  {
    label: "NEET",
    exam_id: 1,
  },
  {
    label: "JEE",
    exam_id: 2,
  },
  {
    label: "AP-EAMCET-MPC",
    exam_id: 3,
  },
  {
    label: "TS-EAMCET-MPC",
    exam_id: 6,
  },
  {
    label: "AP-EAMCET-BIPC",
    exam_id: 7,
  },
  {
    label: "TS-EAMCET-BIPC",
    exam_id: 8,
  },
  {
    label: "KCET - PCMB",
    exam_id: 9,
  },
  {
    label: "KCET - PCM",
    exam_id: 10,
  },
  {
    label: "KCET - PCB",
    exam_id: 11,
  },
];

const COMPLETED_MOCK_TESTS_KEY = "completedMockTests";
const Header = ({ route, setId }) => {
  const navigation = useNavigation();
  const [instituteId, setInstituteId] = useState(0);

  const [selectedOption, setSelectedOption] = useState(null);
  const [addExam, setAddExam] = useState(false);
  const [examsData, setExamsData] = useState([]);
  const [studentId, setStudentId] = useState("");
  const selectedExam = useSelector((state) => state.header.selectedExam);
  const examData = useSelector((state) => state.header.examData);
  const notificationCount = useSelector((state) => state.notifications.count);
  const examLabel = useSelector((state) => state.header.examLabel);
  const [items, setItems] = useState(examData ? examData : []);
  const [hasFetched, setHasFetched] = useState(false);
  const [userData, setUserData] = useState("");
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const response = await getAutoLogin();
      console.log("auto-login-", response);

      if (!response?.data) {
        console.warn("No user data received from API");
        return; // Early exit if no data
      }
      console.log(response.data, "response");
      setUserData(response?.data);
      setInstituteId(response?.data?.institute_id);
      const { name: nm, student_user_id: id, examsData } = response.data;
      //   setName(nm);
      setStudentId(id);
      dispatch(setStudentUid(id));
      //   setStudentUserId(id);
      setExamsData(examsData);

      const userData = await AsyncStorage.getItem("userdata");
      if (exams?.length > 0 && examsData?.length > 0) {
        // Use a Map for efficient lookup of examsData
        const examsDataMap = new Map(
          examsData.map((exam) => [exam.exam_id, exam])
        );
        const fields = {
          student_user_id: id,
        };

        console.log(examsData, exams.data, "examsDataMap");

        const mergedExamsData = exams.map((exam) => {
          console.log(exam.exam_id, "exam.exam_id");
          const existingExamData = examsDataMap.get(exam.exam_id);
          // Use spread operator conditionally, providing a default empty object if existingExamData is undefined
          console.log(existingExamData, "existingExamData");
          return { ...exam, ...(existingExamData || {}) };
        });

        // Filter out entries where is_default is not present (meaning it wasn't in examsData)
        const filteredMergedData = mergedExamsData.filter((exam) =>
          exam.hasOwnProperty("is_default")
        );
        // checkUserIdExamExist(filteredMergedData);

        const dropdownItems = [
          ...filteredMergedData.map((option) => ({
            label: option.label,
            value: option.exam_id,
            isDefault: option.is_default,
            stUserExamId: option.student_user_exam_id,
          })),
          ...(response?.data?.institute_id == 0
            ? [{ label: "➕ Add", value: "add", custom: true }]
            : []),
        ];

        setItems(dropdownItems);
        dispatch(setExamData(dropdownItems));
        const defaultItem = dropdownItems.find((item) => item.isDefault === 1);
        setSelectedOption(defaultItem || dropdownItems[0]);
        setId(defaultItem?.stUserExamId || dropdownItems[0]?.stUserExamId);

        // Example usage
        console.log(defaultItem, dropdownItems, "dropdownItems");
        dispatch(
          setSelectedExam(
            defaultItem?.stUserExamId || dropdownItems[0]?.stUserExamId
          )
        );
        dispatch(setExamLabel(defaultItem?.label || dropdownItems[0]?.label));
        console.log(defaultItem, "default");
        // setStudentExamId((defaultItem || dropdownItems[0]).stUserExamId);
      } else {
        // Handle the case where getExamType returns no data or an error
        console.warn("No exam type data received from API");
        if (examsData && examsData.length > 0) {
          // Fallback to first exam in examsData if no exam types are available.
          //   setStudentExamId(examsData[0].student_user_exam_id);
          setItems([
            {
              label: examsData[0].exam_type || "Default Exam", //Provide a default label
              value: examsData[0].exam_id,
              stUserExamId: examsData[0].student_user_exam_id,
            },
          ]);
          dispatch(
            setExamData([
              {
                label: examsData[0].exam_type || "Default Exam", //Provide a default label
                value: examsData[0].exam_id,
                stUserExamId: examsData[0].student_user_exam_id,
              },
            ])
          );
          setSelectedOption(items?.[0]);
          setId(items?.[0]?.stUserExamId);
          console.log(defaultItem, "default");
          dispatch(setSelectedExam(items[0]?.stUserExamId));
          dispatch(setExamLabel(items[0]?.exam_type));
        } else {
          if (instituteId == 0) {
            setItems([{ label: "➕ Add", value: "add" }]);
          }
          let storedMockTests = await AsyncStorage.getItem(
            COMPLETED_MOCK_TESTS_KEY
          );
          if (!storedMockTests) {
            setAddExam(true);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      //   checkUserIdExamExist([]);
      // Alert.alert(
      //   "Error",
      //   "Failed to get user data. Please check your connection and try again."
      // );
      // Reinstated the Alert for better user experience
    }
  };

  useEffect(() => {
    const paramsData = {
      selectedExam,
    };
    dispatch(getNotificationData(paramsData));
  }, [selectedExam]);

  useEffect(() => {
    console.log("selectedExam in useEffect:", selectedExam);
    if (!selectedExam) {
      getUser();
    }
  }, [selectedExam]);

  const getUserData = async () => {
    const response = await getAutoLogin();
    console.log("auto-login-", response);

    if (!response?.data) {
      console.warn("No user data received from API");
      return; // Early exit if no data
    }
    // console.log(response.data, "response")
    setUserData(response?.data);
    setInstituteId(response?.data?.institute_id);
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (items.length == 0 && instituteId == 0) {
      setItems([{ label: "➕ Add", value: "add" }]);
      // setAddExam(true);
    }
  }, [items, instituteId]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "allExamsSubmitted",
      () => {
        console.log("🎯 Received: All exams have been submitted!");
        // You can dispatch an action, refetch data or update UI here
        getUser(); // Example action
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // const handleOptionSelect = (option) => {
  //   // console.log(option, "options", option.exam_id)
  //   setStudentExamId(option.student_user_exam_id);
  //   setSelectedOption(option.exam_type);

  //   setIsOpen(false);
  // };

  const handleSelect = (item) => {
    if (item.value === "add") {
      setAddExam(true);
    } else {
      setSelectedOption(item);
      setId(item.stUserExamId);
      dispatch(setSelectedExam(item.stUserExamId));
      dispatch(setExamLabel(item.label));
    }
  };

  useEffect(() => {
    if (selectedExam && items.length > 0) {
      setSelectedOption(
        items.find((item) => item.stUserExamId === selectedExam)
      );
    }
  }, [selectedExam]);
  console.log(userData, "userDatacwe");
  const memoizedContent = useMemo(
    () =>
      addExam == true ? (
        <ExamModalComponent
          show={addExam}
          setShow={setAddExam}
          existingExams={items}
          studentUserId={studentId}
        />
      ) : null,
    [addExam, items]
  );
  console.log(instituteId, "instituteId");
  const memoizedNotificationCount = useMemo(() => {
    return notificationCount > 99 ? "99+" : notificationCount;
  }, [notificationCount]);

  console.log(examsData, "examsData");
  return (
    <View style={styles.header}>
      {/* Hamburger Menu */}
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Image
          source={require("../images/more.png")}
          style={[styles.icon, { tintColor: theme.textColor }]}
        />
      </TouchableOpacity>
      {memoizedContent}
      {/* App Logo */}
      {userData?.institute_id !== 0 && (
        <View>
          <Image
            source={{ uri: userData?.institute_logo }}
            style={[styles.logo]}
          />
          <Text style={{ color: "#fff" }}>{userData?.institute_name} </Text>
        </View>
      )}

      {/* Compact Dropdown */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <View style={{ zIndex: 1000 }}>
          {items.length > 0 && (
            <Dropdown
              style={{
                backgroundColor: "#000",
                borderColor: "#E614E1",
                borderWidth: 1,
                minHeight: 35,
                width: 120,
                paddingHorizontal: 10,
                borderRadius: 10,
              }}
              containerStyle={{
                backgroundColor: "#000",
                borderColor: theme.brad,
                maxHeight: 150,
              }}
              placeholderStyle={{
                color: "#E614E1",
                fontSize: 12, // Smaller font size for placeholder
              }}
              selectedTextStyle={{
                color: "#E614E1",
                fontSize: 12, // Smaller font size for selected value
              }}
              itemTextStyle={{
                fontSize: 11, // ✅ Decreased font size for dropdown items
                color: "#E614E1",
              }}
              data={items}
              labelField="label"
              valueField="value"
              value={selectedOption?.value === "add" ? null : selectedOption}
              onChange={(item) => handleSelect(item)}
              placeholder="Select"
            />
          )}
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Notifications")}
          style={styles.notificationWrapper}
        >
          <Image
            source={require("../images/notificationIcon.png")}
            style={[styles.notificationIcon, { tintColor: "#ffffff" }]}
          />
          {memoizedNotificationCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{memoizedNotificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default React.memo(Header);

const styles = StyleSheet.create({
  badgeContainer: {
    position: "absolute",
    right: -6,
    top: -4,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  notificationWrapper: {
    // position: "relative",
    marginLeft: 10,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  notificationIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "transparent",
    boxShadow: "0px 6px 10px -6px #b336f0",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  logo: {
    height: 34,
    width: 70,
    resizeMode: "contain",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
