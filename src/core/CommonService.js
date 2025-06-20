import axios from "axios";
// let apiurl = "https://studentapi.rizee.in";
let apiurl = "https://mocktestapi.rizee.in";

export const endPoint = {
  examtype: "/api/v1/general/exams",
  addExams: "/api/v1/general/addExams",
  preExam: "/api/v1/mocktests/guest",
  exmQuestions: "/api/v1/exams/questions",
  startExam: "/api/v1/exams/startExam",
  resendOtp: "/api/v1/auth/otp-generation",
  signup: "/api/v1/auth/register",
  login: "/api/v1/auth/login",
  verifyOtp: "/api/v1/auth/verify-otp",
  forgetPassword: "/api/v1/auth/forgetPassword",
  changePassword: "/api/v1/auth/changePassword",
  googleAuth: "/api/v1/auth/google",
  updateEmail: "/api/v1/auth/update-mobileOrEmail",
  resetPass: "/api/v1/auth/otp-generation",
  autologin: "/api/v1/auth/auto-login",
  years: "/api/v1/general/years",
  mocktest: "/api/v1/mocktests",
  achievements: "/api/v1/general/achievements",
  achivementBadges: "/api/v1/general/availableBadges",
  leaderBoard: "/api/v1/general/leaderboards",
  resultExamData: "/api/v1/exams/examResult",
  attempts: "/api/v1/exams/attempts",
  previousPapers: "/api/v1/previousPapers",
  pattern: "/api/v1/exams/pattern-sections",
  dashboardGraph: "/api/v1/reports/dashboard",
  customExams: "/api/v1/customExam",
  subjects: "/api/v1/general/subjects",
  chapters: "/api/v1/general/chapters",
  createCustomExam: "/api/v1/customExam/createExam",
  submitExam: "/api/v1/exams/finishExam",
  prevpap: "/api/v1/exams/start-previouspaper-session",
  updatepassword: "/api/v1/auth/update-password",
  chapterwisePerformance: "/api/v1/reports/preformance/chapterWise",
  addAutoSaveData: "/api/v1/exams/addAutoSaveData",
  getAutoSaveData: "/api/v1/exams/autoSaveData",
  autoSaveTime: "/api/v1/exams/auto-save-time",
  reloadQuestion: "/api/v1/exams/reload-question",
  addAanalytics: "/api/v1/general/addAnalytics",
  appVersion: "/api/v1/general/app-version",
  updateAppVersion: "/api/v1/general/update-app-version",
  schedueExam: "/api/v1/mocktests/schedule-exam",
  notifications: "/api/v1/notifications/getNotificationsHistory",
  updateNotification: "/api/v1/notifications/updateNotificationstatus",
  addNotificationToken: "/api/v1/notifications/addNotificationToken",
};

import AsyncStorage from "@react-native-async-storage/async-storage";

