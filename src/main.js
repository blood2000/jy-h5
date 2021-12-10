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

// 基本提示
Vue.prototype.msgSuccess = (msg)=>{
    uni.showToast({title: msg,icon: 'none', duration: 1000});
};

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
    store.dispatch('setOption', _data);
}
// #endif

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
