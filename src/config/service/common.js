import uniRequest from "../request.js";

// 获取数据集信息
export function getDicts(dictType, config) {
  return uniRequest({
    url: '/system/dict/data/type/' + dictType,
    method: 'get',
	headers: config
  });
}