export const addNotificationToken = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.addNotificationToken,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.addNotificationToken, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in year data:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const updateNotificationHistory = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.updateNotification,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.updateNotification, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in year data:",
        error.response?.data || error.message
      );
      return error;
    });
};
export const getNotificationHistory = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.notifications,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.notifications, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in year data:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const getScheduleExams = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.schedueExam,
    "with data:",
    fields?.exam_paper_id,
    fields?.student_user_exam_id
  );

  return await axios
    .post(apiurl + endPoint.schedueExam, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in submit exam:",
        error.response?.data || error.message
      );
      return error;
    });
};
export const getAppversion = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.appVersion,
    "with data:",
    fields?.exam_paper_id,
    fields?.student_user_exam_id
  );

  return await axios
    .post(apiurl + endPoint.appVersion, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in submit exam:",
        error.response?.data || error.message
      );
      return error;
    });
};
export const updateAppversion = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.updateAppVersion,
    "with data:",
    fields?.exam_paper_id,
    fields?.student_user_exam_id
  );

  return await axios
    .post(apiurl + endPoint.updateAppVersion, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in submit exam:",
        error.response?.data || error.message
      );
      return error;
    });
};
export const addAnalytics = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.addAanalytics,
    "with data: Analytics",
    fields
  );

  return await axios
    .post(apiurl + endPoint.addAanalytics, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in submit exam:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const reloadQuestion = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.reloadQuestion,
    "with data:",
    fields?.exam_paper_id,
    fields?.student_user_exam_id
  );

  return await axios
    .post(apiurl + endPoint.reloadQuestion, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in submit exam:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const getAutoSaveTime = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.autoSaveTime,
    "with data:",
    fields
  );

  return await axios
    .get(apiurl + endPoint.autoSaveTime, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in year data:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const addAutoSaveData = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.addAutoSaveData,
    "with data:",
    fields?.exam_paper_id,
    fields?.student_user_exam_id
  );

  return await axios
    .post(apiurl + endPoint.addAutoSaveData, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in submit exam:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const getAutoSaveData = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.getAutoSaveData,
    "with data:",
    fields?.exam_paper_id,
    fields?.student_user_exam_id
  );

  return await axios
    .post(apiurl + endPoint.getAutoSaveData, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in submit exam:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const getSubmitExamResults = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.submitExam,
    "with data:",
    fields?.exam_paper_id,
    fields?.student_user_exam_id
  );

  return await axios
    .post(apiurl + endPoint.submitExam, fields, { headers: headers })
    .then((res) => res)
    .catch((error) => {
      console.error(
        "Error in submit exam:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const getResetPasswordConfirmation = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.updatepassword,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.updatepassword, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in submit exam:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const getPreviousPapRes = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.prevpap,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.prevpap, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in prev exam:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const getPreviousPapers = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };
  console.log(
    "Making request to previousPapers:",
    apiurl + endPoint.previousPapers,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.previousPapers, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in previouspapers:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const getPatternSelection = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };
  console.log("PatternSelection:", apiurl + endPoint.pattern, fields, {
    headers: headers,
  });

  return await axios
    .post(apiurl + endPoint.pattern, fields, { headers: headers })
    .then((res) => res)
    .catch((error) => {
      console.error(
        "Error in PatternSelection:",
        error.response?.data || error.message
      );
      return error;
    });
};
export const getAchievements = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.achievements,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.achievements, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in achievements:",
        error.response?.data || error.message
      );
      return error;
    });
};
export const getAchievementBadges = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.achivementBadges,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.achivementBadges, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in achivementBadges:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const getLeaderBoards = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.leaderBoard,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.leaderBoard, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in leader board:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const getExamResult = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.resultExamData,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.resultExamData, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in leader board:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const getAttempts = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.attempts,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.attempts, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in leader board:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const getYearsData = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.years,
    "with data:",
    fields
  );

  return await axios
    .get(apiurl + endPoint.years, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in year data:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const getMockExams = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.mocktest,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.mocktest, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in mock exam:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const getCustomExams = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:customeExams",
    apiurl + endPoint.customExams,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.customExams, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in custome Exams:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const getSubjects = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.subjects,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.subjects, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in mock exam:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const getChapters = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.chapters,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.chapters, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in mock exam:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const createCustomExams = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.createCustomExam,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.createCustomExam, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in mock exam:",
        error.response?.data || error.message
      );
      return error;
    });
};
export const getDashboardExamResult = async (fields) => {
  const API_URL = "https://mocktestapi.rizee.in/api/v1/reports/dashboard";
  console.log(API_URL, fields, "whatsHappening");
  try {
    const response = await axios.post(API_URL, fields, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000, // 10s timeout
    });

    console.log("✅ Success:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    return null;
  }
};

