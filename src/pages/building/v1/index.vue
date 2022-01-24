<!-- 场区管理 -->
<template>
  <view class="building-content">
    <!-- 头部导航栏 -->
    <!-- <view
      class="status-bar"
      :style="{ height: statusBarHeight * 2 + 'rpx' }"
    ></view>
    <uni-nav-bar
      left-icon="arrowleft"
      color="#ffffff"
      title="场区管理"
      backgroundColor="#3A65FF"
      @clickLeft="back"
    ></uni-nav-bar> -->
    <HeaderBar :title="title" @back="back"></HeaderBar>
    <!-- main -->
    <div class="building-main">
      <div class="building-main-side">
        <!-- 菜单栏 -->
        <SiderBar :siderList="buildingList" @changeSiderBar="changeBuilding" />
        <div class="building-main-side-add" @click="toAddBuildingType">
          <uni-icons type="plusempty" color="#fff" size="30"></uni-icons>
        </div>
      </div>
      <!-- 内容区域 -->
      <div class="building-main-content">
        <div class="building-box-1 ">
          <div class="building-box-left flex-1">
            共 <span>{{ buildingCount }}</span> 条记录
          </div>
          <div class="building-box-right">
            <div
              class="building-as-btn building-default"
              @click="toEditBuildingType"
            >
              编辑分类
            </div>
            <div class="building-as-btn" @click="addBuilding">添加场区</div>
          </div>
        </div>

        <div class="building-main-content-body">
          <div class="building-main-content-body-container">
            <div v-if="activeBuilding.length === 0" class="no-item" @click="addBuilding">暂无场区，点击添加</div>
            <div
              class="building-item-box"
              v-for="(item, index) in activeBuilding"
              :key="index"
              @click="editBuilding(item)"
            >
              <div class="building-item-box-title me-text-beyond">
                {{ item.buildingName }}
              </div>
              <div class="building-item-box-content">
                <img :src="buildingImg" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </view>
</template>

<script>
import { mapState } from "vuex";
import buildingRequest from "../../../config/buildingRequest";
import mockData from "./config/mockData";
import SiderBar from "../../../components/Building/SiderBar.vue";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
export default {
  data() {
    return {
      title: "场区管理",
      buildingList: [],
      buildingCount: 0,
      activeIndex: 0,
      activeBuilding: [], //子类
      buildingImg: '../../../static/building/building.png'
    };
  },

  components: { SiderBar, HeaderBar },
  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
    }),
  },
  onLoad(option) {
    // await this.$onLaunched;
    this.$store.commit("getLoginInfoAction", {
      Authorization: option.token,
      statusBarHeight: option.statusBarHeight,
    });
    this.getAddedGoods();
    // this.$store.commit("getMaterialList", mockData.materialList);
  },
  onShow() {
    this.getBuildingList();
  },

  onPullDownRefresh() {
    console.log("下拉刷新");
    setTimeout(() => {
      uni.stopPullDownRefresh(); //停止下拉刷新动画
    }, 1000);
  },

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    //获取物料字典
    getAddedGoods() {
      const config = {
        url: "getAddedGoods",
        header: this.headerInfo,
      };
      buildingRequest(config).then((res) => {
        console.log("获取所有物料", res);

        if (res.code === 200) {
          this.$store.commit("getMaterialList", res.data);
        }
      });
    },
    //获取父类场区数据
    getBuildingList() {
      const config = {
        url: "getBuilding",
        header: this.headerInfo,
      };
      buildingRequest(config).then((res) => {
        console.log("获取场区父类", res);
        this.buildingList = res.data;
        this.renderBuilding();
      });
      // this.buildingList = mockData.buildingList;
      // this.renderBuilding();
    },

    //场区子类数据显示
    renderBuilding() {
      // this.activeBuilding = this.buildingList[this.activeIndex];
      if (this.buildingList.length === 0) return;
      this.buildingCount = this.buildingList[this.activeIndex].count;
      let buildingId = this.buildingList[this.activeIndex].id;
      //获取子类
      const config = {
        url: "getSubBuilding",
        header: this.headerInfo,
        querys: {
          id: buildingId,
        },
      };
      buildingRequest(config).then((res) => {
        console.log("获取场区子类", res);
        this.activeBuilding = res.data;
      });
    },

    changeBuilding(index) {
      if (this.activeIndex === index) {
        return;
      }
      this.activeIndex = index;
      this.renderBuilding();
    },

    // 添加场区分类
    toAddBuildingType() {
      uni.navigateTo({
        url: "./buildingType",
      });
    },
    //编辑场区分类
    toEditBuildingType() {
      let curBuilding = this.buildingList[this.activeIndex];
      console.log(curBuilding)
      uni.navigateTo({
        url: "./buildingType?curBuilding=" + JSON.stringify(curBuilding),
      });
    },
    // 添加场区
    addBuilding() {
      //isEdit: 0-添加，1-编辑
      if (this.buildingList.length === 0) {
        uni.showModal({
          title: "提示",
          content: "暂无场区分类，请添加",
          success: (res) => {
            if (res.confirm) {
              //点击确认
              uni.navigateTo({
                url: "./buildingType",
              });
            }
          },
        });
        return;
      }
      let data = {
        type: this.buildingList[this.activeIndex].buildingType,
        pid: this.buildingList[this.activeIndex].id,
      };
      uni.navigateTo({
        url: `./addBuilding?data=${JSON.stringify(data)}`,
      });
    },
    // 编辑场区
    editBuilding(item) {
      //isEdit: 0-添加，1-编辑
      let data = {
        type: this.buildingList[this.activeIndex].buildingType,
        pid: this.buildingList[this.activeIndex].id,
        id: item.id,
      };
      uni.navigateTo({
        url: `./editBuilding?data=${JSON.stringify(data)}`,
      });
    },
    // 场区申请审核
    buildingManage() {
      uni.navigateTo({
        url: "./buildingCheck",
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.detail-container {
  overflow-y: hidden;
  padding-bottom: 0;
}
</style>