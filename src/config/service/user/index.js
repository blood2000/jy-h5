import request from "@/config/request.js";

// 获取用户信息
export function queryUserInfo(data, config) {
  return request({
    url: '/jyz/user/queryUserInfo',
    method: 'post',
    headers: config,
    data: data
  });
}
