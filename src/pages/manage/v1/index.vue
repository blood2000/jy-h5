<!-- 管理端TAB页面 -->
<template>
  <div class="manage-content">
    <HeaderBar :title="title" @back="back"></HeaderBar>
    <!-- 工作台组件 -->
    <mumu-get-qrcode v-if="showScan" @success="qrcodeSucess"></mumu-get-qrcode>
    <scroll-view
      class="manage-main"
      :refresher-enabled="isScroll"
      :scroll-y="isScroll"
      refresher-background="#f5f5f5"
      @scroll="scroll"
      @refresherrefresh="onRefresh"
      @refresherrestore="onRestore"
      :refresher-triggered="triggered"
      v-if="tabIndex === 0"
    >
      <work-bench
        :isScroll="isScroll"
        @showTop="showTop"
        @scanOrder="scanOrder"
      ></work-bench>
    </scroll-view>
    <!-- 预约凭证组件 -->
    <div class="manage-main" v-if="tabIndex === 1">
      <reserve-certificate></reserve-certificate>
    </div>

    <!-- 预约统计组件 -->
    <div class="manage-main" v-if="tabIndex === 2">
      <reserve-statistics></reserve-statistics>
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
import ReserveStatistics from "./components/ReserveStatistics.vue";
import WorkBench from "./components/WorkBench.vue";
import { queryUserInfo } from "@/config/service/user/index.js";
import mumuGetQrcode from "@/uni_modules/mumu-getQrcode/components/mumu-getQrcode/mumu-getQrcode.vue";

export default {
  data() {
    return {
      // barStyle: {
      //   color: '#333',
      //   background: '#f5f5f5'
      // },
      title: "入场预约系统",
      isScroll: true,
      triggered: false,
      _freshing: false,
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
      showBar: true,
      showScan: false,
    };
  },

  components: {
    HeaderBar,
    WorkBench,
    ReserveCertificate,
    ReserveStatistics,
    mumuGetQrcode,
  },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
      isFresh: (state) => state.manage.isFresh,
    }),
  },

  async onLoad(option) {
    // console.log(JSON.stringify(option), "option");
    this.$store.dispatch("getLoginInfoAction", {
      Authorization: option.token,
      statusBarHeight: option.statusBarHeight,
    });

    // this.headerInfo["App-Code"] = 'f3209f6c7353414e8dbb94dd23cf8b91'
    // const res = uni.getSystemInfoSync()
    // this.system = res.platform;
    // this.statusBarHeight = option.statusBarHeight
    // 获取jyzCode
    const res = await queryUserInfo(
      { userCode: uni.getStorageSync("userInfo").userCode },
      this.headerInfo
    );
    let jyzCode = res.data.jyzCode;
    uni.setStorageSync("jyzCode", jyzCode);
    // console.log('集运站CODE', this.jyzCode)
    this._freshing = false;
    // setTimeout(() => {
    //   this.triggered = true; //触发onRefresh来加载自己的数据，如果不用这种方式，不要在此改变triggered的值
    // }, 1000);
  },

  methods: {
    back() {
      uni.webView.navigateBack();
    },
    onRefresh() {
      console.log("首页下拉刷新");
      this.$store.commit("setFresh", true);
      if (this._freshing) return;
      this._freshing = true;
      if (!this.triggered)
        //界面下拉触发，triggered可能不是true，要设为true
        this.triggered = true;
      setTimeout(() => {
        this.triggered = false; //触发onRestore，并关闭刷新图标
        this._freshing = false;
      }, 1000);
    },
    onRestore() {
      this.triggered = "restore"; // 需要重置
      console.log("onRestore");
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
      if (scroll > 1) {
        this.isScroll = false;
      }
    },
    showTop() {
      this.isScroll = true;
    },
    scanOrder() {
      // this.showScan = true;
      console.log(uni.webView);
      uni.webView.getEnv(function (res) {
        console.log("当前环境：" + JSON.stringify(res));
      });
      // uni.webView.postMessage({
      //   data: {
      //     message: 111,
      //   },
      // });

      let data = {
        jyzName: "至简",
        goodsName: "原煤",
        effectiveDate: "2022-01-21",
        expirationDate: "2022-01-22",
        reserveNumber: 112,
        adminName: "辛弃疾",
        adminPhonenumber: "13866669999",
        remark: "出港5吨",
        driver: "杜甫",
        driverTel: "13578786969",
        startTime: "08:00",
        endTime: "10:00",
        fail: "凭证已作废",
        reservationNumber: "5486132154ef321",
      };
      uni.navigateTo({
        url: `./scanResult?detail=${JSON.stringify(data)}`,
      });
    },
    //扫码后跳转
    qrcodeSucess(data) {
      this.showScan = false;
      console.log("扫码后获取的参数", data);
      //driverReservationRecordCode
      uni.navigateTo({
        url: `./scanResult?detail=${JSON.stringify(data)}`,
      });
    },
  },
};
</script>


<style lang='scss' scoped>
.manage-content {
  padding-bottom: 120rpx;
}
</style>