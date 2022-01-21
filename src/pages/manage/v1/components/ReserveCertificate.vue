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
            @deleteCertify="deleteCertify"
            @toDispatch="toDispatch"
            @share="share"
          ></certificate-card>
        </block>
      </z-paging>
    </div>
    <div v-if="showQrcode" class="manage-modal">
      <div class="qrcode-box"></div>
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
      jyzCode: "62baa47ae922439fbf3c102774722e40",
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
      qrcodeUrl: '',  //二维码链接
      showQrcode: false,
    };
  },

  components: { CertificateCard },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
    }),
  },
  created() {
    // this.query();
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
      buildingRequest(config).then(res => {
        console.log('删除预约凭证', res);
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
      })
    },
    toDispatch(code) {
      uni.navigateTo({
        url: "./dispatch?code=" + code,
      });
    },
    share(code) {
      const config = {
        url: "share",
        method: "POST",
        header: this.headerInfo,
        data: {
          query: code
        },
      };
      buildingRequest(config).then(res => {
        console.log('分享获取链接', res)
        this.qrcodeUrl = res.data.url;
      })
    },
  },
};
</script>
<style lang='scss' scoped>
.manage-main {
  padding-top: 30rpx;
}
</style>