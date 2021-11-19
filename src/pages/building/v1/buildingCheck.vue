<!-- 场区申请审核 -->
<template>
  <div class="building-content">
    <HeaderBar
      :title="title"
      :rightText="rightText"
      @back="back"
      @jump="jump"
    />
    <div class="building-body">
      <div class="building-tab-box">
        <div
          class="building-tab-item"
          v-for="(item, index) in tabList"
          :key="index"
          :class="activeTabIndex === index ? 'tab-active' : ''"
          @click="changeTab(index)"
        >
          {{ item.name }} ({{ item.num }})
        </div>
      </div>
      <div class="building-body-title building-title2">共{{ total }}条记录</div>
      <!-- 审核卡片 -->
      <div
        class="building-body-box"
        v-for="(item, index) in checkList"
        :key="index"
      >
        <div class="building-body-item building-card-title">
          <div>{{ item.materialType }}</div>
          <div>{{ item.company }}</div>
        </div>

        <div class="building-body-floor">
          <div class="building-body-floor-item">
            <div class="building-name">申请仓储总量</div>
            <div class="building-value">
              {{ item.applyTotal }}
              <span>{{item.unit}} </span>
            </div>
          </div>
          <div class="building-body-floor-item">
            <div class="building-name">租用开始日期</div>
            <div class="building-value">{{ item.startDate }}</div>
          </div>
          <div class="building-body-floor-item">
            <div class="building-name">租用结束日期</div>
            <div class="building-value">{{ item.endDate }}</div>
          </div>
        </div>
        <div class="textarea-box">
          <textarea
            class="building-remark"
            maxlength="255"
            v-model="item.remark"
            
          />
        </div>
        <div class="building-body-floor">
          <div> {{item.applyDate}} </div>
          <div class="as-btn" @click="toCheck(item)">审核</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import mockData from "./config/mockData";
export default {
  data() {
    return {
      title: "场区申请审核",
      rightText: "提交申请",
      total: 3,
      tabList: [
        { name: "待审核", status: 0, num: 3 },
        { name: "已驳回", status: 1, num: 1 },
        { name: "已审核", status: 2, num: 2 },
      ],
      activeTabIndex: 0,
      checkList: [
        {
          materialType: "煤炭",
          station: '五福集运站',
          company: "福建至简之一有限公司",
          applyTotal: 10000,
          unit: '吨',
          startDate: "2021-11-10",
          endDate: "2021-11-18",
          remark:
            "因业务需求故申请10000吨 堆场区域\r\n申请人：张三(132****3232)",
          applyDate: "2021-10-18 15:32",
        },
        
      ],
    };
  },

  components: { HeaderBar },

  computed: {},

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    jump() {
      uni.navigateTo({
        url: "./chooseMaterial",
      });
    },
    changeTab(index) {
      this.activeTabIndex = index;
    },
    toCheck(item) {
      uni.navigateTo({
        url: `./check?itemMsg=${JSON.stringify(item)}`,
      });
    }
  },
};
</script>
<style lang='scss' scoped>
.textarea-box {
  height: 180rpx;
  margin-bottom: 20rpx;
}

.as-btn {
  width: 120rpx;
  height: 60rpx;
  text-align: center;
  line-height: 60rpx;
  color: #fff;
  font-size: 30rpx;
  background: #3a65ff;
  border-radius: 30rpx;
}
</style>