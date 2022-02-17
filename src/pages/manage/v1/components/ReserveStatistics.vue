<!-- 预约统计 -->
<template>
  <div class="components-main">
    <div class="statistics-header">
      <div class="manage-tab-box">
        <div
          class="manage-tab"
          :class="tabIndex === index ? 'manage-tab-active' : ''"
          v-for="(item, index) in tabs"
          :key="index"
          @click="changeTab(index)"
        >
          {{ item.name }}
        </div>
        <div
          class="manage-tab-slider"
          :class="'manage-slider' + tabIndex"
        ></div>
      </div>
      <div class="statistics-header-box">
        <div class="statistics-header-item" @click="toDetail('shipper')">
          <div class="statistics-name">
            货主(家)
            <uni-icons type="forward" size="12" color="#7D849F"></uni-icons>
          </div>
          <div class="statistics-value">{{ overviewData.cargoOwner || 0 }}</div>
        </div>
        <div class="statistics-header-item" @click="toDetail('goods')">
          <div class="statistics-name">
            货品(类)
            <uni-icons type="forward" size="12" color="#7D849F"></uni-icons>
          </div>
          <div class="statistics-value">{{ overviewData.goods || 0 }}</div>
        </div>
        <div class="statistics-header-item" @click="toDetail('vehicle')">
          <div class="statistics-name">
            车次(辆)
            <uni-icons type="forward" size="12" color="#7D849F"></uni-icons>
          </div>
          <div class="statistics-value">
            {{ overviewData.trainNumber || 0 }}
          </div>
        </div>
        <div class="statistics-header-item" @click="toInoutDetail(0)">
          <div class="statistics-name">
            已预约
            <uni-icons type="forward" size="12" color="#B1C2FF"></uni-icons>
          </div>
          <div class="statistics-value">
            {{ overviewData.reservedCount || 0 }}
          </div>
        </div>
        <div class="statistics-header-item" @click="toInoutDetail(1)">
          <div class="statistics-name">
            已入场
            <uni-icons type="forward" size="12" color="#B1C2FF"></uni-icons>
          </div>
          <div class="statistics-value">
            {{ overviewData.enteredCount || 0 }}
          </div>
        </div>
        <div class="statistics-header-item" @click="toInoutDetail(2)">
          <div class="statistics-name">
            已出场
            <uni-icons type="forward" size="12" color="#B1C2FF"></uni-icons>
          </div>
          <div class="statistics-value">
            {{ overviewData.alreadyAppearedCount || 0 }}
          </div>
        </div>
      </div>
    </div>
    <div class="manage-main">
      <z-paging
        ref="paging"
        v-model="statisticsData"
        @query="query"
        :fixed="false"
        :loading-more-enabled="false"
        :hide-empty-view="true"
        :auto="true"
        :show-loading-more-no-more-line="false"
      >
        <!-- 货品统计 -->
        <div class="statistics-card">
          <div class="statistics-card-title">
            <div class="manage-title3">货品统计</div>
            <div class="manage-title-more" @click="toDetail('goods')">
              查看更多
              <uni-icons type="forward" size="12" color="#6986EF"></uni-icons>
            </div>
          </div>
          <div class="statistics-card-main">
            <div class="statistics-card-main-title">接单TOP3</div>
            <div v-if="goodsTopData.length === 0" class="no-data">
              暂无接单TOP3记录
            </div>
            <div
              class="statistics-card-main-line"
              v-for="(item, index) in goodsTopData"
              :key="index"
            >
              <div
                class="statistics-card-main-name manage-title2"
                :class="'statistics-top' + index"
              >
                {{ item.goodsName }}
              </div>
              <div class="statistics-card-main-value manage-title1">
                {{ item.goodsCount }}单
              </div>
            </div>
          </div>
        </div>
        <!-- 车次统计 -->
        <!-- <div class="statistics-card" v-if="trainTopData.length > 0"> -->
        <div class="statistics-card">
          <div class="statistics-card-title">
            <div class="manage-title3">车次统计</div>
            <div class="manage-title-more" @click="toDetail('vehicle')">
              查看更多
              <uni-icons type="forward" size="12" color="#6986EF"></uni-icons>
            </div>
          </div>
          <div class="statistics-card-main">
            <div class="statistics-card-main-title">接单TOP3</div>
            <div v-if="trainTopData.length === 0" class="no-data">
              暂无接单TOP3记录
            </div>
            <div
              class="statistics-card-main-line"
              v-for="(item, index) in trainTopData"
              :key="index"
            >
              <div
                class="statistics-card-main-name manage-title2"
                :class="'statistics-top' + index"
              >
                {{ item.licenseNumber }} {{ item.nickName }}
              </div>
              <div class="statistics-card-main-value manage-title1">
                {{ item.trainNumber }}单
              </div>
            </div>
          </div>
        </div>
        <div class="statistics-card">
          <echarts-el
            :option="echartOption"
            style="height: 480rpx"
          ></echarts-el>
        </div>
      </z-paging>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ZPagingMixin from "@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin";
