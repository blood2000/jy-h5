import store from '@/store'
import apiUrl from '../api/buildingApi'
const baseUrl = process.env.VUE_APP_BASE_API;
//config:url, method, params, data, util
const buildingRequest = function (config) {
  uni.showLoading();
  let util = config.resFun;
  if (!util) {
    util = {
      showError: true, //开启错误提示
    }
  }
  let defaultHeader = config.header;
  console.log(defaultHeader)
  if (config.contentType) {
    defaultHeader['Content-Type'] = config.contentType;
  } else {
    defaultHeader['Content-Type'] = 'application/json;charset=utf-8';
  }
  let url = '';
  if (config.querys) {
    url = apiUrl[config.url] + '?';
    console.log(apiUrl[config.url])
    for (const key of Object.keys(config.querys)) {
      url += key + '=' + config.querys[key] + '&'
    }
    url = url.slice(0, -1);
  } else {
    url = apiUrl[config.url]
  }
  console.log('请求地址', baseUrl + url);
  return new Promise((resolve, reject) => {
    uni.request({
      url: baseUrl + url,
      method: config.method || 'GET',
      data: config.data || {},
      header: defaultHeader,
      success: (res) => {
        uni.hideLoading();
        if (res.data.code === 200) {
          resolve(res.data)
          
        } else {
          // if(util.showError){
          // 	showError(res);
          // }
          uni.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
          });
          // resolve(res)
        }
      },
      fail: (err) => {
        uni.hideLoading();
        // 失败做处理
        if (util.showError) {
          showError(res);
        }
        reject(err)
      }
    })
  })

}
const showError = (error) => {
  if (error) {
    switch (error.data.code) {
      case 401:
        uni.showToast({
          title: '没有权限',
          icon: 'none',
          duration: 1000
        });
        break;

      case 403:
        uni.showToast({
          title: '拒绝访问',
          icon: 'none',
          duration: 1000
        });
        break;

      case 404:
        uni.showToast({
          title: '很抱歉，资源未找到!',
          icon: 'none',
          duration: 1000
        });
        break;

      case 500:
        uni.showToast({
          title: '没有权限',
          icon: 'none',
          duration: 1000
        });
        break;

      case 502:
        uni.showToast({
          title: '服务器异常',
          icon: 'none',
          duration: 1000
        });
        break;

      case 504:
        uni.showToast({
          title: '网络超时',
          icon: 'none',
          duration: 1000
        });
        break;

      default:
        uni.showToast({
          title: "网络错误",
          icon: 'none',
          duration: 1000
        });
        break
    }
  }
}

export default buildingRequest;