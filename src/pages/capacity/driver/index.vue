<template>
	<view class="u-page">
		<HeaderBar title="司机管理" @back="navigateBack">
			<text slot="right" @click="handleAdd">新增司机</text>
		</HeaderBar>
		
		<view class="card-list" v-if="dataList && dataList.length > 0">
			<view v-for="(item, index) in dataList" :key="index" class="card-item">
				<uni-swipe-action>
					<uni-swipe-action-item :right-options="options2" @click="checked=>swipeActionClick(checked, item)">
				        <view class="card-content ly-flex">
				        	<view class="img-box"></view>
				        	<view class="info-box ly-flex-1">
				        		<view class="platenumber">
									{{ item.name }}
									<text>{{ item.telphone }}</text>
									<image v-if="item.authStatus === 3" src="~@/static/capacity/srz.png"></image>
								</view>
				        		<view class="text g-single-row">
				        			<text v-if="item.driverLicenseNumber" class="mr40">车牌号：{{ item.driverLicenseNumber }}</text>
				        			<text>调度组：{{ item.teamCount }}</text>
				        		</view>
				        	</view>
				        </view>
				    </uni-swipe-action-item>
				</uni-swipe-action>
			</view>
		</view>
		<NonePage v-else-if="status !== 'loading'"></NonePage>
		
		<uni-load-more v-if="dataList && dataList.length > 0" :status="status" :icon-size="16" :content-text="contentText" />
		
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import NonePage from '@/components/NonePage/NonePage.vue';
	import { listInfo, delInfo } from '@/config/service/capacity/driver.js';
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
				}]
			}
		},
		onLoad(options){
			this.$store.dispatch('getLoginInfoAction', {
				'Authorization': options.token
			});
			options.statusBarHeight && this.$store.dispatch('getStatusBarHeightAction', options.statusBarHeight);
			this.getList();
		},
		async onPullDownRefresh() {
			await this.handleQuery();
			setTimeout(() => {
				uni.stopPullDownRefresh(); //停止下拉刷新动画
			}, 700);
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
				const pages = getCurrentPages().length;
				if (pages === 1) {
					uni.webView.navigateBack();
				} else {
					uni.webView.switchTab({
						url: '/pages/applicate/index'
					})
				}
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
				const data = await listInfo(this.queryParams, this.headerInfo);
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
				    url: '/pages/capacity/driver/add?token='+this.headerInfo.Authorization+'&title=新增司机'
				});
			},
			// 编辑
			handleUpdate(row) {
				uni.navigateTo({
				    url: '/pages/capacity/driver/add?token='+this.headerInfo.Authorization+'&code='+row.code+'&title=编辑司机'
				});
			},
			// 删除
			handleDelete(row) {
				uni.showModal({
					title: '温馨提示',
					content: '确定要删除"'+ row.name +'"吗？',
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
		height: 100vh;
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
				padding: 34upx 22upx;
				>.img-box{
					width: 102upx;
					height: 102upx;
					background: url('~@/static/capacity/driver_avatar.png') no-repeat;
					background-size: 100% 100%;
					border-radius: 50%;
					overflow: hidden;
					margin-right: 34upx;
				}
				>.info-box{
					width: calc(100% - 136upx);
					>.platenumber{
						font-size: 32upx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #333333;
						line-height: 42upx;
						margin-bottom: 14upx;
						>text{
							font-size: 28upx;
							font-weight: 500;
							color: #999999;
							margin-left: 12upx;
						}
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