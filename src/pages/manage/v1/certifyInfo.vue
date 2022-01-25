<!-- 凭证信息 -->
<template>
  <div class="manage-content">
    <HeaderBar :title="title" @back="back"></HeaderBar>
    <div class="manage-main">
      <div class="manage-box">
        <div class="manage-box-line">
          <div class="manage-title2">货主</div>
          <view class="picker-btn"> {{ detail.jyzName }} </view>
        </div>
      </div>
      <div class="building-input-box">
        <div class="building-input-item">
          <div class="building-title1">入场区域</div>
        </div>
        <!-- 显示框 -->
        <div
          class="building-input-content"
          v-if="detail.buildingInfoVos && detail.buildingInfoVos.length > 0"
        >
          <div
            class="manage-input-content-item"
            v-for="(item, index) in detail.buildingInfoVos"
            :key="index"
          >
            {{ item.buildingName }}
          </div>
        </div>
        <div class="building-input-content" v-else>无</div>
      </div>
      <div class="manage-box">
        <div class="manage-box-line">
          <div class="manage-title2">货品种类</div>
          <view class="picker-btn"> {{ detail.goodsName }} </view>
        </div>
        <div class="manage-box-line">
          <div class="manage-title2">吨/方</div>
          <view class="picker-btn"> {{ detail.number || 0 }} </view>
        </div>
      </div>
      <div class="manage-box">
        <div class="manage-box-line">
          <div class="manage-title2">生效日期</div>
          <view class="picker-btn"> {{ detail.effectiveDate }}</view>
        </div>
        <div class="manage-box-line">
          <div class="manage-title2">失效日期</div>
          <view class="picker-btn"> {{ detail.expirationDate }}</view>
        </div>
        <div class="manage-box-line">
          <div class="manage-title2">车次</div>
          <view class="picker-btn"> {{ detail.reserveNumber }}</view>
        </div>
      </div>
      <div class="building-body-box">
        <div class="building-title1">备注信息</div>
        <div class="textarea-box">
          <textarea
            class="building-remark"
            maxlength="255"
            v-model="detail.remark"
            disabled
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import buildingRequest from "../../../config/buildingRequest";
import formFilter from "../../../utils/filter";
import format from "../../../utils/format";
export default {
  data() {
    return {
      title: "凭证信息",
      // jyzCode: "62baa47ae922439fbf3c102774722e40",
      code: "",
      detail: {},
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

  onLoad(option) {
    this.code = option.code;
    this.getCertifyDetail();
    // this.jyzCode = uni.getStorageSync("jyzCode");
  },

  onShow() {},

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    getCertifyDetail() {
      const config = {
        url: "getCertifyDetail",
        header: this.headerInfo,
        querys: {
          code: this.code,
        },
      };
      buildingRequest(config).then((res) => {
        console.log("预约凭证详情", res);
        if (res.code === 200) {
          this.detail = res.data;
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.manage-main {
  padding: 30rpx 0 120rpx;
  overflow-y: auto;
}

.manage-btn-box {
  justify-content: center;
}

.manage-box-line {
  height: 80rpx;
}

.building-body-box,
.building-input-box {
  width: 92%;
}

.manage-input-content-item {
  position: relative;
  padding: 0 20rpx;
  height: 60rpx;
  margin: 0 1% 20rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 10rpx;
  color: #fff;
  background: #3a65ff;
  .building-input-delete {
    position: absolute;
    top: -4px;
    right: -5px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    text-align: center;
    line-height: 30rpx;
    background: #fff;
  }
}
.manage-btn-box {
  justify-content: center;
}

.manage-btn {
  width: 100%;
}
</style>