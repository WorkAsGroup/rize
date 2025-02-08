import axios from "axios";
// let apiurl = "https://studentapi.rizee.in";
let apiurl = "https://mocktestapi.rizee.in"

export const endPoint = {
	examtype: "/api/v1/general/exams",
	preExam: "/api/v1/mocktests/guest",
	exmQuestions: "/api/v1/exams/questions",
	signup: "/api/v1/auth/register",
	login: "/api/v1/auth/login",
	verifyOtp: "/api/v1/auth/verifyOtp",
	forgetPassword: "/api/v1/auth/forgetPassword",
	changePassword: "/api/v1/auth/changePassword",
	googleAuth: "/api/v1/auth/google",
	updateDetails: "/api/v1/auth/updateMobileOrEmail",
  };

import AsyncStorage from "@react-native-async-storage/async-storage";

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
	const data = {
		"exam_paper_id":15090,
		"exam_session_id":0,
		"type":"schedule_exam"
	}
	return await axios
		.post(apiurl +  endPoint.exmQuestions, data, { headers: headers })
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
  
	console.log("Making request to:", apiurl + endPoint.examtype, "with data:", fields);
	
	return await axios
	  .post(apiurl + endPoint.signup, fields, { headers: headers })
	  .then((res) => res.data)
	  .catch((error) => {
		console.error("Error in getExamType:", error.response?.data || error.message);
		return error;
	  }); 
  };

  export const getLoginDetails = async (fields) => {
	const headers = {
	  "content-type": "application/json",
	  "X-Content-Type-Options": "nosniff",
	  "X-Frame-Options": "SAMEORIGIN",
	};
  
	console.log("Making request to:", apiurl + endPoint.examtype, "with data:", fields);
	
	return await axios
	  .post(apiurl + endPoint.login, fields, { headers: headers })
	  .then((res) => res.data)
	  .catch((error) => {
		console.error("Error in getExamType:", error.response?.data || error.message);
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