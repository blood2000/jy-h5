<!-- 管理端TAB页面 -->
<template>
  <div class="manage-content">
    <HeaderBar :title="title" @back="back"></HeaderBar>
    <!-- 工作台组件 -->
    <scroll-view
      class="manage-main"
      :scroll-y="isScroll"
      @scroll="scroll"
      v-if="tabIndex === 0"
    >
      <work-bench :isScroll="isScroll" @showTop="showTop"></work-bench>
    </scroll-view>
    <!-- 预约凭证组件 -->
    <div class="manage-main" v-if="tabIndex === 1">
      <reserve-certificate></reserve-certificate>
    </div>

    <div class="manage-tabBar">
      <div
        class="manage-tabBar-item"
        :class="index === tabIndex ? 'manage-active-item' : ''"
        v-for="(item, index) in tabs"
        :key="index"
        @click="changeTab(index)"
      >
        <div class="manage-tabBar-item-icon">
          <img :src="index === tabIndex ? item.selPath : item.path" alt="" />
        </div>
        <div class="manage-tabBar-item-name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import ReserveCertificate from "./components/ReserveCertificate.vue";
import WorkBench from "./components/WorkBench.vue";
export default {
  data() {
    return {
      // barStyle: {
      //   color: '#333',
      //   background: '#f5f5f5'
      // },
      title: "入场预约系统",
      isScroll: true,
      tabs: [
        {
          path: "../../../static/manage/home.png",
          selPath: "../../../static/manage/home-sel.png",
          name: "工作台",
        },
        {
          path: "../../../static/manage/reserve.png",
          selPath: "../../../static/manage/reserve-sel.png",
          name: "预约凭证",
        },
        {
          path: "../../../static/manage/statistics.png",
          selPath: "../../../static/manage/statistics-sel.png",
          name: "统计",
        },
      ],
      tabIndex: 0,
    };
  },

  components: { HeaderBar, WorkBench, ReserveCertificate },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
    }),
  },

  onLoad(option) {
    this.$store.dispatch("getLoginInfoAction", {
      Authorization: option.token,
      statusBarHeight: option.statusBarHeight,
    });
    // this.headerInfo["App-Code"] = 'f3209f6c7353414e8dbb94dd23cf8b91'
    // const res = uni.getSystemInfoSync()
    // this.system = res.platform;
    // this.statusBarHeight = option.statusBarHeight
  },

  methods: {
    back() {
      uni.webView.navigateBack();
    },
    changeTab(index) {
      this.tabIndex = index;
      if (index === 0) {
        this.title = "入场预约系统";
      } else {
        this.title = this.tabs[index].name;
      }
    },
    scroll(e) {
      let scroll = e.detail.scrollTop;
      if (scroll > 100) {
        this.isScroll = false;
      }
    },
    showTop() {
      console.log(123);
      this.isScroll = true;
    },
  },
};
</script>
<style lang='scss' scoped>
.manage-content {
  padding-bottom: 120rpx;
}
</style>