import request from "../../request.js";

// 租户物料分页列表
export function tenantGoodsRelList(query, config) {
  return request({
    url: `/jyz/tenantGoodsRel/list`,
    method: 'get',
    headers: config,
    params: query
  });
}

// 删除租户物料
export function tenantGoodsRelDelete(id, config) {
    return request({
      url: `/jyz/tenantGoodsRel/${id}`,
      method: 'DELETE',
      headers: config
    });
}

// 编辑租户物料
export function tenantGoodsRelUpdate(data, config) {
    return request({
      url: '/jyz/tenantGoodsRel/update',
      method: 'post',
      data: data,
      headers: config
    });
}

// 新增租户物料
export function tenantGoodsRelAdd(data, config) {
    return request({
      url: '/jyz/tenantGoodsRel/add',
      method: 'post',
      data: data,
      headers: config
    });
}


// // 运输计划分页详情
// export function orderPlanInfoDetatil(id, config) {
//   return request({
//     url: `/jyz/orderPlanInfo/orderPlanDetatil?id=${id}`,
//     method: 'get',
//     headers: config,
//   });
// }


// // 新增运输计划
// export function orderPlanInfoAdd(data, config) {
//   return request({
//     url: '/jyz/orderPlanInfo/add',
//     method: 'post',
//     headers: config,
//     data: {isArrayQuery: JSON.stringify(data)}
//   });
// }

// // 编辑运输计划
// export function orderPlanInfoUpdate(data, config) {
//   return request({
//     url: '/jyz/orderPlanInfo/update',
//     method: 'post',
//     headers: config,
//     data: {isArrayQuery: JSON.stringify(data)}
//   });
// }


// // 要删掉


// // 根据调度者编号查询调度者列表
// export function teamSelectTeamListByCodes(data, config) {
//   return request({
//     url: `/jyz/team/selectTeamListByCodes`,
//     method: 'post',
//     headers: config,
//     data: {isArrayQuery: JSON.stringify(data)}
//   });
// }




// // 计划启用禁用
// export function orderPlanInfoUpdateStatus(data, config) {
//   return request({
//     url: '/jyz/orderPlanInfo/updateStatus',
//     method: 'post',
//     headers: config,
//     data: {isArrayQuery: JSON.stringify(data)}
//   });
// }


// // 其他的接口, 如果存在了可以删掉

// // 租户运输公司列表
// export function listInfo(data, config) {
//   return request({
//     url: '/jyz/tenantTrans/list',
//     method: 'get',
//     headers: config,
//     params: Object.assign({}, data)
//   });
// }

// // 货源管理分页列表
// export function orderInfoList(query, config) {
//   return request({
//     url: `/jyz/orderInfo/list`,
//     method: 'get',
//     headers: config,
//     params: query
//   });
// }

// // 收发企业分页列表
// export function tenantCompanyInfoList(query, config) {
//   return request({
//     url: `/jyz/tenantCompanyInfo/list`,
//     method: 'get',
//     headers: config,
//     params: query
//   });
// }


// // 调度者列表
// export function getDispatcherTeam(data, config) {
//   return request({
//     url: '/jyz/team/list',
//     method: 'get',
//     headers: config,
//     params: Object.assign({}, data)
//   });
// }

// // 租户常用地址分页列表复制接口复制文档复制地址
// export function tenantCompanyAddressInfoList(query, config) {
//   return request({
//     url: `/jyz/tenantCompanyAddressInfo/list`,
//     method: 'get',
//     headers: config,
//     params: query
//   });
// }

// // 生效的运价列表
// export function tenantGoodsPolicyInfo(query, config) {
//   return request({
//     url: '/jyz/orderPolicyInfo/effectiveList',
//     method: 'get',
//     headers: config,
//     params: query
//   });
// }

// // 生效的货价列表
// export function getEffectiveGoodsList(query, config) {
//   return request({
//     url: '/jyz/tenantGoodsPolicyInfo/effectiveGoodsList',
//     method: 'get',
//     headers: config,
//     params: query
//   });
// }

// // 计算公式管理分页列表
// export function orderPlanFreightList(query, config) {
//   return request({
//     url: `/jyz/orderPlanFreight/list`,
//     method: 'get',
//     headers: config,
//     params: query
//   });
// }

