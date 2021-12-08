import request from "../../request.js";

// 运输计划分页列表
export function orderPlanInfoList(query) {
  return request({
    url: `/jyz/orderPlanInfo/list`,
    method: 'get',
    params: query
  });
}

// 运输计划分页详情
export function orderPlanInfoDetatil(id) {
  return request({
    url: `/jyz/orderPlanInfo/orderPlanDetatil?id=${id}`,
    method: 'get',
  });
}


// 新增运输计划
export function orderPlanInfoAdd(data) {
  return request({
    url: '/jyz/orderPlanInfo/add',
    method: 'post',
    data: {isArrayQuery: JSON.stringify(data)}
  });
}

// 编辑运输计划
export function orderPlanInfoUpdate(data) {
  return request({
    url: '/jyz/orderPlanInfo/update',
    method: 'post',
    data: {isArrayQuery: JSON.stringify(data)}
  });
}


// 要删掉


// 根据调度者编号查询调度者列表
export function teamSelectTeamListByCodes(data) {
  return request({
    url: `/jyz/team/selectTeamListByCodes`,
    method: 'post',
    data: {isArrayQuery: JSON.stringify(data)}
  });
}




// 计划启用禁用
export function orderPlanInfoUpdateStatus(data) {
  return request({
    url: '/jyz/orderPlanInfo/updateStatus',
    method: 'post',
    data: {isArrayQuery: JSON.stringify(data)}
  });
}


// 其他的接口, 如果存在了可以删掉

// 租户运输公司列表
export function listInfo(data) {
  return request({
    url: '/jyz/tenantTrans/list',
    method: 'get',
    params: Object.assign({}, data)
  });
}

// 货源管理分页列表
export function orderInfoList(query) {
  return request({
    url: `/jyz/orderInfo/list`,
    method: 'get',
    params: query
  });
}

// 收发企业分页列表
export function tenantCompanyInfoList(query) {
  return request({
    url: `/jyz/tenantCompanyInfo/list`,
    method: 'get',
    params: query
  });
}


// 调度者列表
export function getDispatcherTeam(data) {
  return request({
    url: '/jyz/team/list',
    method: 'get',
    params: Object.assign({}, data)
  });
}

// 租户常用地址分页列表复制接口复制文档复制地址
export function tenantCompanyAddressInfoList(query) {
  return request({
    url: `/jyz/tenantCompanyAddressInfo/list`,
    method: 'get',
    params: query
  });
}

// 生效的运价列表
export function tenantGoodsPolicyInfo(query) {
  return request({
    url: '/jyz/orderPolicyInfo/effectiveList',
    method: 'get',
    params: query
  });
}

// 生效的货价列表
export function getEffectiveGoodsList(query) {
  return request({
    url: '/jyz/tenantGoodsPolicyInfo/effectiveGoodsList',
    method: 'get',
    params: query
  });
}

// 计算公式管理分页列表
export function orderPlanFreightList(query) {
  return request({
    url: `/jyz/orderPlanFreight/list`,
    method: 'get',
    params: query
  });
}

