<!-- 进出明细 -->
<template>
  <div class="manage-content">
    <HeaderBar
      :title="title"
      @back="back"
      :showNavIcon="true"
      @handleRight="handleRight"
    >
    </HeaderBar>
    <div class="statistics-search-box">
      <div class="statistics-date-picker">
        <uni-datetime-picker
          v-model="dateRange"
          type="daterange"
          rangeSeparator="至"
          :border="false"
          :clear-icon="false"
          @change="dateChange"
        />
      </div>
      <div class="search-box">
        <div class="search-input-box">
          <input
            class="search-input"
            placeholder="车牌号/司机"
            confirm-type="search"
            @confirm="query"
            type="text"
            v-model="searchKey"
          />
        </div>
      </div>
    </div>
    <div class="manage-main">
      <z-paging
        ref="paging"
        v-model="statisticsData"
        @query="search"
        :fixed="false"
        :loading-more-enabled="true"
        :hide-empty-view="true"
        :auto="true"
        :show-loading-more-no-more-line="false"
      >
        <div v-if="statisticsData.length === 0" class="no-data">
          暂无明细记录
        </div>
        <block v-for="(item, index) in statisticsData" :key="index">
          <inout-card
            :cardData="item"
            :cardTitle="cardTitle"
            :status="reservationStatus"
          ></inout-card>
        </block>
      </z-paging>
    </div>
    <div class="inout-modal" v-if="showModal"></div>
    <div class="inout-modal-box" :class="showModal ? 'inout-modal-show' : ''">
      <div class="inout-modal-box-content">
        <div class="inout-modal-box-title manage-title3">
          筛选条件
          <div class="inout-modal-close" @click="closeModal"></div>
        </div>
        <div class="inout-input-title manage-title2">公司名称</div>
        <view class="inout-input-box">
          <uni-icons type="search" color="#878787" size="18"></uni-icons>
          <input
            class="inout-search-input"
            type="text"
            placeholder="请输入公司名称"
            confirm-type="search"
            v-model="companySearchName"
          />
        </view>
        <div class="inout-input-title manage-title2">预约单号</div>
        <view class="inout-input-box">
          <uni-icons type="search" color="#878787" size="18"></uni-icons>
          <input
            class="inout-search-input"
            type="text"
            placeholder="请输入预约单号"
            confirm-type="search"
            v-model="reservationSearchNumber"
          />
        </view>
        <!-- <div class="inout-input-title manage-title2">商品选择</div>
        <div class="inout-modal-main">
          <div class="inout-modal-main-box">
            <div
              class="inout-type-item"
              v-for="(item, index) in goodsSearchList"
              :key="index"
              :class="item.goodsName === goodsSearchName ? 'active-type-item' : ''"
              @click="chooseGoods(item)"
            >
              {{ item.goodsName }}
            </div>
          </div>
        </div> -->
        <div class="inout-modal-btn-box">
          <div class="inout-btn inout-clear-btn" @click="clear">清空</div>
          <div class="inout-btn inout-confirm-btn" @click="confirm">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import buildingRequest from "../../../config/buildingRequest";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import formFilter from "../../../utils/filter";
