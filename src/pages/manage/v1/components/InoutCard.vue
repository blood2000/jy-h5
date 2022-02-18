<!-- 进出明细卡片组件 -->
<template>
  <div class="inout-card" @click="closeToolip">
    <div class="inout-card-header">
      <div class="inout-card-header-item">
        <div class="inout-card-header-title1">
          {{ cardData.licenseNumber }}({{ cardData.nickName }})
        </div>
        <div class="inout-card-header-title2">
          (预约单号:{{ cardData.reservationNumber || "-" }})
        </div>
      </div>
      <div class="inout-card-header-item">
        <div class="inout-card-header-item-icon">
          <div class="inout-time-icon"></div>
          <div
            class="inout-time-text-icon"
            :class="'inout-time-text-' + status"
          ></div>
        </div>
        <div class="inout-card-header-title3" v-if="status === 0">
          {{ cardData.createTime || "-" }}
        </div>
        <div class="inout-card-header-title3" v-if="status === 1">
          {{ cardData.admissionTime || "-" }}
        </div>
        <div class="inout-card-header-title3" v-if="status === 2">
          {{ cardData.appearanceTime || "-" }}
        </div>
      </div>
    </div>
    <!-- <div class="inout-card-icon"></div> -->
    <div class="inout-card-main">
      <div class="inout-card-main-header">
        <div class="inout-card-main-header-item">
          <div class="manage-title2">{{ cardData.companyName }}</div>
          <div class="inout-card-icon" @click.stop="showAllName(0)">
            <uni-icons type="eye" size="16"></uni-icons>
          </div>
          <div class="inout-toolip" v-show="showToolipLeft">
            {{ cardData.companyName }}
          </div>
        </div>

        <div class="inout-card-main-header-item inout-second-item">
          <!-- <div class="manage-title4">入场区域</div> -->
          <div class="manage-title2">{{ buildingName }}</div>
          <div class="inout-card-icon" @click.stop="showAllName(1)">
            <uni-icons type="eye" size="16" ></uni-icons>
          </div>

          <div class="inout-toolip-right" v-show="showToolipRight">
            {{ buildingName }}
          </div>
        </div>
        <div class="inout-card-main-header-item">
          <div class="manage-title4">时间段</div>
          <div class="manage-title2">
            {{ cardData.startTime }}-{{ cardData.endTime }}
          </div>
        </div>

        <div class="inout-card-main-header-item inout-second-item">
          <!-- <div class="manage-title4">商品名称</div> -->
          <div class="manage-title2">{{ cardData.goodsName }}</div>
        </div>
        <!-- <div class="inout-card-main-header-item inout-short-item">
          <div class="manage-title4">吨/方</div>
          <div class="manage-title2">{{ cardData.number || "-" }}</div>
        </div> -->
      </div>
      <div class="inout-split-line"></div>
      <div class="inout-card-main-content" v-if="status !== 0">
        <div class="inout-card-main-content-item manage-title4">预约时间</div>
        <div class="inout-card-main-content-item manage-title2">
          {{ cardData.createTime || "-" }}
        </div>
      </div>
      <div class="inout-card-main-content" v-if="status > 1">
        <div class="inout-card-main-content-item manage-title4">入场时间</div>
        <div class="inout-card-main-content-item manage-title2">
          {{ cardData.admissionTime || "-" }}
        </div>
      </div>
      <div class="inout-split-line" v-if="status > 0"></div>

      <div class="inout-card-main-content">
        <div class="manage-title4">备注</div>
        <div class="inout-card-main-content-item1 manage-title2">
          {{ cardData.remark || "无" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import format from "../../../../utils/format";
export default {
  data() {
    return {
      showToolipLeft: false,
      showToolipRight: false,
    };
  },
  props: {
    status: {
      type: Number,
      default: 0,
    },
    cardTitle: {
      type: String,
      default: "",
    },
    cardData: {
      type: Object,
      required: true,
    },
  },
  components: {},

  computed: {
    buildingName() {
      if (this.cardData.buildingInfoVos) {
        let name = "";
        let buildingId = this.cardData.buildingId.split(",");
        this.cardData.buildingInfoVos.map((item, index) => {
          buildingId.map((itm) => {
            if (itm == item.id) {
              name += item.buildingName + ",";
            }
          });
        });
        name = name.slice(0, -1);
        return name;
      } else {
        return "暂无";
      }
    },
  },

  // mounted() {},

  methods: {
    showAllName(type) {
      if (type === 0) {
        this.showToolipLeft = true;
        this.showToolipRight = false;
      } else {
        this.showToolipRight = true;
        this.showToolipLeft = false;
      }
    },
    closeToolip() {
      console.log(112233);
      this.showToolipLeft = false;
      this.showToolipRight = false;
    },
  },
};
</script>
<style lang='scss' scoped>
.inout-card {
  position: relative;
  box-sizing: border-box;
  width: 94%;
  // height: 200rpx;
  background: linear-gradient(180deg, #e5e6f1 0%, #eff2f8 100%);
  border-radius: 20rpx;
  margin: 4rpx auto 30rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 10rpx 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  &-header {
    position: relative;
    padding: 10rpx 10rpx 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-item {
      &-icon {
        // padding-bottom: 10rpx;
        height: 40rpx;
        display: flex;
        align-items: center;
        .inout-time-icon {
          margin-right: 4rpx;
          width: 28rpx;
          height: 26rpx;
          background: url("../../../../static/manage/statistics-time.png");
          background-size: 100% 100%;
        }
        .inout-time-text-icon {
          width: 118rpx;
          height: 24rpx;
        }
        .inout-time-text-0 {
          background: url("../../../../static/manage/statistics-time-text0.png");
          background-size: 100% 100%;
        }
        .inout-time-text-1 {
          background: url("../../../../static/manage/statistics-time-text1.png");
          background-size: 100% 100%;
        }
        .inout-time-text-2 {
          background: url("../../../../static/manage/statistics-time-text2.png");
          background-size: 100% 100%;
        }
      }
    }

    &-title1 {
      height: 40rpx;
      line-height: 40rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: #2c3041;
    }
    &-title2 {
      height: 34rpx;
      line-height: 34rpx;
      font-size: 26rpx;
      color: #a3aabd;
    }
    &-title3 {
      height: 34rpx;
      line-height: 34rpx;
      font-size: 26rpx;
      font-weight: bold;
      color: #829eff;
    }
  }
  // &-icon {
  //   position: absolute;
  //   top: 0;
  //   right: 0;
  //   width: 241rpx;
  //   height: 236rpx;
  //   background: url("../../../../static/manage/statistics-inout.png");
  //   background-size: 100% 100%;
  // }
  &-main {
    position: relative;
    box-sizing: border-box;
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    padding: 20rpx 30rpx;
    border-radius: 10rpx;
    background: #fff;
    z-index: 100;
    &-header {
      // padding: 0 0 20rpx;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      &-item {
        box-sizing: border-box;
        padding: 0 10rpx 20rpx 0;
        width: 49%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        // padding: 0 0 30rpx;
        .inout-card-icon {
          width: 32rpx;
          height: 32rpx;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .inout-toolip {
        position: absolute;
        box-sizing: border-box;
        top: 40rpx;
        left: 0;
        max-width: 100%;
        padding: 4rpx 10rpx;
        border-radius: 6rpx;
        background: #000;
        font-size: 24rpx;
        color: #fff;
      }
      .inout-toolip::before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border: 8rpx solid transparent;
        border-bottom: 8rpx solid #000;
        top: -16rpx;
        left: 16rpx;
      }
      .inout-toolip-right {
        position: absolute;
        box-sizing: border-box;
        top: 40rpx;
        right: 0;
        max-width: 100%;
        font-size: 24rpx;
        padding: 4rpx 10rpx;
        border-radius: 6rpx;
        background: #000;
        color: #fff;
      }
      .inout-toolip-right::before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border: 8rpx solid transparent;
        border-bottom: 8rpx solid #000;
        top: -16rpx;
        right: 16rpx;
      }
      .inout-second-item {
        justify-content: flex-end;
        padding-right: 0;
      }
      .inout-short-item {
        width: 18%;
      }
      .manage-title4 {
        padding-right: 10rpx;
      }
      .manage-title2 {
        padding-right: 4rpx;
        max-width: 90%;
        font-size: 26rpx;
        // text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    &-content {
      // padding: 20rpx 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-item {
        padding-bottom: 20rpx;
        width: 49%;
      }
      &-item1 {
        width: 80%;
        padding-left: 20rpx;
      }
      .manage-title2 {
        font-size: 26rpx;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    &-remark {
      padding: 20rpx 0 0;
      // height: 56rpx;
      // display: flex;
      // justify-content: flex-start;
      // align-items: center;
      .manage-title2 {
        padding-top: 6rpx;
        font-size: 26rpx;
      }
    }
  }
}

.inout-split-line {
  height: 2rpx;
  background-image: linear-gradient(to bottom, #ddd, transparent);
  transform: scaleY(0.5);
  margin-bottom: 20rpx;
}
</style>