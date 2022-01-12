import request from "@/config/request.js";

// 过磅记录列表
export function findList(query, config) {
  console.log('config', config)
  return request({
    url: `/jyz/jyzWaybillSearch/findList`,
    method: 'get',
    headers: config,
    params: query
  });
}

export function poundRoomList(query, config) {
  return request({
    url: `/poundRoomList`,
    method: 'get',
    headers: config,
    params: query
  });
}

// 磅房列表
export function buildInfoList(query, config) {
  return request({
    url: '/jyz/appWeighingRecord/buildInfoList',
    method: 'get',
    headers: config,
    params: query
  })
}

// 收发企业
export function getTenantCompanyInfoList(query, config) {
  return request({
    url: '/jyz/tenantCompanyInfo/list',
    method: 'get',
    headers: config,
    params: query
  })
}

// 运输计划
export function getOrderPlanInfoList(query, config) {
  return request({
    url: '/jyz/orderPlanInfo/list',
    method: 'get',
    headers: config,
    params: query
  })
}

// 运输计划
export function getWaybillInfoByDeviceNo(query, config) {
  return request({
    url: '/jyz/appWeighingRecord/waybillInfoByDeviceNo',
    method: 'get',
    headers: config,
    params: query
  })
}