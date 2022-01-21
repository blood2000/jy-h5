<!-- 上拉选择器组件 -->
<template>
  <div>
    <div class="manage-modal" v-if="showModal" @click="cancelModal"></div>
    <div class="picker-modal-box" :class="showModal ? 'show-modal' : ''">
      <div class="picker-modal-box-title">
        设置
        <span class="picker-modal-close" @click="cancelModal"></span>
      </div>
      <div
        class="picker-modal-box-line"
        v-for="(item, index) in pickerData"
        :key="index"
        @click="jump(item)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
    pickerData: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  components: {},

  computed: {},

  mounted() {
    console.log("picker show");
  },

  methods: {
    cancelModal() {
      this.$emit("cancelModal");
    },

    jump(item) {
      this.cancelModal();
      uni.navigateTo({
        url: `./${item.url}`
      });
    }
  },
};
</script>
<style lang='scss' scoped>
.picker-modal-box {
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
  &-title {
    position: relative;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
  &-line {
    position: relative;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    color: #3a65ff;
    font-size: 32rpx;
    font-weight: bold;
  }
}

.picker-modal-box-line::after {
  position: absolute;
  content: "";
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2rpx;
  background-image: linear-gradient(to bottom, #ddd, transparent);
  transform: scaleY(0.5);
}

.picker-modal-box-line:last-child::after {
  height: 0;
}

.show-modal {
  padding-top: 10rpx;
  height: 400rpx;
}

.picker-modal-close {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 40rpx;
  height: 40rpx;
  background: url("../../../../static/manage/close.png") no-repeat center;
  background-size: 32rpx 32rpx;
}
</style>