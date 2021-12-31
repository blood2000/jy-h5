<!-- 添加场区分类 -->
<template>
  <div class="building-content">
    <HeaderBar :title="title" @back="back"></HeaderBar>
    <div class="building-body">
      <!-- 表单 -->
      <div class="building-input-box">
        <div class="building-input-item">
          <view class="building-title1"
            >场区分类 <span class="required">*</span>
          </view>
          <picker
            mode="selector"
            :range="buildingTypes"
            :range-key="'name'"
            :value="buildingTypeIndex"
            @change="changeTypes"
          >
            <view class="building-picker-btn">
              {{ buildingTypes[buildingTypeIndex].name }}
              <uni-icons type="forward" size="14"></uni-icons>
            </view>
            <view class="no-choose" v-if="noChoose">请选择</view>
          </picker>
        </div>
        <div class="building-input-item">
          <div class="building-title1">
            场区名称 <span class="required">*</span>
          </div>
          <input
            class="my-input"
            maxlength="32"
            placeholder="请输入"
            type="text"
            v-model="buildingMsg.buildingName"
            cursor-spacing="150"
          />
        </div>
      </div>
      <!-- 位置 -->
      <!-- <div class="building-body-box">
        <div class="building-title1">位置信息</div>
        <div class="map-box">
          <Map :locationInfo="locationMsg"></Map>
        </div>
      </div> -->
      <!-- 备注 -->
      <div class="building-body-box">
        <div class="building-title1">备注信息</div>
        <div class="textarea-box">
          <textarea
            class="building-remark"
            maxlength="255"
            v-model="buildingMsg.remark"
            placeholder="添加备注"
          />
        </div>
      </div>
    </div>
    <div class="building-btn-box">
      <div class="building-btn" @click="addOrEditBuilding"> {{isEdit ? '编辑' : '添加'}} </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import buildingRequest from "../../../config/buildingRequest";
import Map from "../../../components/Building/Map.vue";
import mockData from "./config/mockData";
import { buildingTypes } from "./config/dict";
export default {
  data() {
    return {
      title: "添加场区分类",
      buildingTypes: [],
      buildingTypeIndex: 0,
      curBuilding: {},
      isEdit: false,
      noChoose: true,
      buildingMsg: {
        buildingType: "",
        buildingName: "",
        remark: "",
      },
      locationMsg: {
        latitude: "",
        longitude: "",
      },
    };
  },

  components: { HeaderBar, Map },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
    }),
  },

  onLoad(options) {
    if (options.curBuilding) {
      this.title = '编辑场区分类';
      this.isEdit = true;
      this.curBuilding = JSON.parse(options.curBuilding);
      console.log(this.curBuilding)
      this.buildingMsg = this.curBuilding;
      buildingTypes.map((item, index) => {
        if (item.type === this.buildingMsg.buildingType) {
          this.buildingTypeIndex = index;
          this.noChoose = false;
        }
      })

    } else {
      this.title = '添加场区分类';
      this.isEdit = false;
    }
    
  },

  onShow() {
    this.buildingTypes = buildingTypes;
    
    // this.getLocationInfo();
  },

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    changeTypes(e) {
      this.buildingTypeIndex = e.detail.value;
      this.noChoose = false;
      this.buildingMsg.buildingType =
        this.buildingTypes[this.buildingTypeIndex].type;
    },
    // 获取地理位置
    getLocationInfo() {
      var that = this;
      uni.getLocation({
        type: "wgs84",
        // type: "gcj02",
        success: (res) => {
          console.log("位置信息: ", res);
          that.locationMsg.latitude = res.latitude;
          that.locationMsg.longitude = res.longitude;
        },
      });
    },
    addOrEditBuilding() {
      if (this.isEdit) {
        this.eidtBuilding();
      } else {
        this.addBuilding();
      }
    },
    addBuilding() {
      console.log("添加场区参数", this.buildingMsg);
      if (!this.validParams()) return;
      const config = {
        url: "addBuilding",
        header: this.headerInfo,
        method: "POST",
        data: this.buildingMsg,
      };
      buildingRequest(config).then((res) => {
        console.log("添加场区分类请求", res);
        uni.showModal({
          title: "提示",
          content: res.msg,
          showCancel: false,
          success:  (res) => {
            if (res.confirm) {
              //点击确认
              this.back();
            }
          },
        });
      });
    },
    //编辑
    eidtBuilding() {
      console.log('编辑分类参数',this.buildingMsg);
      if (!this.validParams()) return;
      const config = {
        url: "editBuilding",
        header: this.headerInfo,
        method: "PUT",
        data: this.buildingMsg,
      };
      buildingRequest(config).then(res => {
        console.log("更新场区分类请求", res);
        uni.showModal({
          title: "提示",
          content: res.msg,
          showCancel: false,
          success:  (res) => {
            if (res.confirm) {
              //点击确认
              this.back();
            }
          },
        });
      })
    },
    validParams() {
      if (this.noChoose) {
        uni.showToast({
          title: "请选择场区分类",
          icon: "none",
          duration: 1500,
        });
        return false;
      }
      if (!this.buildingMsg.buildingName) {
        uni.showToast({
          title: "请输入场区名称",
          icon: "none",
          duration: 1500,
        });
        return false;
      }
      return true;
    },
  },
};
</script>
<style lang='scss' scoped>
.building-body {
  padding-bottom: 100rpx;
  margin-bottom: 0;
}
.building-body-box {
  padding: 20rpx 20rpx;
}
</style>