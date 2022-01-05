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
      <div class="manage-title1"> 共 {{total}} 条 </div>
      <div class="manage-btn1">添加凭证</div>
    </div>
    <div class="manage-main">
      <z-paging
          ref="paging"
          v-model="reserveData"
          @query="query"
          :fixed="false"
          :loading-more-enabled="true"
          :hide-empty-view="true"
          :auto="true"
          :show-loading-more-no-more-line="false"
        >
          <div v-if="noData" class="no-data">暂无预约凭证记录</div>
          <div
            class="manage-box"
            v-for="(item, index) in reserveData"
            :key="index"
          >
            {{ item.name }} -- {{item.page}}
          </div>
        </z-paging>
    </div>
  </div>
</template>

<script>
import ZPagingMixin from "@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin";
export default {
  mixins: [ZPagingMixin], // 使用mixin
  data() {
    return {
      total: 7,
      tabs: [
        { name: "已生效", number: 3 },
        { name: "已失效", number: 5 },
      ],
      tabIndex: 0,
      reserveData: [],
      pageNum: 1,
      pageSize: 10,
      noData: false,
    };
  },

  components: {},

  computed: {},

  mounted() {
    console.log("预约凭证 show");
    this.query();
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
      this.getData().then(res => {
        this.$refs.paging.complete(res);
        if (this.reserveData.length === 0 && res.length === 0) {
          this.noData = true;
        } else {
          this.noData = false;
        }
      })
      
      
    },
    getData() {
      uni.showLoading();
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        type: this.tabIndex,
      };
      console.log('参数', data)
      let reserveData = [];
      let len = 10;
      if (this.pageNum === 3) {
        len = 4;
      }
      
      return new Promise((resolve) => {
        setTimeout(() => {
          for (let i = 0; i < len; i++) {
            let time = new Date().getTime();
            let obj = { name: time + i, page: this.pageNum};
            reserveData.push(obj);
          }
          uni.hideLoading();
          resolve(reserveData)
        }, 1000);
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.manage-main {
  padding-top: 30rpx;
}
</style>