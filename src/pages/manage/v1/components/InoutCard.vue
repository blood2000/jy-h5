<!-- 进出明细卡片组件 -->
<template>
  <div class="inout-card">
    <div class="inout-card-header">
            <div class="inout-card-header-title1">进出明细</div>
            <div class="inout-card-header-title2">({{ cardTitle }})</div>
          </div>
          <div class="inout-card-icon"></div>
          <div class="inout-card-main">
            <div class="inout-card-main-header">
              <div class="inout-card-main-header-item">
                <div class="manage-title4">车牌号</div>
                <div class="manage-title2">{{ cardData.licenseNumber }}</div>
              </div>
              <div class="inout-card-main-header-item">
                <div class="manage-title4">货主</div>
                <div class="manage-title2">{{ cardData.companyName }}</div>
              </div>
              <div class="inout-card-main-header-item">
                <div class="manage-title4">司机</div>
                <div class="manage-title2">{{ cardData.nickName }}</div>
              </div>
              <div class="inout-card-main-header-item">
                <div class="manage-title4">商品名称</div>
                <div class="manage-title2">{{ cardData.goodsName }}</div>
              </div>
              <div class="inout-card-main-header-item">
                <div class="manage-title4">入场区域</div>
                <div class="manage-title2">{{ buildingName }}</div>
              </div>
              <div class="inout-card-main-header-item">
                <div class="manage-title4">时间段</div>
                <div class="manage-title2">
                  {{ cardData.startTime }}-{{ cardData.endTime }}
                </div>
              </div>
            </div>
            <div class="inout-split-line"></div>
            <div class="inout-card-main-content">
              <div class="inout-card-main-content-line">
                <div class="manage-title4">吨/方</div>
                <div class="manage-title1"> {{cardData.number}} </div>
              </div>
              <div class="inout-card-main-content-line">
                <div class="manage-title4">预约时间</div>
                <div class="manage-title1"> {{cardData.createTime || '-'}} </div>
              </div>
              <div class="inout-card-main-content-line" v-if="status > 0">
                <div class="manage-title4">入场时间</div>
                <div class="manage-title1"> {{cardData.admissionTime || '-'}} </div>
              </div>
              <div class="inout-card-main-content-line" v-if="status > 1">
                <div class="manage-title4">出场时间</div>
                <div class="manage-title1"> {{cardData.appearanceTime || '-'}} </div>
              </div>
              <div class="inout-card-main-content-line">
                <div class="manage-title4">预约单号</div>
                <div class="manage-title1"> {{cardData.reservationNumber || '-'}} </div>
              </div>
              <div class="inout-card-main-content-line">
                <div class="manage-title4">备注</div>
                <div class="manage-title1"> {{cardData.remark || '无'}} </div>
              </div>
            </div>
          </div>
  </div>
</template>

<script>
import format from "../../../../utils/format";
export default {
  data() {
    return {};
  },
  props: {
    status: {
      type: Number,
      default: 0,
    },
    cardTitle: {
      type: String,
      default: '',
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
        let name = '';
        let buildingId = this.cardData.buildingId.split(",");
        this.cardData.buildingInfoVos.map((item, index) => {
          buildingId.map((itm) => {
            if (itm == item.id) {
              name += item.buildingName + ','
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

  methods: {},
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
    padding: 10rpx 10rpx 36rpx;
    &-title1 {
      font-size: 36rpx;
      font-weight: bold;
      color: #2c3041;
    }
    &-title2 {
      font-size: 22rpx;
      color: #454850;
    }
  }
  &-icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 241rpx;
    height: 236rpx;
    background: url("../../../../static/manage/statistics-inout.png");
    background-size: 100% 100%;
  }
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      &-item {
        width: 32%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 0 30rpx;
      }
      .manage-title2 {
        padding-top: 4rpx;
        width: 100%;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    &-content {
      padding: 20rpx 0 0;
      &-line {
        height: 56rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
}

.inout-split-line {
  height: 2rpx;
  background-image: linear-gradient(to bottom, #ddd, transparent);
  transform: scaleY(.5);
}
</style>