<template>
	<view class="">
		<HeaderBar :title="form.id ? '编辑地址' :'新增地址'" @back="navigateBack">
			<text slot="right" @click="submit">确定</text>
		</HeaderBar>
		<view class="map-content">
			<el-amap-search-box class="search-box" :search-option="{
			            city: '全国',
			            citylimit: true
			          }" :on-search-result="addressChange" />
			<el-amap ref="amapref" vid="amaps" :resize-enable="true" :expand-zoom-range="true" :zoom="zoom"
				:center="center" :plugin="plugins" :events="events">
				<el-amap-marker :position="marker.position" :icon="marker.icon" />
			</el-amap>
		</view>
		<view class="name solid-bottom">
			<view class="cu-form-group">
				<view class="title">地址名称:</view>
				<input placeholder="请输入地址名称" v-model="form.companyAddrName"></input>
			</view>
		</view>
		
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-orange "></text> 电子围栏
			</view>
			<text style="margin-right: 24rpx; color: #0081FF;" @tap="handleAdd()">新增围栏</text>
		</view>
		<view class="cu-list menu-avatar">
			<view class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" v-for="(item,index) in form.zjFenceList" :key="index"
			 @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index">
				<view style="position: absolute;left: 32rpx; font-size: 32rpx;">
					{{index+1}}
				</view>
				<view class="content" style="width: 516rpx;left:80rpx">
					<view class="text-grey">{{item.name}}</view>
					<view class="text-gray text-sm">
						<text class="cuIcon-infofill text-red  margin-right-xs"></text> 
						{{'图形：' + shape(item.geomType) + ' , ' + '坐标：' + item.centerLng + ',' + item.centerLat}}
					</view>
				</view>
				<view class="action" style="width: 160rpx;" :style="{color:item.status ? 'red' : 'green'}">
					<view class="cuIcon-title">
						{{item.status === 0 ? '已启用' : '已禁用'}}
					</view>
				</view>
				<view class="move">
					<view class="bg-grey" @tap="handleEdit(item)">编辑</view>
					<view v-if="item.status === 1 " class="bg-blue" @tap="handleChange(item)">启用</view>
					<view v-else class="bg-orange" @tap="handleChange(item)">禁用</view>
					<view class="bg-red" @tap="handleDelete(item,index)">删除</view>
				</view>
			</view>
		</view>
    <view>
       
    </view>
	</view>
</template>