export const getAutoLogin = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  const token = await AsyncStorage.getItem("authToken");

  const data = {
    token: token,
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.autologin,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.autologin, data, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in auto log:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const getExamType = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.examtype,
    "with data:",
    fields
  );

  return await axios
    .get(apiurl + endPoint.examtype, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in getExamType:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const getPreExam = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };
  console.log(
    "Making request to pre exam:",
    apiurl + endPoint.exmQuestions,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.exmQuestions, fields, { headers: headers })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
};

export const getPreExamdata = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };
  console.log(
    "Making request to pre exam:",
    apiurl + endPoint.startExam,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.startExam, fields, { headers: headers })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
};
export const addExams = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };
  console.log(
    "Making request to pre exam:",
    apiurl + endPoint.addExams,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.addExams, fields, { headers: headers })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
};

export const getPreExamOptions = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };
  const data = {
    exam_paper_id: 15090,
    exam_session_id: 0,
    type: "schedule_exam",
  };
  return await axios
    .get(apiurl + endPoint.preExam, data, { headers: headers })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
};

export const getUpdatedEmail = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };
  const data = {
    exam_paper_id: 15090,
    exam_session_id: 0,
    type: "schedule_exam",
  };
  return await axios
    .post(apiurl + endPoint.updateEmail, fields, { headers: headers })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data || error.message;
    });
};

export const getSignUpDetails = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.signup,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.signup, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in sign up det:",
        error.response?.data || error.message
      );
      return error.response?.data;
    });
};

export const reSendOTP = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.resendOtp,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.resendOtp, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in sign up det:",
        error.response?.data || error.message
      );
      return error;
    });
};

export const getResetDetails = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.resetPass,
    "with data:",
    fields
  );

  try {
    const res = await axios.post(apiurl + endPoint.resetPass, fields, {
      headers: headers,
    });
    return res.data;
  } catch (error) {
    console.error("Error in reset det:", error.response?.data || error.message);
    throw error.response;
  }
};

export const getLoginDetails = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.login,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.login, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error("Error in login det:", error.response.data, error.message);
      return error.response.data || error.message;
    });
};

export const getOTPSubmittedDetails = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };

  console.log(
    "Making request to:",
    apiurl + endPoint.verifyOtp,
    "with data:",
    fields
  );

  return await axios
    .post(apiurl + endPoint.verifyOtp, fields, { headers: headers })
    .then((res) => res.data)
    .catch((error) => {
      console.error(
        "Error in otp submit:",
        error.response?.data || error.message
      );
      return error.response?.data || error.message;
    });
};
export const getConstituencies = async (fields) => {
  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };
  return await axios
    .post(apiurl + "/api/constituency", fields, { headers: headers })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      // window.location = "/";
      return error;
    });
};

export const myConstituencyData = async (fields) => {
  const sessiondetails = await AsyncStorage.getItem("userdata");
  const constuserdetails = JSON.parse(sessiondetails);

  const headers = {
    "content-type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    token: constuserdetails.accessToken,
  };
  fields.userId = constuserdetails.user.u_id;
  return await axios
    .post(apiurl + "/api/user/myConstituencyData", fields, { headers: headers })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      // window.location = "/";
      return error;
    });
};

// Perfomance analasys Tab API's

export const avgScoringTime = async (fields) => {
  try {
    const headers = {
      "content-type": "application/json",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      token: fields.token,
    };

    return await axios.post(
      apiurl + "/api/v1/reports/preformance/avgScoringTime",
      fields,
      { headers }
    );
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return error;
  }
};
export const weekAvgScoringTime = async (fields) => {
  try {
    const headers = {
      "content-type": "application/json",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      token: fields.token,
    };

    return await axios.post(
      apiurl + "/api/v1/reports/preformance/weekTestActivity",
      fields,
      { headers }
    );
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return error;
  }
};

export const chapterWiseAvgScores = async (fields) => {
  try {
    const headers = {
      "content-type": "application/json",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      token: fields.token,
    };

    return await axios.post(apiurl + endPoint.chapterwisePerformance, fields, {
      headers,
    });
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return error;
  }
};
