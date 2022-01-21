<!-- 添加凭证 -->
<template>
  <div class="manage-content">
    <HeaderBar :title="title" @back="back"></HeaderBar>
    <div class="manage-main">
      <div class="manage-box">
        <div class="manage-box-line">
          <div class="manage-title2">货主 <span class="require">*</span></div>
          <picker
            mode="selector"
            :range="tenantList"
            range-key="companyName"
            @change="change($event, 'tenant')"
          >
            <view class="picker-btn" v-if="tenantIndex > -1">
              {{ tenantList[tenantIndex].companyName }}</view
            >
            <view class="picker-btn" v-else> 请选择租户 </view>
          </picker>
        </div>
      </div>
      <div class="building-input-box">
        <div class="building-input-item">
          <div class="building-title1">请选择入场区域</div>
          <div class="placeholder" @click="toChooseBuilding">
            请选择
            <uni-icons type="forward" size="14"></uni-icons>
          </div>
        </div>
        <!-- 显示框 -->
        <div class="building-input-content" v-if="choosedBuilding.length > 0">
          <div
            class="manage-input-content-item"
            v-for="(item, index) in choosedBuilding"
            :key="index"
          >
            {{ item.buildingName }}
            <span class="building-input-delete" @click="deleteItem(index)">
              <uni-icons type="clear" color="red" size="14"></uni-icons>
            </span>
          </div>
        </div>
      </div>
      <div class="manage-box">
        <div class="manage-box-line">
          <div class="manage-title2">
            货品种类 <span class="require">*</span>
          </div>
          <picker
            mode="selector"
            :range="goodsList"
            range-key="goodsName"
            @change="change($event, 'goods')"
          >
            <view class="picker-btn" v-if="goodsIndex > -1">
              {{ goodsList[goodsIndex].goodsName }}</view
            >
            <view class="picker-btn" v-else> 请选择货品种类 </view>
          </picker>
        </div>
        <div class="manage-box-line">
          <div class="manage-title2">吨/方 <span class="require">*</span></div>
          <div class="manage-input-box">
            <input
              class="manage-input"
              type="text"
              placeholder="请输入容量"
              @input="filterInput($event, 'volNums')"
              v-model="volNums"
            />
          </div>
        </div>
      </div>
      <div class="manage-box">
        <div class="manage-box-line">
          <div class="manage-title2">
            生效日期 <span class="require">*</span>
          </div>
          <picker
            mode="date"
            :value="effDate"
            :end="invalidDate"
            @change="changeDate($event, 'effDate')"
          >
            <view class="picker-btn" v-if="effDate"> {{ effDate }}</view>
            <view class="picker-btn" v-else> 请选择生效日期 </view>
          </picker>
        </div>
        <div class="manage-box-line">
          <div class="manage-title2">
            失效日期 <span class="require">*</span>
          </div>
          <picker
            mode="date"
            :value="invalidDate"
            :start="effDate"
            @change="changeDate($event, 'invalidDate')"
          >
            <view class="picker-btn" v-if="invalidDate">
              {{ invalidDate }}</view
            >
            <view class="picker-btn" v-else> 请选择失效日期 </view>
          </picker>
        </div>
        <div class="manage-box-line">
          <div class="manage-title2">车次 <span class="require">*</span></div>
          <div class="manage-input-box">
            <input
              class="manage-input"
              type="text"
              placeholder="请输入车次"
              @input="numberFilter"
              v-model="vehicleNums"
            />
          </div>
        </div>
      </div>
      <div class="building-body-box">
        <div class="building-title1">备注信息</div>
        <div class="textarea-box">
          <textarea
            class="building-remark"
            maxlength="255"
            v-model="remark"
            placeholder="添加备注"
          />
        </div>
      </div>
      <div class="manage-btn-box">
        <div class="manage-btn" @click="submit">保存</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import buildingRequest from "../../../config/buildingRequest";
