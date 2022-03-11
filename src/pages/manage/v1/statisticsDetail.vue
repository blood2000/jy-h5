<!-- 统计详情 -->
<template>
  <div class="manage-content">
    <HeaderBar :title="title" @back="back"></HeaderBar>
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
      <!-- v-if="this.type !== 'goods'" -->
      <div class="search-box" >
        <div class="search-input-box">
          <input
            class="search-input"
            :placeholder="placeholder"
            confirm-type="search"
            @confirm="search"
            type="text"
            v-model="searchKey"
          />
          <!-- <view class="enter" @click="search"></view> -->
        </div>
      </div>
      <!-- 商品类型 -->
      <!-- <div class="statistics-picker" v-else>
        <picker
          mode="selector"
          :range="goodsList"
          range-key="goodsName"
          @change="changeGoods"
        >
          <view class="picker-btn" v-if="goodsIndex > -1">
            {{ goodsList[goodsIndex].goodsName }}</view
          >
          <view class="picker-btn" v-else>
            商品选择
            <uni-icons type="bottom" size="12"></uni-icons>
          </view>
        </picker>
        <uni-icons
          type="closeempty"
          v-if="goodsIndex > -1"
          size="12"
          @click="clearGoods"
        ></uni-icons>
      </div> -->
    </div>
    <div class="manage-main">
      <z-paging
        ref="paging"
        v-model="statisticsData"
        @query="search"
        :fixed="false"
        :loading-more-enabled="false"
        :hide-empty-view="true"
        :auto="true"
        :show-loading-more-no-more-line="false"
      >
        <div v-if="statisticsData.length === 0" class="no-data">暂无记录</div>
        <div
          class="statistics-detail-card"
          v-for="(item, index) in statisticsData"
          :key="index"
        >
          <div
            class="
              statistics-detail-card-title
              manage-title2
              statistics-shipper
            "
            v-if="type === 'shipper'"
          >
            {{ item.companyName }}
          </div>
          <div
            class="statistics-detail-card-title manage-title2 statistics-goods"
            v-if="type === 'goods'"
          >
            {{ item.goodsName }}
          </div>
          <div
            class="
              statistics-detail-card-title
              manage-title2
              statistics-vehicle
            "
            v-if="type === 'vehicle'"
          >
            {{ item.licenseNumber }}({{ item.nickName }})
          </div>
          <div class="statistics-detail-card-main">
            <div class="statistics-detail-card-main-item">
              <div class="statistics-detail-name">已预约</div>
              <div class="statistics-detail-value manage-title3">
                {{ item.reservedCount || 0 | priceFormat }}
              </div>
            </div>
            <div class="statistics-detail-card-main-item">
              <div class="statistics-detail-name">已入场</div>
              <div class="statistics-detail-value manage-title3">
                {{ item.enteredCount || 0 | priceFormat }}
              </div>
            </div>
            <div class="statistics-detail-card-main-item">
              <div class="statistics-detail-name">已出场</div>
              <div class="statistics-detail-value manage-title3">
                {{ item.alreadyAppearedCount || 0 | priceFormat }}
              </div>
            </div>
          </div>
        </div>
      </z-paging>
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
export default {
  mixins: [ZPagingMixin], // 使用mixin
  data() {
    return {
      title: "",
      placeholder: "",
      searchKey: "",
      dateRange: [],
      jyzCode: "",
      type: "", //统计类型
      statisticsData: [],
      goodsList: [],
      goodsIndex: -1,
      goodsName: "",
    };
  },

  components: { HeaderBar },

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
    this.type = params.type;
    switch (this.type) {
      case "shipper":
        this.title = "货主统计";
        this.placeholder = "公司名称";
        break;
      case "goods":
        this.title = "货品统计";
        this.placeholder = "货品名称";
        // this.getGoodsInfo();
        break;
      case "vehicle":
        this.title = "车次统计";
        this.placeholder = "车牌号/司机";
        break;
    }
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
      });
    },
    dateChange(e) {
      // console.log(e);
      this.dateRange = e;
      this.$refs.paging.reload();
      // this.search();
    },
    changeGoods(e) {
      this.goodsIndex = e.detail.value * 1;
      this.goodsName = this.goodsList[this.goodsIndex].goodsName;
      this.$refs.paging.reload();
    },
    clearGoods() {
      this.goodsIndex = -1;
      this.goodsName = "";
      this.$refs.paging.reload();
    },
    search() {
      console.log(this.dateRange, this.searchKey);
      switch (this.type) {
        case "shipper":
          this.getShipper();
          break;
        case "goods":
          this.getGoods();
          break;
        case "vehicle":
          this.getVehicle();
          break;
        // default:
        //   break;
      }
    },
    //货主统计请求
    getShipper() {
      let data = {
        jyzCode: this.jyzCode,
        bigCreateTime: this.dateRange[0],
        endCreateTime: this.dateRange[1],
        companyName: this.searchKey,
      };
      const config = {
        url: "getShipperInfo",
        header: this.headerInfo,
        querys: data,
      };
      buildingRequest(config).then((res) => {
        console.log("货主统计", res);
        this.$refs.paging.complete(res.data);
      });
    },
    //货品统计请求
    getGoods() {
      let data = {
        jyzCode: this.jyzCode,
        bigCreateTime: this.dateRange[0],
        endCreateTime: this.dateRange[1],
        // goodsName: this.goodsName,
        goodsName: this.searchKey,
      };
      const config = {
        url: "getGoodsStatistics",
        header: this.headerInfo,
        querys: data,
      };
      buildingRequest(config).then((res) => {
        console.log("货品统计", res);
        this.$refs.paging.complete(res.data);
      });
    },
    //车次统计
    getVehicle() {
      let data = {
        jyzCode: this.jyzCode,
        bigCreateTime: this.dateRange[0],
        endCreateTime: this.dateRange[1],
        keyWord: this.searchKey,
      };
      const config = {
        url: "getVehicleStatistics",
        header: this.headerInfo,
        querys: data,
      };
      buildingRequest(config).then((res) => {
        console.log("车次统计", res);
        this.$refs.paging.complete(res.data);
      });
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

.statistics-detail-card {
  box-sizing: border-box;
  width: 94%;
  // height: 200rpx;
  background: #ffffff;
  border-radius: 20rpx;
  margin: 4rpx auto 30rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 10rpx 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  &-title {
    height: 60rpx;
    line-height: 60rpx;
    padding-left: 60rpx;
  }
  &-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10rpx 20rpx;
    &-item {
      width: 30%;
      height: 80rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
}

.statistics-detail-name {
  font-size: 24rpx;
  color: #878787;
  margin-bottom: 10rpx;
}

.statistics-shipper {
  background: url("../../../static/manage/statistics-shipper.png") no-repeat;
  background-size: 46rpx 46rpx;
  background-position: left center;
}

.statistics-goods {
  background: url("../../../static/manage/statistics-goods.png") no-repeat;
  background-size: 46rpx 46rpx;
  background-position: left center;
}

.statistics-vehicle {
  background: url("../../../static/manage/statistics-vehicle.png") no-repeat;
  background-size: 46rpx 46rpx;
  background-position: left center;
}
</style>
<style >
>>> .statistics-picker uni-picker {
  width: 100%;
}
</style>