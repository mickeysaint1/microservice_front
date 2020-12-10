import axios from 'axios';

const service = axios.create({
	baseURL: "http://localhost:8040/", // url = base url + request url
	withCredentials: true, // send cookies when cross-domain requests
	timeout: 60000 // request timeout
});

// 请求拦截器
service.interceptors.request.use(
	config => {
		const token = localStorage.getItem("accessToken");
		if (token != null && token != "") {
			config.headers.accessToken = token;
		} else {
			config.headers.accessToken = "";
		}
		console.log(config);
		return config;
	},
	error => {
		console.log(error);

		let resp = {success:false, message:"错误请求：" + error.name};
		return resp;
	}
);

service.interceptors.response.use(
	response => {
		console.log(response);
		return response.data;
	},
	error => {
		console.log(error);
		let errorMsg = "系统错误，请联系管理员。";
		if (error.response && error.response.status) {
			switch (error.response.status) {
				case 401:
					errorMsg = "身份验证失败。";
					break;
				case 404:
					errorMsg = "您访问的链接地址不存在。";
					break;
				default:
					errorMsg = "系统错误，请联系管理员。";
			}
		}

		let resp = {success:false, message:errorMsg};
		return resp;
	}
);

export default service;
