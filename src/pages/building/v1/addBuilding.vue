<!-- 添加场区 -->
<template>
  <div class="building-content">
    <HeaderBar :title="title" @back="back"></HeaderBar>
    <div class="building-body">
      <!-- 表单 -->
      <div class="building-input-box">
        <div class="building-input-item">
          <div class="building-title1">
            设施名称 <span class="required">*</span>
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
      <!-- 选择物料 -->
      <!-- <MaterialPicker
        v-if="buildingMsg.buildingType !== 1"
        :materialList="materialList"
        @changeMaterialList="changeMaterialList"
      ></MaterialPicker> -->

      <div class="building-input-box" v-if="buildingMsg.buildingType !== 1">
        <div class="building-input-item">
          <div class="building-title1">
            请选择存储的物料 <span class="required">*</span>
          </div>
          <div class="placeholder" @click="toChooseMaterial">
            请选择
            <uni-icons type="forward" size="14"></uni-icons>
          </div>
        </div>
        <!-- 显示框 -->
        <div class="building-input-content" v-if="choosedMaterial.length > 0">
          <div
            class="building-input-content-item"
            v-for="(item, index) in choosedMaterial"
            :key="index"
          >
            {{ item.goodsName }}
            <span class="building-input-delete" @click="deleteItem(index)">
              <uni-icons type="clear" color="red" size="14"></uni-icons>
            </span>
          </div>
        </div>
      </div>

      <!-- 物料相关 -->
      <div class="building-input-box" v-if="buildingMsg.buildingType !== 1">
        <div class="building-input-item">
          <div class="building-title1">
            物料单位 <span class="required">*</span>
          </div>
          <input
            class="my-input"
            maxlength="9"
            placeholder="请输入"
            type="text"
            v-model="buildingMsg.goodsUnit"
            cursor-spacing="150"
          />
        </div>
        <div class="building-input-item">
          <div class="building-title1">
            物料最大容积 <span class="required">*</span>
          </div>
          <input
            class="my-input"
            maxlength="16"
            placeholder="请输入"
            type="text"
            v-model="buildingMsg.maxVolume"
            cursor-spacing="150"
          />
        </div>
      </div>
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
      <div class="building-btn" @click="addBuilding">添加</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import buildingRequest from "../../../config/buildingRequest";
import Map from "../../../components/Building/Map.vue";
import MaterialPicker from "../../../components/Building/MaterialPicker.vue";
import mockData from "./config/mockData";
export default {
  data() {
    return {
      title: "",
      buildingTypeIndex: 0,
      noChoose: true,
      buildingMsg: {
        buildingType: "",
        buildingName: "",
        pid: "",
        remark: "",
        goodsUnit: "",
        maxVolume: "",
      },
      locationMsg: {
        latitude: "",
        longitude: "",
      },
    };
  },

  components: { HeaderBar, Map, MaterialPicker },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
      choosedMaterial: (state) => state.building.choosedMaterial,
    }),
  },

  onLoad(option) {
    this.$store.commit("getChoosedMaterial", []);
    let data = JSON.parse(option.data);
    console.log(option.data);
    this.buildingMsg.buildingType = data.type;
    this.buildingMsg.pid = data.pid;
    if (data.type === 1) {
      // 磅房
      this.title = "添加设施（地磅类）";
    } else {
      this.title = "添加场区（仓储类）";
    }
    //获取当前物料并存入vuex
    //TODO...  this.$store.commit("getChoosedMaterial", this.choosedList);
  
  },

  onShow() {
    console.log(this.choosedMaterial);
    // this.getChoosedList();
    // this.handleMaterialList();
    // this.getLocationInfo();
  },

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
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
    //选择物料
    changeMaterialList(list) {
      this.materialList = JSON.parse(list);
    },
    toChooseMaterial() {
      uni.navigateTo({
        url: "./materialList?check=1",
      });
    },

    // 删除已选物料
    deleteItem(index) {
      this.$store.commit("deleteMaterial", index);
    },

    //请求参数
    getReqData() {
      let { buildingType, buildingName, pid, remark, goodsUnit, maxVolume } =
        this.buildingMsg;

      if (!buildingName) {
        uni.showToast({
          title: "请输入设施名称",
          icon: "none",
          duration: 1500,
        });
        return false;
      }

      if (this.buildingMsg.buildingType !== 1) {
        if (this.choosedMaterial.length === 0) {
          uni.showToast({
            title: "请选择物料",
            icon: "none",
            duration: 1500,
          });
          return false;
        }

        if (!goodsUnit) {
          uni.showToast({
            title: "请选择物料单位",
            icon: "none",
            duration: 1500,
          });
          return false;
        }

        if (!maxVolume) {
          uni.showToast({
            title: "请输入最大容积",
            icon: "none",
            duration: 1500,
          });
          return false;
        }

        let goodsTypes = "";
        this.choosedMaterial.map((item) => {
          goodsTypes += item.goodsType + ",";
        });

        let reqData = {
          buildingType,
          buildingName,
          pid,
          remark,
          building: { goodsUnit, maxVolume, goodsTypes },
        };

        return reqData;
      } else {
        return  {
          buildingType,
          buildingName,
          pid,
          remark,
        };
      }
    },

    addBuilding() {
      let data = this.getReqData();
      if (!data) return;
      const config = {
        url: "insertSubBuilding",
        header: this.headerInfo,
        method: "POST",
        data: data,
      };
      buildingRequest(config).then((res) => {
        console.log("添加场区", res);
        uni.showModal({
          title: "提示",
          content: res.msg,
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              //点击确认
              this.back();
            }
          },
        });
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
</style>