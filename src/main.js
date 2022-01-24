import Vue from 'vue'
import App from './App'
import './common/css/index.scss'
import "./common/css/building.scss";
import "./common/css/manage.scss";
//引入vuex
import store from './store'

import { getDicts, listByDict, getDictsByType } from '@/config/service/data';
//与app桥接
// import './config/bridge.js'
//自定义指令
import './directive'
import { parseTime, numberFormat, numberFormatUnit, selectDictLabel, floor } from './utils/ddc.js';
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
    console.log('h5我被触发了', JSON.stringify(_data));
    store.dispatch('setOption', _data);
}
// #endif

// 高德地图vue组件库
import VueAMap from 'vue-amap';
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '2066cb0dafaa492aee47fa1090227a38', // 高德企业key
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.Driving', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.RectangleEditor','AMap.Geocoder', 'AMap.Marker','AMap.CitySearch','AMap.Geocoder'],
  v: '1.4.4',
  uiVersion: '1.1.1'
});


Vue.prototype.$onLaunched = new Promise(resolve => {
	Vue.prototype.$isResolve = resolve;
})
Vue.prototype.parseTime = parseTime;
Vue.prototype.numberFormat = numberFormat;
Vue.prototype.numberFormatUnit = numberFormatUnit;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.$store = store;
Vue.config.productionTip = false;
Vue.prototype.getDicts = getDicts;
Vue.prototype.floor = floor;
Vue.prototype.listByDict = listByDict;
Vue.prototype.getDictsByType = getDictsByType;

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()

