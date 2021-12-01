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


// 接收App传过来的数据
window.handleMessage = (_data)=>{
    _data.token && uni.setStorageSync('token', _data.token);
}

// 测试
handleMessage({ token: 'a38d69eb-97fd-4487-b06f-c30ee9e1d0f0' })

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
