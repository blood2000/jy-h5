import uniRequest from "../../request.js";

// 添加租户与司机\车辆\调度者关系
export function addTenantRel(data, config) {
  return uniRequest({
    url: '/jyz/driver/insertTenantDriverVehicleRel',
    method: 'post',
    data: Object.assign({}, data, { isApp: 1 }),
	headers: config
  });
}
