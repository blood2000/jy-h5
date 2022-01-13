<template>
  <view class="list-record">
    <view class="item-record" v-for="item in list" :key="item.id" :data-deviceNo="item.deviceNo" @click="navigateToDetail(item.deviceNo)">
      <!-- 磅房标题 -->
      <view class="item-head">
        <text class="item-title">{{ item.buildingName }}</text>
        <view class="item-head-right">
          <i class="icon-arrow"></i>
        </view>
      </view>
      <!-- 收发货统计 -->
      <view class="item-weigh">
        <view class="weigh-green">
        <image src="@/static/weighRecord/icon_receipt.png" class="item-logo-green"></image>
        <view class="wrapper-detail">
          <view class="weigh-lable">收货：</view>
          <view class="weigh-value">{{ item.receiveCarNum }}车-{{ item.receiveNetWeight }}吨</view>
        </view>
        </view>
        <view class="weigh-blue">
        <image src="@/static/weighRecord/icon_delivery.png" class="item-logo-blue"></image>
        <view class="wrapper-detail">
          <view class="weigh-lable">发货：</view>
          <view class="weigh-value">{{ item.sendCarNum }}车-{{ item.sendNetWeight }}吨</view>
        </view>
        </view>
      </view>
      <view class="item-route building-top-line">
        <view class="item-route-lastTime">
          <text>最近一个过磅:</text>
          <text>{{ item.finishTime }}</text>
        </view>
        <view class="item-route-name">
          <image src="@/static/weighRecord/icon_route.png" class="item-logo-route"></image>
          <view class="item-route-place">
            <text class="item-route-start">{{ item.sendCompany }}</text>
            <i class="icon-logo-line"></i>
            <text class="item-route-end">{{ item.receivingCompany }}</text>
          </view>
        </view>
        <view class="item-info">
          <view class="item-info-car">
            <view>
              <text class="item-info-lable">毛重：</text>
              <text class="item-info-value">{{ item.grossWeight }}吨</text>
            </view>
          </view>
          <view class="item-info-driver">
            <view>
              <text class="item-info-lable">车牌：</text>
              <text class="item-info-value">{{ item.licenseNumber }}</text>
            </view>
            <view>
              <text class="item-info-lable">司机：</text>
              <text class="item-info-value">{{ item.driverName }}</text>
            </view>
            </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'ListPoundRoom',
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
			navigateToDetail(deviceNo) {
        if(!deviceNo) {
          return uni.showToast({
            title: '缺失设备编号deviceNo',
            icon: 'none'
          });
        }
				uni.navigateTo({
          url: `/pages/weighRecord/list?deviceNo=${deviceNo}`
        });
      },
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
          background: url(@/static/weighRecord/arrow_left.png) no-repeat;
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
        .weigh-green, .weigh-blue {
          width: 100%;
          display: flex;
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
        .weigh-lable {
          font-size: 24upx;
          color: $label-color;
        }
        .weigh-value {
          font-weight: bold;
        }
      }
      .item-route {
        position: relative;
        margin-top: 40upx;
        padding: 24upx;
        background-color: rgba($color: #d6ddf5, $alpha: .2);
        &::before {
          position: absolute;
          content: '';
          width: 100%;
          height: 1px;
          left: 0;
          top: 0;
          background-color: #f0f0f0;
          transform: scaleY(.5);
        }
        &-lastTime {
          display: flex;
          justify-content: space-between;
          font-size: 24rpx;
          color: $label-color;
        }
        &-name {
          display: flex;
          align-items: center;
          padding: 15upx 20upx;
          background-color:rgba(204, 204, 204, .18);
          border-radius: 6upx;
          margin-top: 12upx;
          .item-route-place {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            flex-shrink: 1;
            font-weight:bold;
            padding: 0 30upx;
/*             &::before, &::after {
              display: block;
              content: '';
            } */
            .item-route-start {
              margin: 0 20upx;
              width: 35%;
              overflow: hidden;
              text-align: left;
            }
            .icon-logo-line {
              position: absolute;
              transform: translateX(-50%);
              left: 50%;
              width: 50upx;
              height: 22upx;
              background: url(@/static/weighRecord/icon_line.png) no-repeat;
              background-size: contain;
              display: block;
            }
            .item-route-end {
              width: 35%;
              margin: 0 20upx;
              text-align: right;
            }
          }
          .item-logo-route {
            width: 35upx;
            height:35upx;
            margin-left: 20upx;
            object-fit: contain;
            flex-shrink: 0;
          }
        }
        .item-info {
          margin-top: 15upx;
          &-lable {
            font-size: 24rpx;
            color: $label-color;
          }
          &-value {
            font-size: 24rpx;
          }
          &-driver {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10upx;
          }
        }
      }
    }
  }
</style>