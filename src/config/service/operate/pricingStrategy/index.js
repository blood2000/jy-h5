import request from "../../../request.js";

// 查询运价策略
export function getList(query,config) {
  return request({
    url: '/jyz/orderPolicyInfo/list',
    method: 'get',
    params: query,
	headers: config,
  });
}
// 生效的运价列表
export function getEffectiveList(query,config) {
  return request({
    url: '/jyz/orderPolicyInfo/effectiveList',
    method: 'get',
    params: query,
	headers: config,
  });
}

// 运价策略细项分页列表
export function getDetailList(query,config) {
  return request({
    url: '/jyz/orderPolicyInfo/detailList',
    method: 'get',
    params: query,
	headers: config,
  });
}

// 运价策略细项历史分页列表
export function historyList(query,config) {
  return request({
    url: '/jyz/orderPolicyInfo/historyList',
    method: 'get',
    params: query,
	headers: config,
  });
}

// 新增运价策略
export function addStrategy(data,config) {
  return request({
    url: '/jyz/orderPolicyInfo/add',
    method: 'post',
    data: {isArrayQuery: JSON.stringify(data)},
	headers: config,
  });
}

// 编辑运价策略
export function eidtStrategy(data,config) {
  return request({
    url: '/jyz/orderPolicyInfo/update',
    method: 'post',
    data: {isArrayQuery: JSON.stringify(data)},
	headers: config,
  });
}

// 删除运价策略
export function deleteStrategy(id,config) {
  return request({
    url: `/jyz/orderPolicyInfo/${id}`,
    method: 'delete',
	headers: config,
  });
}
