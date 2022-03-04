<!-- 工作台 -->
<template>
  <div :class="isScroll ? '' : 'components-main'">
    <div class="work-header" :class="isScroll ? '' : 'work-hidden'">
      <div class="manage-box work-header-box">
        <div class="work-title-line">
          <div class="work-title"></div>
          <div class="work-set" @click="openSet"></div>
        </div>
        <div class="work-title-line">
          <div class="work-title-line-long">
            <div class="work-item-name1">预约号量</div>
            <div class="work-item-value1">
              {{ overviewData.largesseCount || 0 }}
            </div>
          </div>
          <div class="work-title-line-long">
            <div class="work-item-name1">已预约</div>
            <div class="work-item-value1">
              {{ overviewData.reservedCount || 0 }}
            </div>
          </div>
          <div class="work-title-line-short">
            <div class="work-item-name1">已入场</div>
            <div class="work-item-value1">
              {{ overviewData.enteredCount || 0 }}
            </div>
          </div>
          <div class="work-title-line-short">
            <div class="work-item-name1">已出场</div>
            <div class="work-item-value1">
              {{ overviewData.alreadyAppearedCount || 0 }}
            </div>
          </div>
        </div>
        <div class="work-radius-line">
          <div class="work-radius-line-item">
            <div class="point"></div>
            <div class="work-item-name2">预约凭证</div>
            <span> {{ overviewData.voucherCount || 0 }} </span>
          </div>
          <div class="work-radius-line-item">
            <div class="point"></div>
            <div class="work-item-name2">预约号段</div>
            <span> {{ overviewData.segmentCount || 0 }} </span>
          </div>
        </div>
      </div>
      <div class="work-header-line">
        <div
          class="work-header-line-item"
          v-for="(item, index) in overviewData.lastAppearance"
          :key="index"
        >
          <img src="../../../../static/manage/car.png" alt="" />
          <div class="manage-title2">{{ item.licenseNumber }}</div>
          <div class="work-item-name3">{{ item.nickName }}</div>
          <div class="work-date">{{ item.appearanceTime | dateFilter1 }}</div>
        </div>
      </div>
    </div>
    <div class="work-main" :class="isScroll ? '' : 'work-main-padding'">
      <div v-show="!isScroll" class="showTop" @click="showTop">
        <uni-icons type="top" size="16"></uni-icons>
      </div>
      <!-- <div v-show="!isScroll" class="manage-expand-splite" @click="showTop">
        <uni-icons type="top" size="16"></uni-icons>
      </div> -->
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
        <!-- <div class="scan-code" @click="scanOrder">
          <img src="../../../../static/manage/code.png" alt="" />
          <div class="scan-code-name">出入场扫码</div>
        </div> -->
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
        <div class="manage-tab-date">
          <picker mode="date" :value="createTime" @change="changeDate">
            <view class="picker-btn">
              {{ createTime }}
              <uni-icons type="bottom" color="#3a65ff" size="14"></uni-icons>
            </view>
          </picker>
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
          <div v-if="noData" class="no-data">暂无记录</div>
          <block v-for="(item, index) in reserveData" :key="index">
            <reserve-card
              :cardData="item"
              @changeStatus="changeStatus"
              @disableRecord="disableRecord"
            ></reserve-card>
          </block>
        </z-paging>
      </div>

      <div class="work-main-content" v-else>
        <div v-if="noData" class="no-data">暂无记录</div>
        <block v-for="(item, index) in reserveData" :key="index">
          <reserve-card
            :cardData="item"
            @changeStatus="changeStatus"
            @disableRecord="disableRecord"
          ></reserve-card>
        </block>
      </div>
    </div>
    <picker-modal
      :pickerData="pickerData"
      :showModal="showPickerModal"
      @cancelModal="cancelPickerModal"
    ></picker-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ZPagingMixin from "@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin";
