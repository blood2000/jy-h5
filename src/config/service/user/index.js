import request from "@/config/request.js";

// 获取用户信息
export function queryUserInfo(data) {
  return request({
    url: '/jyz/user/queryUserInfo',
    method: 'post',
    data: data
  });
}
