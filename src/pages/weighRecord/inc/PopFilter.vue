<template>
  <view>
    <scroll-view scroll-y="true" style="max-height: 520px">
      <!-- 选择筛选 -->
      <view
        class="pop-filter"
        v-show="!isShowMoreCompany && !isShowMoretransportPlan"
      >
        <view class="pop-filter-title">
          <view class="pop-filter-title-inner">
            <text>选择筛选条件</text>
            <i class="icon-close" @click="closePopFilter()"></i>
          </view>
        </view>
        <view class="pop-filter-content">
          <view class="form-group">
            <!-- 过磅类型 -->
            <view class="form-item">
              <view class="form-label">过磅类型</view>
              <view class="form-cont">
                <view class="radio-group">
                  <view
                    class="item-radio"
                    :class="{ active: filterForm.weighingType == item.id }"
                    :data-value="item.id"
                    data-formName="weighingType"
                    v-for="item in weighTypeList"
                    :key="item.id"
                    @click="onChangeFilterForm(item.id, 'weighingType')"
                    >{{ item.name }}</view
                  >
                </view>
              </view>
            </view>
            <!-- 收发企业 -->
            <view class="form-item">
              <view class="form-label">
                <text>收发企业</text>
                <text class="more" @click="isShowMoreCompany = true"
                  >更多企业</text
                >
              </view>
              <view class="form-cont">
                <view class="radio-group">
                  <view
                    class="item-radio fill"
                    :class="{ active: filterForm.compnayInfoId == item.id }"
                    :data-value="item.id"
                    data-formName="compnayInfoId"
                    v-for="item in companyListNew"
                    :key="item.id"
                    @click="onChangeFilterForm(item.id, 'compnayInfoId')"
                    >{{ item.companyName }}</view
                  >
                </view>
              </view>
            </view>
            <!-- 运输计划 -->
            <view class="form-item">
              <view class="form-label">
                <text>运输计划</text>
                <text class="more" @click="isShowMoretransportPlan = true"
                  >更多运输计划</text
                >
              </view>
              <view class="form-cont">
                <view class="radio-group">
                  <view
                    class="item-radio fill"
                    :class="{
                      active:
                        filterForm.orderPlanInfoCode == item.orderPlanCode,
                    }"
                    :data-value="item.orderPlanCode"
                    data-formName="orderPlanInfoCode"
                    v-for="item in orderPlanListNew"
                    :key="item.orderPlanCode"
                    @click="
                      onChangeFilterForm(
                        item.orderPlanCode,
                        'orderPlanInfoCode'
                      )
                    "
                    >{{ item.name }}</view
                  >
                </view>
              </view>
            </view>
            <!-- 地磅 -->
            <view class="form-item">
              <view class="form-label">
                <text>地磅</text>
              </view>
              <view class="form-cont">
                <view class="radio-group">
                  <view
                    class="item-radio"
                    :class="{ active: filterForm.deviceCode == item.deviceNo }"
                    :data-value="item.deviceNo"
                    data-formName="deviceNo"
                    v-for="item in weighbridgeList"
                    :key="item.deviceNo"
                    @click="onChangeFilterForm(item.deviceNo, 'deviceCode')"
                    >{{ item.buildingName }}</view
                  >
                </view>
              </view>
            </view>
            <!-- 称重状况 -->
            <view class="form-item">
              <view class="form-label">
                <text>称重状况</text>
              </view>
              <view class="form-cont">
                <view class="radio-group">
                  <view
                    class="item-radio"
                    :class="{ active: filterForm.completeFlag === item.id }"
                    :data-value="item.id"
                    data-formName="completeFlag"
                    v-for="item in weighStatusList"
                    :key="item.id"
                    @click="onChangeFilterForm(item.id, 'completeFlag')"
                    >{{ item.name }}</view
                  >
                </view>
              </view>
            </view>
          </view>
          <view class="btn-group">
            <view class="btn btn-cancel" @click="clearAllFormData">清空</view>
            <view class="btn btn-comfirm" @click="comfirm">确定</view>
          </view>
        </view>
      </view>
      <!-- 更多收发企业 -->
      <view class="pop-filter-company" v-show="isShowMoreCompany">
        <view class="pop-filter-company-title">
          <i class="icon-back" @click="isShowMoreCompany = false"></i>
          <text>收发企业</text>
        </view>
        <view class="pop-filter-company-content">
          <input
            type="text"
            placeholder="输入企业名称"
            class="input-search"
            v-model="searchCompanyName"
          />
          <view class="list-company">
            <scroll-view
              :scroll-top="scrollTop"
              scroll-y="true"
              class="scroll-Y"
            >
              <view class="radio-group">
                <view
                  class="item-radio fill"
                  :class="{ active: filterForm.compnayInfoId == item.id }"
                  :data-value="item.id"
                  data-formName="compnayInfoId"
                  v-for="item in companyListFiltter"
                  :key="item.id"
                  @click="onChangeFilterForm(item.id, 'compnayInfoId')"
                  >{{ item.companyName }}</view
                >
              </view>
            </scroll-view>
          </view>
          <view class="btn-group">
            <view class="btn-primary" @click="doComfirmCompany">确定</view>
          </view>
        </view>
      </view>
      <!-- 更多运输计划 -->
      <view class="pop-filter-company" v-show="isShowMoretransportPlan">
        <view class="pop-filter-company-title">
          <i class="icon-back" @click="isShowMoretransportPlan = false"></i>
          <text>运输计划</text>
        </view>
        <view class="pop-filter-company-content">
          <input
            type="text"
            placeholder="输入运输计划名称"
            class="input-search"
            v-model="searchOrderPlan"
          />
          <view class="list-company">
            <scroll-view
              :scroll-top="scrollTop"
              scroll-y="true"
              class="scroll-Y"
            >
              <view class="radio-group">
                <view
                  class="item-radio fill"
                  :class="{
                    active: filterForm.orderPlanInfoCode == item.orderPlanCode,
                  }"
                  :data-value="item.orderPlanCode"
                  data-formName="orderPlanInfoCode"
                  v-for="item in orderPlanListFiltter"
                  :key="item.orderPlanCode"
                  @click="
                    onChangeFilterForm(item.orderPlanCode, 'orderPlanInfoCode')
                  "
                  >{{ item.name }}</view
                >
              </view>
            </scroll-view>
          </view>
          <view class="btn-group">
            <view class="btn-primary" @click="doComfirmTransportPlan"
              >确定</view
            >
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: "PopFilter",
  props: {
    filterForm: {
      type: Object,
      default: () => {
        return {
          weighingType: "",
          compnayInfoId: "", // 收发企业
          orderPlanInfoCode: "", // 运输计划
          completeFlag: "", // 称重状况
          deviceCode: "",
        };
      },
    },
    weighTypeList: {
      // 过磅类型（皮重过磅、毛重过磅）
      type: Array,
      default: () => [],
    },
    companyList: {
      // 收发企业
      type: Array,
      default: [],
    },
    orderPlanList: {
      // 运输计划
      type: Array,
      default: [],
    },
    weighbridgeList: {
      // 地磅列表
      type: Array,
      default: [],
    },
    weighStatusList: {
      // 称重状况（已完成、未完成）
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      scrollTop: 0,
      isShowMoreCompany: false, // 是否显示更多收发企业
      isShowMoretransportPlan: false, // 是否显示更多运输计划
      searchOrderPlan: "", // 实时搜索运输计划
      searchCompanyName: "", // 实时搜索企业名称
    };
  },
  methods: {
    closePopFilter() {
      this.$emit("closePopFilter");
    },
    /**
     * 选择类型
     */
    onChangeFilterForm(value, formName) {
      console.log(111);
      if (formName) {
        if (this.filterForm[formName] === value) {
          this.filterForm[formName] = "";
        } else {
          this.filterForm[formName] = value;
        }
      }
    },
    /**
     * 清空
     */
    clearAllFormData() {
      this.$emit("clearAllFormData");
    },
    /**
     * 确定操作
     */
    comfirm() {
      this.$emit("input", this.filterForm);
      this.$emit("doFilter");
    },
    /**
     * 确定选择的收发企业
     */
    doComfirmCompany() {
      this.isShowMoreCompany = !this.isShowMoreCompany;
      this.searchCompanyName = "";
    },
    /**
     * 确定选择的收发企业
     */
    doComfirmTransportPlan() {
      this.isShowMoretransportPlan = !this.isShowMoretransportPlan;
      this.searchOrderPlan = "";
    },
  },
  computed: {
    companyListNew() {
      const { companyList } = this;
      const len =
        companyList && companyList.length >= 3 ? 3 : companyList.length;
      return companyList.slice(0, len);
    },
    orderPlanListNew() {
      const { orderPlanList } = this;
      const len =
        orderPlanList && orderPlanList.length >= 3 ? 3 : orderPlanList.length;
      return orderPlanList.slice(0, len);
    },
    /**
     * 根据实时搜索框返回最终更多运输计划列表
     */
    orderPlanListFiltter() {
      const { searchOrderPlan, orderPlanList } = this;
      let orderPlanListFiltter;
      if (orderPlanList && orderPlanList.length > 0) {
        orderPlanListFiltter = orderPlanList.filter(
          (item) => item.name.indexOf(searchOrderPlan) !== -1
        );
      }
      return orderPlanListFiltter;
    },
    /**
     * 根据实时搜索框返回最终更多收发企业列表
     */
    companyListFiltter() {
      const { searchCompanyName, companyList } = this;
      let companyListFiltter;
      if (companyList && companyList.length > 0) {
        companyListFiltter = companyList.filter(
          (item) => item.companyName.indexOf(searchCompanyName) !== -1
        );
      }
      return companyListFiltter;
    },
  },
};
</script>

