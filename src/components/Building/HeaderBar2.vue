<!-- 头部导航栏 -->
<template>
  <div :style="{'--statusBar': statusBar }">
    <uni-nav-bar left-icon="back" @clickLeft="$emit('back')" :title="title" :statusBar="true" fixed :border='false' v-bind="$attrs">
        <view slot="right" class="header-bar-right-text">
          <slot name="right"></slot>
        </view>
    </uni-nav-bar>
  </div>
</template>

<script>
/*
  
*/ 
import { mapState } from "vuex";
export default {
  name:'HeaderBar',
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
	
    statusBar(){
      return this.statusBarHeight + 'px'
    }
  },
 
};
</script>
<style lang='scss' scoped>

// 修改uni-nav中标题的样式
::v-deep{
	.uni-nav-bar-text{
		font-weight: bold;
		color: #333333;
	}
	.uni-status-bar{
		height: var(--statusBar) !important;
	}
  
  /* #ifdef H5 */
  .uni-navbar__header-btns-left{
    width: 160upx;
  }
  .uni-navbar__header-btns-right{
    width: 160upx;
  }
  /* #endif */
}
.header-bar-right-text{
	font-size: 28upx !important;
}
</style>
