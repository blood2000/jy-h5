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
      <div>{{item.name}}</div>
      <div>({{item.num}})</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      siderList: [
        { name: "磅房", num: 3, id: 0 },
        { name: "仓库A区", num: 3, id: 1 },
        { name: "仓库B区", num: 3, id: 2 },
        { name: "堆场A区", num: 3, id: 3 },
        { name: "场区入口", num: 3, id: 4 },
        { name: "场区出口", num: 3, id: 5 },
        
      ],
      activeSider: 0,
    };
  },

  components: {},

  computed: {},

  onShow() {},

  methods: {

    changeSiderBar(index) {
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