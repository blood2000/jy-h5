<template>
  <view class="content-page" :style="{ '--statusBar12': statusBar12 + 'px' }">
    <HeaderBar
      title="过磅记录详情"
      @back="navigateBack"
      :border="false"
    ></HeaderBar>
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
              <img
                src="@/static/weighRecord/logo_chao.png"
                alt=""
                class="item-logo"
                v-if="detailInfo.isChy > 0"
              />
              <img
                src="@/static/weighRecord/logo_ji.png"
                alt=""
                class="item-logo"
                v-else
              />
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
        <block
          v-for="(itemWeight, index) in detailInfo.weightList"
          :key="index"
        >
          <view class="record-content" v-if="itemWeight.weight">
            <view class="record-name">
              <view>
                <text class="label">地磅：</text>
                <text class="val">{{ itemWeight.deviceName }}</text>
              </view>
              <view>
                <text class="label">司磅员：</text>
                <text class="val">{{ itemWeight.userName }}</text>
              </view>
            </view>
            <view class="record-tare">
              <view
                class="label"
                :class="{ label2: itemWeight.weightType == 2 }"
                >{{ itemWeight.weightType == 1 ? "皮重" : "毛重" }}</view
              >
              <text>{{ itemWeight.weight }}吨</text>
            </view>
            <view
              class="record-img"
              v-if="itemWeight.imgs && itemWeight.imgs.length > 0"
            >
              <img
                :src="item"
                alt=""
                class="item-img"
                v-for="(item, index) in imgs.tare"
                :key="index"
              />
            </view>
            <view class="record-time"
              >过磅时间：{{
                parseTime(
                  new Date(detailInfo.weightTime).getTime(),
                  "{y}-{m}-{d} {h}:{i}:{s}"
                )
              }}</view
            >
          </view>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
import HeaderBar from "@/components/Building/HeaderBar2.vue";
import {
  findList,
} from "@/config/service/weighRecord/index.js";
import { mapState } from "vuex";
import { queryUserInfo } from "@/config/service/user/index.js";
export default {
  components: {
    HeaderBar,
  },
  data() {
    return {
      statusBar12: 0,
      detailInfo: {}, // 订单详情
      weighRecord: {}, // 过磅记录
      imgs: [],
    };
  },
  async onLoad(options) {
    if (options.token) {
      this.$store.dispatch("getLoginInfoAction", {
        Authorization: options.token,
      });
      options.statusBarHeight &&
        this.$store.dispatch(
          "getStatusBarHeightAction",
          options.statusBarHeight
        );
    }
    this.statusBar12 = this.statusBarHeight;
    if (uni.getSystemInfoSync().platform == "ios") {
      this.statusBar12 -= 10;
    }

    // 获取jyzCode
    const res = await queryUserInfo(
      { userCode: uni.getStorageSync("userInfo").userCode },
      this.headerInfo
    );
    this.jyzCode = res.data.jyzCode;

    this.deviceNo = options.deviceNo;
    this.waybillNo = options.waybillNo;
    this.findList();
  },
  methods: {
    /**
     * 返回上一页
     */
    navigateBack() {
      uni.navigateBack();
    },
    findList() {
      findList(
        {
          waybillNo: this.waybillNo,
          pageNum: 1,
          buildingType: 1,
          jyzCode: this.jyzCode,
        },
        this.headerInfo
      ).then((res) => {
        this.detailInfo = res.rows[0];
        this.imgs = {
          gross: [
            res.rows[0].grossImgs,
            res.rows[0].mineImgs,
            res.rows[0].receiptImgs,
          ].filter((item) => {
            return item && item.trim();
          }),
          tare: [
            res.rows[0].tareImgs,
            res.rows[0].mineImgs,
            res.rows[0].receiptImgs,
          ].filter((item) => {
            return item && item.trim();
          }),
        };
        const weightList = [{
          weightType: 1,
          weight: this.detailInfo.tareWeight,
          userName: this.detailInfo.tareUserName,
          time: this.detailInfo.tareTime,
          deviceName: this.detailInfo.tareDeviceName,
          imgs: [
            res.rows[0].tareImgs,
            res.rows[0].mineImgs,
            res.rows[0].receiptImgs,
          ].filter((item) => {
            return item && item.trim();
          }),
        }, {
          weightType: 2,
          weight: this.detailInfo.grossWeight,
          userName: this.detailInfo.grossUserName,
          time: this.detailInfo.grossTime,
          deviceName: this.detailInfo.grossDeviceName,
          imgs: [
            res.rows[0].grossImgs,
            res.rows[0].mineImgs,
            res.rows[0].receiptImgs,
          ].filter((item) => {
            return item && item.trim();
          }),
        }];
        if (this.detailInfo.receiveType == 1) {
          this.detailInfo.weightList = weightList.reverse();
        } else {
          this.detailInfo.weightList = weightList;
        }
      });
    },
  },
  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
    }),
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
.detail-info {
  background-color: #fff;
  padding: 30upx;
  .info-title {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    min-height: 42upx;
    .title {
      font-size: 32upx;
      color: $text-color;
      font-weight: bold;
      width: 60%;
    }
    .type {
      font-size: 28upx;
      color: #3a65ff;
      font-weight: bold;
      width: 40%;
      margin-left: 20upx;
      text-align: right;
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
    height: 86upx;
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
            content: "发";
            display: block;
          }
        }
        &.receipt {
          background-color: #59be32;
          &::before {
            content: "收";
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
    margin-bottom: 24upx;
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
      background-color: rgba($color: #ccc, $alpha: 0.18);
      border-radius: 6upx;
      padding: 18upx 24upx;
      margin-top: 20upx;
      font-weight: bold;
      .label {
        display: flex;
        align-items: center;
        &::before {
          content: "";
          display: block;
          width: 34upx;
          height: 34upx;
          background: url(@/static/weighRecord/icon_tare.png) no-repeat;
          background-size: contain;
          margin-right: 20upx;
        }
      }
      .label2 {
        display: flex;
        align-items: center;
        &::before {
          content: "";
          display: block;
          width: 34upx;
          height: 34upx;
          background: url(@/static/weighRecord/icon_gross.png) no-repeat;
          background-size: contain;
          margin-right: 20upx;
        }
      }
    }
    .record-img {
      display: flex;
      flex-wrap: wrap;
      margin: 20upx -12upx 0;
      .item-img {
        width: 198upx;
        height: 144upx;
        object-fit: object-fit;
        background-color: #dcdcdc;
        border-radius: 6upx;
        margin: 12upx;
      }
    }
    .record-time {
      color: $label-color;
      margin-top: 25upx;
    }
  }
}
</style>
