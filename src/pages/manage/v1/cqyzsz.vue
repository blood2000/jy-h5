<!-- 场区阈值设置 -->
<template>
  <div class="manage-content">
    <HeaderBar :title="title" @back="back"></HeaderBar>
    <div class="manage-main">
      <div class="manage-box">
        <div class="manage-box-line">
          <div class="manage-title2">场区车辆容载阈值</div>
          <div class="manage-input-box">
            <input
              class="manage-input"
              type="number"
              placeholder="请输入场区车辆容载阈值"
              @input="numberInput"
              v-model="threshold"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="manage-btn-box">
      <div class="manage-btn manage-btn-cancel" @click="cancel">取消</div>
      <div class="manage-btn manage-btn-confirm" @click="confirm">确定</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import buildingRequest from "../../../config/buildingRequest";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import formFilter from "../../../utils/filter";
export default {
  data() {
    return {
      title: "场区阈值设置",
      reason: "",
      threshold: "",
      id: '',
      jyzCode: "",
      tempThreshold: "",
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

  onLoad() {
    this.jyzCode = uni.getStorageSync('jyzCode');
  },

  onShow() {
    this.getData();
  },

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    //获取阈值
    getData() {
      const config = {
        url: "getThreshold",
        header: this.headerInfo,
        querys: {
          jyzCode: this.jyzCode,
        },
      };
      buildingRequest(config).then((res) => {
        console.log("获取场区阈值", res);
        if (res.data) {
          this.threshold = res.data.capacityVehicleThreshold;
          this.id = res.data.id;
        }
      });
    },
    numberInput(e) {
      setTimeout(() => {
        let value = e.detail.value;
        if (value != "" && formFilter.priceFilter(value)) {
          this.tempThreshold = value;
        } else {
          if (value != "") {
            this.threshold = this.tempThreshold;
          }
        }
      }, 0);
    },
    cancel() {
      uni.navigateBack({
        delta: 1,
      });
    },
    //设置阈值
    confirm() {
      if (!this.threshold) {
        uni.showToast({
          title: "请输入场区阈值",
          icon: "none",
          duration: 1500,
        });
        return false;
      }
      const config = {
        url: "setThreshold",
        method: "POST",
        header: this.headerInfo,
        data: {
          id: this.id,
          jyzCode: this.jyzCode,
          capacityVehicleThreshold: this.threshold,
        },
      };
      buildingRequest(config).then((res) => {
        console.log("设置阈值", res);
        uni.showModal({
          title: "提示",
          content: res.msg,
          showCancel: false,
          success:  (res) => {
            if (res.confirm) {
              //点击确认
              uni.navigateBack({
                delta: 1,
              })
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
  padding-top: 30rpx;
}

.manage-box {
  padding: 0 30rpx;
}

.manage-btn-cancel {
  width: 38%;
}

.manage-btn-confirm {
  width: 58%;
}
</style>