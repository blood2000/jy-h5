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
      <div class="manage-btn manage-btn-confirm">确定</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import formFilter from "../../../utils/filter";
export default {
  data() {
    return {
      title: "场区阈值设置",
      reason: "",
      threshold: '',
      tempThreshold: '',
    };
  },

  components: { HeaderBar },

  computed: {},

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
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
        delta: 1
      })
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