<style lang="scss" scoped>
// Color Palette
$gray-1: #333;
$gray-2: #878787;
// Component Colors
$text-color: $gray-1;
$label-color: $gray-2;
.radio-group {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15upx;
  .item-radio {
    height: 70upx;
    line-height: 70upx;
    font-size: 29upx;
    color: $text-color;
    padding: 0 28upx;
    border-radius: 6upx;
    margin: 0 15upx 15upx;
    background-color: rgba($color: #ccc, $alpha: 0.18);
    &.active {
      background-color: rgba($color: #3a65ff, $alpha: 0.12);
      color: #3a65ff;
      font-weight: bold;
    }
    &.fill {
      width: 100%;
    }
  }
}
.pop-filter {
  background-color: #fff;
  border-radius: 25upx 25upx 0rem 0rem;
  padding: 40upx 36upx;
  &-title {
    text-align: center;
    font-size: 33upx;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 0 36upx;
    background-color: #fff;
    height: 80upx;
    line-height: 80upx;
    z-index: 9999;
    &-inner {
      position: relative;
      width: 100%;
    }
    .icon-close {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 32upx;
      height: 32upx;
      background: url(@/static/weighRecord/icon_close.png) no-repeat;
      background-size: contain;
      display: block;
    }
  }
  &-content {
    margin-top: 42upx;
  }
  .form-group {
    .form-item {
      margin-bottom: 30upx;
      .form-label {
        position: relative;
        margin-bottom: 25upx;
        .more {
          position: absolute;
          right: 0;
          top: 0;
          font-size: 29upx;
          color: $label-color;
          display: flex;
          align-items: center;
          &::after {
            content: "";
            display: block;
            width: 18upx;
            height: 26upx;
            background: url(@/static/weighRecord/arrow_left.png) no-repeat;
            background-size: contain;
            margin-left: 15upx;
          }
        }
      }
    }
  }
  .btn-group {
    display: flex;
    justify-content: space-between;
    margin: 50upx -15upx 0;
    .btn {
      height: 80upx;
      border-radius: 10upx;
      border: solid 1upx #3a65ff;
      margin: 0 15upx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30upx;
      &.btn-cancel {
        color: #3a65ff;
        background-color: #fff;
        width: 350upx;
      }
      &.btn-comfirm {
        color: #fff;
        background-color: #3a65ff;
        width: 350upx;
      }
    }
  }
}
.pop-filter-company {
  background-color: #fff;
  border-radius: 25upx 25upx 0rem 0rem;
  padding: 40upx 36upx;
  &-title {
    text-align: center;
    font-size: 33upx;
    position: relative;
    margin-bottom: 30upx;
    font-weight: bold;
    .icon-back {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 32upx;
      height: 32upx;
      background: url(@/static/weighRecord/icon_back.png) no-repeat;
      background-size: contain;
      display: block;
    }
  }
  &-content {
    overflow: hidden;
    .input-search {
      height: 72upx;
      background-color: #f5f5f5;
      border-radius: 10upx;
      width: 100%;
      padding: 0 16upx;
      font-size: 28upx;
      ::v-deep .uni-input-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
        &::before {
          content: "";
          display: block;
          width: 32upx;
          height: 32upx;
          background: url(@/static/weighRecord/icon_search.png) no-repeat;
          background-size: contain;
          margin-right: 10upx;
        }
        .uni-input-placeholder {
          left: 42upx;
          width: calc(100% - 42upx);
        }
      }
    }
    .list-company {
      margin-top: 35upx;
      height: 600upx;
      overflow: hidden;
      overflow-y: scroll;
      .scroll-Y {
        height: 100%;
      }
    }
    .btn-group {
      margin-top: 20upx;
      background-color: #fff;
    }
    .btn-primary {
      height: 80upx;
      background-color: #3a65ff;
      border-radius: 10upx;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30upx;
    }
  }
}
</style>