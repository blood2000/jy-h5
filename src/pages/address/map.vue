<template>
	<view class="">
		<HeaderBar :title="title" @back="navigateBack">
			<text slot="right" @click="submit">确定</text>
		</HeaderBar>
		<view class="map-content">
			<view class="name">
				<input type="text" v-model.trim="form.name" placeholder="请输入电子围栏名称" />
			</view>
			<!-- <el-amap-search-box class="search-box" :search-option="{
			            city: '全国',
			            citylimit: true
			          }" :on-search-result="addressChange" /> -->
			<el-amap ref="amapref" vid="amaps" :resize-enable="true" :expand-zoom-range="true" :zoom="zoom"
				:center="center" :plugin="plugins" :events="events">
				<el-amap-marker :position="marker.position" :icon="marker.icon" />
			</el-amap>
			<view class="input-card">
				<view v-if='isDraw&&isEdit' class="flex">
					<u-button type="primary" style="width: 200rpx;margin:auto" text="绘制多边形" @tap="drawPolygon"></u-button>
					<u-button type="primary" style="width: 200rpx;margin:auto" text="绘制矩形" @tap="drawRectangle"></u-button>
					<u-button type="primary" style="width: 200rpx;margin:auto" text="绘制圆形" @tap="drawCircle"></u-button>
				</view>
				<view v-else>
					<u-button v-if='isEdit' type="primary" style="width: 300rpx;margin:auto" text="确定" @tap="close"></u-button>
					<u-button v-else type="primary" style="width: 300rpx;margin:auto" text="绘制围栏" @tap="reDraw"></u-button>
				</view>
				<!-- <u-button v-else type="primary" style="width: 300rpx;margin:24rpx auto" text="确定" @tap="close"></u-button> -->
			</view>
		</view>
	</view>
</template>

