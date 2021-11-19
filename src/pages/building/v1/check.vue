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
          <div class="building-title1">存储单位</div>
          <input
            class="my-input"
            maxlength="9"
            placeholder="请输入"
            type="text"
            v-model="itemMsg.unit"
            cursor-spacing="150"
          />
        </div>
        <div class="building-input-item">
          <div class="building-title1">存储总量</div>
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
        <div class="building-title1">备注信息</div>
        <div class="textarea-box">
          <textarea
            class="building-remark"
            maxlength="255"
            v-model="itemMsg.remark"
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
      <div class="building-btn building-cancel">取消</div>
      <div class="building-btn building-danger">驳回</div>
      <div class="building-btn building-primary">审批及分配</div>
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
      title: "申请审核",
      itemMsg: {},
      buildingStations: [
        { name: "集运站1", id: 0 },
        { name: "五福集运站", id: 1 },
      ],
      stationIndex: 0,
      checkReplay: '',
    };
  },

  components: { HeaderBar },

  computed: {},

  onLoad(option) {
    this.itemMsg = JSON.parse(option.itemMsg);
    console.log(this.itemMsg);
    this.getStationName();
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

    startDateChange(e) {
      this.itemMsg.startDate = e.detail.value;
      console.log(this.itemMsg.startDate);
      // TODO...
    },
    endDateChange(e) {
      this.itemMsg.endDate = e.detail.value;
      // TODO...
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
  border-radius: 40rpx;
  margin-right: 2%;
  // min-width: 120rpx;
}

.building-primary {
  margin-right: 0;
}
</style>