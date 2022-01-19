<!-- 预约规则设置 -->
<template>
  <div class="manage-content">
    <HeaderBar :title="title" @back="back"></HeaderBar>
    <div class="manage-line">
      <div class="manage-title4">
        共 <span class="manage-total">{{ total }}</span> 条预约规则
      </div>
      <div class="manage-btn1" @click="toJump(0)">创建规则</div>
    </div>
    <div class="manage-main">
      <z-paging
        ref="paging"
        v-model="ruleData"
        @query="getData"
        :fixed="false"
        :loading-more-enabled="false"
        :hide-empty-view="true"
        :auto="true"
        :show-loading-more-no-more-line="false"
      >
        <div v-if="noData" class="no-data">暂无预约规则</div>
        <block v-for="(item, index) in ruleData" :key="index">
          <rule-card
            :cardData="item"
            :cardIndex="index"
            @changeUse="changeUse"
            @toJump="toJump"
            @deleteRule="deleteRule"
            @toApportion="toApportion"
          ></rule-card>
        </block>
      </z-paging>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import buildingRequest from "../../../config/buildingRequest";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import formFilter from "../../../utils/filter";
import format from "../../../utils/format";
import ZPagingMixin from "@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin";
import RuleCard from "./components/RuleCard";
export default {
  mixins: [ZPagingMixin], // 使用mixin
  data() {
    return {
      title: "预约规则设置",
      jyzCode: "7f913f1fbf454c9f85e19eadac059d8f",
      total: 0,
      ruleData: [],
      noData: false,
    };
  },

  components: { HeaderBar, RuleCard },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
    }),
  },

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
      const config = {
        url: "getRules",
        header: this.headerInfo,
        querys: {
          jyzCode: this.jyzCode,
        },
      };
      buildingRequest(config).then((res) => {
        console.log("获取预约规则", res);

        this.total = res.data.length;
        let resData = res.data;
        resData.map((item) => {
          let reserveNums = 0;
          item.ruleAdmissionTimeIntervals.map((itm) => {
            reserveNums += itm.largesse;
          });
          item.reserveNums = reserveNums;
          item.acDays = item.totalDays - item.ruleExcludeDates.length;
        });
        this.$refs.paging.complete(resData);
        if (resData.length === 0) {
          this.noData = true;
        } else {
          this.noData = false;
        }
      });
    },
    changeUse(params) {
      let curIndex = params.index * 1;
      let id = this.ruleData[curIndex].id;
      const config = {
        url: "putDisable",
        method: "PUT",
        header: this.headerInfo,
        data: {
          id: id,
          jyzCode: this.jyzCode,
          isDisable: params.isInvalid,
        },
      };
      buildingRequest(config).then((res) => {
        console.log("启用/禁用规则", res);
        uni.showModal({
          title: "提示",
          content: res.msg,
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              //点击确认
             this.$refs.paging.reload();
            }
          },
        });
        
      });
    },
    toJump(code) {
      if (code) {
        uni.navigateTo({
          url: "./cjyygz?code=" + code,
        });
      } else {
        uni.navigateTo({
          url: "./cjyygz",
        });
      }
    },
    toApportion(code) {
      uni.navigateTo({
          url: "./apportion?code=" + code,
        });
    },
    deleteRule(id) {
      
      const config = {
        url: "deleteRule",
        method: "DELETE",
        header: this.headerInfo,
        params: id,
      };
      buildingRequest(config).then((res) => {
        console.log("删除规则", res);
        uni.showModal({
          title: "提示",
          content: res.msg,
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              //点击确认
              this.$refs.paging.reload();
            }
          },
        });
      });
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