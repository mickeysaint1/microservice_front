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

export function deleteOrg(ids) {
	return request({
		url: "/service-user/org/delete",
		method: "post",
		data: ids
	});
}

export function saveOrg(data) {
	return request({
		url: "/service-user/org/save",
		method: "post",
		data: data
	});
}