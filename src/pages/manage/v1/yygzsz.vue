<!-- 预约规则设置 -->
<template>
  <div class="manage-content">
    <HeaderBar :title="title" @back="back"></HeaderBar>
    <div class="manage-line">
      <div class="manage-title4">
        共 <span class="manage-total">{{ total }}</span> 条预约规则
      </div>
      <div class="manage-btn1" @click="toJump">创建规则</div>
    </div>
    <div class="manage-main">
      <block v-for="(item, index) in ruleData" :key="index">
        <rule-card :cardData="item" :cardIndex="index" @changeUse="changeUse"></rule-card>
      </block>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import formFilter from "../../../utils/filter";
import format from "../../../utils/format";
import RuleCard from "./components/RuleCard";
export default {
  data() {
    return {
      title: "预约规则设置",
      total: 3,
      ruleData: [],
    };
  },

  components: { HeaderBar, RuleCard },

  computed: {},

  onShow() {
    this.getData();
  },

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    getData() {
      uni.showLoading();
      let ruleData = [];
      setTimeout(() => {
        let createDate = format.dateFormat(
          new Date(),
          "{y}-{m}-{d} {h}:{i}:{s}"
        );
        for (let i = 0; i < 3; i++) {
          let obj = {
            name: "夏时令排号计划",
            isInvalid: false,
            reserveTimeNums: 3,
            reserveNums: 660,
            startDate: '2021-12-06',
            endDate: '2021-12-30',
            exDays: 32,
            acDays: 58,
            date: createDate,
            time: "08:00",
            enterArea: "站台",
            licenseNumber: "闽A123123",
            driver: "辛弃疾",
            enterDate: format.dateFormat(new Date(), "{m}-{d} {h}:{i}"),
            outDate: format.dateFormat(new Date(), "{m}-{d} {h}:{i}"),
          };
          ruleData.push(obj);
        }
        this.ruleData = ruleData;
        uni.hideLoading();
      }, 1000);
    },
    changeUse(params) {
      let curIndex = params.index * 1;
      this.ruleData.map((item, index) => {
        if (curIndex === index) {
          this.$set(item, 'isInvalid', params.isInvalid);
        } else {
          this.$set(item, 'isInvalid', false);
        }
      })
      

      console.log(this.ruleData)
    },
    toJump() {
      uni.navigateTo({
        url: './cjyygz'
      })
    },
  },
};
</script>
<style lang='scss' scoped>
.manage-line {
  height: 100rpx;
}

.manage-main {
  padding-top: 20rpx;
}
</style>