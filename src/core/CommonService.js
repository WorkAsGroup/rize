import axios from "axios";
// let apiurl = "https://studentapi.rizee.in";
let apiurl = "https://mocktestapi.rizee.in"

export const endPoint = {
	examtype: "/api/v1/general/exams",
	preExam: "/api/v1/mocktests/guest",
	exmQuestions: "/api/v1/exams/questions",
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
	achievements:"/api/v1/general/achievements",
	leaderBoard:"/api/v1/general/leaderboards",
	previousPapers:"/api/v1/previousPapers",
	pattern:"/api/v1/exams/pattern-sections"
  };

import AsyncStorage from "@react-native-async-storage/async-storage";

export const getPreviousPapers = async (fields) => {
	const headers = {
	  "content-type": "application/json",
	  "X-Content-Type-Options": "nosniff",
	  "X-Frame-Options": "SAMEORIGIN",
	};
	return await axios
	  .post(apiurl + endPoint.previousPapers, fields, { headers: headers })
	  .then((res) => res.data)
	  .catch((error) => {
		console.error("Error in previouspapers:", error.response?.data || error.message);
		return error;
	  }); 
  };

  export const getPatternSelection = async (fields) => {
	const headers = {
	  "content-type": "application/json",
	  "X-Content-Type-Options": "nosniff",
	  "X-Frame-Options": "SAMEORIGIN",
	};
	console.error("PatternSelection:", apiurl + endPoint.pattern, fields, { headers: headers });

	return await axios
	  .post(apiurl + endPoint.pattern, fields, { headers: headers })
	  .then((res) => res.data)
	  .catch((error) => {
		console.error("Error in PatternSelection:", error.response?.data || error.message);
		return error;
	  }); 
  };
export const getAchievements = async (fields) => {
	const headers = {
	  "content-type": "application/json",
	  "X-Content-Type-Options": "nosniff",
	  "X-Frame-Options": "SAMEORIGIN",
	};
  
	console.log("Making request to:", apiurl + endPoint.achievements, "with data:", fields);
	
	return await axios
	  .post(apiurl + endPoint.achievements, fields, { headers: headers })
	  .then((res) => res.data)
	  .catch((error) => {
		console.error("Error in achievements:", error.response?.data || error.message);
		return error;
	  }); 
  };

  export const getLeaderBoards = async (fields) => {
	const headers = {
	  "content-type": "application/json",
	  "X-Content-Type-Options": "nosniff",
	  "X-Frame-Options": "SAMEORIGIN",
	};
  
	console.log("Making request to:", apiurl + endPoint.leaderBoard, "with data:", fields);
	
	return await axios
	  .post(apiurl + endPoint.leaderBoard, fields, { headers: headers })
	  .then((res) => res.data)
	  .catch((error) => {
		console.error("Error in leader board:", error.response?.data || error.message);
		return error;
	  }); 
  };

export const getYearsData = async (fields) => {
	const headers = {
	  "content-type": "application/json",
	  "X-Content-Type-Options": "nosniff",
	  "X-Frame-Options": "SAMEORIGIN",
	};
  
	console.log("Making request to:", apiurl + endPoint.years, "with data:", fields);
	
	return await axios
	  .get(apiurl + endPoint.years, fields, { headers: headers })
	  .then((res) => res.data)
	  .catch((error) => {
		console.error("Error in year data:", error.response?.data || error.message);
		return error;
	  }); 
  };

  export const getMockExams = async (fields) => {
	const headers = {
	  "content-type": "application/json",
	  "X-Content-Type-Options": "nosniff",
	  "X-Frame-Options": "SAMEORIGIN",
	};
  
	console.log("Making request to:", apiurl + endPoint.mocktest, "with data:", fields);
	
	return await axios
	  .post(apiurl + endPoint.mocktest, fields, { headers: headers })
	  .then((res) => res.data)
	  .catch((error) => {
		console.error("Error in mock exam:", error.response?.data || error.message);
		return error;
	  }); 
  };

