import uniRequest from "../../request.js";

// 司机列表
export function listInfo(data, config) {
  return uniRequest({
    url: '/jyz/driver/list',
    method: 'get',
    data: Object.assign({}, data),
	headers: config
  });
}

// 新增司机
export function addInfo(data, config) {
  return uniRequest({
    url: '/assets/driver/addJyzDriver',
    method: 'post',
    data: data,
	headers: config
  });
}

// 编辑司机
export function updateInfo(data, config) {
  return uniRequest({
    url: '/assets/driver/updateJyzDriver',
    method: 'PUT',
    data: data,
	headers: Object.assign({}, config, {'Content-Type':'application/json'})
  });
}

// 查询司机详情
export function getInfo(driverCode, config) {
  return uniRequest({
    url: '/jyz/driver/getDriverByCode/' + driverCode,
    method: 'get',
	headers: config
  });
}

// 删除司机与租户关系
export function delInfo(driverCodes, config) {
  return uniRequest({
    url: '/jyz/driver/' + driverCodes,
    method: 'delete',
	headers: config
  });
}

// 根据手机号查询司机
export function selectInfo(telphone, config) {
  return uniRequest({
    url: '/jyz/driver/selectDriverInfoByDriverInfoQueryBo',
    method: 'get',
    data: {
      telphone
    },
	headers: config
  });
}
