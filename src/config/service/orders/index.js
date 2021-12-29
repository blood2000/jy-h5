import request from "../../request.js";

// orderInfoList, orderInfoAdd, orderInfoUpdate, orderInfoUpdateStatus


// 货源管理分页列表
export function orderInfoList(query, config) {
  return request({
    url: `/jyz/orderInfo/list`,
    method: 'get',
    params: query,
    headers: config,
  });
}

// 新增货源管理
export function orderInfoAdd(data, config) {
  return request({
    url: '/jyz/orderInfo/add',
    method: 'post',
    data: data,
    headers: config,
  });
}

// 编辑货源管理
export function orderInfoUpdate(data, config) {
  return request({
    url: '/jyz/orderInfo/update',
    method: 'post',
    data: data,
    headers: config,
  });
}

// 货源管理启用禁用
export function orderInfoUpdateStatus(data, config) {
  return request({
    url: '/jyz/orderInfo/updateStatus',
    method: 'post',
    data: data,
    headers: config,
  });
}
