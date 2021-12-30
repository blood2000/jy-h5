<template>
	<view class="content-page" :style="{'--statusBar12': (statusBar12) + 'px' }">
		<HeaderBar title="过磅记录" @back="navigateBack" :border="false"></HeaderBar>
	  <!-- main -->
	  <view class="main-box">
			<view class="list-record">
				<view class="item-record">
					<view class="item-head">
						<text class="item-title">磅房A-地磅1</text>
						<view class="item-head-right">
							<i class="icon-arrow"></i>
						</view>
					</view>
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
							<view class="weigh-lable">收货：</view>
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
							<view class="tiem-route-place">
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
		</view>
	</view>
</template>

<script>
	import HeaderBar from '@/components/Building/HeaderBar.vue';
	export default {
		components: {
			HeaderBar
		},
		data() {
			return {
				statusBar12: 0
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
	}
</script>

<style>
.list-record {
	margin-top: 24upx;
	overflow: hidden;
	
}
.item-record {
	background-color: #fff;
	border-radius: 24upx;
}
.item-head {
	height: 80upx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 28upx;
	font-size: 32rpx;
}
.main-box{
		height: calc(100% - 100upx);
		padding: 24upx 30upx;
		background: url(../../static/weighRecord/bg.png) #f5f5f5 no-repeat;
		background-size: contain;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
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
.item-weigh {
	display: flex;
	justify-content: space-between;
	padding: 0 28upx;
}
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
.item-route {
	margin-top: 40upx;
	padding: 0, 20upx;
	background-color:rgba(214, 221, 245, .2);
}
.item-route-lastTime {
	display: flex;
	justify-content: space-between;
	padding-top: 20upx;
	padding-left: 24upx;
	padding-right: 24upx;
	font-size: 24rpx;
	color: #878787;
	
}
.item-route-name {
	display: flex;
	align-items: center;
	height: 60upx;
	margin: 20upx;
	background-color:rgba(204, 204, 204, .18);
	border-radius: 6rpx;
}
.tiem-route-place {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.item-logo-route {
	width: 35upx;
	height:35upx;
	margin-left: 19upx;
}
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
.item-info {
	display: flex;
	justify-content: space-between;
	padding-left: 24upx;
	padding-right: 18upx;
}
.item-info-lable {
	font-size: 24rpx;
	color: #878787;
}
.item-info-value {
	font-size: 24rpx;
	color: #333333;
}
.item-info-driver {
	padding-top: 15upx;
	margin-top: 25upx;
	margin-bottom: 25upx;
}
</style>
