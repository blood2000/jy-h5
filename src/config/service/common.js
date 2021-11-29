import uniRequest from "../request.js";

// 获取字典
export function getDicts(dictType, config) {
  return uniRequest({
    url: '/system/dict/data/type/' + dictType,
    method: 'get',
	headers: config
  });
}

// 获取省份字典
export function getProvinceList(data, config) {
  return uniRequest({
    url: '/system/province/list',
    method: 'get',
	data: data,
	headers: config
  });
}

// 上传图片api
export const uploadImgApi = '/assets/upload/uploadToHW';

// 获取文件列表
export function getFile(code, config) {
  return uniRequest({
    url: '/assets/upload/getUrlByCode?code=' + code,
    method: 'post',
	headers: config
  });
}

// 自动识别
export function uploadOcr(data, config) {
  return uniRequest({
    url: '/assets/upload/ocr',
    method: 'post',
    data: data,
	headers: config
  });
}

