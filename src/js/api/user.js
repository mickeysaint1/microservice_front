import request from "@/js/axios-config";

export function getUserInfoByUserNamePassword(data) {
	return request({
		url: "/service-oauth2/oauth2/login",
		method: "post",
		data: data
	});
}
