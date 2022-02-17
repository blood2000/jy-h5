<!-- 调号 -->
<template>
  <div class="manage-content">
    <HeaderBar :title="title" @back="back" :barStyle="barStyle"></HeaderBar>
    <div class="manage-dispatch-header">
      <div class="manage-box">
        <div class="card-line">
          <div class="manage-title3">{{ detail.jyzName }}</div>
        </div>
        <div class="dispatch-split-line"></div>
        <div class="dispatch-box">
          <div class="dispatch-box-line">
            <div class="dispatch-box-line-name">货品类型:</div>
            <div class="manage-title1">{{ detail.goodsName }}</div>
          </div>
          <div class="dispatch-box-line">
            <div class="dispatch-box-line-name">有效日期:</div>
            <div class="manage-title1">
              {{ detail.effectiveDate }} 至 {{ detail.expirationDate }}
            </div>
          </div>
          <div class="dispatch-box-line">
            <div class="dispatch-box-line-name">总车次:</div>
            <div class="manage-title1">{{ detail.reserveNumber }}</div>
          </div>
          <div class="dispatch-box-line">
            <div class="dispatch-box-line-name">剩余车次:</div>
            <div class="manage-title1">{{ restNumber }}</div>
          </div>
          <div class="dispatch-box-line">
            <div class="dispatch-box-line-name">联系人:</div>
            <div class="manage-title1">
              {{ detail.adminName }}({{ detail.adminPhonenumber }})
            </div>
          </div>
        </div>
        <div class="dispatch-split-line"></div>
        <div class="dispatch-box dispatch-bottom-box">
          <div class="manage-expand-line-bg">
            <div class="manage-expand-item">
              <uni-icons
                type="wallet-filled"
                color="#3a65ff"
                size="18"
              ></uni-icons>
              <div class="manage-expand-item manage-ml">
                <div class="manage-title4">预约总量</div>
                <div class="manage-expand-item-value">
                  {{ detail.useNumber }}
                </div>
              </div>
            </div>
            <div class="manage-expand-item">
              <div class="manage-title4">入场车次</div>
              <div class="manage-expand-item-value">
                {{ detail.admissionNumber }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="manage-main">
      <div class="dispatch-main-title">调号面板</div>
      <div class="card-line">
        <div class="card-line-item card-line-item1">
          <div
            :class="arrangeMode === 0 ? 'card-item-active' : ''"
            @click="switchType('plus')"
          >
            加号
          </div>
          <div
            :class="arrangeMode === 1 ? 'card-item-active' : ''"
            @click="switchType('minus')"
          >
            减号
          </div>
        </div>
        <div class="card-line-item">
          <div class="manage-number-box">
            <div class="manage-number-minus" @click="minus">
              <span></span>
            </div>
            <!-- <div class="manage-number-text">{{ changeNums }}</div> -->
            <div class="manage-number-input">
              <input
                class="manage-input"
                type="number"
                
                @input="numberFilter"
                v-model="changeNums"
              />
            </div>
            <div class="manage-number-plus" @click="plus">
              <uni-icons
                type="plus-filled"
                size="24"
                color="#3a65ff"
              ></uni-icons>
            </div>
          </div>
        </div>
        <div class="dispatch-bottom-line"></div>
      </div>
      <div class="building-body-box">
        <div class="building-title1">调号原因</div>
        <div class="textarea-box">
          <textarea
            class="building-remark"
            maxlength="255"
            v-model="detail.remark"
            placeholder="调号原因"
          />
        </div>
      </div>
    </div>
    <div class="manage-btn-box">
      <div class="manage-btn" @click="submit">保存</div>
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
      title: "调号",
      barStyle: {
        background: "#3a65ff",
        color: "#fff",
      },
      code: "",
      jyzCode: "",
      detail: {},
      changeNums: 0,
      arrangeMode: 0, //0: +, 1: -
      showPrompt: true,
    };
  },

  components: { HeaderBar },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
      isFresh: (state) => state.manage.isFresh,
      // choosedBuilding: (state) => state.manage.choosedBuilding,
    }),
    restNumber() {
      return this.detail.reserveNumber - this.detail.useNumber;
    },
  },

  onLoad(option) {
    this.code = option.code;
    console.log(option);
    this.jyzCode = uni.getStorageSync("jyzCode");
    this.getDetail();
  },

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    getDetail() {
      const config = {
        url: "getCertifyDetail",
        header: this.headerInfo,
        querys: {
          code: this.code,
        },
      };
      buildingRequest(config).then((res) => {
        console.log("获取凭证详情", res);
        if (res.code === 200) {
          this.detail = res.data;
        }
      });
    },
    switchType(type) {
      this.showPrompt = true;
      if (type === "minus") {
        this.arrangeMode = 1;
        if (this.changeNums > this.restNumber) {
          this.changeNums = this.restNumber;
          uni.showToast({
            title: "减号不能超出剩余车次!",
            icon: "none",
            duration: 1500,
          });
        }
      } else {
        this.arrangeMode = 0;
      }
    },
    numberFilter(e) {
      setTimeout(() => {
        let value = e.detail.value;
        this.changeNums = formFilter.numberFilter(value);
        if (this.changeNums > this.restNumber && this.arrangeMode === 1) {
          this.changeNums = this.restNumber;
        }
      }, 0);
    },
    plus() {
      if (!this.showPrompt) return;
      if (this.arrangeMode === 0 || this.changeNums < this.restNumber) {
        this.changeNums++;
      }
      if (this.arrangeMode === 1 && this.changeNums === this.restNumber) {
        uni.showToast({
          title: "减号不能超出剩余车次!",
          icon: "none",
          duration: 1500,
        });
        this.showPrompt = false;
        setTimeout(() => {
          this.showPrompt = true;
        }, 1500);
      }
    },
    minus() {
      this.showPrompt = true;
      if (this.changeNums > 0) {
        this.changeNums--;
      }
    },
    submit() {
      if (!this.detail.remark) {
        uni.showToast({
          title: "请输入调号原因",
          icon: "none",
          duration: 1500,
        });
        return;
      }
      let data = {
        id: this.detail.id,
        reserveNumber: this.changeNums,
        remark: this.detail.remark,
        arrangeMode: this.arrangeMode,
        code: this.code,
      };
      console.log(data);
      const config = {
        url: "adjust",
        method: "PUT",
        header: this.headerInfo,
        data: data,
      };
      buildingRequest(config).then((res) => {
        console.log("调整车次", res);
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
              this.$store.commit("setFresh", true);
            }
          },
        });
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.manage-box {
  padding: 0 0 30rpx;
  overflow: hidden;
}

