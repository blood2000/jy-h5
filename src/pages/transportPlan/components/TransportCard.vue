<template>
	<view class="ly-form-card">
		<view class="info">
			<view class="ly-flex">
				<view class="img-box">
					<view class="avatar"
						:style="{color:_cardList.receiveType === 1?'#ffb83a':'#3c65fd',backgroundColor:_cardList.receiveType === 1?'#fff0da':'#ecf1fd'}">
						{{_cardList.receiveType === 1?'收':'发'}}
					</view>
				</view>
				<view class="info-box ly-flex-1">
					<view class="planName">
						{{_cardList.name}}
					</view>
					<view class="ly-flex mb10">
						<view class="ly-flex receive">
							<view class="miniavatar">
								收
							</view>
							五福洗煤
						</view>
						<view class="ly-flex deliver">
							<view class="miniavatar">
								发
							</view>
							五福洗煤大厂
						</view>
					</view>
					<view class="ly-flex mb10">
						<view class="source">
							货源：原煤
						</view>
						<view class="company">
							运输公司：自营
						</view>
					</view>
					<view class="total">
						总量：999/999吨
					</view>
				</view>
			</view>
		</view>
		<view class="share">
			<button type="primary" size="mini" @click="$emit('share')">分享接单码</button>
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
		}
	}
</script>

<style lang="scss" scoped>
	.mb10 {
		margin-bottom: 10px;
	}

	.info {
		padding: 10px 0;
		border-bottom: 1px solid #F1F1F1;

		.img-box {
			.avatar {
				// background-color: #c9dfff;
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				text-align: center;
				line-height: 100rpx;
				font-size: 40rpx;
				font-weight: 600;
				// color: #52baff;
			}
		}

		.info-box {
			padding-left: 20rpx;

			.planName {
				margin-bottom: 10px;
				font-size: 30rpx;
				font-weight: bold;
			}

			.source,
			.company,
			.receive,
			.deliver {
				width: 250rpx;
			}

			.receive {
				.miniavatar {
					background-color: #0055ff;
				}
			}

			.miniavatar {
				margin-right: 10rpx;
				background-color: #ffaa00;
				width: 40rpx;
				height: 40rpx;
				border-radius: 10rpx;
				text-align: center;
				line-height: 40rpx;
				font-size: 20rpx;
				color: white;
			}
		}
	}

	.share {
		height: 40px;
		padding-top: 15rpx;

		button {
			float: right;
		}
	}
</style>