import format from "../../../utils/format";
import ZPagingMixin from "@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin";
import InoutCard from "./components/InoutCard.vue";
export default {
  mixins: [ZPagingMixin], // 使用mixin
  data() {
    return {
      title: "进出明细",
      subTitle: "",
      searchKey: "",
      dateRange: [],
      jyzCode: "",
      pageNum: 1,
      pageSize: 10,
      reservationStatus: 0,
      // type: "", //统计类型
      statisticsData: [],
      goodsList: [],
      goodsIndex: -1,
      goodsName: "",
      goodsSearchName: '', //商品搜索名称
      companyName: "",
      companySearchName: '',  //公司搜索名称
      reservationNumber: "", //预约号
      reservationSearchNumber: '',  //搜索预约号
      showModal: false,
      goodsSearchList: [],
    };
  },

  components: { HeaderBar, InoutCard },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
    }),
  },
  filters: {
    priceFormat: (val) => {
      return format.priceFormat(val, 0);
    },
  },

  onLoad(option) {
    this.jyzCode = uni.getStorageSync("jyzCode");
    let params = JSON.parse(option.params);
    this.dateRange = params.dateRange;
    this.reservationStatus = params.type;
    console.log(params);
    switch (this.reservationStatus) {
      case 0:
        this.cardTitle = "已预约";
        break;
      case 1:
        this.cardTitle = "已入场";
        break;
      case 2:
        this.cardTitle = "已出场";
        break;
    }
    // this.getGoodsInfo();
  },

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    getGoodsInfo() {
      const config = {
        url: "getGoodsInfo",
        header: this.headerInfo,
        querys: {
          jyzCode: this.jyzCode,
        },
      };
      buildingRequest(config).then((res) => {
        console.log("货品列表", res);
        this.goodsList = res.data;
        this.goodsSearchList = JSON.parse(JSON.stringify(this.goodsList));
      });
    },
    dateChange(e) {
      // console.log(e);
      this.dateRange = e;
      this.$refs.paging.reload();
      // this.search();
    },
    // changeGoods(e) {
    //   this.goodsIndex = e.detail.value * 1;
    //   this.goodsName = this.goodsList[this.goodsIndex].goodsName;
    //   this.$refs.paging.reload();
    // },
    // clearGoods() {
    //   this.goodsIndex = -1;
    //   this.goodsName = "";
    //   this.$refs.paging.reload();
    // },
    query(e) {
      this.searchKey = e.detail.value;
      this.$refs.paging.reload();
    },
    search(pageNum, pageSize) {
      console.log(pageNum, pageSize);
      console.log(this.dateRange, this.searchKey);
      this.pageNum = pageNum || 1;
      this.getDetail();
    },

    //货主统计请求
    getDetail() {
      let data = {
        jyzCode: this.jyzCode,
        bigCreateTime: this.dateRange[0],
        endCreateTime: this.dateRange[1],
        keyWord: this.searchKey,
        companyName: this.companyName,
        goodsName: this.goodsName,
        reservationStatus: this.reservationStatus,
        reservationNumber: this.reservationNumber,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const config = {
        url: "getSubscribeStatisticsDetail",
        header: this.headerInfo,
        querys: data,
      };
      buildingRequest(config).then((res) => {
        console.log("进出明细", res);
        this.$refs.paging.complete(res.data.list);
        // this.getBuildingName(res.data.list);
      });
    },

    handleRight() {
      console.log("handleright");
      this.showModal = true;
      this.goodsSearchName = this.goodsName;
      this.companySearchName = this.companyName;
      this.reservationSearchNumber = this.reservationNumber;
    },
    closeModal() {
      this.showModal = false;
    },
    chooseGoods(item) {
      this.goodsSearchName = item.goodsName;
    },

    confirm() {
      
      this.goodsName = this.goodsSearchName;
      this.companyName = this.companySearchName;
      this.reservationNumber = this.reservationSearchNumber;
      this.showModal = false;
      this.$refs.paging.reload();
    },

    clear() {
      this.goodsSearchName = '';
      // this.goodsName = '';
      this.reservationSearchNumber = '';
      this.companySearchName = '';
    },
  },
};
</script>
<style lang='scss' scoped>
.statistics-search-box {
  box-sizing: border-box;
  padding: 30rpx 3%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-box {
  box-sizing: border-box;
  width: 34%;
  height: 80rpx;
  background: #f5f5f5;
  justify-content: space-between;
  align-items: center;
  .search-input-box {
    height: 80rpx;
    border-radius: 10rpx;
    border: none;
    flex: 1;
    margin-right: 0;
    padding: 0 20rpx;
  }
}

.enter {
  top: 20rpx;
  right: 10rpx;
}

.statistics-date-picker {
  width: 64%;
  height: 80rpx;
}

.statistics-picker {
  box-sizing: border-box;
  width: 30%;
  height: 80rpx;
  padding: 0 20rpx;
  background: #fff;
  border-radius: 10rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .picker-btn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.inout-modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 101;
}

.inout-modal-box {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0;
  background: #ffffff;
  border-radius: 24rpx 24rpx 0 0;
  z-index: 102;
  overflow: hidden;
  transition: all 0.2s linear;
}

.inout-modal-show {
  // height: 1040rpx;
  height: 540rpx;
}

.inout-modal-box-content {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 40rpx 30rpx 30rpx;
  overflow: hidden;
}

.inout-modal-box-title {
  position: relative;
  text-align: center;
  margin-bottom: 10rpx;
}

.inout-modal-close {
  position: absolute;
  width: 30rpx;
  height: 30rpx;
  right: 0;
  top: 50%;
  background: url("../../../static/manage/close.png");
  background-size: 100% 100%;
  transform: translateY(-50%);
}

.inout-input-box {
  box-sizing: border-box;
  width: 100%;
  background: #f6f6f6;
  height: 70rpx;
  margin: 0 auto 20rpx;
  padding-left: 20rpx;
  border-radius: 10rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inout-search-input {
  box-sizing: border-box;
  width: 100%;
  height: 70rpx;
  font-size: 28rpx;
  line-height: 70rpx;
  padding-left: 10rpx;
  color: #878787;
}

.inout-input-title {
  padding: 20rpx 0;
}

.inout-modal-main {
  height: 400rpx;
  overflow-y: auto;
  &-box {
    padding-top: 20rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }
}

.inout-type-item {
  box-sizing: border-box;
  padding: 0 20rpx;
  width: 48%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background: #f6f6f6;
  border-radius: 8rpx;
  font-size: 28rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 30rpx;
}

.active-type-item {
  color: #3a65ff;
  background: rgba(58, 101, 255, 0.12);
}

.inout-modal-btn-box {
  height: 80rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inout-btn {
  box-sizing: border-box;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 10rpx;
  font-size: 28rpx;
  font-weight: bold;
}

.inout-clear-btn {
  background: #ffffff;
  border: 1rpx solid #3a65ff;
  color: #3a65ff;
  line-height: 78rpx;
  width: 35%;
}

.inout-confirm-btn {
  background: #3A65FF;
  color: #fff;
  width: 60%;
}
</style>