<script>
	import HeaderBar from '@/components/Building/HeaderBar2.vue';
	import {
		mapState
	} from "vuex";

	export default {
		components: {
			HeaderBar
		},
		onShow() {
		},
		onLoad(options){
			if(options.data){
				this.form = JSON.parse(options.data)
				this.title = '编辑电子围栏'
			}
			this.center = options.center.split(',')
			this.marker.position = options.center.split(',')
		},
		computed: {
			...mapState({
				statusBarHeight: (state) => state.header.statusBarHeight,
			}),
		},
		mounted() {},
		data() {
			const _this = this
			return {
				form:{
					geomText:undefined,
					geomType:undefined,
					functionType: 'collision',
					centerLat:undefined,
					centerLng:undefined,
					name:undefined,
					status:0,
					delFlag:0,
				},
				title:'新增电子围栏',
				map: null, // 地图实例
				
				circle:null, // 圆形实例
				circleCenter:[], // 圆心
				circleRadius:0, // 半径
				
				rectangle:null, // 矩形实例
				rectanglelnglat:[], // 矩形第一个点
				_rectanglelnglat:[], // 矩形第二个点
				
				polygon:null, // 多边形实例
				polygonPath:[], // 多边形路径
				
				isDraw:true, // 画图 
				isEdit:false, // 编辑
				addressName: '', // 地址
				zoom: 14,
				center: [116.397497,39.906888],
				plugins: [
					{	
						pName:'ToolBar',
						position:'RT'
						// events:{
						// 	init(o){
						// 		console.log(o);
						// 	}
						// }
					}
				], // 
				events: {
					init: (o) => {
						// _this.map = o
						_this.init();
						// this.$refs.map.$$getInstance();
						// o.getCity(result => { console.log(result, '点了'); });
					},
					click(e) {
						// console.log(_this.active);
						//   console.log('您在 [ ' + e.lnglat.getLng() + ',' + e.lnglat.getLat() + ']的位置点击了');
						// if (_this.showCircle || _this.active) return;
						// const { lng, lat } = e.lnglat;
						// _this.circle(lng, lat);
						// _this.addressNamelnglat = [lng, lat];
						// _this.map.setFitView();
						// _this.typeClick = true; // 点击才赋值
					},
					complete: () => {
						// _this.setFitView();
					}
				},
				marker: {
					icon: '/static/icon_location.png',
					position: [116.397497,39.906888]
				},
			}
		},
		methods: {
			submit(){
				let pages = getCurrentPages()
				let prePage = pages[pages.length - 2]
				// 圆形
				if(this.form.geomType === 1){
					this.form.geomText = [...this.circleCenter,Math.floor(this.circleRadius)].join()
					this.form.centerLng = this.circleCenter[0]
					this.form.centerLat = this.circleCenter[1]
				}
				// 矩形
				if(this.form.geomType === 2){
					this.form.geomText = [...this.rectanglelnglat,...this._rectanglelnglat].join()
					const {lng,lat} = this.rectangle.getBounds().getCenter()
					this.form.centerLng = lng
					this.form.centerLat = lat
				}
				// 多边形
				if(this.form.geomType === 3){
					this.form.geomText = this.polygonPath.join()
					const {lng,lat} = this.polygon.getBounds().getCenter()
					this.form.centerLng = lng
					this.form.centerLat = lat
				}
				// console.log(this.form);
				if(this.form.name){
					prePage.addList(this.form)
					uni.navigateBack({
						delta: 1
					})
				}else{
					uni.showToast({title: '请输入名称',icon: 'none', duration: 1000})
				}
			},
			navigateBack(){
				uni.navigateBack({
					delta:1
				})
			},
			// s= 高德地图搜索组件
			// addressChange(e) {
			// 	const { lng, lat } = e[0];
			// 	this.center = [lng, lat]
			// 	this.marker.position = [lng, lat]
			// 	// circle.setCenter(new AMap.LngLat(lng, lat));
			// 	// this.addressNamelnglat = [lng, lat];
			// },
			init() {
				const _this = this
				this.map = this.$refs.amapref.$$getInstance();
				this.polygon = new AMap.Polygon({
					strokeColor: "#FF33FF", //线颜色
					strokeOpacity: 0.2, //线透明度
					strokeWeight: 3,    //线宽
					fillColor: "#1791fc", //填充色
					fillOpacity: 0.35,//填充透明度
					// draggable: true
					// path: this.polygonPath,
					// zIndex: 100,
				})
				this.circle = new AMap.Circle({
					center:_this.circleCenter.length ? _this.circleCenter : null,
					radius:_this.circleRadius,
					strokeColor: "#FF33FF", //线颜色
					strokeOpacity: 0.2, //线透明度
					strokeWeight: 3,    //线宽
					fillColor: "#1791fc", //填充色
					fillOpacity: 0.35,//填充透明度
					// draggable: true
					// path: _this.polygonPath,
					// zIndex: 100,
				})
				this.rectangle = new AMap.Rectangle({
					// path: _this.polygonPath,
					strokeColor: "#FF33FF", //线颜色
					strokeOpacity: 0.2, //线透明度
					strokeWeight: 3,    //线宽
					fillColor: "#1791fc", //填充色
					fillOpacity: 0.35,//填充透明度
					// draggable: true,
					// zIndex: 100,
				})
				
				this.polygon.setMap(this.map)
				this.circle.setMap(this.map)
				this.rectangle.setMap(this.map)
				
				if(this.form.geomType === 1){
					// console.log(this.form.geomText.split(','));
					const lnglat = this.form.geomText.split(',')
					this.circleCenter = [Number(lnglat[0]),Number(lnglat[1])]
					this.circleRadius = Number(lnglat[2])
					this.circle.setCenter(this.circleCenter)
					this.circle.setRadius(Number(lnglat[2]))
				}
				if(this.form.geomType === 2){
					const lnglat = this.form.geomText.split(',')
					this.rectanglelnglat = [lnglat[0],lnglat[1]]
					this._rectanglelnglat = [lnglat[2],lnglat[3]]
					this.rectangle.setBounds(new AMap.Bounds(this.rectanglelnglat,this._rectanglelnglat))
				}
				if(this.form.geomType === 3){
					const lnglat = this.form.geomText.split(',')
					const _lnglat = lnglat.map((item,index) => {
						if(index%2 === 0){
							return [item,lnglat[index+1]]
						}
					})
					this.polygon.setPath(_lnglat.filter(res => res !== undefined))
				}
				// console.log(this.form);
			},
			// 画多边形
			drawPolygon() {
				this.form.geomType = 3
				// this.map.setStatus({dragEnable:true})
				this.isDraw = false
				this.map.on('touchend',this.eventListen)
			},
			// 画圆形
			drawCircle(){
				this.form.geomType = 1
				this.isDraw = false
				this.map.on('touchstart',this.eventListenCircle)
				this.map.on('touchmove',this.circleEvent)
			},
			// 画矩形
			drawRectangle(){
				this.form.geomType = 2
				this.isDraw = false
				this.map.on('touchstart',this.startEvent)
				this.map.on('touchmove',this.endEvent)
			},
			// 结束绘制
			close(){
				const _this = this
				this.map.off('touchend',this.eventListen)
				this.map.off('touchstart',this.eventListenCircle)
				this.map.off('touchmove',this.circleEvent)
				this.map.off('touchstart',this.startEvent)
				this.map.off('touchmove',this.endEvent)
				this.map.setStatus({dragEnable:true})
				this.isDraw = true
				this.isEdit = false
			},
			// 重新绘制
			reDraw(){
				this.resetCover()
				this.isDraw = true
				this.isEdit = true
			},
			
			// 多边形绘制，监听回调函数
			eventListen(e){
				// console.log(e);
				// const{lng,lat} = e.lnglat
				this.polygonPath.push(e.lnglat)
				this.polygon.setPath(this.polygonPath)
			},
			
			// 圆形绘制，监听回调函数
			//开始
			eventListenCircle(e){
				this.map.setStatus({dragEnable:false})
				const{lng,lat} = e.lnglat
				this.circleCenter = [lng,lat]
				this.circle.setCenter([lng,lat])
			},
			// 结束
			circleEvent(e){
				const{lng,lat} = e.lnglat
				const radius = AMap.GeometryUtil.distance(this.circleCenter,[lng,lat]) 
				this.circleRadius = radius
				this.circle.setRadius(radius)
			},
			
			// 矩形绘制，固定屏幕，存坐标
			// 开始
			startEvent(e){
				this.map.setStatus({dragEnable:false})
				const{lng,lat} = e.lnglat
				this.rectanglelnglat = [lng,lat]
			},
			// 结束
			endEvent(e){
				const{lng,lat} = e.lnglat
				this._rectanglelnglat = [lng,lat]
				this.rectangle.setBounds(new AMap.Bounds(this.rectanglelnglat,this._rectanglelnglat))
			},
			
			// 重置覆盖物
			resetCover(){
				this.polygonPath = []
				this.polygon.setPath([])
				this.rectangle.setBounds(new AMap.Bounds([0,0],[0,0]))
				this.circle.setRadius(0)
				this.circleRadius = 0
			}
		}

	}
</script>

<style lang="scss" scoped>
	.map-content {
		position: relative;
		height: calc(100vh - 88rpx);
		width: 100%;

		::v-deep .amap-marker .amap-icon img {
			max-width: 40px !important;
			max-height: 30px !important;
		}

		.name {
			input{
				position: fixed;
				width: 70%;
				height:80rpx ;
				line-height: 80rpx;
				left: 0;
				right: 0;
				top: 100rpx;
				margin: auto;
				border: 1px solid black;
				border-radius: 40rpx;
				z-index: 1;
				background-color: #FFFFFF;
				text-align: center;
			}
		}
	}

	.input-card {
		position: fixed;
		width: 90%;
		left: 0;
		right: 0;
		bottom: 24rpx;
		margin: auto;
		z-index: 501;
	}
</style>
