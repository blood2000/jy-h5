    <!-- 头部导航栏 -->
<template>
  <div>
    <view
      class="status-bar"
      :style="{ height: statusBarHeight * 2 + 'rpx' }"
    ></view>
    <uni-nav-bar
      left-icon="arrowleft"
      color="#ffffff"
      :title="title"
      backgroundColor="#3A65FF"
      @clickLeft="back"
    ></uni-nav-bar>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },

  props: {
    title: {
      type: String,
      default: "",
    },
  },

  computed: {
    ...mapState({
      statusBarHeight: (state) => state.header.statusBarHeight,
    }),
  },
  methods: {
    back() {
      this.$emit("back");
    },
  },
};
</script>
<style lang='scss' scoped>
// .status-bar {
//   background: transparent;
// }
</style>