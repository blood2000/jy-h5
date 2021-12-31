<!-- 场区申请审核 -->
<template>
  <div class="building-content">
    <HeaderBar
      :title="title"
      :rightText="rightText"
      :barStyle="barStyle"
      @back="back"
      @jump="jump"
    />

    <div class="building-body">
      <div class="header-bg"></div>
      <div class="building-tab-box">
        <div
          class="building-tab-item"
          v-for="(item, index) in tabList"
          :key="index"
          :class="activeTabIndex === index ? 'tab-active' : ''"
          @click="changeTab(index)"
        >
          {{ item.name }}
          <span
            class="building-count-icon"
            :class="item.num > 9 ? 'count-icon-2' : ''"
          >
            {{ item.num &lt; 10 ? item.num : "9+" }}
          </span>
        </div>
        <div
          class="building-tab-slider"
          :class="'slider-active' + activeTabIndex"
        ></div>
      </div>
      <!-- <div class="building-body-title building-title2">共{{ total }}条记录</div> -->
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
        <div class="building-body-floor building-bg-floor">
          <div class="building-bg-name">
            <uni-icons type="home-filled" color="#3A65FF" size="14"></uni-icons>
            <span>申请仓储总量</span>
          </div>
          <div class="building-bg-value">
            {{ item.applyTotal }}
            <span>{{ item.unit }} </span>
          </div>
        </div>
        <div class="building-body-floor">
          <div class="building-body-floor-item">
            <div class="building-name">租用开始日期</div>
            <div class="building-value">{{ item.startDate }}</div>
          </div>
          <div class="building-body-floor-item" style="padding-right: 60rpx">
            <div class="building-name">租用结束日期</div>
            <div class="building-value">{{ item.endDate }}</div>
          </div>
        </div>
        <div class="building-body-line"></div>

        <div class="building-body-floor">
          <div class="building-body-floor-sub">申请原因</div>
        </div>

        <div class="building-body-floor">
          <div class="building-title1">
            {{ item.reason }}
          </div>
        </div>

        <div class="building-body-floor">
          <div class="building-body-floor-sub">
            申请人: {{ item.applyName }} ({{ item.applyPhone }})
          </div>
        </div>

        <div class="building-body-line"></div>

        <!-- <div class="textarea-box">
          <textarea
            class="building-remark"
            maxlength="255"
            v-model="item.remark"
          />
        </div> -->
        <div class="building-body-floor">
          <div class="building-body-floor-sub">{{ item.applyDate }}</div>
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
      barStyle: {
        color: "#fff",
        background: "#3A65FF",
      },
      total: 3,
      tabList: [
        { name: "待审核", status: 0, num: 123 },
        { name: "已驳回", status: 1, num: 99 },
        { name: "已审核", status: 2, num: 2 },
      ],
      activeTabIndex: 0,
      checkList: [
        {
          materialType: "煤炭",
          station: "五福集运站",
          company: "福建至简之一有限公司",
          applyTotal: 1000,
          unit: "吨",
          startDate: "2021-11-10",
          endDate: "2021-11-18",
          reason: "因业务需求故申请 1000吨 堆场区域",
          applyName: "张三",
          applyPhone: "132****3232",
          applyDate: "2021-10-18 15:32",
        },
        {
          materialType: "煤炭",
          station: "五福集运站",
          company: "福建至简之一有限公司",
          applyTotal: 1000,
          unit: "吨",
          startDate: "2021-11-10",
          endDate: "2021-11-18",
          reason: "因业务需求故申请 1000吨 堆场区域",
          applyName: "张三",
          applyPhone: "132****3232",
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
    },
  },
};
</script>
<style lang='scss' scoped>
.textarea-box {
  height: 180rpx;
  margin-bottom: 20rpx;
}

.as-btn {
  width: 108rpx;
  height: 48rpx;
  background: #3a65ff;
  border-radius: 4rpx;
  text-align: center;
  line-height: 48rpx;
  color: #fff;
  font-size: 28rpx;
}

.building-body {
  padding: 0;
}

.building-bottom-line {
  position: relative;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}

.building-body-line {
  height: 1px;
  background-image: linear-gradient(to bottom, #333, transparent);
  transform: scaleY(0.5);
  margin: 14rpx 0 20rpx;
}
</style>