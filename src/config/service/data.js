import request from "@/config/request";


// 根据字典类型查询字典数据信息
export function getDicts(dictType, config) {
  return request({
    url: '/system/dict/data/type/' + dictType,
    method: 'get',
    headers: config
  });
}

export function getDictsByType(data, config) {
  return request({
    url: '/system/dict/data/listDataByDict',
    method: 'post',
    data: data,
    headers: config
  });
}

// 大小类查询接口
export function listByDict(data,config ) {
  return request({
    url: '/system/dict/data/listDataByDict',
    method: 'post',
    data: data,
    headers: config
  });
}

