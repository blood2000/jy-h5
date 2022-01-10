<!-- 预约规则卡片组件 -->
<template>
  <div class="manage-box card-box">
    <div class="card-line">
      <div class="manage-title3">{{ cardData.name }}</div>
      <div class="switch-box">
        <span v-show="cardData.isInvalid">启用</span>
        <span v-show="!cardData.isInvalid">禁用</span>
        <switch
          class="my-switch"
          color="#3a65ff"
          :checked="cardData.isInvalid"
          @change="switchInvalid($event)"
        />
      </div>
    </div>
    <div class="manage-splite-line"></div>
    <div class="card-line">
      <div class="card-line-item">
        <div class="card-line-value">预约时段:</div>
        <div class="manage-title2">{{ cardData.reserveTimeNums }}</div>
      </div>
      <div class="card-line-item">
        <div class="card-line-value">总预约数:</div>
        <div class="manage-title2 card-line-text">
          {{ cardData.reserveNums }}
        </div>
      </div>
    </div>
    <div class="card-line card-bg-line">
      <div class="card-line-item">
        <div class="card-line-item-icon card-line-item-start">始</div>
        <div class="manage-title2">{{ cardData.startDate }}</div>
      </div>
      <div class="card-line-item">
        <div class="card-line-item-icon card-line-item-end">终</div>
        <div class="manage-title2">{{ cardData.endDate }}</div>
      </div>
    </div>
    <div class="card-line">
      <!-- <div class="card-line-date">{{ cardData.date }}</div> -->

      <div class="card-line-day">
        排除天数: <span> {{ cardData.exDays }} </span> 天
      </div>
      <div class="card-line-day">
        实际天数: <span> {{ cardData.acDays }} </span>天
      </div>
    </div>
    <div class="card-line">
      <div class="card-line-date">{{ cardData.date }}</div>
    </div>
    <div class="manage-splite-line top-border"></div>
    <div class="card-line">
      <div class="card-bottom-item">
        <uni-icons type="checkbox" size="16"></uni-icons>
        <div class="manage-title2 card-line-item-ml">派号</div>
      </div>
      <div class="card-bottom-item">
        <uni-icons type="compose" size="16"></uni-icons>
        <div class="manage-title2 card-line-item-ml">编辑</div>
      </div>
      <div class="card-bottom-item">
        <uni-icons type="trash" color="red" size="16"></uni-icons>
        <div class="manage-title2 card-line-item-ml manage-delete">删除</div>
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
    cardIndex: {
      type: Number,
      required: true,
    },
  },

  components: {},

  computed: {},

  mounted() {
    console.log("Card Show");
  },

  methods: {
    switchInvalid(e) {
      console.log(e);
      let value = e.target.value;
      // Vue.set(item, "isInvalid", !value * 1);
      let obj = {
        isInvalid: value,
        index: this.cardIndex,
      };
      this.$emit("changeUse", obj);
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

    &-start {
      width: 30rpx;
      height: 30rpx;
      text-align: center;
      line-height: 30rpx;
      background: #3a65ff;
      color: #fff;
      font-size: 20rpx;
      border-radius: 4rpx;
      margin-right: 10rpx;
    }
    &-end {
      width: 30rpx;
      height: 30rpx;
      text-align: center;
      line-height: 30rpx;
      background: #59be32;
      color: #fff;
      font-size: 20rpx;
      border-radius: 4rpx;
      margin-right: 10rpx;
    }
  }
  &-value {
    color: #878787;
    font-size: 28rpx;
    margin-right: 10rpx;
  }

  &-date {
    font-size: 24rpx;
    color: #878787;
    font-weight: normal;
  }

  &-day {
    font-size: 24rpx;
    color: #878787;
    font-weight: normal;
    > span {
      padding: 0 10rpx;
      color: #333;
      font-weight: bold;
    }
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