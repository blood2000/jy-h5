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
