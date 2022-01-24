    <!-- 头部导航栏 -->
<template>
  <div>
    <view
      class="status-bar"
      :style="{ height: statusBarHeight * 2 + 'rpx', background: barStyle.background}"
    ></view>
    <uni-nav-bar
      left-icon="arrowleft"
      :color="barStyle.color"
      :title="title"
      :backgroundColor="barStyle.background"
      @clickLeft="back"
    >
      <view class="nav-right" slot="right" @click="jump"> {{rightText}} </view>
    </uni-nav-bar>
  </div>
</template>

<script>
//#3A65FF
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
		border: {
			type: Boolean,
			default: true
		},
		fixed: {
			type: Boolean,
			default: false
		},
    rightText: {
      type: String,
      default: '',
    },
    barStyle: {
      type: Object,
      default() {
        return {
          color: '#333333',
          background: '#ffffff'
        };
      },
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
    jump() {
      this.$emit('jump');
    },
  },
};
</script>
<style lang='scss' scoped>
// .status-bar {
//   background: transparent;
// }
.nav-right {
  position: absolute;
  top: 50%;
  right: 20rpx;
  font-size: 24rpx;
  color: #3A65FF;
  transform: translateY(-50%);
}

</style>