import formFilter from "../../../utils/filter";
import format from "../../../utils/format";
export default {
  data() {
    return {
      title: "添加凭证",
      jyzCode: "62baa47ae922439fbf3c102774722e40",
      tenantList: [],
      tenantIndex: -1,
      tenantCode: "",
      goodsList: [],
      goodsIndex: -1,
      goodsBigType: "",
      goodsType: "",
      volNums: "", //容积
      effDate: "", //生效日期
      invalidDate: "", //失效日期
      vehicleNums: "", //车次
      remark: "",
      // chooseBuildingList: [],
      temInput: {
        volNums: "",
      },
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

  onLoad() {
    this.$store.commit("getChoosedBuilding", []);
  },

  onShow() {
    this.getTenantInfo();
    this.getGoodsInfo();
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

    //选择入场区域
    toChooseBuilding() {
      uni.navigateTo({
        url: "./buildingList",
      });
    },
    // 删除已选区域
    deleteItem(index) {
      this.$store.commit("deleteBuilding", index);
    },
    //上拉列表选择
    change(e, type) {
      let that = this;
      const changeValue = {
        tenant: () => {
          this.tenantIndex = e.detail.value * 1;
          this.tenantCode = this.tenantList[this.tenantIndex].code;
          console.log(this.tenantCode);
        },
        goods: () => {
          this.goodsIndex = e.detail.value * 1;
          this.goodsType = this.goodsList[this.goodsIndex].goodsType;
          this.goodsBigType = this.goodsList[this.goodsIndex].goodsBigType;
        },
      };
      changeValue[type]();
    },
    //日期选择
    changeDate(e, type) {
      this[type] = e.detail.value;
    },
    //数值输入
    filterInput(e) {
      setTimeout(() => {
        let value = e.detail.value;
        if (value != "" && formFilter.priceFilter(value)) {
          this.temInput.volNums = value;
        } else {
          if (value != "") {
            this.volNums = this.temInput.volNums;
          }
        }
      }, 0);
    },
    numberFilter(e) {
      setTimeout(() => {
        let value = e.detail.value;
        this.vehicleNums = formFilter.numberFilter(value);
      }, 0);
    },
    formValid() {
      if (!this.tenantCode) {
        uni.showToast({
          title: "请选择货主",
          icon: "none",
          duration: 1500,
        });
        return false;
      }
      if (!this.goodsType) {
        uni.showToast({
          title: "请选择货品",
          icon: "none",
          duration: 1500,
        });
        return false;
      }
      if (!this.volNums) {
        uni.showToast({
          title: "请输入货品数量",
          icon: "none",
          duration: 1500,
        });
        return false;
      }
      if (!this.effDate) {
        uni.showToast({
          title: "请选择生效日期",
          icon: "none",
          duration: 1500,
        });
        return false;
      }
      if (!this.invalidDate) {
        uni.showToast({
          title: "请选择失效日期",
          icon: "none",
          duration: 1500,
        });
        return false;
      }
      if (!this.vehicleNums) {
        uni.showToast({
          title: "请输入车次",
          icon: "none",
          duration: 1500,
        });
        return false;
      }
      return true;
    },
    submit() {
      if (!this.formValid()) return;

      let buildingId = "";
      this.choosedBuilding.map((item) => {
        buildingId += item.id + ",";
      });
      buildingId = buildingId.slice(0, -1);
      let data = {
        jyzCode: this.jyzCode,
        effectiveDate: this.effDate,
        expirationDate: this.invalidDate,
        goodsType: this.goodsType,
        goodsBigType: this.goodsBigType,
        buildingId: buildingId,
        tenantCode: this.tenantCode,
        reserveNumber: this.vehicleNums,
        number: this.volNums,
        remark: this.remark,
      };
      console.log("添加凭证参数", data);
      const config = {
        url: "addCertify",
        method: "POST",
        header: this.headerInfo,
        data: data,
      };
      buildingRequest(config).then((res) => {
        console.log("添加凭证", res);
        uni.showModal({
          title: "提示",
          content: res.msg,
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              //点击确认
              uni.navigateBack({
                delta: 1,
              });
            }
          },
        });
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.manage-main {
  padding: 30rpx 0 120rpx;
  overflow-y: auto;
}

.manage-btn-box {
  justify-content: center;
}

.manage-box-line {
  height: 80rpx;
}

.building-body-box,
.building-input-box {
  width: 92%;
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
.manage-btn-box {
  justify-content: center;
}

.manage-btn {
  width: 100%;
}
</style>