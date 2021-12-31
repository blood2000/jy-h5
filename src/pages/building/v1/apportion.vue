<!-- 仓储分配 -->
<template>
  <div class="building-content">
    <HeaderBar :title="title" @back="back"></HeaderBar>
    <div class="building-box-1">
      <div>共3/12仓储区域</div>
      <div class="building-as-tab">
        <div class="building-as-tab-item" :class="activeIndex === 0 ? 'active' : ''" @click="changeTab(0)">所有</div>
        <div class="building-as-tab-item" :class="activeIndex === 1 ? 'active' : ''" @click="changeTab(1)">空闲</div>
      </div>
    </div>
    <div class="building-body">
      <block v-for="(item, index) in apportionData" :key="index">
        <div class="building-title0">{{item.areaName}}</div>
      <div class="building-input-box">
        <div class="building-input-item" v-for="(itm,idx) in item.buildings" :key="idx">
          <div class="building-title1">{{itm.name}}</div>
          <div class="building-box-right" @click="choosedItem(idx, index)">
            <div class="building-title3"> 余量： {{itm.rest}}{{itm.unit}}  </div>
            <div class="as-radio" :class="itm.check ? 'radio-choosed' : ''">
              <uni-icons type="checkmarkempty" color="#fff" size="16"></uni-icons>
            </div>
          </div>
        </div>
      </div>
      </block>
      
    </div>
    <div class="building-btn-box">
      <!-- <div class="building-btn building-cancel">取消</div> -->
      <div class="building-btn building-danger">驳回</div>
      <div class="building-btn building-primary" @click="toApportion">
        审批及分配
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import mockData from "./config/mockData";
import { buildingUnit } from "./config/dict";
export default {
  data() {
    return {
      title: "仓储分配",
      itemMsg: {},
      activeIndex: 0,
      buildingUnit: [],
      buildingUnitIndex: 0,
      stationIndex: 0,
      checkReplay: "",
      materialIndex: 0, //物料索引
      goodsType: "",
      noChoose: true,
      apportionData: [
        {areaName: '堆场A区', buildings: [{name: '1号堆场', rest: 1000, unit: '吨'}, {name: '2号堆场', rest: 560, unit: '吨'}, {name: '3号堆场', rest: 328, unit: '吨'}]},
        {areaName: '堆场B区', buildings: [{name: '1号堆场', rest: 1000, unit: '吨'}, {name: '2号堆场', rest: 560, unit: '吨'}, {name: '3号堆场', rest: 328, unit: '吨'}]},
        {areaName: '堆场C区', buildings: [{name: '1号堆场', rest: 1000, unit: '吨'}, {name: '2号堆场', rest: 560, unit: '吨'}, {name: '3号堆场', rest: 328, unit: '吨'}]},
      ],
      
    };
  },

  components: { HeaderBar },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
      materialList: (state) => state.building.materialList,
    }),
  },

  onLoad() {},

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },

    changeTab(tabIndex) {
      this.activeIndex = tabIndex;
    },

    changeUnit(e) {
      this.buildingUnitIndex = e.detail.value;
    },

    startDateChange(e) {
      this.itemMsg.startDate = e.detail.value;
      console.log(this.itemMsg.startDate);
      // TODO...
    },
    endDateChange(e) {
      this.itemMsg.endDate = e.detail.value;
      // TODO...
    },

    //选中
    choosedItem(buildingIndex, parentIndex) {
      this.apportionData[parentIndex].buildings.map((item, index) => {
        this.$set(item, "check", false);
        if (index === buildingIndex) {
          this.$set(item, "check", true);
        }
      })
    },

    //审批
    toApportion() {
      uni.navigateTo({
        url: "./apportion",
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.building-box-1 {
  align-items: center;
  color: #999;
}

.building-as-tab {
  width: 186rpx;
  height: 54rpx;
  background: #e0e0e0;
  border-radius: 4rpx;
  display: flex;
  overflow: hidden;
  &-item {
    width: 50%;
    line-height: 54rpx;
    text-align: center;
    background: #E0E0E0;
    color: #999;
    font-size: 24rpx;
  }
  .active {
    background: #fff;
    color: #000;
  }
}
.building-body {
  padding: 0 0 100rpx;
  margin-bottom: 0;
  overflow-y: auto;
}
.building-body-box {
  padding: 20rpx 20rpx;
}

.building-btn-box {
  box-sizing: border-box;
  padding: 0 20rpx;
  justify-content: space-between;
}

.building-btn {
  box-sizing: border-box;
  width: 20%;
  border-radius: 10rpx;
  margin-right: 2%;
  // min-width: 120rpx;
}

.building-danger {
  width: 228rpx;
}

.building-primary {
  margin-right: 0;
}
</style>