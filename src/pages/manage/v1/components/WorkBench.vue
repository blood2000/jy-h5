<!-- 工作台 -->
<template>
  <div :class="isScroll ? '' : 'components-main'">
    <div class="work-header" :class="isScroll ? '' : 'work-hidden'">
      <div class="manage-box work-header-box">
        <div class="work-title-line">
          <div class="work-title"></div>
          <div class="work-set"></div>
        </div>
        <div class="work-title-line">
          <div class="work-title-line-long">
            <div class="work-item-name1">预约号量</div>
            <div class="work-item-value1">{{ overviewData.yyhl }}</div>
          </div>
          <div class="work-title-line-long">
            <div class="work-item-name1">已预约</div>
            <div class="work-item-value1">{{ overviewData.yyy }}</div>
          </div>
          <div class="work-title-line-short">
            <div class="work-item-name1">已入场</div>
            <div class="work-item-value1">{{ overviewData.yrc }}</div>
          </div>
          <div class="work-title-line-short">
            <div class="work-item-name1">已出场</div>
            <div class="work-item-value1">{{ overviewData.ycc }}</div>
          </div>
        </div>
        <div class="work-radius-line">
          <div class="work-radius-line-item">
            <div class="point"></div>
            <div class="work-item-name2">预约凭证</div>
            <span> 5 </span>
          </div>
          <div class="work-radius-line-item">
            <div class="point"></div>
            <div class="work-item-name2">预约号段</div>
            <span> 12 </span>
          </div>
        </div>
      </div>
      <div class="work-header-line">
        <div
          class="work-header-line-item"
          v-for="(item, index) in vehicleData"
          :key="index"
        >
          <img src="../../../../static/manage/car.png" alt="" />
          <div class="manage-title2">{{ item.num }}</div>
          <div class="work-item-name3">{{ item.name }}</div>
          <div class="work-date">{{ item.date }}</div>
        </div>
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
        <div class="scan-code">
          <img src="../../../../static/manage/code.png" alt="">
          <div class="scan-code-name">出入场扫码</div>
        </div>
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
          <block
            v-for="(item, index) in reserveData"
            :key="index"
          >
            <reserve-card :cardData="item"></reserve-card>
          </block>
        </z-paging>
      </div>

      <div class="work-main-content" v-else>
        <block
            v-for="(item, index) in reserveData"
            :key="index"
          >
            <reserve-card :cardData="item"></reserve-card>
          </block>
      </div>
    </div>
  </div>
</template>

<script>
import ZPagingMixin from "@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin";
import format from "../../../../utils/format";
import ReserveCard from './ReserveCard.vue';
export default {
  mixins: [ZPagingMixin], // 使用mixin
  data() {
    return {
      searchKey: "",
      overviewData: { yyhl: 620, yyy: 132, yrc: 78, ycc: 50 },
      vehicleData: [
        { num: "闽A112233", name: "辛弃疾", date: "12.28 12:32" },
        { num: "闽A667833", name: "王阳明", date: "12.28 12:32" },
        { num: "闽A545233", name: "李白", date: "12.28 12:32" },
      ],
      tabs: [
        { name: "待入场", number: 3 },
        { name: "已入场", number: 5 },
        { name: "已出场", number: 2 },
      ],
      tabIndex: 0,
      total: 13,
      reserveData: [],

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

  components: {ReserveCard},

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
      this.getData().then((res) => {
        this.isScroll || this.$refs.paging.complete(res);
        this.isScroll && (this.reserveData = res);
        if (this.reserveData.length === 0 && res.length === 0) {
          this.noData = true;
        } else {
          this.noData = false;
        }
      });
    },
    getData() {
      uni.showLoading();
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        keyword: this.searchKey,
        type: this.tabIndex,
      };
      console.log("参数", data);
      let reserveData = [];
      let len = 10;
      if (this.pageNum === 3) {
        len = 4;
      }
      if (this.searchKey !== "") {
        len = this.searchKey * 1;
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          let createDate = format.dateFormat(new Date(),'{y}-{m}-{d} {h}:{i}:{s}');
          for (let i = 0; i < len; i++) {
            
            let obj = { 
              company: '山西华汇通商贸有限公司',
              goodsType: '石渣土',
              status: this.tabIndex,
              date: createDate,
              time: '08:00',
              enterArea: this.pageNum + '站台',
              licenseNumber: '闽A123123',
              driver: '辛弃疾',

            };
            reserveData.push(obj);
          }
          uni.hideLoading();
          resolve(reserveData);
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
    padding: 20rpx 30rpx;
    height: 306rpx;
    background: #3a65ff;
    // background: url('../../../../static/manage/header-bg.png') no-repeat center;
  }
  &-line {
    padding: 10rpx 4% 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-item {
      box-sizing: border-box;
      width: 30%;
      padding: 20rpx 20rpx;
      border-radius: 12rpx;
      background: #fff;
      box-shadow: 0 2rpx 10rpx 0 rgba(0, 0, 0, 0.2);
      > img {
        width: 36rpx;
        height: 36rpx;
      }
    }
  }
}

.work-title-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  &-item {
    width: 25%;
  }
  &-long {
    width: 28%;
  }

  &-short {
    width: 22%;
  }
}

.work-item-name1 {
  color: rgba(255, 255, 255, 0.6);
  font-size: 24rpx;
}

.work-item-value1 {
  color: #fff;
  font-size: 42rpx;
  font-weight: bold;
}

.work-title {
  width: 296rpx;
  height: 56rpx;
  background: url("../../../../static/manage/header-title.png");
  background-size: 100% 100%;
}

.work-set {
  width: 128rpx;
  height: 48rpx;
  background: url("../../../../static/manage/header-set.png");
  background-size: 100% 100%;
}

.work-radius-line {
  box-sizing: border-box;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 30rpx;
  padding: 0 40rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-item {
    width: 50%;
    color: rgba(135, 135, 135, 0.8);
    font-size: 24rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    > span {
      color: #3a65ff;
      font-size: 28rpx;
      font-weight: bold;
    }
  }
}

.work-item-name2 {
  margin: 0 10rpx;
}

.work-item-name3 {
  color: #b3b3b3;
  font-size: 24rpx;
}

.work-date {
  width: 174rpx;
  height: 42rpx;
  line-height: 42rpx;
  background: rgba(58, 101, 255, 0.08);
  border-radius: 4rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #3a65ff;
  text-align: center;
  margin-top: 10rpx;
}

.manage-tab-box {
  background: #f5f5f5;
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
  background: #f5f5f5;
  justify-content: space-between;
  align-items: center;
  .search-input-box {
    border-radius: 10rpx;
    flex: 1;
    margin-right: 20rpx;
  }
}

.scan-code {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &-name {
    font-size: 20rpx;
    color: #333;
    font-weight: bold;
    margin-top: 10rpx;
  }
  > img {
    width: 34rpx;
    height: 34rpx;
  }
}

.manage-main-title {
  box-sizing: border-box;
  padding: 20rpx 30rpx;
  // background: #f5f5f5;
}
</style>