import buildingRequest from "../../../../config/buildingRequest";
import Echarts from "@/components/echarts/echarts.vue";
import EchartsEl from "@/components/echarts/echarts-el.vue";
import Graph from "../../../../utils/graph";
import format from "../../../../utils/format";
export default {
  mixins: [ZPagingMixin], // 使用mixin
  data() {
    return {
      jyzCode: "",
      total: 0,
      tabs: [
        { name: "今天", status: 0 },
        { name: "昨天", status: 1 },
        { name: "近一周", status: 2 },
        { name: "近一月", status: 3 },
      ],
      tabIndex: 0,
      overviewData: {},
      statisticsData: [], //图表统计数据
      goodsTopData: [], //货品统计
      trainTopData: [], //车次统计
      echartOption: {},
      dateRange: [],
    };
  },

  components: { Echarts, EchartsEl },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
      isFresh: (state) => state.manage.isFresh,
    }),
  },

  created() {
    this.jyzCode = uni.getStorageSync("jyzCode");
  },
  mounted() {
    // this.query();
  },

  methods: {
    changeTab(index) {
      if (index === this.tabIndex) return;
      this.tabIndex = index;
      this.$refs.paging.reload();
    },

    query() {
      let data = {
        jyzCode: this.jyzCode,
        timeType: this.tabIndex * 1 + 1,
      };
      const config = {
        url: "getStatisticsInfo",
        header: this.headerInfo,
        querys: data,
      };
      buildingRequest(config).then((res) => {
        console.log("统计首页信息", res);
        let resData = res.data;
        this.$refs.paging.complete(res.data.subscribeStatisticsVos);
        this.getEchartOption(res.data.subscribeStatisticsVos);
        this.getDateRange(res.data.subscribeStatisticsVos);
        this.overviewData = {
          cargoOwner: resData.cargoOwner,
          goods: resData.goods,
          trainNumber: resData.trainNumber,
          reservedCount: resData.reservedCount,
          enteredCount: resData.enteredCount,
          alreadyAppearedCount: resData.alreadyAppearedCount,
        };
        this.goodsTopData = res.data.goodsStatisticsVos;
        this.trainTopData = res.data.trainNumberStatisticsVos;
      });
    },
    getDateRange(data) {
      if (this.tabIndex === 0) {
        let today = format.dateFormat(new Date(), "{y}-{m}-{d}");
        this.dateRange[0] = today;
        this.dateRange[1] = today;
      } else if (this.tabIndex === 1) {
        let yesterDatyTimes = new Date().getTime() - 24 * 3600 * 1000;
        let yesterday = format.dateFormat(new Date(yesterDatyTimes), "{y}-{m}-{d}");
        this.dateRange[0] = yesterday;
        this.dateRange[1] = yesterday;
      } else {
        this.dateRange[0] = data[0].createTime;
        this.dateRange[1] = data[data.length-1].createTime;
      }
      console.log(this.dateRange)
    },
    getEchartOption(data) {
      let graph = new Graph();
      let xAxis = [];
      let reservedCount = [];
      let enteredCount = [];
      let alreadyAppearedCount = [];

      data.map((item, index) => {
        if (this.tabIndex > 1) {
          let xAxisArr = item.createTime.split("-").slice(1);
          let xAxisStr = xAxisArr.join("-");
          xAxis.push(xAxisStr);
          graph.xAxisLabel(2, -15);
          if (this.tabIndex === 2) {
            graph.xAxisLabel(0, 0);
          }
        } else {
          xAxis.push(item.createTime);
          graph.xAxisLabel(1, 0);
        }

        reservedCount.push(item.reservedCount);
        enteredCount.push(item.enteredCount);
        alreadyAppearedCount.push(item.alreadyAppearedCount);
      });

      graph.xAxisData(xAxis);
      // graph.yAxisName("单/天");
      graph.updateSeriesData(0, reservedCount);
      graph.updateSeriesData(1, enteredCount);
      graph.updateSeriesData(2, alreadyAppearedCount);
      graph.updateLegend(["已预约", "已入场", "已出场"]);
      this.echartOption = graph.option;
    },
    toDetail(type) {
      console.log(type)
      let data = {
        type: type,
        dateRange: this.dateRange
      }
      uni.navigateTo({
        url: `./statisticsDetail?params=${JSON.stringify(data)}`,
      });
    },
    toInoutDetail(type) {
      let data = {
        type: type,
        dateRange: this.dateRange
      }
      uni.navigateTo({
        url: `./inoutDetail?params=${JSON.stringify(data)}`,
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.manage-main {
  padding-top: 172rpx;
}

.statistics-header {
  position: relative;
  height: 240rpx;
  background: linear-gradient(
    360deg,
    rgba(58, 101, 255, 0) 0%,
    rgba(58, 10, 255, 0.12) 100%
  );
}

.manage-tab-box {
  background: transparent;
}

.statistics-header-box {
  box-sizing: border-box;
  position: absolute;
  width: 92%;
  left: 4%;
  top: 120rpx;
  padding: 40rpx 20rpx;
  height: 260rpx;
  // background: url("../../../../static/manage/statistics-bg.png");
  // background-size: 100% 100%;
  background: linear-gradient(180deg, #e0e7ff 0%, #ffffff 100%);
  box-shadow: 0px 3rpx 6rpx rgba(0, 0, 0, 0.16);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  border-radius: 20rpx;
}

.statistics-header-item {
  box-sizing: border-box;
  // padding: 0 30rpx;
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.statistics-name {
  font-size: 24rpx;
  color: #7d849f;
}

.statistics-value {
  font-size: 42rpx;
  color: #2c3350;
  font-weight: bold;
}

.statistics-card {
  width: 92%;
  // height: 384rpx;
  background: #ffffff;
  border-radius: 20rpx;
  margin: 4rpx auto 30rpx;
  box-shadow: 0 2rpx 5px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  &-title {
    box-sizing: border-box;
    position: relative;
    height: 100rpx;
    padding: 0 30rpx;
    background: #f7f8fd;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &-main {
    box-sizing: border-box;
    // height: 284rpx;
    padding: 20rpx 30rpx;
    &-title {
      font-size: 28rpx;
      color: #b3b3b3;
    }
    &-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 0 10rpx;
    }
    &-name {
      box-sizing: border-box;
      padding-left: 60rpx;
      width: 70%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &-value {
      width: 25%;
      text-align: right;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
    }
  }
}

.statistics-card-title::before {
  content: "";
  position: absolute;
  width: 8rpx;
  height: 32rpx;
  top: 34rpx;
  left: 0;
  background: #3a65ff;
  border-radius: 4rpx;
}

.statistics-top0 {
  background: url("../../../../static/manage/statistics-top1.png") no-repeat;
  background-size: 45rpx 38rpx;
  background-position: left center;
}

.statistics-top1 {
  background: url("../../../../static/manage/statistics-top2.png") no-repeat;
  background-size: 45rpx 38rpx;
  background-position: left center;
}

.statistics-top2 {
  background: url("../../../../static/manage/statistics-top3.png") no-repeat;
  background-size: 45rpx 38rpx;
  background-position: left center;
}
</style>