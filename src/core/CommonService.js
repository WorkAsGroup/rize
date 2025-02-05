import axios from "axios";
let apiurl = "https://studentapi.rizee.in";

export const endPoint = () =>{
	signup = "/api/v1/auth/registration";
	login = "/api/v1/auth/login";
	verifyOtp = "/api/v1/auth/verifyOtp";
	forgetPassword = "/api/v1/auth/forgetPasswod";
	changePassword = "/api/v1/auth/changePasswod";
	googleAuth = "/api/v1/auth/google";
	updateDetails = "/api/v1/auth/updateMobileOrEmail";
}

import AsyncStorage from "@react-native-async-storage/async-storage";

export const getSignUpDetails = async (fields) => {
	const headers = {
		"content-type": "application/json",
		"X-Content-Type-Options": "nosniff",
		"X-Frame-Options": "SAMEORIGIN",
	};
	return await axios
		.post(apiurl + endPoint.signup , fields, { headers: headers })
		.then((res) => {
			return res.data;
		})
		.catch((error) => {
			// window.location = "/";
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