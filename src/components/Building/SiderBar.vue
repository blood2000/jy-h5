<!--  -->
<template>
  <div class="building-siderBar">
    <div
      class="building-siderBar-item"
      v-for="(item, index) in siderList"
      :key="index"
      :class="activeSider === index ? 'active-sider' : ''"
      @click="changeSiderBar(index)"
    >
      <div>{{item.buildingName}}</div>
      <div>({{item.count}})</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeSider: 0,
    };
  },

  props: {
    siderList: {
      type: Array,
      required: true,
    },
  },

  computed: {},

  onShow() {
    
  },

  methods: {

    changeSiderBar(index) {
      this.$emit('changeSiderBar', index);
      this.activeSider = index;
    },
  },
};
</script>
<style lang='scss' scoped>
.building-siderBar {
  box-sizing: border-box;
  width: 120rpx;
  height: 100%;
  
  overflow-y: auto;
  
  
  
  &-item {
    width: 100rpx;
    padding: 20rpx 0;
    margin: 0 auto 20rpx;
    background: #ddd;
    border-radius: 10rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > div {
      width: 36px;
      text-align: center;
    }

  }

  .active-sider {
    background: #3A65FF;
    color: #fff;
  }
}
</style>