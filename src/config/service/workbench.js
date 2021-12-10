import uniRequest from "../request.js";
// import baseURL from '../index.js';

// 常用应用列表
export function listUsually(config) {
	return uniRequest({
		url: '/system/sysCommonUser/querySysCommonUserMenuByUserCode',
		method: 'get',
		headers: config
	});
}

// 添加常用应用
export function addUsually(menuCodes, config) {
	return uniRequest({
		url: '/system/sysCommonUser/add',
		method: 'post',
		data: {
			menuCodes: menuCodes
		},
		headers: config
	});
}

// 删除常用应用
export function deleteUsually(menuCodes, config) {
	return uniRequest({
		url: '/system/sysCommonUser/' + menuCodes,
		method: 'delete',
		headers: config
	});
}

// 应用列表
export function applicateList(config) {
	return uniRequest({
		url: '/system/sysCommonUser/queryAllMenuByUser',
		method: 'get',
		headers: config
	});
}

// 新闻列表
export function listNews(data, config) {
	return uniRequest({
		url: '/system/websiteNews/list',
		method: 'post',
		data: data,
		headers: config
	});
}

// 通知/公告列表
export function userNotice(query, config) {
	return uniRequest({
		url: '/system/userNotice/appList',
		method: 'get',
		params: query,
		headers: config
	});
}
