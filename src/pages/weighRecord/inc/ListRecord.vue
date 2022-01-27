<template>
  <view class="list-record">
    <view
      class="item-record"
      v-for="item in list"
      :key="item.waybillNo"
      :data-waybillNo="item.waybillNo"
      :data-deviceNo="deviceNo"
      @click="navigateToDetail(item.waybillNo)"
    >
      <view class="item-head building-bottom-line">
        <text class="item-title">{{ item.orderPlanInfoName }}</text>
        <view class="item-head-right">
          <img
            src="@/static/weighRecord/logo_chao.png"
            alt=""
            class="item-logo"
            v-if="item.isChy > 0"
          />
          <img
            src="@/static/weighRecord/logo_ji.png"
            alt=""
            class="item-logo"
            v-else
          />
          <i class="icon-arrow"></i>
        </view>
      </view>
      <view class="item-route building-bottom-line">
        <view class="item-info">
          <view class="item-info-name">
            <text>{{ item.licenseNumber }}</text>
          </view>
          <view class="item-info-phone">
            <text>{{ item.driverName }} {{ item.driverPhone }}</text>
          </view>
        </view>
        <block v-for="(itemWeight, index) in item.weightList" :key="index">
          <view
            class="route"
            :class="{
              'route-delivery': itemWeight.weightType == 1,
              'route-receipt': itemWeight.weightType == 2,
            }"
            v-if="itemWeight.weight"
          >
            <view class="route-delivery-info">
              <view>
                <view class="Weight">
                  <text>{{ itemWeight.weight }}吨</text>
                </view>
                <view class="time">
                  <text>{{ itemWeight.time }} </text>
                  <text>司磅员：{{ itemWeight.userName }}</text>
                </view>
              </view>
            </view>
          </view>
          <view
            class="route"
            :class="{
              'route-delivery': itemWeight.weightType == 1,
              'route-receipt': itemWeight.weightType == 2,
            }"
            v-else
          >
            <view class="route-delivery-info">
              <view class="is-show">
                <text v-if="itemWeight.weightType == 1">皮重暂未称重！</text>
                <text v-else>毛重暂未称重！</text>
              </view>
            </view>
          </view>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "ListRecord",
  props: {
    list: {
      type: Array,
      default: [],
    },
    deviceNo: {
      type: String,
      default: "",
    },
  },
  methods: {
    /**
     * 跳转至过磅详情
     * @param {Object} e 当前点击对象
     */
    navigateToDetail(waybillNo) {
      if (!waybillNo) {
        return uni.showToast({
          title: "缺失订单编号waybillNo",
          icon: "none",
        });
      }
      uni.navigateTo({
        url: `/pages/weighRecord/detail?waybillNo=${waybillNo}&deviceNo=${this.deviceNo}`,
      });
    },
  },
};
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
      .item-title {
        font-size: 32upx;
        color: $text-color;
        font-weight: 700;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .item-logo {
        width: 120upx;
        height: 44upx;
        object-fit: contain;
      }
      &-right {
        display: flex;
        align-items: center;
        margin-left: 10upx;
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
        margin: 20upx 0;
        padding: 20upx;
        background-color: rgba($color: #ccc, $alpha: 0.18);
        border-radius: 6upx;
        &::before {
          width: 52upx;
          height: 52upx;
          border-radius: 50%;
          font-size: 20upx;
          color: #fff;
          font-style: normal;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 20upx;
          flex-shrink: 0;
        }
        &-delivery {
          &::before {
            content: "皮";
            background-color: #3a65ff;
          }
          &-info {
            width: 100%;
            .Weight {
              font-size: 32upx;
              font-weight: 700;
            }
            .time {
              display: flex;
              justify-content: space-between;
              flex-shrink: 1;
              font-size: 24upx;
              color: $gray-2;
            }
            .is-show {
              font-size: 32upx;
              font-weight: 700;
              color: #ef5242;
            }
          }
        }
        &-receipt {
          &::before {
            content: "毛";
            background-color: #59be32;
          }
        }
      }
    }
    .item-info {
      font-size: 28upx;
      display: flex;
      justify-content: space-between;
      &-name {
        color: $gray-1;
      }
    }
  }
}
</style>