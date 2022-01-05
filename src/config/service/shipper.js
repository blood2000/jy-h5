import request from "../request.js";

// 收发企业分页列表
export function tenantCompanyInfoList(query, config) {
  return request({
    url: `/jyz/tenantCompanyInfo/list`,
    method: 'get',
    params: query,
    headers: config
  });
}

// 新增收发企业
export function tenantCompanyInfoAdd(data, config) {
  return request({
    url: '/jyz/tenantCompanyInfo/add',
    method: 'post',
    data: data,
    headers: config
  });
}

// 编辑收发企业
export function tenantCompanyInfoUpdate(data, config) {
  return request({
    url: '/jyz/tenantCompanyInfo/update',
    method: 'post',
    data: data,
    headers: config
  });
}

// 启用禁用
export function tenantCompanyInfoUpdateStatus(data, config) {
  return request({
    url: '/jyz/tenantCompanyInfo/updateStatus',
    method: 'post',
    data: data,
    headers: config
  });
}
