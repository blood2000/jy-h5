<!--  -->
<template>
  <div class="building-content">
    <HeaderBar :title="title" @back="back"></HeaderBar>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderBar from "../../../components/Building/HeaderBar.vue";

export default {
  data () {
    return {
      title: '添加场区分类',
    };
  },

  components: {HeaderBar},

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
    }),
  },

  onShow() {

  },

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
  }
}

</script>
<style lang='scss' scoped>
</style>