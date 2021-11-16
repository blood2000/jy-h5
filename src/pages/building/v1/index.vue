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
        <SiderBar />
        <div class="building-main-side-add" @click="toAddBuildingType">
          <uni-icons type="plus-filled" color="#3A65FF" size="30"></uni-icons>
        </div>
      </div>
      <!-- 内容区域 -->
      <div class="building-main-content">
        <div class="building-box-1 building-bottom-line">
          <div class="building-box-left flex-1">共{{ total }}条记录</div>
          <div class="building-box-right">
            <div class="building-as-btn building-default">编辑分类</div>
            <div class="building-as-btn">添加磅房</div>
          </div>
        </div>

        <div class="building-main-content-body">
          <div class="building-item-box"></div>
          <div class="building-item-box"></div>
        </div>
      </div>
    </div>
  </view>
</template>

<script>
import { mapState } from "vuex";
import SiderBar from "../../../components/Building/SiderBar.vue";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
export default {
  data() {
    return {
      total: 3,
      title: '场区管理',
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
  async onLoad() {
    await this.$onLaunched;
  },
  onShow() {},

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

    // 添加场区分类
    toAddBuildingType() {
      uni.navigateTo({
      	url: './buildingType'
      })
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