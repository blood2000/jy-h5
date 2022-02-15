<!-- 今日预约调号 -->
<template>
  <div class="manage-content">
    <HeaderBar :title="title" @back="back" :barStyle="barStyle"></HeaderBar>

    <div class="manage-main">
      <div class="manage-header">
        <div class="manage-header-title">
          <div class="manage-header-title-line1">{{ today }}</div>
          <div class="manage-header-title-line2">
            总号数{{ changeNums >= 0 ? "新增" : "扣除" }}
            {{ Math.abs(changeNums) }} 个
          </div>
        </div>
        <div class="manage-header-img"></div>
      </div>
      <z-paging
        ref="paging"
        v-model="todayTimes"
        @query="getData"
        :fixed="false"
        :loading-more-enabled="false"
        :hide-empty-view="true"
        :auto="true"
        :show-loading-more-no-more-line="false"
      >
        <div
          class="manage-box"
          v-for="(item, index) in todayTimes"
          :key="index"
        >
          <div class="card-line">
            <div class="manage-title3">
              {{ item.startTime }}-{{ item.endTime }}
            </div>
            <div class="card-line-value">
              现剩余号数 {{ item.surplusLargesse }}
            </div>
          </div>
          <div class="card-line">
            <div class="card-line-item card-line-item1">
              <div
                :class="item.type === 'plus' ? 'card-item-active' : ''"
                @click="switchType(index, 'plus')"
              >
                加号
              </div>
              <div
                :class="item.type === 'minus' ? 'card-item-active' : ''"
                @click="switchType(index, 'minus')"
              >
                减号
              </div>
            </div>
            <div class="card-line-item">
              <div class="manage-number-box">
                <div class="manage-number-minus" @click="minus(item, index)">
                  <span></span>
                </div>
                <!-- <div class="manage-number-text">
                  {{ item.calNum }}
                </div> -->
                <div class="manage-number-input">
                  <input
                    class="manage-input"
                    type="number"
                    placeholder="号量"
                    @input="numberFilter($event, index)"
                    v-model="item.calNum"
                  />
                </div>
                <div class="manage-number-plus" @click="plus(item, index)">
                  <uni-icons
                    type="plus-filled"
                    size="24"
                    color="#3a65ff"
                  ></uni-icons>
                </div>
              </div>
            </div>
          </div>
          <div class="card-line card-line-bg">
            <img src="../../../static/manage/prompt.png" alt="" />
            <div>
              {{ item.type === "plus" ? "+" : "-" }}
              <span>{{ item.calNum || 0 }}</span> 个号码, 本号段还剩余
              <span>
                {{
                  item.type === "plus"
                    ? item.surplusLargesse + item.calNum
                    : item.surplusLargesse - item.calNum
                }}
              </span>
            </div>
          </div>
        </div>
        <div class="building-body-box" v-if="isSubmit">
          <div class="building-title1">备注信息</div>
          <div class="textarea-box">
            <textarea
              class="building-remark"
              maxlength="255"
              v-model="remark"
              placeholder="添加备注"
            />
          </div>
        </div>
        
      </z-paging>
    </div>
    <div class="manage-btn-box" v-if="isSubmit">
      <div class="manage-btn manage-btn-confirm" @click="submit">保存</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import buildingRequest from "../../../config/buildingRequest";
