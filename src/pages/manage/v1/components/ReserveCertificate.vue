<!-- 预约凭证 -->
<template>
  <div class="components-main">
    <div class="manage-tab-box">
      <div
        class="manage-tab"
        :class="tabIndex === index ? 'manage-tab-active' : ''"
        v-for="(item, index) in tabs"
        :key="index"
        @click="changeTab(index)"
      >
        {{ item.name }}
      </div>
      <div class="manage-tab-slider" :class="'manage-slider' + tabIndex"></div>
    </div>
    <div class="manage-line">
      <div class="manage-title1">共 {{ total }} 条</div>
      <div class="manage-btn1" @click="add">添加凭证</div>
    </div>
    <div class="manage-main">
      <z-paging
        ref="paging"
        v-model="reserveData"
        @query="query"
        :fixed="false"
        :loading-more-enabled="false"
        :hide-empty-view="true"
        :auto="true"
        :show-loading-more-no-more-line="false"
      >
        <div v-if="noData" class="no-data">暂无预约凭证记录</div>
        <block v-for="(item, index) in reserveData" :key="index">
          <certificate-card
            :cardData="item"
            :status="tabIndex"
            @toDetail="toDetail"
            @deleteCertify="deleteCertify"
            @toDispatch="toDispatch"
            @share="share"
            @disableCertify="disableCertify"
          ></certificate-card>
        </block>
      </z-paging>
    </div>
    <div v-if="showQrcode" class="manage-modal" @click="cancelModal">
      <div class="qrcode-box">
        <div class="qrcode-content" @click.stop="saveQrcode">
          <uqrcode ref="uQRCode" :text="qrcodeUrl" :size="qrcodeSize" />
        </div>
        <div class="qrcode-text">扫描二维码前往至简集运司机端小程序</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ZPagingMixin from "@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin";
import CertificateCard from "./CertificateCard.vue";
import buildingRequest from "../../../../config/buildingRequest";
export default {
  mixins: [ZPagingMixin], // 使用mixin
  data() {
    return {
      jyzCode: "",
      total: 0,
      tabs: [
        { name: "已生效", status: 0 },
        { name: "已失效", status: 1 },
      ],
      tabIndex: 0,
      reserveData: [],
      pageNum: 1,
      pageSize: 10,
      noData: false,
      qrcodeUrl: "", //二维码链接
      showQrcode: false,
      qrcodeSize: 256,
    };
  },

  components: { CertificateCard },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
      isFresh: (state) => state.manage.isFresh,
    }),
  },
  watch: {
    isFresh(val) {
      console.log("isFresh", val);
      if (!val) return;
      this.query();
    },
  },
  created() {
    // this.query();
    this.jyzCode = uni.getStorageSync("jyzCode");
  },

  mounted() {
    console.log("预约凭证 show");
  },

  methods: {
    changeTab(index) {
      if (index === this.tabIndex) return;
      this.tabIndex = index;
      this.$refs.paging.reload();
    },
    query(pageNum, pageSize) {
      console.log(pageNum, pageSize);
      this.$store.commit("setFresh", false);
      this.noData = false;
      this.pageNum = pageNum || 1;
      let data = {
        // pageNum: this.pageNum,
        // pageSize: this.pageSize,
        jyzCode: this.jyzCode,
        status: this.tabIndex,
      };
      const config = {
        url: "getCertifyRecord",
        header: this.headerInfo,
        querys: data,
      };
      buildingRequest(config).then((res) => {
        console.log("获取预约凭证记录", res);
        // res.data = [
        //   {
        //     companyName: "123",
        //   },
        // ];
        this.$refs.paging.complete(res.data);
        this.total = res.data.length;
        if (this.reserveData.length === 0 && res.data.length === 0) {
          this.noData = true;
        } else {
          this.noData = false;
        }
      });
    },
    add() {
      console.log(111);
      uni.navigateTo({
        url: "./addCertify",
      });
    },
    deleteCertify(id) {
      const config = {
        url: "deleteCertify",
        method: "DELETE",
        header: this.headerInfo,
        params: id,
      };
      buildingRequest(config).then((res) => {
        console.log("删除预约凭证", res);
        uni.showModal({
          title: "提示",
          content: res.msg,
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              //点击确认
              this.$refs.paging.reload();
            }
          },
        });
      });
    },
    toDispatch(code) {
      uni.navigateTo({
        url: "./dispatch?code=" + code,
      });
    },

    toDetail(code) {
      uni.navigateTo({
        url: "./certifyInfo?code=" + code,
      });
    },

    cancelModal() {
      this.showQrcode = false;
    },
    disableCertify(id) {
      const config = {
        url: "disableCertify",
        method: "PUT",
        header: this.headerInfo,
        params: id,
      };
      buildingRequest(config).then((res) => {
        console.log("作废请求", res);
        uni.showModal({
          title: "提示",
          content: res.msg,
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              //点击确认
              this.$refs.paging.reload();
            }
          },
        });
      });
    },
    share(code) {
      const config = {
        url: "share",
        method: "POST",
        header: this.headerInfo,
        data: {
          query: code,
        },
      };
      buildingRequest(config).then((res) => {
        console.log("分享获取链接", res);
        this.qrcodeUrl = res.data.url;
        this.showQrcode = true;
      });
    },
    toTempFilePath() {
      console.log(111);
      this.$refs.uQRCode.toTempFilePath({
        success: (res) => {
          console.log(res);
        },
      });
    },
    saveQrcode() {
      // this.$refs.uQRCode.save({
      //   success: (res) => {
      //     console.log(res);
      //     // this.cancelModal();
      //   },
      // });
    },
  },
};
</script>
<style lang='scss' scoped>
.manage-main {
  padding-top: 30rpx;
}

.qrcode-box {
  box-sizing: border-box;
  padding: 30rpx 30rpx;
  position: absolute;
  z-index: 102;
  width: 90%;
  // height: 600rpx;
  left: 5%;
  top: 30%;
  border-radius: 20rpx;
  background: #fff;

  .qrcode-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .qrcode-text {
    padding-top: 20rpx;
    text-align: center;
    color: #333;
  }
}
</style>