export const getAutoLogin = async (fields) => {
	const headers = {
	  "content-type": "application/json",
	  "X-Content-Type-Options": "nosniff",
	  "X-Frame-Options": "SAMEORIGIN",
	};

	const token = await AsyncStorage.getItem('authToken');

	const data = {
		token : token
	}
  
	console.log("Making request to:", apiurl + endPoint.autologin, "with data:", fields);
	
	return await axios
	  .post(apiurl + endPoint.autologin, data, { headers: headers })
	  .then((res) => res.data)
	  .catch((error) => {
		console.error("Error in auto log:", error.response?.data || error.message);
		return error;
	  }); 
  };

export const getExamType = async (fields) => {
	const headers = {
	  "content-type": "application/json",
	  "X-Content-Type-Options": "nosniff",
	  "X-Frame-Options": "SAMEORIGIN",
	};
  
	console.log("Making request to:", apiurl + endPoint.examtype, "with data:", fields);
	
	return await axios
	  .get(apiurl + endPoint.examtype, fields, { headers: headers })
	  .then((res) => res.data)
	  .catch((error) => {
		console.error("Error in getExamType:", error.response?.data || error.message);
		return error;
	  }); 
  };

export const getPreExam = async (fields) => {
	const headers = {
		"content-type": "application/json",
		"X-Content-Type-Options": "nosniff",
		"X-Frame-Options": "SAMEORIGIN",
	};
	console.log("Making request to pre exam:", apiurl + endPoint.exmQuestions, "with data:", fields);

	return await axios
		.post(apiurl +  endPoint.exmQuestions, fields, { headers: headers })
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
		"exam_paper_id":15090,
		"exam_session_id":0,
		"type":"schedule_exam"
	}
	return await axios
		.get(apiurl +  endPoint.preExam, data, { headers: headers })
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
		"exam_paper_id":15090,
		"exam_session_id":0,
		"type":"schedule_exam"
	}
	return await axios
		.post(apiurl +  endPoint.updateEmail, fields, { headers: headers })
		.then((res) => {
			return res.data;
		})
		.catch((error) => {
			return error;
		});
};

export const getSignUpDetails = async (fields) => {
	const headers = {
	  "content-type": "application/json",
	  "X-Content-Type-Options": "nosniff",
	  "X-Frame-Options": "SAMEORIGIN",
	};
  
	console.log("Making request to:", apiurl + endPoint.signup, "with data:", fields);
	
	return await axios
	  .post(apiurl + endPoint.signup, fields, { headers: headers })
	  .then((res) => res.data)
	  .catch((error) => {
		console.error("Error in sign up det:", error.response?.data || error.message);
		return error;
	  }); 
  };

  export const getResetDetails = async (fields) => {
	const headers = {
	  "content-type": "application/json",
	  "X-Content-Type-Options": "nosniff",
	  "X-Frame-Options": "SAMEORIGIN",
	};
  
	console.log("Making request to:", apiurl + endPoint.resetPass, "with data:", fields);
	
	return await axios
	  .post(apiurl + endPoint.resetPass, fields, { headers: headers })
	  .then((res) => res.data)
	  .catch((error) => {
		console.error("Error in reset det:", error.response?.data || error.message);
		return error;
	  }); 
  };
  export const getLoginDetails = async (fields) => {
	const headers = {
	  "content-type": "application/json",
	  "X-Content-Type-Options": "nosniff",
	  "X-Frame-Options": "SAMEORIGIN",
	};
  
	console.log("Making request to:", apiurl + endPoint.login, "with data:", fields);
	
	return await axios
	  .post(apiurl + endPoint.login, fields, { headers: headers })
	  .then((res) => res.data)
	  .catch((error) => {
		console.error("Error in login det:", error.response?.data || error.message);
		return error;
	  }); 
  };

  export const getOTPSubmittedDetails = async (fields) => {
	const headers = {
	  "content-type": "application/json",
	  "X-Content-Type-Options": "nosniff",
	  "X-Frame-Options": "SAMEORIGIN",
	};
  
	console.log("Making request to:", apiurl + endPoint.verifyOtp, "with data:", fields);
	
	return await axios
	  .post(apiurl + endPoint.verifyOtp, fields, { headers: headers })
	  .then((res) => res.data)
	  .catch((error) => {
		console.error("Error in otp submit:", error.response?.data || error.message);
		return error;
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