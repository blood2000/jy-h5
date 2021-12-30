<template>
	<view class="content-page" :style="{'--statusBar12': (statusBar12) + 'px' }">
		<HeaderBar title="过磅记录" @back="navigateBack" :border="false"></HeaderBar>
	  <!-- main -->
	  <view class="main-box">
			<!-- 筛选 -->
			<view class="filter-wrap">
				<view class="item-filter">
					<!-- 选择时间 -->
					<datetimerangePicker v-model="effectiveDate" />
				</view>
			</view>
			<!-- 磅房列表 -->
			<view class="list-wrap">
				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltolower="scrolltolower">
					<view class="list-record">
						<view class="item-record" v-for="item in dataList" :key="item.id">
							<!-- 磅房标题 -->
							<view class="item-head">
								<text class="item-title">磅房A-地磅1</text>
								<view class="item-head-right">
									<i class="icon-arrow"></i>
								</view>
							</view>
							<!-- 收发货统计 -->
							<view class="item-weigh">
								<view class="weigh-green">
								<image src="../../static/weighRecord/icon_receipt.png" class="item-logo-green"></image>
								<view class="wrapper-detail">
									<view class="weigh-lable">收货：</view>
									<view class="weigh-value">2车-26吨</view>
								</view>
								</view>
								<view class="weigh-blue">
								<image src="../../static/weighRecord/icon_delivery.png" class="item-logo-blue"></image>
								<view class="wrapper-detail">
									<view class="weigh-lable">发货：</view>
									<view class="weigh-value">2车-26吨</view>
								</view>
								</view>
							</view>
							<view class="item-route">
								<view class="item-route-lastTime">
									<text>最近一个过磅:</text>
									<text>2021-12-12 18:18:40</text>
								</view>
								<view class="item-route-name">
									<image src="../../static/weighRecord/icon_route.png" class="item-logo-route"></image>
									<view class="item-route-place">
										<text class="item-route-star">五福洗煤</text>
										<i class="icon-logo-line"></i>
										<text class="item-route-end">六福洗煤</text>
									</view>
								</view>
								<view class="item-info">
									<view class="item-info-car">
										<view>
											<text class="item-info-lable">毛重：</text>
											<text class="item-info-value">8.23吨</text>
										</view>
										<view>
											<text class="item-info-lable">车牌：</text>
											<text class="item-info-value">闽A54772</text>
										</view>
									</view>
									<view class="item-info-driver">
											<text class="item-info-lable">司机：</text>
											<text class="item-info-value">兔斯基</text>
										</view>
								</view>
							</view>
						</view>
					</view>
					<uni-load-more v-if="dataList && dataList.length > 0" :status="status" :icon-size="16" :content-text="contentText" />
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import HeaderBar from '@/components/Building/HeaderBar.vue';
	import datetimerangePicker from './inc/datetimerangePicker.vue'
	export default {
		components: {
			HeaderBar,
			datetimerangePicker
		},
		data() {
			return {
				scrollTop: 0,
				statusBar12: 0,
				oldDatePicker1: Date.now(), // 改变key值重新渲染
				effectiveDate: [], // 转成 开始时间 和 结束时间
				dataList: [{
					id: 1
				}, {
					id: 2
				}, {
					id: 3
				}],
				status: 'more',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了'
				}
			}
		},
		async onLoad(options) {
			if(options.token){
				this.$store.dispatch('getLoginInfoAction', {
					'Authorization': options.token
				});
				options.statusBarHeight && this.$store.dispatch('getStatusBarHeightAction', options.statusBarHeight);
			}
			this.statusBar12 = this.statusBarHeight;
			if(uni.getSystemInfoSync().platform == 'ios'){
				this.statusBar12 -= 10
			}
		},
		methods: {
			// 触底
			scrolltolower(e) {
				console.log('触达底部')
				if(!this.isEnd) {
					this.status = 'loading';
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
.content-page {
	font-size: 28upx;
	font-family: PingFang SC;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	overflow: hidden;
}
.main-box{
	height: calc(100% - 88upx);
	padding: 24upx 30upx 0;
	background: url(../../static/weighRecord/bg.png) #f5f5f5 no-repeat;
	background-size: contain;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}
.filter-wrap {
	width: 100%;
	.item-filter {
		display: flex;
		align-items: center;
	}
}
.list-wrap {
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
	margin: 0 -30upx;
	margin-top: 28upx;
	padding: 0 30upx;
	.scroll-Y {
		height: 100%;
	}	
}
.list-record {
	.scroll-Y {
		height: 100%;
	}	
	.item-record {
		background-color: #fff;
		border-radius: 24upx;
		&:not(:last-child) {
			margin-bottom: 24upx;
		}
		.item-head {
			height: 80upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 28upx;
			font-size: 32rpx;
			.item-title {
				font-weight: bold;
			}
			.icon-arrow {
				width: 18upx;
				height: 26upx;
				background: url(../../static/weighRecord/arrow_left.png) no-repeat;
				background-size: contain;
				display: block;
				margin-left: 10upx;
			}
		}
		.item-weigh {
			display: flex;
			justify-content: space-between;
			padding: 0 28upx;
			margin-top: 20upx;
			.item-logo-green {
				display: inline-block;
				width: 70upx;
				height: 70upx;
				margin-right: 17upx;
			}
			.item-logo-blue {
				display: inline-block;
				width: 70upx;
				height: 70upx;
				margin-right: 17upx;
			}
			.wrapper-detail {
				display: inline-block;
			}
			.weigh-blue {
				margin-right: 60upx;
			}
			.weigh-lable {
				font-size: 24upx;
				color: #878787;
			}
			.weigh-value {
				font-weight: bold;
			}
		}
		.item-route {
			margin-top: 40upx;
			padding: 0, 20upx;
			background-color: rgba($color: #d6ddf5, $alpha: .2);
			&-lastTime {
				display: flex;
				justify-content: space-between;
				padding: 24upx 24upx 0;
				font-size: 24rpx;
				color: #878787;
			}
			&-name {
				display: flex;
				align-items: center;
				height: 60upx;
				margin: 24upx;
				background-color:rgba(204, 204, 204, .18);
				border-radius: 6rpx;
				.item-route-place {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.item-route-star {
						margin-left: 80upx;
						margin-right: 50upx;
						font-weight:bold;
					}
					.icon-logo-line {
						width: 50upx;
						height: 22upx;
						background: url(../../static/weighRecord/icon_line.png) no-repeat;
						background-size: contain;
						display: block;
						margin-left: 50upx;
					}
					.item-route-end {
						margin-left: 80upx;
						font-weight:bold;
					}
				}
				.item-logo-route {
					width: 35upx;
					height:35upx;
					margin-left: 19upx;
				}
			}
			.item-info {
				display: flex;
				justify-content: space-between;
				padding: 0 24upx;
				&-lable {
					font-size: 24rpx;
					color: #878787;
				}
				&-value {
					font-size: 24rpx;
					color: #333333;
				}
				&-driver {
					padding-top: 15upx;
					margin-top: 25upx;
					margin-bottom: 25upx;
				}
			}
		}
	}
}
</style>
