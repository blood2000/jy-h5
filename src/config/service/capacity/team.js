import uniRequest from "../../request.js";

// 调度者列表
export function listInfo(data, config) {
  return uniRequest({
    url: '/jyz/team/list',
    method: 'get',
    data: Object.assign({}, data),
	headers: config
  });
}
