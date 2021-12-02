<template>
	<view class="u-page">
		<u-navbar title="运输计划" @leftClick="navigateBack" safeAreaInsetTop fixed placeholder>
		</u-navbar>
		<view class="ly-flex-pack-around">
			<view class="sendPlan" @click="sendPlan">
					<image src="../../static/transportPlan/send.png" style="width: 50rpx;height: 50rpx;"></image>
					111
			</view>
			<view class="receivePlan" @click="receivePlan">
				发货
			</view>
		</view>
		<template v-if="cardList && cardList.length > 0">
			<view v-for="(item,index) in cardList" :key="index">
				<TransportCard v-model="cardList[index]" @share='share()' @handlerClick="handlerClick(item)"></TransportCard>
			</view>
		</template>

		<NonePage v-else></NonePage>

		<uni-load-more v-if="cardList && cardList.length > 0" :status="status" :icon-size="16" :content-text="contentText" />

		<u-overlay :show="show" @click="show = false">
			<view class="qrcode ly-flex-v ly-flex-align-center">
				<view class="title">
					<image src="../../static/transportPlan/title.png" mode="aspectFill" style="height:50px;width:250px">
					</image>
				</view>
				<view class="qr" @tap.stop>
					二维码
				</view>
				<view class="message mb10 mt10">
					司机扫码即可接单，您也可以分享链接到微信中让司机点击接单
				</view>
				<view class="btn ly-flex-pack-around">
					<button @click.stop="">保存到手机</button>
					<button @click.stop="">分享链接到微信</button>
				</view>
			</view>
		</u-overlay>
	</view>
</template>

<script>
	import TransportCard from './components/TransportCard.vue'
	import { orderPlanInfoList as getList, orderPlanInfoAdd, orderPlanInfoUpdate, orderPlanInfoUpdateStatus, teamSelectTeamListByCodes } from '@/config/service/transportPlan/transportationPlan.js'
	export default {
		components: {
			TransportCard
		},
		data() {
			return {
				// 二维码展示
				show: false,
				// 运输计划列表
				cardList: [],
				// 是否无数据了
				isEnd: false,
				status: 'more',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了'
				},


				loading: false,
				queryParams: { // 请求参数
					pageNum: 1,
					pageSize: 10,
				},
			}
		},

		computed:{
			_queryParams(){
				return this.queryParams
			}
		},

		onPullDownRefresh() {
			// console.log('下拉刷新');
			uni.stopPullDownRefresh();
		},

		// 触底加载
		onReachBottom() {
			if(!this.isEnd) {
				this.status = 'more';
				this.queryParams.pageNum++;
				this.getList();
			}
		},
		
		onShow(){
			this.getList()
		},

		methods: {
			// s= 请求列表数据(固定字段名)
			getList() {
				this.status = 'loading';
				uni.showLoading();
				this.loading = true;
				getList(this._queryParams).then(async res => {
					console.log(res);
					this.loading = false;
					uni.hideLoading();
					if (res.data.list.length === 0) {
						this.isEnd = true;
						this.status = 'noMore';
						return;
					}
					if(res.data.list.length < this._queryParams.pageSize){
						this.status = 'noMore';
					}

					this.total = res.data.total || 0;
					this.cardList = [...this.cardList, ...res.data.list];
				}).catch(() => { this.loading = false; });
			},
			// e=

			navigateBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			share() {
				this.show = true
			},

			// 点击
			handlerClick(_data){
				console.log(_data);
				// uni.$emit('caback')
				const { receiveType, id } = _data
				uni.navigateTo({
					url: `./add?type=${receiveType - 1}&id=${id}`
				})
			},

			sendPlan(){
				uni.navigateTo({
					url:'./add?type=0'
				})
			},
			receivePlan(){
				uni.navigateTo({
					url:'./add?type=1'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sendPlan,
	.receivePlan{
		margin-top: 20rpx;
		border-radius: 20rpx;
		width: 45%;
		height: 150rpx;
	}
	.sendPlan{
		background:#3a65ff url(../../static/transportPlan/sendbg.png) no-repeat 150rpx 32rpx;
		background-size:200rpx
	}
	.receivePlan{
		background:#5abe00 url(../../static/transportPlan/receivebg.png) no-repeat 150rpx 42rpx;
		background-size:200rpx
	}
	.qrcode {
		width: 600rpx;
		height: 850rpx;
		background-color: #3c65fd;
		margin: auto;
		border-radius: 30rpx;

		.qr {
			border-radius: 20rpx;
			width: 500rpx;
			height: 500rpx;
			background-color: #FFFFFF;
		}

		.message {
			width: 80%;
			color: #FFFFFF;
			line-height: 50rpx;
		}

		.btn {
			width: 90%;

			button {
				width: 240rpx;
				height: 80rpx;
				line-height: 80rpx;
				font-size: 12rpx;
				font-weight: bold;

				&:first-child {
					color: #FFFFFF;
					background-color: #7897ff;

					&:active {
						background-color: #6c88e5;
					}
				}

				&:last-child {
					color: #3c65fd;
				}
			}
		}
	}

	.mb10 {
		margin-bottom: 20rpx;
	}

	.mt10 {
		margin-top: 20rpx;
	}
</style>
