import request from "@/js/axios-config";

export function getTreeById(id) {
	return request({
		url: "/service-user/org/findTreeById?id=" + id,
		method: "post"
	});
}

export function getListDataByParentId(parentId) {
	return request({
		url: "/service-user/org/getListDataByParentId?parentId=" + parentId,
		method: "post"
	});
}