import formFilter from "../../../utils/filter";
import format from "../../../utils/format";
import ZPagingMixin from "@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin";
export default {
  mixins: [ZPagingMixin], // 使用mixin
  data() {
    return {
      title: "今日预约调号",
      barStyle: {
        background: "#3a65ff",
        color: "#fff",
      },
      jyzCode: "",
      isSubmit: false,
      remark: "",
      todayTimes: [],
      total: 0,
      restNums: 0,
      changeNums: 0,
      today: "",
      overviewData: {},
    };
  },

  components: { HeaderBar },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
      // choosedBuilding: (state) => state.manage.choosedBuilding,
    }),
  },

  onLoad() {
    this.$store.commit("getChoosedBuilding", []);
    this.today = format.dateFormat(new Date(), "{y}-{m}-{d}");
    this.jyzCode = uni.getStorageSync("jyzCode");
    // this.getData();
  },

  onShow() {},
  methods: {
    getData() {
      const config = {
        url: "getTodayRecord",
        header: this.headerInfo,
        querys: {
          jyzCode: this.jyzCode,
        },
      };
      buildingRequest(config).then((res) => {
        console.log("获取今日预约调号", res);
        this.isSubmit = true;
        this.remark = res.data.remark;
        this.total = res.data.sumLargesse;
        this.restNums = res.data.sumLargesse;
        let { code, id, jyzCode, subscribeRuleCode, sumLargesse } = res.data;
        this.overviewData = {
          code,
          id,
          jyzCode,
          subscribeRuleCode,
          sumLargesse,
        };

        this.changeNums = this.total - this.restNums;
        let todayTimes = res.data.todaySubscribeRuleTimes;
        this.handleTimes(todayTimes);
      });
    },

    handleTimes(todayTimes) {
      todayTimes.map((item, index) => {
        item.type = "plus";
        item.calNum = 0;
        // this.$set(item, 'type', 'plus');
      });
      this.$refs.paging.complete(todayTimes);
    },

    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    switchType(index, type) {
      console.log(type);
      if (
        type === "minus" &&
        this.todayTimes[index].calNum > this.todayTimes[index].surplusLargesse
      ) {
        this.todayTimes[index].calNum = this.todayTimes[index].surplusLargesse;
      }
      this.$set(this.todayTimes[index], "type", type);
      this.$set(this.todayTimes, index, this.todayTimes[index]);
      let changeNums = 0;
      this.todayTimes.map((item) => {
        item.type === "minus" && (changeNums -= item.calNum);
        item.type === "plus" && (changeNums += item.calNum);
      });
      this.changeNums = changeNums;
    },

    numberFilter(e, index) {
      setTimeout(() => {
        let value = e.detail.value;
        let item = this.todayTimes[index];
        item.calNum = formFilter.numberFilter(value);
        if (item.type === "minus") {
          if (item.calNum > item.surplusLargesse) {
            item.calNum = item.surplusLargesse;
          }
        }
        this.$set(this.todayTimes, index, item);

        let changeNums = 0;
        this.todayTimes.map((itm) => {
          itm.type === "minus" && (changeNums -= itm.calNum);
          itm.type === "plus" && (changeNums += itm.calNum);
        });
        this.changeNums = changeNums;
      }, 0);
    },

    minus(item, index) {
      //加号操作
      // if (item.type === "minus") {
      //   if (item.calNum > 0) {
      //     item.calNum--;
      //     this.$set(this.todayTimes, index, item);
      //   }
      // } else {
      //   if (item.calNum > 0) {
      //     item.calNum--;
      //     this.$set(this.todayTimes, index, item);
      //   }
      // }
      if (item.calNum > 0) {
        item.calNum--;
        this.$set(this.todayTimes, index, item);
        if (item.type === "minus") {
          this.changeNums++;
        } else {
          this.changeNums--;
        }
      }
      // if (item.calNum > 0) {
      //   item.calNum--;
      //   this.$set(this.todayTimes, index, item);
      //   this.changeNums--;
      // }
    },
    plus(item, index) {
      if (item.type === "minus") {
        if (item.calNum < item.surplusLargesse) {
          item.calNum++;
          this.$set(this.todayTimes, index, item);
          this.changeNums--;
        }
      } else {
        item.calNum++;
        this.$set(this.todayTimes, index, item);
        this.changeNums++;
      }
    },
    cancel() {
      uni.navigateBack({
        delta: 1,
      });
    },

    submit() {
      if (!this.remark) {
        uni.showToast({
          title: "请添加备注",
          icon: "none",
          duration: 1500,
        });
        return;
      }
      this.overviewData.sumLargesse = this.total + this.changeNums;
      this.overviewData.remark = this.remark;

      let todaySubscribeRuleTimes = [];
      this.todayTimes.map((item) => {
        let obj = {
          arrangeMode: item.type === "plus" ? 0 : 1,
          code: item.code,
          startTime: item.startTime,
          endTime: item.endTime,
          id: item.id,
          ruleAdmissionTimeIntervalCode: item.ruleAdmissionTimeIntervalCode,
          todaySubscribeRuleCode: item.todaySubscribeRuleCode,
          originalLargesse: item.surplusLargesse,
          number: item.calNum,
          finalLargesse:
            item.type === "plus"
              ? item.surplusLargesse + item.calNum
              : item.surplusLargesse - item.calNum,
        };
        todaySubscribeRuleTimes.push(obj);
      });
      this.overviewData.todaySubscribeRuleTimes = todaySubscribeRuleTimes;
      console.log(this.overviewData);
      const config = {
        url: "setTodayRecord",
        method: "POST",
        header: this.headerInfo,
        data: this.overviewData,
      };
      buildingRequest(config).then((res) => {
        console.log("设置今日调号", res);
        uni.showModal({
          title: "提示",
          content: res.msg,
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              //点击确认
              this.$store.commit("setFresh", true);
              uni.navigateBack({
                delta: 1,
              });
            }
          },
        });
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.manage-main {
  position: relative;
  padding: 140rpx 0 120rpx;
}

.manage-box {
  padding: 30rpx 30rpx;
}

.building-body-box {
  width: 92%;
  padding: 20rpx 30rpx 30rpx;
}

// .manage-btn-cancel {
//   width: 38%;
// }

.manage-btn-confirm {
  width: 100%;
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
  &-item1 {
    width: 200rpx;
    height: 56rpx;
    background: rgba(58, 101, 255, 0.1);
    border-radius: 28rpx;
    font-size: 24rpx;
    font-weight: bold;
    color: rgba(58, 101, 255, 0.77);
    overflow: hidden;
    justify-content: space-between;
    > div {
      width: 96rpx;
      height: 46rpx;
      line-height: 46rpx;
      text-align: center;
    }
  }
  &-value {
    color: #999;
    font-size: 24rpx;
  }

  &-text {
    max-width: 200rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &-text1 {
    color: #3a65ff;
  }
}

.card-item-active {
  background: #3a65ff;
  border-radius: 23rpx;
  color: #fff;
}

.card-line:last-child {
  margin-bottom: 0;
}

.card-line-bg {
  box-sizing: border-box;
  padding: 0 20rpx;
  height: 66rpx;
  background: #f7f7f7;
  border-radius: 6rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #909090;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  > img {
    width: 30rpx;
    height: 30rpx;
  }
  > div {
    margin-left: 20rpx;
    > span {
      padding: 0 10rpx;
      color: #333;
    }
  }
}
</style>