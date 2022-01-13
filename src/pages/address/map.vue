<template>
	<view :style="{'--statusBar': statusBarHeight + 'px'}">
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
					<view v-if="isEditor">
						<u-button v-if='isCheck' type="primary" style="width: 300rpx;margin:auto" text="确定" @tap="endEdit"></u-button>
						<view v-else class="flex">
							<u-button type="primary" style="width: 300rpx;margin:auto" text="重新绘制" @tap="reDraw"></u-button>
							<u-button type="primary" style="width: 300rpx;margin:auto" text="编辑" @tap="eidtor"></u-button>
						</view>
					</view>
					<view v-else>
						<view v-if='isDraw&&isEdit' class="flex">
							<u-button type="primary" style="width: 200rpx;margin:auto" text="绘制多边形" @tap="drawPolygon"></u-button>
							<u-button type="primary" style="width: 200rpx;margin:auto" text="绘制矩形" @tap="drawRectangle"></u-button>
							<u-button type="primary" style="width: 200rpx;margin:auto" text="绘制圆形" @tap="drawCircle"></u-button>
						</view>
						<view v-else>
							<u-button v-if='isEdit' type="primary" style="width: 300rpx;margin:auto" text="确定" @tap="close"></u-button>
							<u-button v-else type="primary" style="width: 300rpx;margin:auto" text="绘制围栏" @tap="reDraw"></u-button>
						</view>
					</view>
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
		onLoad(option){
			if(option.data){
				this.form = JSON.parse(option.data)
				this.title = '编辑电子围栏',
				this.isEditor = true
			}
			this.center = option.center.split(',')
			this.marker.position = option.center.split(','),
			this.form.index = option.index
		},
		computed: {
			...mapState({
				statusBarHeight: (state) => state.header.statusBarHeight,
			})
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
				CircleEditor:null,
				
				rectangle:null, // 矩形实例
				rectanglelnglat:[], // 矩形第一个点
				_rectanglelnglat:[], // 矩形第二个点
				RectangleEditor:null,
				
				polygon:null, // 多边形实例
				polygonPath:[], // 多边形路径
				PolyEditor:null,
				
				isDraw:true, // 画图 
				isEdit:false, // 编辑
				isEditor:false,
				isCheck:false,
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
					const circleCenter = this.circle.getCenter()
					// this.form.geomText = [...this.circleCenter,Math.floor(this.circleRadius)].join()
					this.form.geomText = [circleCenter,this.circle.getRadius()].join()
					this.form.centerLng = circleCenter.lng
					this.form.centerLat = circleCenter.lat
				}
				// 矩形
				if(this.form.geomType === 2){
					// this.form.geomText = [...this.rectanglelnglat,...this._rectanglelnglat].join()
				    const Bounds = this.rectangle.getBounds()
					this.form.geomText = [Bounds.southwest,Bounds.northeast].join()
					const {lng,lat} = Bounds.getCenter()
					console.log(Bounds.getCenter);
					this.form.centerLng = lng
					this.form.centerLat = lat
				}
				// 多边形
				if(this.form.geomType === 3){
					// this.form.geomText = this.polygonPath.join()
					this.form.geomText = this.polygon.getPath().join()
					const {lng,lat} = this.polygon.getBounds().getCenter()
					this.form.centerLng = lng
					this.form.centerLat = lat
				}
				// console.log(this.form);
				if(this.form.name && this.form.geomText){
					prePage.addList(this.form)
					uni.navigateBack({
						delta: 1
					})
				}else{
					if(this.form.geomText){
						uni.showToast({title: '请输入名称',icon: 'none', duration: 1000})
					}else{
						uni.showToast({title: '请绘制围栏',icon: 'none', duration: 1000})
					}
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
				this.PolyEditor = new AMap.PolyEditor(this.map,this.polygon);
				// this.PolyEditor.open(); 
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
				this.CircleEditor = new AMap.CircleEditor(this.map,this.circle); 
				// this.circleEditor.open(); 
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
				this.RectangleEditor = new AMap.RectangleEditor(this.map,this.rectangle);
				// this.RectangleEditor.open();
				
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
					// console.log(this.form.geomText);
					const lnglat = this.form.geomText.split(',')
					this.rectanglelnglat = [lnglat[0],lnglat[1]]
					this._rectanglelnglat = [lnglat[2],lnglat[3]]
					this.rectangle.setBounds(new AMap.Bounds(this.rectanglelnglat,this._rectanglelnglat))
				}
				if(this.form.geomType === 3){
					// console.log(this.form.geomText);
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
				this.msgSuccess('点击地图绘制多边形')
				this.form.geomType = 3
				// this.map.setStatus({dragEnable:true})
				this.isDraw = false
				this.map.on('touchend',this.polygonEvent)
			},
			// 画圆形
			drawCircle(){
				this.msgSuccess('点击地图拖动绘制圆形')
				this.form.geomType = 1
				this.isDraw = false
				this.map.on('touchstart',this.circleStartEvent)
				this.map.on('touchmove',this.circleMoveEvent)
			},
			// 画矩形
			drawRectangle(){
				this.msgSuccess('点击地图拖动绘制矩形')
				this.form.geomType = 2
				this.isDraw = false
				this.map.on('touchstart',this.startEvent)
				this.map.on('touchmove',this.moveEvent)
				this.map.on('touchend',this.endEvent)
			},
			// 结束绘制
			close(){
				this.map.off('touchend',this.polygonEvent) // 多边形
				this.map.off('touchstart',this.circleStartEvent) // 圆
				this.map.off('touchmove',this.circleMoveEvent)
				this.map.off('touchstart',this.startEvent) // 矩形
				this.map.off('touchmove',this.moveEvent)
				this.map.off('touchend',this.endEvent)
				this.map.setStatus({dragEnable:true})
				this.isDraw = true
				this.isEdit = false
				this.isEditor = true
			},
			// 重新绘制
			reDraw(){
				this.resetCover()
				this.isDraw = true
				this.isEdit = true
				this.isEditor = false
			},
			
			// 多边形绘制，监听回调函数
			polygonEvent(e){
				// console.log(e);
				// const{lng,lat} = e.lnglat
				this.polygonPath.push(e.lnglat)
				this.polygon.setPath(this.polygonPath)
			},
			
			// 圆形绘制，监听回调函数
			//开始
			circleStartEvent(e){
				this.map.setStatus({dragEnable:false})
				const{lng,lat} = e.lnglat
				this.circleCenter = [lng,lat]
				this.circle.setCenter([lng,lat])
			},
			// 结束
			circleMoveEvent(e){
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
			// 滑动
			moveEvent(e){
				const{lng,lat} = e.lnglat
				this._rectanglelnglat = [lng,lat]
				const Bounds = new AMap.Bounds(this.rectanglelnglat,this._rectanglelnglat)
				this.rectangle.setBounds(Bounds)
			},
			// 结束
			endEvent(e){
				const{lng,lat} = e.lnglat
				const _lng = this.rectanglelnglat[0]
				const _lat = this.rectanglelnglat[1]
				const southWest = []
				const northEast = []
				lng > _lng ? (northEast[0] = lng,southWest[0] = _lng) : (northEast[0] = _lng,southWest[0] = lng)
				lat > _lat ? (northEast[1] = lat,southWest[1] = _lat) : (northEast[1] = _lat,southWest[1] = lat)
				this.rectangle.setBounds(new AMap.Bounds(southWest,northEast))
				
			},
			
			// 重置覆盖物
			resetCover(){
				this.form.geomText = undefined
				this.polygonPath = []
				this.polygon.setPath([])
				this.rectangle.setBounds(new AMap.Bounds([0,0],[0,0]))
				this.circle.setRadius(0)
				this.circleRadius = 0
			},
			
			// 编辑
			eidtor(){
				this.isCheck = true
				// 圆形
				if(this.form.geomType === 1){
					this.CircleEditor.open()
				}
				// 矩形
				if(this.form.geomType === 2){
					this.RectangleEditor.open()
				}
				// 多边形
				if(this.form.geomType === 3){
					this.PolyEditor.open()
				}
			},
			endEdit(){
				this.isCheck = false
				// 圆形
				if(this.form.geomType === 1){
					this.CircleEditor.close()
				}
				// 矩形
				if(this.form.geomType === 2){
					this.RectangleEditor.close()
				}
				// 多边形
				if(this.form.geomType === 3){
					this.PolyEditor.close()
				}
			}
		}

	}
</script>

<style lang="scss" scoped>
	.map-content {
		position: relative;
		height: calc(100vh - 88rpx - var(--statusBar));
		width: 100%;

		::v-deep .amap-marker .amap-icon{
			top:-40rpx;
			left: -40rpx;
			width: 102rpx !important;
			height: 102rpx !important;
			img{
				top: 40rpx !important;
				left: 40rpx !important;
				max-width: 40px !important;
				max-height: 30px !important;
			}
		}

		.name {
			input{
				position: absolute;
				width: 70%;
				height:80rpx ;
				line-height: 80rpx;
				left: 0;
				right: 0;
				top: 50rpx;
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
