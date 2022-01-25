## 插件简绍
### 实现原理

> 基本二维码识别功能使用的是jsQR这个库，调用摄像头使用的 	navigator.mediaDevices.getUserMedia 这个H5的api。通过canvas画布把摄像头获取到的数据展现到页面上，同时循环监听jsQR解析。


### 使用环境
经测试发现大部分浏览器都可以正常使用（微信，QQ，谷歌，火狐，safari），少数的安卓自带浏览器无法使用（浏览器内核版本过低）。需要https环境才能使用，本地测试可以在 manifest.json  中点击源码展示，找到h5 ，添加："devServer" : { "https" : true}
需要https环境才能使用！！！
需要https环境才能使用！！！
需要https环境才能使用！！！
**小知识点：苹果设备上不论什么浏览器都是safari套壳的，不论是谷歌还是火狐都是safari套壳。这也就是代表在苹果上无需担心无法使用此插件。（造成这样的现象是因为苹果有一则协议，浏览器只能使用safari内核）**
### 插件使用
**插件已支持 uni_modules 支持组件easycom，以下代码演示的是普通使用**

``` html
<!-- HTML -->
	<mumu-get-qrcode @success='qrcodeSucess' ></mumu-get-qrcode>
```

``` javascript
// js
import mumuGetQrcode from '@/uni_modules/mumu-getQrcode/components/mumu-getQrcode/mumu-getQrcode.vue'
// 嫌路径长的话可以单独复制出来
export default {
		components: {
			mumuGetQrcode
		},
		methods: {
			qrcodeSucess(data) {
				uni.showModal({
					title: '成功',
					content: data,
					success: () => {
						uni.navigateBack({})
					}
				})
			},
		}
	}
```
### 相关API

##### 可传属性（Props）

| 参数     | 说明         | 类型    | 默认值 |     
| -------- | ------------ | ------- | ------ | --- |
| continue | 是否连续获取 | Boolean | false  |     
##### 事件（Events）

| 事件名  | 说明                           | 回调参数   |    
| ------- | ------------------------------ | ---------- | --- |
| success | 检查到二维码并读取到数据是回调 | 二维码数据 |    

### 案例演示
![enter description here](https://student.mumudev.top/vueQrcode/qrcode.png)

## 支持作者
![支持作者](https://student.mumudev.top/wxMP.jpg)
