<template>
  <view class="list-record" @click="navigateToDetail">
    <view class="item-record" v-for="item in list" :key="item.waybillNo" :data-waybillNo="item.waybillNo">
      <view class="item-head building-bottom-line">
        <text class="item-title">{{ item.orderPlanInfoName }}</text>
        <view class="item-head-right">
          <img src="@/static/weighRecord/logo_chao.png" alt="" class="item-logo" v-if="item.isChy > 0">
          <img src="@/static/weighRecord/logo_ji.png" alt="" class="item-logo" v-else>
          <i class="icon-arrow"></i>
        </view>
      </view>
      <view class="item-route building-bottom-line">
        <view class="route route-delivery">
          <text>{{ item.sedCompnayInfoName }}</text>
        </view>
        <view class="route route-receipt">
          <text>{{ item.recCompnayInfoName }}</text>
        </view>
      </view>
      <view class="item-info">
        <view class="item-info-name">
          <view>
            <text class="label">货物：</text>
            <text class="val">{{ item.goodsTypeName }}</text>
          </view>
          <view>
            <text class="label">过磅类型：</text>
            <text class="val">{{ item.weighingTypeName }}</text>
          </view>
        </view>
        <view class="item-info-number">
          <view class="car-no">{{ item.licenseNumber }}</view>
          <view class="tel">{{ item.driverName }} {{ item.driverPhone }}</view>
        </view>
        <view class="item-info-time">
          过磅时间：{{ item.createTime }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
		name: 'ListRecord',
    props: {
      list: {
        type: Array,
        default: []
      }
    },
    methods: {
      /**
       * 跳转至过磅详情
       * @param {Object} e 当前点击对象
       */
      navigateToDetail(e) {
        if(e.target.dataset.id >= 0) {
          uni.navigateTo({
            url: `/pages/weighRecord/detail?id=${e.target.dataset.id}`
          });
        }
      }
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
  .building-bottom-line {
      position: relative;
      &::after {
        background: #f0f0f0;
      }
    }
  .list-record {
		.item-record {
			position: relative;
			background-color: #fff;
			border-radius: 24upx;
			&:not(:last-child) {
				margin-bottom: 24upx;
			}
			&::after {
				content: "";
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				top: 0;
			}
			.item-head {
				height: 80upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 28upx;
				.item-title {
					font-size: 32upx;
					color: $text-color;
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
					background: url(@/static/weighRecord/arrow_left.png) no-repeat;
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
					color: $text-color;
					margin: 10upx 0;
          &::before {
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
          }
          &-delivery {
            &::before {
              content: '发';
              background-color: #3a65ff;
              display: block;
            }
          }
          &-receipt {
            &::before {
              content: '收';
              background-color: #59be32;
              display: block;
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
						color: $label-color;
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
							background: url(@/static/weighRecord/icon_car.png) no-repeat;
							background-size: contain;
							margin-right: 20upx;
						}
					}
				}
				&-time {
					color: $label-color;
					margin-top: 25upx;
				}
			}
		}
	}
</style>