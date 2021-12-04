import uniRequest from "uni-request";
import store from '../store';

const headers = store.state.header.headerInfo

// 全局配置
uniRequest.defaults.baseURL = process.env.VUE_APP_BASE_API;
uniRequest.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';

// 初始化头部
uniRequest.defaults.headers['Produce-Code'] = headers['Produce-Code'] 
uniRequest.defaults.headers['App-Code'] = headers['App-Code']
uniRequest.defaults.headers['App-Type'] = headers['App-Type']
uniRequest.defaults.headers['App-Version'] = headers['App-Version']
uniRequest.defaults.headers['Terminal-Type'] = headers['Terminal-Type']
uniRequest.defaults.headers['Authorization'] = uni.getStorageSync('token') || headers['Authorization'];

// 请求拦截
uniRequest.interceptors.request.use(
	config => {
		
		
		config.headers.Authorization = uni.getStorageSync('token') || headers['Authorization'];
		console.log('请求头cc', JSON.stringify(config.headers.Authorization));

		if(config.data && config.data.isArrayQuery){
			if (config.data.isArrayQuery) {
				try{
					config.data = JSON.parse(config.data.isArrayQuery)
				}catch(e){
					//TODO handle the exception
				}
			}
		}
		return config;
	},
	err => {
		console.log('请求失败');
		return Promise.reject(err);
	}
);

// 响应拦截
uniRequest.interceptors.response.use(
	res => {
		const code = res.data.code || 200;
		const msg = res.data.msg || '系统未知错误,请反馈给管理员';
		if (code === 401) {
			uni.showToast({
				title: msg,
				icon: 'none',
				duration: 2000
			});
			return Promise.reject(new Error(msg));
		} else if (code === 500) {
			uni.showToast({
				title: msg,
				icon: 'none',
				duration: 2000
			});
			return Promise.reject(new Error(msg));
		} else if (code !== 200) {
			uni.showToast({
				title: msg,
				icon: 'none',
				duration: 2000
			});
			return Promise.reject('error');
		} else {
			return res.data;
		}
		return Promise.resolve(response);
	},
	error => {
		return Promise.reject(error);
	}
);

export default uniRequest;
