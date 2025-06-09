import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setLoading,
  setNotificationCount,
  setNotificationData,
} from "../slices/NotificationSlice";
import {
  getNotificationHistory,
  updateNotificationHistory,
} from "../../core/CommonService";

export const getNotificationData = (paramsData) => async (dispatch) => {
  try {
    setLoading(true);

    const userDataString = await AsyncStorage.getItem("userdata");
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const userId = userData?.student_user_id;

    if (paramsData?.selectedExam) {
      const fields = {
        student_user_exam_id: paramsData?.selectedExam,
      };

      const res = await getNotificationHistory(fields);

      dispatch(setNotificationData(res.data));
      const unread = res.data.filter((item) => item.status == 0);
      dispatch(setNotificationCount(unread?.length));
      console.log(res, "Notification response");
    } else {
      console.warn("No user data found to fetch notifications");
    }
  } catch (error) {
    console.error("Error fetching notification data:", error);
  } finally {
    setLoading(false);
  }
};

export const updateNotification = (paramsData) => async (dispatch) => {
  try {
    const response = await updateNotificationHistory(paramsData);
    console.log(response);
  } catch (error) {
    console.error("Error fetching notification data:", error);
  } finally {
    setLoading(false);
  }
};