<script>
	import { wgs84_to_gcj02 } from '@/utils/wgs84_to_gcj02';
	import HeaderBar from '@/components/Building/HeaderBar2.vue';
	import { mapState } from "vuex";
	import {tenantCompanyAddressInfo_isDelWl as cantDel ,tenantCompanyAddressInfoAdd as Add ,tenantCompanyAddressInfoUpdate as Edit} from "@/config/service/address/index.js"
	
	const geocoder = new AMap.Geocoder({
	  radius: 1,
	  extensions: 'all'
	});
	
	export default{
		components:{HeaderBar},
		computed: {
		  ...mapState({
		    statusBarHeight: (state) => state.header.statusBarHeight,
			headerInfo: state => state.header.headerInfo
		  }),
		  shape(){
			  return shape => {
				  return shape === 1 ? '圆形' : shape === 2 ? '矩形' : shape === 3 ? '多边形' : '未知'
			  }
		  },
		},
		onLoad(options){
			if(options.data){
				this.form = JSON.parse(options.data);
				this.form.zjFenceList = this.form.zjFenceList || []
				console.log(this.form);
				this.center = [this.form.lng,this.form.lat];
				this.marker.position = [this.form.lng,this.form.lat]
			}else{
				
				
			}
			// uni.getLocation({
			//   // type: "wgs84",
			//   type: "gcj02",
			//   success: (res) => {
			//     console.log("位置信息: ", res);
			//     // that.locationMsg.latitude = res.latitude;
			//     // that.locationMsg.longitude = res.longitude;
			//   },
			// });
			// const local = new AMap.Geolocation()
			// console.log(local.getCurrentPosition(function(status,result){console.log(result);}));
		},
		data() {
			const _this = this
			return{
				form:{
					companyAddrName:'',
					addressName: '', // 地址
					zjFenceList:[],
					zjFenceBoList:[],
				},
				isdelFlags: [], // 有id，被删除
				modalName:null, // 当前点击围栏
				map:null, // 地图实例
				citysearch:null, // 定位实例
				zoom: 14,
				center: [116.397497,39.906888],
				plugins: ['ToolBar',
					{
					pName:'Geolocation',
					events:{
						complete: (result) => {
							// console.log(result);
							// const {lng,lat} = result.position
							// console.log(wgs84_to_gcj02(lng,lat));
							// _this.setFitView();
						},
						err: (err) => {
							// console.log("err");
						}
					}
				},
				], // 
				events: {
					init: (o) => {
						_this.map = o
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
		watch:{
			center:{
				handler(v){
					this.form.lng = v[0];
					this.form.lat = v[1]
				}
			}
		},
		methods:{
			async submit(){
				await geocoder.getAddress([this.form.lng, this.form.lat], (status, result) => {
				        if (status === 'complete' && result.info === 'OK') {
				          if (result && result.regeocode) {
							const addressInfo = result.regeocode.addressComponent
							this.form.city = addressInfo.city
							this.form.province = addressInfo.province
							this.form.county = addressInfo.county
							this.form.provinceCode = addressInfo.adcode.slice(0,2)
							this.form.cityCode = addressInfo.adcode.slice(0,4)
							this.form.countyCode = addressInfo.adcode.slice(0,6)
							this.form.detail = result.regeocode.formattedAddress
							this.form.zjFenceBoList = this.form.zjFenceList ? this.form.zjFenceList.concat(this.isdelFlags) : []
							Object.keys(this.form).forEach(item => {
								if(this.form[item] === null || this.form[item] === undefined){
									this.form[item] = ''
								}
							})
							if(this.form.companyAddrName){
								if(this.form.id){
									Edit(this.form,this.headerInfo).then(res => {
										uni.showToast({title: '变更成功',icon: 'none', duration: 1000})
										setTimeout(() => {
											uni.navigateBack({
												delta:1
											})
										},1000)
									})
								}else{
									Add(this.form,this.headerInfo).then(res => {
										uni.showToast({title: '新增成功',icon: 'none', duration: 1000})
											setTimeout(() => {
												uni.navigateBack({
													delta:1
												})
											},1000)
									})
								}
							}else{
								uni.showToast({title: '请输入名称',icon: 'none', duration: 1000})
							}
				          }
				        }
				      });
				
				// console.log(this.form);
				// uni.navigateBack({
				// 	delta:1
				// })
			},
			navigateBack(){
				uni.navigateBack({
					delta:1
				})
			},
			// 新增
			handleAdd(){
				uni.navigateTo({
					url:"/pages/address/map?center=" + this.center
				})
			},
			// 编辑
			handleEdit(item){
				uni.navigateTo({
					url:"/pages/address/map?data=" + JSON.stringify(item) + '&center=' + this.center
				})
			},
			// 启用/禁用
			handleChange(item){
				item.status === 1 ? item.status = 0 : item.status = 1
			},
			// 删除
			handleDelete(item,index){
				uni.showModal({
					title: '温馨提示',
					content: '确定要删除"'+ item.name +'"吗？',
					success: async res => {
						if (res.confirm) {
							const _cantDel = await cantDel(item.id,this.headerInfo)
							// console.log(_cantDel);
							if(_cantDel.data){
								item.delFlag = 1
								item.id && this.isdelFlags.push(item)
								this.form.zjFenceList.splice(index,1)
								uni.showToast({
									title: '删除成功'
								});
							}else{
								uni.showToast({
									title: '该围栏已被使用,禁止删除',
									icon:'none'
								});
							}
						}
					}
				})
				
			},
			addList(data){
				if(data.id){
					this.form.zjFenceList.find((res,index) => {
						if(res.id === data.id){
							this.form.zjFenceList.splice(index,1,data)
						}
					})
				}else{
					this.form.zjFenceList.push(data)
				}
			},
			// 搜索地址
			addressChange(e) {
				this.form.addressName = e[0].name
				// console.log(e);
				const { lng, lat } = e[0];
				this.center = [lng, lat]
				this.marker.position = [lng, lat]
				// circle.setCenter(new AMap.LngLat(lng, lat));
				// this.addressNamelnglat = [lng, lat];
			},
			init() {
				if(!this.form.addressName){
					this.showCityInfo()
				}
			},
			//获取用户所在城市信息
			showCityInfo() {
				const _this = this
				//实例化城市查询类
				this.citysearch = new AMap.CitySearch();
				//自动获取用户IP，返回当前城市
				this.citysearch.getLocalCity(function(status, result) {
					if (status === 'complete' && result.info === 'OK') {
						if (result && result.city && result.bounds) {
							// _this.form.city = result.city
							// _this.form.province = result.province
							// _this.form.provinceCode = result.adcode.slice(0,2)
							// _this.form.cityCode = result.adcode.slice(0,4)
							const citybounds = result.bounds;
							const center = citybounds.getCenter()
							const {lng,lat} = center
							_this.marker.position = [lng,lat]
							_this.center = [lng,lat]
							//地图显示当前城市
							_this.map.setBounds(citybounds);
						}
					} else {
						_this.msgSuccess('获取位置信息失败！')
					}
				});
			},
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},
			
			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},
			
			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			}
		}
	}
</script>

<style lang="scss" scoped>
	.name{
		height: 100rpx;
		line-height: 100rpx;
		// border-bottom: 1rpx solid #ddd;
		font-size: 32rpx;
		background-color: #ffffff;
	}
	.map-content {
		position: relative;
		height: 50vh;
		width: 100%;

		::v-deep .amap-marker .amap-icon img {
			max-width: 40px !important;
			max-height: 30px !important;
		}

		.search-box {
			position: fixed;
			width: 90%;
			left: 0;
			right: 0;
			top: 100rpx;
			margin: auto;
		}
	}
	.cu-list{
		height: calc(50vh - 88upx - 100upx - 100upx);
		overflow-y: auto;
	}
</style>

