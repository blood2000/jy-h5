import uniRequest from "../request.js";

// 获取数据集信息
export function getDataModel(id, config) {
  return uniRequest({
    url: '/analysis/dataModelInfos/' + id,
    method: 'get',
	headers: config
  });
}

// 模型查询
export function searchDataModel(data, config) {
  return uniRequest({
    url: '/analysis/dataModelInfos/query',
    method: 'post',
	data: data,
	headers: config
  });
}

// 根据数据项Id获取枚举类型
export function getCustomEnumById(id, config) {
  return uniRequest({
    url: '/analysis/dataItemInfos/getCustomEnum/' + id,
    method: 'get',
	headers: config
  });
}