<!-- 管理端TAB页面 -->
<template>
  <div class="manage-content">
    <HeaderBar :title="title" @back="back"></HeaderBar>
    <!-- 工作台组件 -->
    <mumu-get-qrcode v-if="showScan" @success="qrcodeSucess"></mumu-get-qrcode>
    <scroll-view
      class="manage-main"
      :scroll-y="isScroll"
      @scroll="scroll"
      v-if="tabIndex === 0"
    >
      <work-bench :isScroll="isScroll" @showTop="showTop" @scanOrder="scanOrder"></work-bench>
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
import { queryUserInfo } from '@/config/service/user/index.js'
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
      showScan: false,
    };
  },

  components: { HeaderBar, WorkBench, ReserveCertificate, mumuGetQrcode },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
    }),
  },

  async onLoad(option) {
    this.$store.dispatch("getLoginInfoAction", {
      Authorization: option.token,
      statusBarHeight: option.statusBarHeight,
    });
    // this.headerInfo["App-Code"] = 'f3209f6c7353414e8dbb94dd23cf8b91'
    // const res = uni.getSystemInfoSync()
    // this.system = res.platform;
    // this.statusBarHeight = option.statusBarHeight
    // 获取jyzCode
			const res = await queryUserInfo({ userCode: uni.getStorageSync('userInfo').userCode }, this.headerInfo);
			let jyzCode = res.data.jyzCode;
      uni.setStorageSync('jyzCode', jyzCode);
      // console.log('集运站CODE', this.jyzCode)
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
    scanOrder() {
      // this.showScan = true;
      let data = {
        jyzName: '至简',
        goodsName: '原煤',
        effectiveDate: '2022-01-21',
        expirationDate: '2022-01-22',
        reserveNumber: 112,
        adminName: '辛弃疾',
        adminPhonenumber: '13866669999',
        remark: '出港5吨',
        driver: '杜甫',
        driverTel: '13578786969',
        startTime: '08:00',
        endTime: '10:00',
        fail: '凭证已作废'
      }
      uni.navigateTo({
        url: `./scanResult?detail=${JSON.stringify(data)}`
      })
    },
    //扫码后跳转
    qrcodeSucess(data) {
      this.showScan = false;
      uni.navigateTo({
        url: `./scanResult?detail=${JSON.stringify(data)}`
      })
    },
  },
};
</script>
<style lang='scss' scoped>
.manage-content {
  padding-bottom: 120rpx;
}
</style>