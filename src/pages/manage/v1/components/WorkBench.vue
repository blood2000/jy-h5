<!-- 工作台 -->
<template>
  <div :class="isScroll ? '' : 'components-main'">
    <div class="work-header" :class="isScroll ? '' : 'work-hidden'">
      <div class="manage-box work-header-box"></div>
      <div class="work-header-line">
        <div class="work-header-line-item">1</div>
        <div class="work-header-line-item">1</div>
        <div class="work-header-line-item">1</div>
      </div>
    </div>
    <div class="work-main" :class="isScroll ? '' : 'work-main-padding'">
      <div v-show="!isScroll" class="showTop" @click="showTop"></div>
      <div class="search-box">
        <div class="search-input-box">
          <input
            class="search-input"
            placeholder="请输入司机姓名或手机号"
            confirm-type="search"
            @confirm="searchDriver"
            type="text"
            v-model="searchKey"
          />
          <view class="enter" @click="searchDriver"></view>
        </div>
        <div class="scan-code">出入场扫码</div>
      </div>
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
        <div
          class="manage-tab-slider"
          :class="'manage-slider' + tabIndex"
        ></div>
      </div>
      <div class="manage-main-title">共 {{ total }} 条记录</div>
      
      <div class="work-main-content" v-if="!isScroll">
        
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
          <div v-if="noData" class="no-data">暂无预约记录</div>
          <div
            class="manage-box"
            v-for="(item, index) in reserveData"
            :key="index"
          >
            {{ item.name }} -- {{item.page}}
          </div>
        </z-paging>
      </div>

      <div class="work-main-content" v-else>
        <div
          class="manage-box"
          v-for="(item, index) in reserveData"
          :key="index"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ZPagingMixin from "@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin";
export default {
  mixins: [ZPagingMixin], // 使用mixin
  data() {
    return {
      searchKey: "",
      tabs: [
        { name: "待入场", number: 3 },
        { name: "已入场", number: 5 },
        { name: "已出场", number: 2 },
      ],
      tabIndex: 0,
      total: 13,
      reserveData: [],
      overviewData: [],
      pageNum: 1,
      pageSize: 10,
      noData: false,
    };
  },

  props: {
    isScroll: {
      type: Boolean,
      default: true,
    },
  },

  // watch: {
  //   isScroll(val) {
  //     console.log(val)
  //     if (!val) {
  //       this.query();
  //     }
  //   }
  // },

  created() {
    console.log("workbench load");
  },

  mounted() {
    console.log("workbench show");
    this.query();
  },

  components: {},

  computed: {},

  methods: {
    showTop() {
      this.$emit("showTop");
    },
    searchDriver() {
      if (this.isScroll) {
        this.reserveData = [];
        this.query();
      } else {
        this.$refs.paging.reload();
      }
    },

    changeTab(index) {
      if (index === this.tabIndex) return;
      this.tabIndex = index;
      if (this.isScroll) {
        this.reserveData = [];
        this.query();
      } else {
        this.$refs.paging.reload();
      }
    },
    query(pageNum, pageSize) {
      console.log(pageNum, pageSize, this.isScroll);
      this.noData = false;
      this.pageNum = pageNum || 1;
      this.getData().then(res => {
        this.isScroll || this.$refs.paging.complete(res);
        this.isScroll && (this.reserveData = res);
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
        keyword: this.searchKey,
        type: this.tabIndex,
      };
      console.log('参数', data)
      let reserveData = [];
      let len = 10;
      if (this.pageNum === 3) {
        len = 4;
      }
      if (this.searchKey !== '') {
        len = this.searchKey * 1;
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
.work-header {
  padding: 30rpx 0;
  &-box {
    margin-bottom: 20rpx;
  }
  &-line {
    padding: 10rpx 4% 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-item {
      width: 30%;
      height: 100rpx;
      border-radius: 12rpx;
      background: #fff;
      box-shadow: 0 2rpx 10rpx 0 rgba(0, 0, 0, 0.2);
    }
  }
}

.work-hidden {
  padding: 0;
  height: 0;
  overflow: hidden;
}
.work-main {
  box-sizing: border-box;
  position: relative;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  &-content {
    flex: 1;
    overflow: hidden;
  }
}

.manage-box {
  // margin-bottom: 10rpx;
}

.work-main-padding {
  padding-top: 30rpx;
}

.showTop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30rpx;
  background: #fff;
}

.showTop::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 40rpx;
  height: 6rpx;
  border-top: 4rpx solid #999;
  border-bottom: 4rpx solid #999;
}

.search-box {
  box-sizing: border-box;
  padding: 10rpx 20rpx 0;
  justify-content: space-between;
  align-items: center;
  .search-input-box {
    width: 70%;
  }
}

.scan-code {
  box-sizing: border-box;
  width: 26%;
  height: 70rpx;
  line-height: 68rpx;
  text-align: center;
  border: 1rpx solid #999;
  border-radius: 10rpx;
}

.manage-main-title {
  box-sizing: border-box;
  padding: 20rpx 30rpx;
  // background: #f5f5f5;
}


</style>