import buildingRequest from "../../../../config/buildingRequest";
import format from "../../../../utils/format";
import ReserveCard from "./ReserveCard.vue";
import PickerModal from "./PickerModal.vue";
// import mumuGetQrcode from "@/uni_modules/mumu-getQrcode/components/mumu-getQrcode/mumu-getQrcode.vue";
export default {
  mixins: [ZPagingMixin], // 使用mixin
  data() {
    return {
      jyzCode: "",
      searchKey: "",
      today: "",
      pickerData: [
        { name: "今日预约调号", url: "jryyth" },
        { name: "场区阈值设置", url: "cqyzsz" },
        { name: "预约规则设置", url: "yygzsz" },
      ],
      showPickerModal: false,
      overviewData: {},
      // vehicleData: [
      //   { num: "闽A112233", name: "辛弃疾", date: "12.28 12:32" },
      //   { num: "闽A667833", name: "王阳明", date: "12.28 12:32" },
      //   { num: "闽A545233", name: "李白", date: "12.28 12:32" },
      // ],
      tabs: [
        { name: "待入场", reservationStatus: 0 },
        { name: "已入场", reservationStatus: 1 },
        { name: "已出场", reservationStatus: 2 },
      ],
      tabIndex: 0,
      total: 0,
      reserveData: [],
      createTime: "",
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

  // components: {mumuGetQrcode,},

  // watch: {
  //   isScroll(val) {
  //     console.log(val)
  //     if (!val) {
  //       this.query();
  //     }
  //   }
  // },

  filters: {
    dateFilter1: (n) => {
      return format.dateFormat(new Date(n), "{m}-{d} {h}:{i}");
    },
  },

  created() {
    console.log("workbench load");
    this.jyzCode = uni.getStorageSync("jyzCode");
    this.today = format.dateFormat(new Date(), "{y}-{m}-{d}");
    this.createTime = format.dateFormat(new Date(), "{y}-{m}-{d}");
    this.getStatistics();
  },

  mounted() {
    console.log("workbench show");

    this.query();
  },

  components: { ReserveCard, PickerModal },

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
      if (this.isScroll) {
        this.reserveData = [];
        this.query();
      } else {
        this.$refs.paging.reload();
      }
      this.getStatistics();
    },
  },

  methods: {
    //入场预约设置
    openSet() {
      console.log("set");
      this.showPickerModal = true;
      this.$emit('openSet', true)
    },
    cancelPickerModal() {
      this.showPickerModal = false;
      this.$emit("cancelPickerModal", false);
    },
    showTop() {
      this.$emit("showTop");
    },
    //首页统计信息
    getStatistics() {
      const config = {
        url: "getStatistics",
        header: this.headerInfo,
        querys: {
          jyzCode: this.jyzCode,
        },
      };
      buildingRequest(config).then((res) => {
        console.log("首页统计信息", res);
        this.overviewData = res.data;
      });
    },
    searchDriver() {
      if (this.isScroll) {
        this.reserveData = [];
        this.query();
      } else {
        this.$refs.paging.reload();
      }
    },

    //切换日期
    changeDate(e) {
      this.createTime = e.detail.value;
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
      this.$store.commit("setFresh", false);
      this.noData = false;
      this.pageNum = pageNum || 1;
      this.getRecord();
    },
    //标记出入场
    changeStatus(params) {
      console.log(params);
      const config = {
        url: "changeStatus",
        method: "PUT",
        header: this.headerInfo,
        data: params,
      };
      buildingRequest(config).then((res) => {
        console.log("标记出入场", res);
        uni.showModal({
          title: "提示",
          content: res.msg,
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              //点击确认
              if (this.isScroll) {
                this.query();
              } else {
                this.$refs.paging.reload();
              }
              this.getStatistics();
            }
          },
        });
      });
    },
    disableRecord(id) {
      const config = {
        url: "disableDriverRecord",
        method: "PUT",
        header: this.headerInfo,
        params: id,
      };
      buildingRequest(config).then((res) => {
        console.log("废止出入场", res);
        uni.showModal({
          title: "提示",
          content: res.msg,
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              //点击确认
              if (this.isScroll) {
                this.query();
              } else {
                this.$refs.paging.reload();
              }
              this.getStatistics();
            }
          },
        });
      });
    },
    getRecord() {
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        jyzCode: this.jyzCode,
        keyWord: this.searchKey,
        reservationStatus: this.tabIndex,
        createTime: this.createTime,
      };
      const config = {
        url: "getDriverRecord",
        header: this.headerInfo,
        querys: data,
      };
      buildingRequest(config).then((res) => {
        console.log("司机记录", res);
        this.isScroll || this.$refs.paging.complete(res.data.list);
        this.isScroll && (this.reserveData = res.data.list);
        this.total = res.data.total;
        // if (this.reserveData.length === 0 && res.data.list.length === 0) {
        if (this.total === 0) {
          this.noData = true;
        } else {
          this.noData = false;
        }
      });
    },
    scanOrder() {
      this.$emit("scanOrder");
    },
  },
};

</script>
<style lang='scss' scoped>
.work-header {
  padding: 30rpx 0 0;
  &-box {
    margin-bottom: 20rpx;
    padding: 20rpx 30rpx;
    height: 306rpx;
    background: #3a65ff;
    // background: url('../../../../static/manage/header-bg.png') no-repeat center;
  }
  &-line {
    padding: 10rpx 4% 10rpx;
    display: flex;
    // justify-content: space-between;
    align-items: center;
    &-item {
      box-sizing: border-box;
      width: 30%;
      margin-right: 5%;
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

.work-header-line-item:last-child {
  margin-right: 0;
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

.manage-tab-date {
  flex: 1;
  padding-right: 20rpx;
  text-align: right;
  color: #3a65ff;
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
  display: flex;
  justify-content: center;
  align-items: center;
  // &-line {
  //   flex: 1;
  //   height: 2rpx;
  //   background-image: linear-gradient(to bottom, #ddd, transparent);
  //   transform: scaleY(.5);
  // }
}

// .showTop::after {
//   content: "";
//   position: absolute;
//   bottom: 0;
//   left: 50%;
//   width: 40rpx;
//   height: 6rpx;
//   border-top: 4rpx solid #999;
//   border-bottom: 4rpx solid #999;
//   transform: translateX(-50%);
// }

.search-box {
  box-sizing: border-box;
  padding: 10rpx 20rpx 0;
  background: #f5f5f5;
  justify-content: space-between;
  align-items: center;
  .search-input-box {
    border-radius: 10rpx;
    border: none;
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