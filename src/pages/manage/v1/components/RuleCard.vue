<!-- 预约规则卡片组件 -->
<template>
  <div class="manage-box card-box">
    <div class="card-line">
      <div class="manage-title3">{{ cardData.ruleName }}</div>
      <div class="switch-box" @click="switchInvalid">
        <span v-show="!cardData.isDisable">启用</span>
        <span v-show="cardData.isDisable">禁用</span>
        <switch
          class="my-switch"
          color="#3a65ff"
          :checked="!cardData.isDisable"
          @change="switchInvalid($event)"
        />
      </div>
    </div>
    <div class="manage-splite-line"></div>
    <div class="card-line">
      <div class="card-line-item">
        <div class="card-line-value">预约时段:</div>
        <div class="manage-title2">
          {{ cardData.ruleAdmissionTimeIntervals.length }}
        </div>
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
        <div class="manage-title2">{{ cardData.effectiveDate }}</div>
      </div>
      <div class="card-line-item">
        <div class="card-line-item-icon card-line-item-end">终</div>
        <div class="manage-title2">{{ cardData.expirationDate }}</div>
      </div>
    </div>
    <div class="card-line">
      <!-- <div class="card-line-date">{{ cardData.date }}</div> -->

      <div class="card-line-day">
        排除天数: <span> {{ cardData.ruleExcludeDates.length }} </span> 天
      </div>
      <div class="card-line-day">
        实际天数: <span> {{ cardData.acDays }} </span>天
      </div>
    </div>
    <div class="card-line">
      <div class="card-line-date">{{ cardData.createTime }}</div>
    </div>
    <div class="manage-splite-line top-border"></div>
    <div class="card-line">
      <div class="card-bottom-item" @click="apportion">
        <uni-icons type="checkbox" size="16"></uni-icons>
        <div class="manage-title2 card-line-item-ml">派号</div>
      </div>
      <div class="card-bottom-item" @click="editRule">
        <uni-icons type="compose" size="16"></uni-icons>
        <div class="manage-title2 card-line-item-ml">编辑</div>
      </div>
      <div class="card-bottom-item" @click="deleteRule">
        <uni-icons type="trash" color="red" size="16"></uni-icons>
        <div class="manage-title2 card-line-item-ml manage-delete">删除</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import format from "../../../../utils/format";
import buildingRequest from "../../../../config/buildingRequest";
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

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
    }),
  },

  // watch: {
  //   cardData: {
  //     // 需要注意，因为对象引用的原因， newValue和oldValue的值一直相等
  //     handler(newValue, oldValue) {
  //       // 在这里标记页面编辑状态
  //       console.log(newValue.isDisable)
  //     },
  //     // 通过指定deep属性为true, watch会监听对象里面每一个值的变化
  //     deep: true,
  //   },
  // },

  mounted() {
    console.log("Card Show");
  },

  methods: {
    //启用禁用规则
    switchInvalid() {
      let value = this.cardData.isDisable;
      let content = '';
      value && (content = "确认启用该条规则?");
      value || (content = "确认禁用该条规则?");
      let obj = {
        isInvalid: value ? 0 : 1,
        index: this.cardIndex,
      };
      uni.showModal({
        title: "提示",
        content: content,
        success: (res) => {
          if (res.confirm) {
            this.$emit("changeUse", obj);
          }
        },
      });
    },
    //派号
    apportion() {
      let code = this.cardData.code;
      let params = {
        code: this.cardData.code,
        choiceDate: this.cardData.effectiveDate,
        reserveNums: this.cardData.reserveNums
      };
      this.$emit("toApportion", params);
    },
    //编辑
    editRule() {
      let code = this.cardData.code;
      this.$emit("toJump", code);
    },
    //删除
    deleteRule() {
      let id = this.cardData.id;
      uni.showModal({
        title: "提示",
        content: "确认删除该规则?",
        success: (res) => {
          if (res.confirm) {
            this.$emit("deleteRule", id);
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