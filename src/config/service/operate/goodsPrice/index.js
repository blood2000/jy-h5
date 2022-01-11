import request from "../../../request.js";

// 查询货价策略
export function getList(query,config) {
  return request({
    url: '/jyz/tenantGoodsPolicyInfo/list',
    method: 'get',
    params: query,
	headers: config,
  });
}
// 生效的货价列表
export function getEffectiveGoodsList(query,config) {
  return request({
    url: '/jyz/tenantGoodsPolicyInfo/effectiveGoodsList',
    method: 'get',
    params: query,
	headers: config,
  });
}

// 查询货品列表
export function goodsList(query,config) {
  return request({
    url: '/jyz/tenantGoodsRel/list',
    method: 'get',
    params: query,
	headers: config,
  });
}

// 货价策略细项分页列表
export function getDetailList(query,config) {
  return request({
    url: '/jyz/tenantGoodsPolicyInfo/detailList',
    method: 'get',
    params: query,
	headers: config,
  });
}

// 货价策略细项历史分页列表
export function historyList(query,config) {
  return request({
    url: '/jyz/tenantGoodsPolicyInfo/historyList',
    method: 'get',
    params: query,
	headers: config,
  });
}

// 新增货价策略
export function addStrategy(data,config) {
  return request({
    url: '/jyz/tenantGoodsPolicyInfo/add',
    method: 'post',
    data: {isArrayQuery: JSON.stringify(data)},
	headers: config,
  });
}

// 编辑货价策略
export function eidtStrategy(data,config) {
	console.log(data);
  return request({
    url: '/jyz/tenantGoodsPolicyInfo/update',
    method: 'post',
    data: {isArrayQuery: JSON.stringify(data)},
	headers: config,
  });
}

// 删除货价策略
export function deleteStrategy(id,config) {
  return request({
    url: `/jyz/tenantGoodsPolicyInfo/${id}`,
    method: 'delete',
	headers: config,
  });
}
