import uniRequest from "../request.js";

// 收发统计列表
export function planStatisticsList(query, config) {
	return uniRequest({
		url: '/jyz/jyzWaybillSearch/planStatisticsList',
		method: 'get',
		params: query,
		headers: config
	});
}

// 自定义统计列表
export function statisticsList(query, config) {
	return uniRequest({
		url: '/jyz/jyzWaybillSearch/statisticsList',
		method: 'get',
		params: query,
		headers: config
	});
}