.manage-main {
  background: #fff;
  padding-bottom: 120rpx;
  overflow-y: auto;
}
.manage-dispatch-header {
  position: relative;
  box-sizing: border-box;
  min-height: 80rpx;
  padding-bottom: 26rpx;
  color: #fff;
  background: #3a65ff;
}
.manage-dispatch-header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 26rpx;
  border-top-left-radius: 13px;
  border-top-right-radius: 13px;
  background: #fff;
}

.card-line {
  position: relative;
  box-sizing: border-box;
  padding: 0 40rpx;
  height: 100rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  &-item {
    display: flex;
    align-items: center;
    &-icon {
      width: 40rpx;
      height: 40rpx;

      > img {
        width: 100%;
        height: 100%;
      }
    }

    &-mr {
      margin-right: 20rpx;
    }
    &-ml {
      margin-left: 10rpx;
    }
  }
}

.dispatch-bottom-line {
  position: absolute;
  width: 92%;
  height: 1rpx;
  bottom: 0;
  left: 4%;
  background-image: linear-gradient(to bottom, #ddd, transparent);
  transform: scaleY(0.5);
}

.dispatch-box {
  box-sizing: border-box;
  padding: 10rpx 40rpx;
  &-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70rpx;
    &-name {
      font-size: 28rpx;
      color: #999;
    }
  }
}

.manage-btn-box {
  background: #fff;
}

.manage-btn {
  width: 100%;
}

.dispatch-bottom-box {
  padding-top: 40rpx;
}

.dispatch-split-line {
  position: relative;
  width: 100%;
  margin: 0 auto;
  height: 2rpx;
  background-image: linear-gradient(to bottom, #f0f0f0, transparent);
}
.dispatch-split-line::before,
.dispatch-split-line::after {
  content: "";
  position: absolute;
  width: 20rpx;
  height: 20rpx;
  background: #3a65ff;
  border-radius: 50%;
  top: -10rpx;
}

.dispatch-split-line::before {
  left: -10rpx;
}

.dispatch-split-line::after {
  right: -10rpx;
}

.dispatch-main-title {
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #2f3034;
}

.card-line-item1 {
  width: 200rpx;
  height: 56rpx;
  background: rgba(58, 101, 255, 0.1);
  border-radius: 28rpx;
  font-size: 24rpx;
  font-weight: bold;
  color: rgba(58, 101, 255, 0.77);
  overflow: hidden;
  justify-content: space-between;
  > div {
    width: 96rpx;
    height: 46rpx;
    line-height: 46rpx;
    text-align: center;
  }
}

.card-item-active {
  background: #3a65ff;
  border-radius: 23rpx;
  color: #fff;
}

.building-body-box {
  margin-bottom: 6rpx;
  box-shadow: none;
}
</style>