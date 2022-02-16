<template>
	<view class="ly-form-card" :style="{ '--ship': _cardList.receiveType === 1? '#59BE32':'#3c65fd', }">
		<view class="tarns-card ship" @click="$emit('handlerClick')">
			<view class="ly-flex-pack-justify">
				<view class="tarns-title ly-flex-align-center ly-flex-1">
					<view class="tarns-title-text ly-flex-align-center ly-flex-pack-center">
						{{_cardList.receiveType === 1?'收货':'发货'}}
					</view>
					<view class="oreder-name ly-flex-1">
						<view class="g-single-row">
							{{ _cardList.name }}
						</view>
					</view>
					<view>
						<switch :checked="_cardList.status == 0" @change="(data) => switchChange(data, _cardList.id)" @click.stop="" />
					</view>
				</view>
			</view>
			<view class="scompanyName-box ly-flex-pack-justify ly-flex-align-center">
				<view class="address-name">
					<view class="address-name-text g-single-row">
						{{ _cardList.fcompanyName }}
					</view>
				</view>
				<view class="middle-box">
					<image v-if="_cardList.receiveType === 1" class="middle-walk-img" src="@/static/transportPlan/separate.png" mode=""></image>
					<image v-else class="middle-walk-img" src="@/static/transportPlan/separate1.png" mode=""></image>

					<text v-if="_cardList.transRelType !== 'chy'" class="trans-name">{{ _cardList.transName }}</text>
					<image v-else class="trans-name-img" src="@/static/transportPlan/chy.png" mode=""></image>
				</view>


				<view class="address-name">
					<view class="address-name-text g-single-row">
						{{ _cardList.scompanyName }}
					</view>
				</view>
			</view>
			<view class="ly-flex-align-center commodity-box ly-flex-pack-justify">
				<view>
					<image class="commodity-box-img" src="../../../static/transportPlan/rawcoal.png" mode=""></image>
					<text>{{ _cardList.goodsTypeName }}</text>
				</view>
				<view class="quantity-box">
					<text v-if="_cardList.weightType === 1">不限</text>
					<text v-else><text>{{ _cardList.loadedWeight? _cardList.loadedWeight + '/': '0/' }}</text>{{ _cardList.weight }}<text class="unit">吨</text></text>
				</view>
			</view>
			<view class="share-wrap">
				<view class="share-box ly-flex-align-center" @click.stop="$emit('share', value )">
					<view class="share-box-text">
						分享接单码
					</view>
					<image class="share-img" src="@/static/transportPlan/qr.png" mode=""></image>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		props: {
			value: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				color: 0
			}
		},
		computed: {
			_cardList: {
				get() {
					return this.value
				},
				set(val) {
					this.$emit('input', val)
				}
			}
		},
		methods: {
			switchChange(data, id) {
				const status = data.detail.value ? 0 : 1;
				this.$emit('updateStatus', status, id);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tarns-card{
		padding: 24upx;
	}
	.tarns-card{
		.tarns-title{
			overflow: hidden;
		}
		.tarns-title-text{
			width: 82upx;
			height: 33upx;
			background: var(--ship);
			border-radius: 16upx 16upx 16upx 0upx;
			font-size: 24upx;
			color: #FFFFFF;
			margin-right: 14upx;
		}
		.oreder-name{
			font-size: 32upx;
			font-weight: bold;
			color: #333333;
			overflow: hidden;
		}
		.share-box{
			.share-box-text{
				min-width: 140upx;
				font-size: 28upx;
				font-weight: bold;
				color: #3A65FF;
				margin-right: 7upx;
			}
		}
		.share-img{
			width: 26upx;
			height: 26upx;
		}

		.scompanyName-box{
			margin-top: 10upx;
			.address-name{
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 36upx;
				font-weight: bold;
				color: #333333;
				overflow: hidden;
				.address-name-text{
					text-align: center;
					padding: 0 20upx;
				}
			}
			.middle-box{
				display: flex;
				flex-direction: column;
				padding-top: 40upx;
				.middle-walk-img{
					width: 57upx;
					height: 17upx;
					margin-bottom: 12upx;
				}
				.trans-name-img{
					width: 57upx;
					height: 26upx;
				}
				.trans-name{
					font-size: 28upx;
					font-weight: bold;
					color: #333333;
				}
			}
		}

		.commodity-box{
			width: 100%;
			height: 66upx;
			// background: #CCCCCC;
			// opacity: 0.18;
			background-color: rgba($color: #CCCCCC, $alpha: 0.18);
			border-radius: 6upx;
			margin-top: 40upx;
			padding: 0 24upx;
			text{
				font-weight: bold;
				font-size: 28upx;
				color: #000000;
				line-height: 1;
			}

			.commodity-box-img{
				width: 30upx;
				height: 30upx;
				margin-right: 15upx;
				vertical-align: bottom;
			}
			.quantity-box{
				.unit{
					margin-left: 10upx;
				}
			}
		}
	}
	.ly-form-card {
		padding: 0;
	}
	.share-wrap {
		display: flex;
		justify-content: flex-end;
		margin-top: 20rpx;
	}
	uni-switch::after, uni-switch::before {
		display: none;
	}
</style>
