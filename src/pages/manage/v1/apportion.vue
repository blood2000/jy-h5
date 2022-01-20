<!-- 派号 -->
<template>
  <div class="manage-content">
    <HeaderBar :title="title" @back="back"></HeaderBar>

    <div class="manage-main">
      <div class="manage-expand">
        <div class="calendar-box" :class="isExpand ? 'expand' : ''">
          <uni-calendar
            v-if="isExpand"
            :date="choiceDate"
            :insert="true"
            :lunar="true"
            :startDate="startDate"
            :endDate="endDate"
            @change="changeDate"
          />
        </div>
        <div class="manage-expand-splite" @click="expandCalendar">
          <uni-icons type="bottom" size="16" v-show="!isExpand"></uni-icons>
          <uni-icons type="top" size="16" v-show="isExpand"></uni-icons>
        </div>
        <div class="manage-expand-line">
          <div class="manage-expand-curdate">当前日期</div>
          <div>{{ choiceDate }}</div>
        </div>
        <div class="manage-expand-line-bg">
          <div class="manage-expand-item">
            <uni-icons
              type="wallet-filled"
              color="#3a65ff"
              size="18"
            ></uni-icons>
            <div class="manage-expand-item manage-ml">
              <div class="manage-title4">总票数</div>
              <div class="manage-expand-item-value">{{ reserveNums }}</div>
            </div>
          </div>
          <div class="manage-expand-item">
            <div class="manage-title4">剩余票数</div>
            <div class="manage-expand-item-value">144</div>
          </div>
        </div>
      </div>
      <div
        class="manage-box"
        v-for="(item, index) in dispatchList"
        :key="index"
      >
        <div class="manage-box-title">
          <div class="manage-box-title-item">
            <div class="manage-title2">凭证信息 ({{ index * 1 + 1 }})</div>
          </div>
          <div class="manage-delete-box" @click="deleteTime(index)">
            <uni-icons type="trash" size="15" color="#F95757"></uni-icons>
            <div>删除</div>
          </div>
        </div>
        <div class="manage-box-line">
          <div class="manage-title2">货主 <span class="require">*</span></div>
          <picker
            mode="selector"
            :range="tenantList"
            range-key="companyName"
            @change="change($event, 'tenant', index)"
          >
            <view class="picker-btn" v-if="item.tenantIndex > -1">
              {{ tenantList[item.tenantIndex].companyName }}</view
            >
            <view class="picker-btn" v-else>
              请选择货主名称
              <uni-icons type="forward" size="14"></uni-icons>
            </view>
          </picker>
        </div>
        <div class="manage-box-line">
          <div class="manage-title2">
            货品种类 <span class="require">*</span>
          </div>
          <picker
            mode="selector"
            :range="goodsList"
            range-key="goodsName"
            @change="change($event, 'goods', index)"
          >
            <view class="picker-btn" v-if="item.goodsIndex > -1">
              {{ goodsList[item.goodsIndex].goodsName }}</view
            >
            <view class="picker-btn" v-else>
              请选择货品种类
              <uni-icons type="forward" size="14"></uni-icons>
            </view>
          </picker>
        </div>
        <div class="building-input-item">
          <div class="building-title1">请选择入场区域</div>
          <div class="placeholder" @click="toChooseBuilding(index)">
            请选择
            <uni-icons type="forward" size="14"></uni-icons>
          </div>
        </div>
        <!-- 显示框 -->
        <div
          class="building-input-content"
          v-if="item.choosedBuilding.length > 0"
        >
          <div
            class="manage-input-content-item"
            v-for="(itm, idx) in item.choosedBuilding"
            :key="idx"
          >
            {{ itm.buildingName }}
            <span class="building-input-delete" @click="deleteItem(idx)">
              <uni-icons type="clear" color="red" size="14"></uni-icons>
            </span>
          </div>
        </div>
        <div class="manage-box-line">
          <div class="manage-title2">车次 <span class="require">*</span></div>
          <div class="manage-input-box">
            <input
              class="manage-input"
              type="number"
              placeholder="请输入车次"
              v-model="item.vehicleNums"
            />
          </div>
        </div>
      </div>

      <div class="add-time" @click="addCertify">新增凭证</div>
    </div>
    <div class="manage-btn-box">
      <div class="manage-btn manage-btn-confirm" @click="submit">保存</div>
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
      title: "派号",
      code: "",
      reserveNums: "",
      choiceDate: "",
      startDate: "",
      endDate: "",
      ruleExcludeDates: [], //排除日期
      isExpand: false,
      jyzCode: "62baa47ae922439fbf3c102774722e40",
      tenantList: [],
      goodsList: [],
      // goodsBigType: "",
      dispatchList: [],
      curIndex: 0,
    };
  },

  components: { HeaderBar },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
      choosedBuilding: (state) => state.manage.choosedBuilding,
    }),
  },

  onLoad(option) {
    let params = JSON.parse(option.params);
    this.code = params.code;
    this.choiceDate = params.choiceDate;
    this.reserveNums = params.reserveNums;
    console.log(params);
    this.$store.commit("getChoosedBuilding", []);
    this.getTenantInfo();
    this.getGoodsInfo();
    this.getDispatch();
  },

  onShow() {
    console.log(this.choosedBuilding);
    if (this.dispatchList.length > 0) {
      this.dispatchList[this.curIndex].choosedBuilding = this.choosedBuilding;
      // this.$set(this.dispatchList, this.curIndex, this.dispatchList[this.curIndex]);
      console.log(this.dispatchList);
    }
  },

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    getTenantInfo() {
      const config = {
        url: "getTenantInfo",
        header: this.headerInfo,
        querys: {
          jyzCode: "03520ce23946491fbe3eb689e60cfc66",
        },
      };
      buildingRequest(config).then((res) => {
        console.log("租户列表", res);
        this.tenantList = res.data;
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
    getDispatch() {
      const config = {
        url: "getDispatch",
        header: this.headerInfo,
        querys: {
          code: this.code,
          choiceDate: this.choiceDate,
        },
      };
      buildingRequest(config).then((res) => {
        console.log("获取派号信息", res);
        this.startDate = res.data.effectiveDate;
        this.endDate = res.data.expirationDate;
        this.ruleExcludeDates = res.data.ruleExcludeDates;
        this.dispatchList = res.data.subscribeRuleVoucherVos;
        this.dispatchList.map((item) => {
          item.tenantIndex = -1;
          item.tenantCode = "";
          item.goodsIndex = -1;
        });
      });
    },
    expandCalendar() {
      this.isExpand = !this.isExpand;
    },
    changeDate(e) {
      console.log("日历", e);
      let leap = true;
      this.choiceDate = e.fulldate;
      this.ruleExcludeDates.map((item) => {
        if (this.choiceDate === item.excludeDate) {
          leap = false;
        }
      });
      if (leap) {
        this.getDispatch();
      } else {
        uni.showToast({
          title: "排除日期无派号记录!",
          icon: "none",
          duration: 1500,
        });
      }
    },
    //上拉列表选择
    change(e, type, index) {
      let that = this;
      let item = this.dispatchList[index];
      const changeValue = {
        tenant: () => {
          item.tenantIndex = e.detail.value * 1;
          item.tenantCode = this.tenantList[item.tenantIndex].code;
        },
        goods: () => {
          item.goodsIndex = e.detail.value * 1;
          item.goodsType = this.goodsList[item.goodsIndex].goodsType;
          item.goodsBigType = this.goodsList[item.goodsIndex].goodsBigType;
        },
      };
      changeValue[type]();
    },
    //选择入场区域
    toChooseBuilding(index) {
      this.curIndex = index;
      this.$store.commit(
        "getChoosedBuilding",
        this.dispatchList[this.curIndex].choosedBuilding
      );
      uni.navigateTo({
        url: "./buildingList",
      });
    },

    numberFilter(e, index) {
      setTimeout(() => {
        let value = e.detail.value;
        this.dispatchList[index].vehicleNums = formFilter.numberFilter(value);
      }, 0);
    },
    addCertify() {
      let obj = {
        tenantIndex: -1,
        tenantCode: "",
        goodsIndex: -1,
        goodsType: "",
        choosedBuilding: [],
        vehicleNums: "",
      };
      this.dispatchList.push(obj);
    },

    formValid() {
      if (this.dispatchList.length === 0) {
        uni.showToast({
          title: "请添加凭证",
          icon: "none",
          duration: 1500,
        });
        return false;
      }
      let leap = true;
      for (let i = 0; i < this.dispatchList.length; i++) {
        // || !this.dispatchList[i].goodsType || this.dispatchList[i].choosedBuilding
        if (!this.dispatchList[i].tenantCode) {
          leap = false;
          uni.showToast({
            title: "请选择货主名称",
            icon: "none",
            duration: 1500,
          });
          break;
        }
        if (!this.dispatchList[i].goodsType) {
          leap = false;
          uni.showToast({
            title: "请选择商品类型",
            icon: "none",
            duration: 1500,
          });
          break;
        }
        if (this.dispatchList[i].choosedBuilding.length === 0) {
          leap = false;
          uni.showToast({
            title: "请选择入场区域",
            icon: "none",
            duration: 1500,
          });
          break;
        }
        if (!this.dispatchList[i].vehicleNums) {
          leap = false;
          uni.showToast({
            title: "请输入车次",
            icon: "none",
            duration: 1500,
          });
          break;
        }
      }
      return leap;
    },

    submit() {
      if (!this.formValid()) return;
      let data = {
        
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.manage-main {
  padding: 0 0 120rpx;
  overflow-y: auto;
}
.manage-btn-confirm {
  width: 100%;
}

.manage-delete-box {
  width: 150rpx;
}

.manage-box-line {
  height: 100rpx;
}
.building-input-item {
  height: 100rpx;
}
.building-input-content {
  border-bottom: 1rpx solid #ebebeb;
}

.manage-input-content-item {
  position: relative;
  padding: 0 20rpx;
  height: 60rpx;
  margin: 0 1% 20rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 10rpx;
  color: #fff;
  background: #3a65ff;
  .building-input-delete {
    position: absolute;
    top: -4px;
    right: -5px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    text-align: center;
    line-height: 30rpx;
    background: #fff;
  }
}
</style>