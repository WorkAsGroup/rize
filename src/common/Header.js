import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../core/theme";
import { useExam } from "../ExamContext";
import { getAutoLogin, getExamType } from "../core/CommonService";
import ExamModalComponent from "../screens/ExamModalComponent";
const Header = ({ route, setId }) => {
  const navigation = useNavigation();

  const [items, setItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [ addExam, setAddExam] = useState(false);
  const [examsData, setExamsData] = useState([]);
  const { selectedExam, setSelectedExam } = useExam();
  const getUser = async () => {
    try {
      const response = await getAutoLogin();
      console.log("auto-login-", response);

      if (!response?.data) {
        console.warn("No user data received from API");
        return; // Early exit if no data
      }

      const { name: nm, student_user_id: id, examsData } = response.data;
      //   setName(nm);
      //   setStudentId(id);
      //   setStudentUserId(id);
      setExamsData(examsData);

      //   if (!examsData || examsData.length === 0) {
      //     const comData = AsyncStorage.getItem(COMPLETED_EXAMS_KEY);
      //     if (JSON.parse(comData).length < 1) {
      //       setAddExam(true);
      //     }
      //     return; // Early exit if no examsData
      //   }

      const exams = await getExamType();

      if (exams?.data?.length > 0&&examsData?.length>0) {
        // Use a Map for efficient lookup of examsData
        const examsDataMap = new Map(
          examsData.map((exam) => [exam.exam_id, exam])
        );

        const mergedExamsData = exams.data.map((exam) => {
          const existingExamData = examsDataMap.get(exam.exam_id);
          // Use spread operator conditionally, providing a default empty object if existingExamData is undefined
          return { ...exam, ...(existingExamData || {}) };
        });

        // Filter out entries where is_default is not present (meaning it wasn't in examsData)
        const filteredMergedData = mergedExamsData.filter((exam) =>
          exam.hasOwnProperty("is_default")
        );
        // checkUserIdExamExist(filteredMergedData);

        const dropdownItems = [
          ...filteredMergedData.map((option) => ({
            label: option.exam_type,
            value: option.exam_id,
            isDefault: option.is_default,
            stUserExamId: option.student_user_exam_id,
          })),
          { label: "➕ Add", value: "add", custom: true },
        ];

        setItems(dropdownItems);

        const defaultItem = dropdownItems.find((item) => item.isDefault === 1);
        setSelectedOption(defaultItem || dropdownItems[0]);
        setId(defaultItem?.stUserExamId || dropdownItems[0]?.stUserExamId)
        setSelectedExam(defaultItem?.stUserExamId || dropdownItems[0]?.stUserExamId)
 
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
          setSelectedOption(items[0]);
          setId(items[0]?.stUserExamId)
          setSelectedExam(items[0]?.stUserExamId)
     
        } else {
          setItems([{ label: "➕ Add", value: "add" }]);
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
    getUser();
  }, []);
  useEffect(() => {
    if (items.length == 0) {
      setItems([{ label: "➕ Add", value: "add" }]);
      // setAddExam(true);
    }
  }, [items]);




  const handleOptionSelect = (option) => {
    // console.log(option, "options", option.exam_id)
    setStudentExamId(option.student_user_exam_id);
    setSelectedOption(option.exam_type);
    
    setIsOpen(false);
  };

    const handleSelect = (item) => {
      if (item.value === "add") {
        setAddExam(true);
      } else {
        setSelectedOption(item);
        setId(item.stUserExamId);
        setSelectedExam((item.stUserExamId))
      }
    };


    useEffect(() => {
  if(selectedExam&&items.length>0){
    setSelectedOption(items.find((item) => item.stUserExamId === selectedExam))
  }
    },[selectedExam])

    const memoizedContent = useMemo(() => (
       addExam===true ? (
          <ExamModalComponent
              show={addExam}
              setShow={setAddExam}
              existingExams={items}
              studentUserId={selectedExam}
          />
      ) : null
  ), [ addExam,items]);

    console.log(examsData, "examsData")
  return (
    <View style={styles.header}>
      {/* Hamburger Menu */}
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Image
          source={require("../images/more.png")}
          style={[styles.icon, { tintColor: theme.textColor }]}
        />
      </TouchableOpacity>
{memoizedContent}
      {/* App Logo */}
      {/* <Image
        source={require("../images/logo.png")}
        style={[styles.logo, { tintColor: theme.textColor }]}
      /> */}

      {/* Compact Dropdown */}
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
            data={items.length > 0 ? items : { label: "➕ Add", value: "add" }}
            labelField="label"
            valueField="value"
            value={selectedOption?.value === "add" ? null : selectedOption}
            onChange={(item) => handleSelect(item)}
            placeholder="Select"
          />
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "transparent",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  logo: {
    height: 80,
    width: 150,
    resizeMode: "contain",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
