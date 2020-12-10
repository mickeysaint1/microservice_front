import request from "@/js/axios-config";
import router from '@/router'

export function getUserInfoByUserNamePassword(data) {
	return request({
		url: "/service-oauth2/oauth2/login",
		method: "post",
		data: data
	});
}

export function getUserData() {
	if (localStorage.getItem("userData") != null) {
		return JSON.parse(localStorage.getItem("userData"));
	} else {
		router.push("/login");
		return {};
	}
}
