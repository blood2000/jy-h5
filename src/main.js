import Vue from 'vue'
import App from './App'
import './common/css/index.scss'
//引入vuex
import store from './store'
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
