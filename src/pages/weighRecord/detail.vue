<template>
	<view class="content-page" :style="{'--statusBar12': (statusBar12) + 'px' }">
		<HeaderBar title="过磅记录详情" @back="navigateBack" :border="false"></HeaderBar>
		<view class="main-box">
			<view class="detail-info">
				<view class="info-title">
					<text class="title">{{ detailInfo.orderPlanInfoName }}</text>
					<text class="type">{{ detailInfo.goodsTypeName }}</text>
				</view>
				<view class="info-price">
					<view class="item-price">
						<text class="label">运价：</text>
						<text class="val">{{ detailInfo.freightPrice }}元</text>
					</view>
					<view class="item-price">
						<text class="label">货价：</text>
						<text class="val">{{ detailInfo.goodsPrice }}元</text>
					</view>
				</view>
				<view class="info-route">
					<view class="item-route">
						<i class="icon-route delivery"></i>
						<text>{{ detailInfo.sedCompnayInfoName }}</text>
					</view>
					<view class="item-route">
						<i class="icon-route receipt"></i>
						<text>{{ detailInfo.recCompnayInfoName }}</text>
					</view>
				</view>
				<view class="info-order">
					<view class="item-order">
						<text class="label">运单号：</text>
						<text class="val">{{ detailInfo.waybillNo }}</text>
					</view>
					<view class="item-order">
						<text class="label">运单状态：</text>
						<text class="val">{{ detailInfo.waybillStatus }}</text>
					</view>
					<view class="item-order">
						<text class="label">运单类型：</text>
						<text class="val">
							<img src="@/static/weighRecord/logo_chao.png" alt="" class="item-logo" v-if="detailInfo.isChy > 0">
							<img src="@/static/weighRecord/logo_ji.png" alt="" class="item-logo" v-else>
						</text>
					</view>
					<view class="item-order">
						<text class="label">车牌：</text>
						<text class="val">{{ detailInfo.licenseNumber }}</text>
					</view>
					<view class="item-order">
						<text class="label">司机：</text>
						<text class="val">{{ detailInfo.driverName }}</text>
					</view>
				</view>
			</view>
			<view class="record-wrap">
				<view class="record-title">过磅记录</view>
				<view class="record-content">
					<view class="record-name">
						<view>
							<text class="label">地磅：</text>
							<text class="val">{{ weighRecord.weighbridgeName }}</text>
						</view>
						<view>
							<text class="label">司磅员：</text>
							<text class="val">{{ weighRecord.userName }}</text>
						</view>
					</view>
					<view class="record-tare">
						<view class="label">皮重</view>
						<text>{{ weighRecord.tareWeight }}吨</text>
					</view>
					<view class="record-img">
						<img src="@/static/weighRecord/img01.jpg" alt="" class="item-img" v-for="(item,index) in 3" :key="index">
					</view>
					<view class="record-time">过磅时间：{{ weighRecord.finishTime}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import HeaderBar from '@/components/Building/HeaderBar2.vue';
	import { getWaybillInfoByDeviceNo, findList } from '@/config/service/weighRecord/index.js'
	import { mapState} from 'vuex';
	export default {
		components: {
			HeaderBar
		},
		data() {
			return {
				statusBar12: 0,
				detailInfo: {}, // 订单详情
				weighRecord: {} // 过磅记录
			}
		},
		onLoad(options){
			console.log(123)
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

			this.jyzCode = '170234e12abb405aa0cd475e7c824866';

			this.deviceNo = options.deviceNo;
			this.waybillNo = options.waybillNo;
			this.findList();
			this.getWaybillInfoByDeviceNo();
		},
		methods: {
			/**
			 * 返回上一页
			 */
			navigateBack() {
				uni.navigateBack();
			},
			getWaybillInfoByDeviceNo() {
				getWaybillInfoByDeviceNo({
					deviceNo: this.deviceNo
				}, this.headerInfo).then(res=>{
					this.weighRecord = res.data;
				})
			},
			findList() {
				findList({
					waybillNo: this.waybillNo,
					pageNum: 1,
					buildingType: 1,
					jyzCode: this.jyzCode
				}, this.headerInfo).then(res=>{
					this.detailInfo = res.rows[0];
				})
			}
		},
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			}),
		}
	}
</script>

<style lang="scss" scoped>
  // Color Palette
  $gray-1: #333;
  $gray-2: #878787;
  // Component Colors
  $text-color: $gray-1;
  $label-color: $gray-2;
	.detail-info {
		background-color: #fff;
		padding: 40upx;
		.info-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.title {
				font-size: 32upx;
				color: $text-color;
				font-weight: bold;
			}
			.type {
				font-size: 28upx;
				color: #3a65ff;
				font-weight: bold;
			}
		}
		.info-price {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 28upx;
			margin-top: 24upx;
			.item-price {
				.label {
					color: $label-color;
				}
				.val {
					color: $text-color;
					font-weight: bold;
				}
			}
		}
		.info-route {
			position: relative;
			margin-top: 35upx;
			.item-route {
				display: flex;
				align-items: center;
				font-size: 28upx;
				color: $text-color;
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
		.info-order {
			font-size: 28upx;
			margin-top: 35upx;
			.item-order {
				display: flex;
				justify-content: space-between;
				align-items: center;
				&:not(:first-child) {
					margin-top: 30upx;
				}
				.label {
					color: $label-color;
				}
				.val {
					color: $text-color;
					font-weight: bold;
				}
				.item-logo {
					height: 44upx;
					object-fit: contain;
				}
			}
		}
	}
	.record-wrap {
		padding: 30upx;
		.record-title {
			font-size: 28upx;
			color: $text-color;
			margin-bottom: 20upx;
			font-weight: bold;
		}
		.record-content {
			padding: 30upx 24upx;
			background-color: #fff;
			border-radius: 24upx;
			.record-name {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.label {
					color: $label-color;
				}
				.val {
					font-weight: bold;
				}
			}
			.record-tare {
				display: flex;
				justify-content: space-between;
				align-items: center;
				background-color: rgba($color: #ccc, $alpha: .18);
				border-radius: 6upx;
				padding: 18upx 24upx;
				margin-top: 20upx;
				font-weight: bold;
				.label {
					display: flex;
					align-items: center;
					&::before {
						content: '';
						display: block;
						width: 34upx;
						height: 34upx;
						background: url(@/static/weighRecord/icon_tare.png) no-repeat;
						background-size: contain;
						margin-right: 20upx;
					}
				}
			}
			.record-img {
				display: flex;
				margin: 20upx -12upx 0;
				.item-img {
					width: 198upx;
					height: 144upx;
					object-fit: object-fit;
					background-color: #dcdcdc;
					border-radius: 6upx;
					margin: 0 12upx;
				}
			}
			.record-time {
				color: $label-color;
				margin-top: 25upx;
			}
		}
	}
</style>
