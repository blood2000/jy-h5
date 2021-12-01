import uniRequest from "../../request.js";

// 车辆列表
export function listInfo(data, config) {
  return uniRequest({
    url: '/jyz/vehicle/list',
    method: 'get',
    data: Object.assign({}, data),
	headers: config
  });
}

// 新增车辆
export function addInfo(data, config) {
  return uniRequest({
    url: '/assets/vehicle/addJyzVehicle',
    method: 'post',
    data: data,
	headers: config
  });
}

// 修改车辆
export function updateInfo(data, config) {
  return uniRequest({
    url: '/assets/vehicle/editJyzVehicle',
    method: 'PUT',
    data: data,
    headers: Object.assign({}, config, {'Content-Type':'application/json'})
  });
}

// 车辆详情
export function getInfo(vehicleCode, config) {
  return uniRequest({
    url: '/jyz/vehicle/selectVehicleInfoByCode/' + vehicleCode,
    method: 'get',
	headers: config
  });
}

// 删除租户与车辆的关系
export function delInfo(vehicleCodes, config) {
  return uniRequest({
    url: '/jyz/vehicle/' + vehicleCodes,
    method: 'delete',
	headers: config
  });
}