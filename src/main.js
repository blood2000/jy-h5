import Vue from 'vue'
import App from './App'
import './common/css/index.scss'
import "./common/css/building.scss";
//引入vuex
import store from './store'
console.log(store,'请求---');
//与app桥接
// import './config/bridge.js'
//自定义指令
import './directive'
import { parseTime, numberFormat, numberFormatUnit, selectDictLabel } from './utils/ddc.js';
//复制到剪贴板
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import {VueJsonp} from 'vue-jsonp'
Vue.use(VueJsonp)

// uview
import uView from "uview-ui";
Vue.use(uView);

// webview跳回应用
import('@/utils/uni.webview.1.5.2.js')

// #ifdef H5
// 接收App传过来的数据
window.sendOption = (_data)=>{
    console.log('我被触发了, 收到的参数是~~~', JSON.stringify(_data));
    // store.dispatch('getLoginInfoAction', {
    //     'Authorization': _data.token
    // });
    // _data.token && uni.setStorageSync('token', _data.token);
}
// #endif

// 测试
// if(process.env.ENV === 'development'){
//     sendOption({ token: 'f70b9ad9-4694-4f82-82aa-614d8ddd3435' })
// }

Vue.prototype.$onLaunched = new Promise(resolve => {
	Vue.prototype.$isResolve = resolve;
})
Vue.prototype.parseTime = parseTime;
Vue.prototype.numberFormat = numberFormat;
Vue.prototype.numberFormatUnit = numberFormatUnit;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.$store = store;
Vue.config.productionTip = false;

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
