<template>
	<view class="content-page" :style="{'--statusBar12': (statusBar12) + 'px' }">
		<HeaderBar title="过磅记录" @back="navigateBack" :border="false"></HeaderBar>
	  <!-- main -->
	  <view class="main-box">
			<!-- 筛选 -->
			<view class="filter-wrap">
				<view class="item-filter select">
					<!-- 选择时间 -->
					<view class="filter-date">
						<i class="icon-calendar"></i>
						<text>2021-11-26</text>
						<text class="to">到</text>
						<text>2021-12-03</text>
						<i class="icon-select"></i>
					</view>
					<!-- 筛选条件 -->
					<view class="btn-filter">筛选</view>
				</view>
				<view class="item-filter input">
					<input type="text" placeholder="输入车牌或司机名字或手机号" class="input-search" />
				</view>
			</view>
			<view class="list-record">
				<view class="item-record">
					<view class="item-head building-bottom-line">
						<text class="item-title">运输计划名称</text>
						<view class="item-head-right">
							<img src="@/static/weighRecord/logo_ji.png" alt="" class="item-logo">
							<i class="icon-arrow"></i>
						</view>
					</view>
					<view class="item-route building-bottom-line">
						<view class="route">
							<i class="icon-route delivery"></i>
							<text>衢州宝红建材有限公司</text>
						</view>
						<view class="route">
							<i class="icon-route receipt"></i>
							<text>浙江宝红商品砼有限公司</text>
						</view>
					</view>
					<view class="item-info">
						<view class="item-info-name">
							<view>
								<text class="label">货物：</text>
								<text class="val">小石头</text>
							</view>
							<view>
								<text class="label">过磅类型：</text>
								<text class="val">皮重</text>
							</view>
						</view>
						<view class="item-info-number">
							<view class="car-no">闽A12345</view>
							<view class="tel">兔斯基 13700000000</view>
						</view>
						<view class="item-info-time">
							过磅时间：2021-12-12 18:18:40
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

<style lang="scss">
	.building-bottom-line {
		position: relative;
		&::after {
			background: #f0f0f0;
		}
	}
	.content-page {
		font-size: 28upx;
		font-family: PingFang SC;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: calc(100vh);
		overflow: hidden;
		display: felx;
		flex-direction: column;
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
	.filter-wrap {
		.item-filter {
			display: flex;
			align-items: center;
			&.select {
				font-size: 28upx;
				color: #fff;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.filter-date {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.icon-calendar {
						background: url(../../static/weighRecord/icon_calendar.png);
						background-size: contain;
						width: 30upx;
						height: 30upx;
						display: block;
						margin-right: 10upx;
					}
					.to {
						margin: 0 5upx;
					}
					.icon-select {
						width: 30upx;
						height: 16upx;
						background: url(../../static/weighRecord/icon_select.png) no-repeat;
						background-size: contain;
						margin-left: 10upx;
					}
				}
				.btn-filter {
					font-size: 28upx;
					display: flex;
					align-items: start;
					line-height: 1;
					&::after {
						content: '';
						display: block;
						width: 30upx;
						height: 30upx;
						background: url(../../static/weighRecord/icon_filter.png) no-repeat;
						background-size: contain;
						margin-left: 10upx;
					}
				}
			}
			&.input {
				margin-top: 40upx;
				.input-search {
					height: 72upx;
					background-color: #fff;
					border-radius: 10upx;
					width: 100%;
					padding: 0 16upx;
					font-size: 28upx;
					/deep/ .uni-input-wrapper {
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: row;
						&::before {
							content: '';
							display: block;
							width: 32upx;
							height: 32upx;
							background: url(../../static/weighRecord/icon_search.png) no-repeat;
							background-size: contain;
							margin-right: 10upx;
						}
						.uni-input-placeholder {
							left: 42upx;
							width: calc(100% - 42upx);
						}
					}
				}
			}
		}
	}
	.list-record {
		.item-record {
			background-color: #fff;
			border-radius: 24upx;
			margin-top: 24upx;
			.item-head {
				height: 80upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 28upx;
				.item-title {
					font-size: 32upx;
					color: #333;
					font-weight: 700;
				}
				.item-logo {
					width: 120upx;
					height: 44upx;
					object-fit: contain;
				}
				&-right {
					display: flex;
					align-items: center;
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
			.item-route {
				position: relative;
				padding: 23upx 28upx;
				.route {
					display: flex;
					align-items: center;
					font-size: 28upx;
					color: #333;
					margin: 10upx 0;
					.icon-route {
						width: 30upx;
						height: 30upx;
						display: block;
						border-radius: 4upx;
						font-size: 20upx;
						color: #fff;
						font-style: normal;
						display: flex;
						justify-content: center;
						align-items: center;
						margin-right: 20upx;
						&.delivery {
							background-color: #3a65ff;
							&::before {
								content: '发';
								display: block;
							}
						}
						&.receipt {
							background-color: #59be32;
							&::before {
								content: '收';
								display: block;
							}
						}
					}
				}
			}
			.item-info {
				padding: 23upx 28upx;
				font-size: 28upx;
				&-name {
					display: flex;
					justify-content: space-between;
					.label {
						font-size: 26upx;
						color: #878787;
					}
					.val {
						font-weight: 700;
					}
				}
				&-number {
					background-color: rgba($color: #ccc, $alpha: .18);
					border-radius: 6upx;
					padding: 20upx;
					display: flex;
					justify-content: space-between;
					margin-top: 28upx;
					font-weight: bold;
					.car-no {
						display: flex;
						align-items: center;
						&::before {
							content: '';
							width: 32upx;
							height: 32upx;
							display: block;
							background: url(../../static/weighRecord/icon_car.png) no-repeat;
							background-size: contain;
							margin-right: 20upx;
						}
					}
				}
				&-time {
					color: #878787;
					margin-top: 25upx;
				}
			}
		}
	}
</style>
