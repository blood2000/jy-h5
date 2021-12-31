import request from "@/config/request.js";

// 当前司机的运单
export function findList(query, config) {
  console.log('config', config)
  return request({
    url: `/jyz/wxmp/jyz-waybill-opera/findList`,
    method: 'get',
    headers: config,
    params: query
  });
}