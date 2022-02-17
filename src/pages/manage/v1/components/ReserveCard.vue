<!-- 预约记录卡片组件 -->
<template>
  <div class="manage-box card-box">
    <div class="card-line">
      <div>
        <div class="manage-title3">{{ cardData.companyName }}</div>
        <div class="manage-title4"> 预约单号: {{cardData.reservationNumber || '无'}} </div>
      </div>
      <div class="card-title-time">
        <img src="../../../../static/manage/time.png" alt="" />
        <span>{{ cardData.startTime }}</span>
      </div>
    </div>
    <div class="manage-splite-line"></div>
    <div class="card-line">
      <div class="card-line-item">
        <div class="card-line-value">货品:</div>
        <div class="manage-title2">{{ cardData.goodsName }}</div>
      </div>
      <div class="card-line-item">
        <div class="card-line-value">入场区域:</div>
        <div class="manage-title2 card-line-text">{{ buildingName }}</div>
      </div>
    </div>
    <div class="card-line card-bg-line">
      <div class="card-line-item">
        <div class="card-line-item-icon card-line-item-mr">
          <img src="../../../../static/manage/car.png" alt="" />
        </div>
        <div class="manage-title2">
          {{ cardData.licenseNumber || "暂无车牌号" }}
        </div>
      </div>
      <div class="card-line-item">
        <div class="manage-title2">{{ cardData.nickName || "无" }}</div>
        <div class="card-line-item-icon card-line-item-ml">
          <img src="../../../../static/manage/tel.png" alt="" />
        </div>
      </div>
    </div>
    <div class="card-line" v-if="cardData.reservationStatus === 0">
      <div class="card-line-date">{{ cardData.createTime }}</div>
    </div>
    <div class="card-line" v-if="cardData.reservationStatus === 1">
      <div class="card-line-date">{{ cardData.admissionTime }}</div>
    </div>
    <div class="manage-splite-line top-border"></div>
    <div class="card-line" v-if="cardData.reservationStatus === 0">
      <div class="card-bottom-item" @click="changeStatus(1)">
        <div class="card-line-item-icon">
          <img src="../../../../static/manage/enter.png" alt="" />
        </div>
        <div class="manage-title2 card-line-item-ml">标记入场</div>
      </div>
      <div class="card-bottom-item" @click="disableRecord">
        <div class="card-line-item-icon">
          <img src="../../../../static/manage/void.png" alt="" />
        </div>
        <div class="manage-title2 card-line-item-ml">废号</div>
      </div>
    </div>
    <div class="card-line" v-if="cardData.reservationStatus === 1">
      <div class="card-bottom-item" @click="changeStatus(2)">
        <div class="card-line-item-icon">
          <img src="../../../../static/manage/enter.png" alt="" />
        </div>
        <div class="manage-title2 card-line-item-ml">标记出场</div>
      </div>
    </div>
    <div class="card-line" v-if="cardData.reservationStatus === 2">
      <div class="card-date-item">
        <div class="card-line-value">入场时间:</div>
        <div class="manage-title2 card-line-text">
          {{ cardData.admissionTime | dateFilter1 }}
        </div>
      </div>
      <div class="card-date-item">
        <div class="card-line-value">出场时间:</div>
        <div class="manage-title2 card-line-text">
          {{ cardData.appearanceTime | dateFilter1 }}
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
      // company: "山西华汇通商贸有限公司",
      // goodsType: "石渣土",
      // status: this.tabIndex,
      // date: createDate,
      // time: "08:00",
      // enterArea: this.pageNum + "站台",
      // licenseNumber: "闽A123123",
      // driver: "辛弃疾",
    };
  },

  props: {
    cardData: {
      type: Object,
      required: true,
    },
  },

  components: {},

  filters: {
    dateFilter1: (n) => {
      return format.dateFormat(new Date(n),'{m}-{d} {h}:{i}')
    }
  },

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
  // mounted() {
  //   console.log("Card Show");
  // },

  methods: {
    changeStatus(status) {
      let content = "";
      if (status === 1) {
        content = "标记入场?";
      } else if (status === 2) {
        content = "标记出场?";
      }
      uni.showModal({
        title: "提示",
        content: content,
        success: (res) => {
          if (res.confirm) {
            let params = {
              id: this.cardData.id,
              reservationStatus: status,
            };
            this.$emit("changeStatus", params);
          }
        },
      });
    },
    disableRecord() {
      uni.showModal({
        title: "提示",
        content: "确认作废该条记录?",
        success: (res) => {
          if (res.confirm) {
            let id = this.cardData.id;
            this.$emit("disableRecord", id);
          }
        },
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.card-box {
  padding: 20rpx 30rpx 0;
}
.card-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  &-item {
    display: flex;
    align-items: center;
    &-icon {
      width: 40rpx;
      height: 40rpx;

      > img {
        width: 100%;
        height: 100%;
      }
    }

    &-mr {
      margin-right: 20rpx;
    }
    &-ml {
      margin-left: 10rpx;
    }
  }
  &-value {
    color: #878787;
    font-size: 28rpx;
    margin-right: 10rpx;
    // min-width: 124rpx;
  }

  &-date {
    font-size: 24rpx;
    color: #878787;
    font-weight: normal;
  }

  &-text {
    max-width: 200rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.card-line:last-child {
  margin-bottom: 0;
}

.card-bg-line {
  box-sizing: border-box;
  background: #f7f7f7;
  height: 66rpx;
  border-radius: 6rpx;
  padding: 0 20rpx;
}

.card-title-time {
  box-sizing: border-box;
  padding: 0 12rpx 0 8rpx;
  width: 156rpx;
  height: 54rpx;
  background: rgba(58, 101, 255, 0.08);
  border-radius: 4rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #3a65ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > img {
    width: 43rpx;
    height: 43rpx;
  }
}

.manage-splite-line {
  margin: 10rpx -30rpx 16rpx;
}

.top-border {
  margin-bottom: 0;
}

.card-bottom-item {
  box-sizing: border-box;
  flex: 1;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1rpx solid #f0f0f0;
}

.card-bottom-item:last-child {
  border-right: none;
}

.card-date-item {
  box-sizing: border-box;
  height: 80rpx;
  display: flex;
  align-items: center;
}
</style>