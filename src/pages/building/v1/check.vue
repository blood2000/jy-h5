<!-- 申请审核 -->
<template>
  <div class="building-content">
    <HeaderBar :title="title" @back="back"></HeaderBar>
    <div class="building-body">
      <div class="building-input-box">
        <div class="building-input-item">
          <div class="building-title1">集运站</div>
          <picker
            mode="selector"
            :range="buildingStations"
            :range-key="'name'"
            @change="changeStations"
          >
            <view class="building-picker-btn">
              {{ buildingStations[stationIndex].name }}
              <uni-icons type="forward" size="14"></uni-icons>
            </view>
            <!-- <view class="no-choose" v-if="noChoose">请选择</view> -->
          </picker>
        </div>
      </div>
      <!-- 单位及总量 -->
      <div class="building-input-box">
        <div class="building-input-item">
          <div class="building-title1">存储物料 <span class="required">*</span></div>
          <picker
            mode="selector"
            :range="materialList"
            :range-key="'goodsName'"
            @change="changeMaterialList"
          >
            <view class="building-picker-btn">
              {{ materialList[materialIndex].goodsName }}
              <uni-icons type="forward" size="14"></uni-icons>
            </view>
            <view class="no-choose" v-if="noChoose">请选择</view>
          </picker>
        </div>
        <div class="building-input-item">
          <div class="building-title1">存储单位 <span class="required">*</span></div>
          <picker
            mode="selector"
            :range="buildingUnit"
            @change="changeUnit"
          >
            <view class="building-picker-btn">
              {{ buildingUnit[buildingUnitIndex] }}
              <uni-icons type="forward" size="14"></uni-icons>
            </view>
            <!-- <view class="no-choose" v-if="noChoose">请选择</view> -->
          </picker>
        </div>
        <div class="building-input-item">
          <div class="building-title1">存储总量 <span class="required">*</span></div>
          <input
            class="my-input"
            maxlength="16"
            placeholder="请输入"
            type="text"
            v-model="itemMsg.applyTotal"
            cursor-spacing="150"
          />
        </div>
      </div>
      <!-- 日期 -->
      <div class="building-input-box">
        <div class="building-input-item">
          <div class="building-title1">
            租用开始日期 <span class="required">*</span>
          </div>
          <!-- startDate -->
          <picker
            mode="date"
            :value="itemMsg.startDate"
            @change="startDateChange"
            :end="itemMsg.endDate"
          >
            <view class="building-date">
              <span>{{ itemMsg.startDate || "选择日期" }} </span>
              <uni-icons type="forward" color="#333" size="12"></uni-icons>
            </view>
          </picker>
        </div>
        <div class="building-input-item">
          <div class="building-title1">
            租用结束日期 <span class="required">*</span>
          </div>
          <!-- endDate -->
          <picker
            mode="date"
            :value="itemMsg.endDate"
            @change="sendDateChange"
            :start="itemMsg.startDate"
          >
            <view class="building-date">
              <span>{{ itemMsg.endDate || "选择日期" }} </span>
              <uni-icons type="forward" color="#333" size="12"></uni-icons>
            </view>
          </picker>
        </div>
      </div>
      <!-- 备注 -->
      <div class="building-body-box">
        <div class="building-title1">申请原因 <span class="required">*</span></div>
        <div class="textarea-box">
          <textarea
            class="building-remark"
            maxlength="255"
            v-model="itemMsg.reason"
            :disabled="true"
            placeholder="添加备注"
          />
        </div>
      </div>
      
      <!-- 回复 -->
      <div class="building-body-box">
        <div class="building-title1">审批回复 <span class="required">*</span></div>
        <div class="textarea-box">
          <textarea
            class="building-remark"
            maxlength="255"
            v-model="checkReplay"
            placeholder="添加审批回复"
          />
        </div>
      </div>
    </div>
    <div class="building-btn-box">
      <!-- <div class="building-btn building-cancel">取消</div> -->
      <div class="building-btn building-danger">驳回</div>
      <div class="building-btn building-primary" @click="toApportion">审批及分配</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import mockData from "./config/mockData";
import {buildingUnit} from "./config/dict";
export default {
  data() {
    return {
      title: "申请审核",
      itemMsg: {},
      buildingStations: [
        { name: "集运站1", id: 0 },
        { name: "五福集运站", id: 1 },
      ],
      buildingUnit: [],
      buildingUnitIndex: 0,
      stationIndex: 0,
      checkReplay: '',
      materialIndex: 0,  //物料索引
      goodsType: '',
      noChoose: true,
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

  onLoad(option) {
    this.itemMsg = JSON.parse(option.itemMsg);
    console.log(this.itemMsg);
    this.getStationName();
    this.buildingUnit = buildingUnit;
    this.buildingUnit.map((item, index) => {
      if (item === this.itemMsg.unit) {
        this.buildingUnitIndex = index;
      }
    })
    console.log(this.materialList)
  },

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    getStationName() {
      this.buildingStations.map((item, index) => {
        if (item.name === this.itemMsg.station) {
          this.stationIndex = index;
        }
      });
    },
    changeStations(e) {
      this.stationIndex = e.detail.value;
    },

    changeMaterialList(e) {
      this.materialIndex = e.detail.value;
      this.noChoose = false;
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

    //审批分配
    toApportion() {
      uni.navigateTo({
        url: "./apportion",
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.building-body {
  padding-bottom: 100rpx;
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