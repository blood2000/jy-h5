<template>
	<view class="u-page">
		<u-navbar
			title="车辆管理"
			@leftClick="navigateBack"
			safeAreaInsetTop
			fixed
			placeholder
		>
			<view slot="right" @click="handleAdd">新增车辆</view>
		</u-navbar>
		
		<view class="card-list" v-if="dataList && dataList.length > 0">
			<view v-for="(item, index) in dataList" :key="index" class="card-item">
				<uni-swipe-action>
					<uni-swipe-action-item :right-options="options2" @click="checked=>swipeActionClick(checked, item)">
				        <view class="card-content ly-flex">
							<view class="img-box">
								
							</view>
							<view class="info-box ly-flex-1">
								<view class="platenumber">闽A12345</view>
								<view class="text">
									<text class="mr40">司机：小七</text>
									<text>调度者：大白</text>
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
	export default {
		components: {
			NonePage
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
			}
		},
		onLoad(options){
			this.$store.dispatch('getLoginInfoAction', {
				'Authorization': options.token
			});
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
				uni.navigateBack();
			},
			handleQuery() {
			  this.queryParams.pageNum = 1;
			  this.dataList = [];
			  this.getList();
			},
			async getList() {
				this.dataList = [{}];
				// this.status = 'loading';
				// uni.showLoading();
				// this.loading = true;
				// const { data } = await listInfo(this.queryParams, this.headerInfo);
				// uni.hideLoading();
				// this.loading = false;
				// if (data.list.length === 0) {
				// 	this.isEnd = true;
				// 	this.status = 'noMore';
				// 	return;
				// }
				// if(data.list.length < this.queryParams.pageSize){
				// 	this.status = 'noMore';
				// }
				// this.total = data.total;
				// this.dataList = [...this.dataList, ...data.list];
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
				    url: '/pages/capacity/vehicle/add?token='+this.headerInfo.Authorization
				});
			},
			// 删除
			handleDelete(row) {
				uni.showModal({
					title: '温馨提示',
					content: '确定要删除吗？',
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
					background: #F7F7F7;
					border-radius: 10upx;
					overflow: hidden;
					margin-right: 18upx;
				}
				>.info-box{
					>.platenumber{
						font-size: 32upx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #333333;
						line-height: 42upx;
						margin-bottom: 14upx;
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