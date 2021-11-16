<!-- 场区管理 -->
<template>
  <view class="content">
    <!-- 头部导航栏 -->
    <view
      class="status-bar"
      :style="{ height: statusBarHeight * 2 + 'rpx' }"
    ></view>
    <uni-nav-bar
      left-icon="arrowleft"
      color="#ffffff"
      title="场区管理"
      backgroundColor="#3A65FF"
      @clickLeft="back"
    ></uni-nav-bar>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },

  components: {},
  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
    }),
  },
  onLoad() {},
  onShow() {},

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.detail-container {
  overflow-y: hidden;
  padding-bottom: 0;
}
</style>