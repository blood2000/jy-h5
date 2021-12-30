import request from "../../request.js";

// 租户常用地址分页列表复制接口复制文档复制地址
export function getList(query, config) {
  return request({
    url: `/jyz/tenantCompanyAddressInfo/list`,
    method: 'get',
    headers: config,
    params: query
  });
}


// 是否可以删除电子围栏
export function tenantCompanyAddressInfo_isDelWl(id, config) {
  return request({
    url: `/jyz/tenantCompanyAddressInfo/isDelWl/${id}`,
	headers: config,
    method: 'get'
  });
}

// 新增租户常用地址
export function tenantCompanyAddressInfoAdd(data, config) {
  return request({
    url: '/jyz/tenantCompanyAddressInfo/add',
    method: 'post',
	headers: config,
    data: {isArrayQuery: JSON.stringify(data)}
  });
}

// 编辑租户常用地址
export function tenantCompanyAddressInfoUpdate(data, config) {
  return request({
    url: '/jyz/tenantCompanyAddressInfo/update',
    method: 'post',
	headers: config,
    data: {isArrayQuery: JSON.stringify(data)}
  });
}

// 启用禁用
export function tenantCompanyAddressInfoUpdateStatus(data, config) {
  return request({
    url: '/jyz/tenantCompanyAddressInfo/updateStatus',
    method: 'post',
	headers: config,
    data: {isArrayQuery: JSON.stringify(data)}
  });
}
