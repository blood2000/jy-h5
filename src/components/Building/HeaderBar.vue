    <!-- 头部导航栏 -->
<template>
  <div>
    <view
      class="status-bar"
      :style="{ height: statusBarHeight * 2 + 'rpx', background: barStyle.background}"
    ></view>
    <uni-nav-bar
      v-if="showBar"
      left-icon="arrowleft"
      :color="barStyle.color"
      :title="title"
      :backgroundColor="barStyle.background"
      @clickLeft="back"
    >
      <view class="nav-right" slot="right" @click="jump"> {{rightText}} </view>
      <div class="nav-right-icon" slot="right" @click="handleRight" v-if="showNavIcon"></div>
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
		showBar: {
			type: Boolean,
			default: true
		},
		fixed: {
			type: Boolean,
			default: false
		},
		showNavIcon: {
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
    handleRight() {
      this.$emit('handleRight');
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
.nav-right-icon {
  position: absolute;
  top: 50%;
  right: 26rpx;
  width: 34rpx;
  height: 34rpx;
  background: url('../../static/manage/statistics-nav.png') no-repeat center;
  background-size: 100% 100%;
  transform: translateY(-50%);
}
</style>

