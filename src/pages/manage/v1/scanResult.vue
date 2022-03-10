<!-- 调号 -->
<template>
  <div class="manage-content">
    <HeaderBar :title="title" @back="back" :barStyle="barStyle"></HeaderBar>
    <div class="manage-dispatch-header">
      <div class="manage-box">
        <div class="scan-title" v-if="result">
          <img src="../../../static/manage/scan-suc.png" alt="" />
          <div class="scan-title-text">验证成功</div>
        </div>
        <div class="scan-title" v-else>
          <img src="../../../static/manage/scan-fail.png" alt="" />
          <div class="scan-title-text">验证失败</div>
        </div>
        <div class="dispatch-split-line"></div>
        <div class="dispatch-box">
          <div class="dispatch-box-line">
            <div class="dispatch-box-line-name">货主名称:</div>
            <div class="manage-title0">{{ detail.jyzName }}</div>
          </div>
          <div class="dispatch-box-line">
            <div class="dispatch-box-line-name">货品类型:</div>
            <div class="manage-title0">{{ detail.goodsName }}</div>
          </div>
          <div class="dispatch-box-line">
            <div class="dispatch-box-line-name">有效日期:</div>
            <div class="manage-title0">
              {{ detail.effectiveDate }} 至 {{ detail.expirationDate }}
            </div>
          </div>
          <div class="dispatch-box-line">
            <div class="dispatch-box-line-name">总车次:</div>
            <div class="manage-title0">{{ detail.reserveNumber }}</div>
          </div>

          <div class="dispatch-box-line">
            <div class="dispatch-box-line-name">联系人:</div>
            <div class="manage-title0">
              {{ detail.adminName }}({{ detail.adminPhonenumber }})
            </div>
          </div>

          <div class="dispatch-box-line">
            <div class="dispatch-box-line-name">原因:</div>
            <div class="manage-title0">{{ detail.remark }}</div>
          </div>
        </div>
        <div class="dispatch-split-line"></div>
        <div class="dispatch-box dispatch-bottom-box " v-if="result">
          <div class="manage-title3">闽A112245</div>
          <div class="card-line">
            <div class="card-line-item">
              <div class="dispatch-box-line-name">司机姓名:</div>
              <div class="manage-title0">{{ detail.driver }}</div>
            </div>
            <div class="card-line-item">
              <div class="dispatch-box-line-name">联系方式:</div>
              <div class="manage-title0">{{ detail.driverTel }}</div>
            </div>
          </div>
          <div class="manage-expand-line-bg">
            <div class="manage-expand-item">
              <img src="../../../static/manage/time.png" alt="" />
              <div class="manage-expand-item manage-ml">
                <div class="manage-title4">预约时段</div>
              </div>
            </div>
            <div class="manage-expand-item">
              <div class="scan-text">
                {{ detail.startTime }} - {{ detail.endTime }}
              </div>
            </div>
          </div>
          <div class="card-line">
            <div class="card-line-item">
              <div class="dispatch-box-line-name">预约单号:</div>
              <div class="manage-title0">{{ detail.reservationNumber }}</div>
            </div>
          </div>
        </div>
        <div class="dispatch-box dispatch-bottom-box" v-if="!result">
          <div class="manage-title4">失败原因</div>
          <div class="scan-fail-text manage-title3">{{ detail.fail }}</div>
        </div>
        <div class="dispatch-split-line" v-if="result"></div>
        <div class="scan-btn-box" v-if="result">
          <div class="scan-btn scan-btn-confirm" @click="submit">确认入场</div>
          <div class="scan-btn scan-btn-cancel" @click="disableRecord">
            废号
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="manage-btn-box">
      <div class="manage-btn" @click="submit">保存</div>
    </div> -->
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
      title: "扫码结果",
      barStyle: {
        background: "#3a65ff",
        color: "#fff",
      },
      code: '',
      detail: {},
      result: true,
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
  },

  onLoad(option) {
    this.detail = JSON.parse(option.detail);
    // this.getDetail();
  },
   

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    getDetail() {
      const config = {
        url: "getScanDetail",
        header: this.headerInfo,
        querys: {
          code: this.code,
        },
      };
      buildingRequest(config).then((res) => {
        console.log("获取微信扫码详情", res);
        if (res.code === 200) {
          this.detail = res.data;
        }
      });
    },

    disableRecord() {
      uni.showModal({
        title: "提示",
        content: "确认废号?",
        success: (res) => {
          if (res.confirm) {
            const config = {
              url: "disableDriverRecord",
              method: "PUT",
              header: this.headerInfo,
              params: this.detail.id,
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
          }
        },
      });
    },

    submit() {
      let params = {
        id: this.detail.id,
        reservationStatus: 1,
      };
      const config = {
        url: "changeStatus",
        method: "PUT",
        header: this.headerInfo,
        data: params,
      };
      buildingRequest(config).then((res) => {
        console.log("标记入场", res);
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
  padding: 0;
  overflow: hidden;
}

.scan-title {
  padding: 20rpx 0;
  font-size: 44rpx;
  font-family: PingFang SC;
  font-weight: bold;
  color: #333333;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 96rpx;
    height: 96rpx;
  }
}

.manage-main {
  background: #fff;
  padding-bottom: 120rpx;
  overflow-y: auto;
}
.manage-dispatch-header {
  flex: 1;
  position: relative;
  box-sizing: border-box;
  padding-bottom: 26rpx;
  color: #fff;
  background: #3a65ff;
}

.card-line {
  position: relative;
  box-sizing: border-box;
  padding: 0 0;
  height: 80rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
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
      font-size: 24rpx;
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
  padding: 30rpx 40rpx 0;
  background: #e7ecff;
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

.manage-expand-line-bg {
  height: 54rpx;
  background: rgba(58, 101, 255, 0.08);
  color: #3a65ff;
  padding-left: 0;
}

.manage-expand-item {
  img {
    width: 42rpx;
    height: 42rpx;
  }
}

.scan-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #3a65ff;
}

.scan-btn-box {
  padding: 40rpx 0;
  height: 200rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  .scan-btn {
    box-sizing: border-box;
    width: 90%;
    height: 80rpx;
    border-radius: 10rpx;
    text-align: center;
    line-height: 80rpx;
    font-size: 28rpx;
    font-weight: bold;
  }

  .scan-btn-confirm {
    background: #3a65ff;
    color: #fff;
  }

  .scan-btn-cancel {
    border: 1rpx solid #3a65ff;
    color: #3a65ff;
  }
}

.scan-fail-text {
  padding: 20rpx 0 40rpx;
}
</style>