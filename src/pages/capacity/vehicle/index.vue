<template>
	<view class="u-page">
		<HeaderBar title="车辆管理" @back="navigateBack">
			<text slot="right" @click="handleAdd">新增车辆</text>
		</HeaderBar>
		
		<view class="card-list" v-if="dataList && dataList.length > 0">
			<view v-for="(item, index) in dataList" :key="index" class="card-item">
				<uni-swipe-action>
					<uni-swipe-action-item :right-options="options2" @click="checked=>swipeActionClick(checked, item)">
				        <view class="card-content ly-flex">
							<view class="img-box ly-flex ly-flex-align-center ly-flex-pack-center">
								<img v-if="item.vehicleImagePath" :src="item.vehicleImagePath" />
								<img v-else src="~@/static/capacity/car_bg.png" />
							</view>
							<view class="info-box ly-flex-1">
								<view class="platenumber">
									{{ item.licenseNumber }}
									<image v-if="item.authStatus === 3" src="~@/static/capacity/srz.png"></image>
								</view>
								<view class="text g-single-row">
									<text class="mr40" v-if="item.driverName">司机：{{ item.driverName }}</text>
									<text v-if="item.teamLeaderName">调度者：{{ item.teamLeaderName }}</text>
								</view>
								<view class="text">
									<text>车型：{{ selectDictLabel(vehicleTypeOptions, item.vehicleTypeCode) }}</text>
								</view>
							</view>
						</view>
				    </uni-swipe-action-item>
				</uni-swipe-action>
			</view>
		</view>
		<NonePage v-else></NonePage>
		
		<uni-load-more v-if="dataList && dataList.length > 0" :status="status" :icon-size="16" :content-text="contentText" />
		
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import NonePage from '@/components/NonePage/NonePage.vue';
	import { listInfo, delInfo } from '@/config/service/capacity/vehicle.js';
	import { getDicts } from '@/config/service/common.js';
	import { selectDictLabel } from '@/utils/ddc.js';
	import { getFile } from '@/config/service/common.js'
	import uniData from '@/utils/uni.webview.1.5.2.js';
	import HeaderBar from '@/components/Building/HeaderBar2.vue';
	export default {
		components: {
			NonePage,
			HeaderBar
		},
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			})
		},
		data() {
			return {
				queryParams: {
					pageNum: 1,
					pageSize: 10
				},
				dataList: [],
				// 是否无数据了
				isEnd: false,
				status: 'more',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了'
				},
				options2: [{
					text: '编辑',
					style: {
						backgroundColor: '#3A65FF'
					}
				}, {
					text: '删除',
					style: {
						backgroundColor: '#EF5242'
					}
				}],
				// 车型字典
				vehicleTypeOptions: []
			}
		},
		onLoad(options){
			this.$store.dispatch('getLoginInfoAction', {
				'Authorization': options.token
			});
			options.statusBarHeight && this.$store.dispatch('getStatusBarHeightAction', options.statusBarHeight);
			this.getDictsList();
			this.getList();
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh();  //停止下拉刷新动画
		},
		// 触底加载
		onReachBottom() {
			if(!this.isEnd) {
				this.status = 'more';
				this.queryParams.pageNum++;
				this.getList();
			}
		},
		methods: {
			navigateBack() {
				uni.webView.navigateBack();
			},
			/** 查询字典 */
			getDictsList() {
				// 车辆类型
				getDicts('vehicleClassification', this.headerInfo).then(response => {
					this.vehicleTypeOptions = response.data;
				});
			},
			handleQuery() {
			  this.queryParams.pageNum = 1;
			  this.dataList = [];
			  this.getList();
			},
			async getList() {
				this.status = 'loading';
				uni.showLoading();
				this.loading = true;
				const { data } = await listInfo(this.queryParams, this.headerInfo);
				uni.hideLoading();
				this.loading = false;
				if (data.list.length === 0) {
					this.isEnd = true;
					this.status = 'noMore';
					return;
				}
				if(data.list.length < this.queryParams.pageSize){
					this.status = 'noMore';
				}
				// 获取车头正面照
				data.list.forEach(el => {
					if (el.vehicleImage) {
						getFile(el.vehicleImage, this.headerInfo).then(response => {
							if (response.data && response.data.length > 0) {
								el.vehicleImagePath = response.data[0].attachUrl;
								this.$forceUpdate();
							}
						});
					}
				});
				this.dataList = [...this.dataList, ...data.list];
			},
			swipeActionClick(data, row) {
				// 编辑
				if (data.index === 0) {
					this.handleUpdate(row);
				}
				// 删除
				if (data.index === 1) {
					this.handleDelete(row);
				}
			},
			// 新增
			handleAdd() {
				uni.navigateTo({
				    url: '/pages/capacity/vehicle/add?token='+this.headerInfo.Authorization
				});
			},
			// 编辑
			handleUpdate(row) {
				uni.navigateTo({
				    url: '/pages/capacity/vehicle/add?token='+this.headerInfo.Authorization+'&code='+row.code
				});
			},
			// 删除
			handleDelete(row) {
				uni.showModal({
					title: '温馨提示',
					content: '确定要删除"'+ row.licenseNumber +'"吗？',
					success: async res => {
						if (res.confirm) {
							await delInfo(row.code, this.headerInfo);
							this.handleQuery();
							uni.showToast({
								title: '删除成功'
							});
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-page {
		padding: 0;
	}
	// 列表
	.card-list{
		padding: 24upx 24upx 0;
		>.card-item{
			background: #FFFFFF;
			border-radius: 20upx;
			margin-bottom: 24upx;
			position: relative;
			.card-content{
				min-height: 168upx;
				fonte-size: 28upx;
				padding: 20upx 32upx;
				>.img-box{
					width: 156upx;
					height: 132upx;
					border-radius: 10upx;
					overflow: hidden;
					margin-right: 18upx;
					background: #F7F7F7;
					>img{
						max-width: 100%;
						max-height: 100%;
					}
				}
				>.info-box{
					width: calc(100% - 174upx);
					>.platenumber{
						font-size: 32upx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #333333;
						line-height: 42upx;
						margin-bottom: 8upx;
						>image{
							width: 102upx;
							height: 32upx;
							vertical-align: middle;
							margin-top: -8upx;
							margin-left: 20upx;
						}
					}
					>.text{
						font-size: 28upx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #999999;
						line-height: 42upx;
						>.mr40{
							margin-right: 40upx;
						}
					}
				}
			}
		}
	}
</style>