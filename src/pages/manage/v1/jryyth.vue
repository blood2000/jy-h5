<!-- 今日预约调号 -->
<template>
  <div class="manage-content">
    <HeaderBar :title="title" @back="back" :barStyle="barStyle"></HeaderBar>
    
    <div class="manage-main">
      <div class="manage-box">
        <div class="manage-box-line">
          <div class="manage-title2">今日预约号</div>
          <div class="manage-number-box">
            <div class="manage-number-minus" @click="minus">
              <span></span>
            </div>
            <div class="manage-number-text">{{ reserveNo }}</div>
            <div class="manage-number-plus" @click="plus">
              <uni-icons
                type="plus-filled"
                size="24"
                color="#3a65ff"
              ></uni-icons>
            </div>
          </div>
        </div>
        <div class="manage-box-line">
          <div class="manage-title2">调整原因</div>
          <div class="manage-input-box">
            <input
              class="manage-input"
              type="text"
              placeholder="请输入调整原因"
              v-model="reason"
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
export default {
  data() {
    return {
      title: "今日预约调号",
      barStyle: {
        background: '#3a65ff',
        color: '#fff'
      },
      reason: "",
      reserveNo: 98,
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
    minus() {
      if (this.reserveNo > 1) {
        this.reserveNo--;
      }
    },
    plus() {
      this.reserveNo++;
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