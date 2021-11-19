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
      <div class="building-body-box">
        <div class="building-title1">位置信息</div>
        <div class="map-box">
          <Map :locationInfo="locationMsg"></Map>
        </div>
      </div>
      <!-- 选择物料 -->
      <!-- <MaterialPicker
        v-if="buildingMsg.buildingType !== '0'"
        :materialList="materialList"
        @changeMaterialList="changeMaterialList"
      ></MaterialPicker> -->

      <div class="building-input-box" v-if="buildingMsg.buildingType !== '0'">
        <div class="building-input-item">
          <div class="building-title1">请选择存储的物料</div>
          <div class="placeholder" @click="chooseMaterial">
            请选择
            <uni-icons type="forward" size="14"></uni-icons>
          </div>
        </div>
        <!-- 显示框 -->
        <div class="building-input-content">
          <div
            class="building-input-content-item"
            v-for="(item, index) in choosedList"
            :key="index"
          >
            {{ item.name }}
            <span class="building-input-delete" @click="deleteItem(index)">
              <uni-icons type="clear" color="red" size="14"></uni-icons>
            </span>
          </div>
        </div>
      </div>

      <!-- 物料相关 -->
      <div class="building-input-box" v-if="buildingMsg.buildingType !== '0'">
        <div class="building-input-item">
          <div class="building-title1">
            物料单位 <span class="required">*</span>
          </div>
          <input
            class="my-input"
            maxlength="9"
            placeholder="请输入"
            type="text"
            v-model="buildingMsg.unit"
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
            v-model="buildingMsg.size"
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
      <div class="building-btn">添加</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import Map from "../../../components/Building/Map.vue";
import MaterialPicker from "../../../components/Building/MaterialPicker.vue";
import mockData from "./config/mockData";
export default {
  data() {
    return {
      title: "",
      buildingTypes: [],
      buildingTypeIndex: 0,
      noChoose: true,
      buildingMsg: {
        buildingType: "",
        buildingName: "",
        remark: "",
        material: "",
        unit: "",
        size: "",
      },
      locationMsg: {
        latitude: "",
        longitude: "",
      },
      // materialList: [],
      choosedList: [],
    };
  },

  components: { HeaderBar, Map, MaterialPicker },

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
    this.buildingMsg.buildingType = option.type;
    if (option.type === "0") {
      // 磅房
      this.title = "添加设施（地磅类）";
    } else {
      this.title = "添加场区（仓储类）";
    }
  },

  onShow() {
    this.buildingTypes = mockData.buildingTypes;
    this.getChoosedList();
    // this.handleMaterialList();
    this.getLocationInfo();
  },

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    // handleMaterialList() {
    //   this.materialList = mockData.materialList;
    //   this.$store.commit("getMaterialList", this.materialList);
    //   this.getChoosedList();
    // },
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
    chooseMaterial() {
      uni.navigateTo({
        url: "./materialList",
      });
    },
    //获取已选物料列表
    getChoosedList() {
      let choosedList = [];
      this.materialList.map((item) => {
        item.list.map(itm => {
          if (itm.checked) {
          choosedList.push(itm);
        }
        })
      });
      this.choosedList = choosedList;
      // this.$store.commit("getChoosedMaterial", this.choosedList);
    },
     // 删除已选物料
    deleteItem(index) {
      let delType = this.choosedList[index].type;
      this.materialList.map(item => {
        item.list.map(itm => {
          if (itm.type === delType) {
            this.$set(itm, 'checked', false);
          }
        })
      })
      
      this.getChoosedList();
      this.$store.commit("getMaterialList", this.materialList);
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