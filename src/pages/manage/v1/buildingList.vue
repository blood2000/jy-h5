<!-- 入场区域 -->
<template>
  <div class="manage-content">
    <HeaderBar :title="title" @back="back"></HeaderBar>
    <div class="search-box">
      <div class="search-input-box">
        <input
          class="search-input"
          placeholder="请输入场区名称"
          confirm-type="search"
          @confirm="searchName"
          type="text"
          v-model="buildingName"
        />
        <view class="enter" @click="searchName"></view>
      </div>
    </div>
    <div class="building-body">
      <div class="building-body-title building-title2">共{{ total }}条记录</div>
      <div class="building-input-box" v-if="renderList.length > 0">
        <div
          class="building-input-item"
          v-for="(item, index) in renderList"
          :key="index"
        >
          <div class="building-input-item-name">{{ item.buildingName }}</div>
          <div
            class="building-input-item-icon"
            @click="chooseItem(item)"
          >
            <div class="as-checkbox">
              <uni-icons
                v-show="item.checked"
                type="checkmarkempty"
                size="16"
                color="#3A65FF"
              ></uni-icons>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import buildingRequest from "../../../config/buildingRequest";
export default {
  data() {
    return {
      title: "入场区域",
      jyzCode: "62baa47ae922439fbf3c102774722e40",
      buildingName: "",
      choosedList: [],
      renderList: [],
      total: 0,
    };
  },

  components: { HeaderBar },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
      choosedBuilding: (state) => state.manage.choosedBuilding,
    }),
  },

  onShow() {
    this.getBuildingInfo();
  },

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    getBuildingInfo() {
      const config = {
        url: "getBuildingInfo",
        header: this.headerInfo,
        querys: {
          jyzCode: this.jyzCode,
        },
      };
      buildingRequest(config).then((res) => {
        console.log("场区列表", res);

        if (res.code === 200) {
          this.$store.commit("getBuildingList", res.data);
          let choosedList = [];
          // res.data = [
          //   {buildingName: 'AAAadsfasdfadsf', id: 0},
          //   {buildingName: 'BBB', id: 1},
          //   {buildingName: 'CCC', id: 2},
          //   {buildingName: 'DDD', id: 3},
          // ];
          res.data.map((item) => {
            this.choosedBuilding.map((cItem) => {
              if (cItem.id === item.id) {
                item.checked = true;
              }
            });
            choosedList.push(item);
          });
          this.choosedList = choosedList;
          console.log(this.choosedList);

          // this.$store.commit('getChoosedMaterial', this.choosedList);
          this.searchName();
        }
      });
    },
    searchName() {
      // console.log(this.materialName)
      let renderList = [];
      this.choosedList.map((item) => {
        if (item.buildingName.indexOf(this.buildingName) > -1) {
          renderList.push(item);
        }
      });
      this.renderList = renderList;
      this.total = this.renderList.length;
      // console.log(this.choosedList)
    },
    //选择物料
    chooseItem(item) {
      console.log(this.choosedList);
      this.$set(item, "checked", !item.checked);
      let choosedBuilding = [];
      this.choosedList.map((cItem) => {
        if (item.id === cItem.id) {
          this.$set(cItem, "checked", item.checked);
        }
        cItem.checked && choosedBuilding.push(cItem);
      });
      this.$store.commit("getChoosedBuilding", choosedBuilding);
    },
  },
};
</script>
<style lang='scss' scoped>
.as-checkbox {
  width: 30rpx;
  height: 30rpx;
  text-align: center;
  line-height: 30rpx;
  border: 1rpx solid #ddd;
}
</style>