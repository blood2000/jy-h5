<!-- 物料类别 -->
<template>
  <div class="building-content">
    <HeaderBar :title="title" :rightText="rightText" @back="back" @jump="jump">
      
    </HeaderBar>
    <div class="search-box">
      <div class="search-input-box">
        <input
          class="search-input"
          placeholder="请输入物料名称"
          confirm-type="search"
          @confirm="searchName"
          type="text"
          v-model="materialName"
        />
        <!-- <view class="enter" @click="searchUserByTel"></view> -->
      </div>
    </div>
    <div class="building-body">
      <div class="building-body-title building-title2">共{{total}}条记录</div>
      <div class="building-input-box">
        <div class="building-input-item" v-for="(item, index) in renderList" :key="index">
          <div class="building-input-item-name"> {{item.name}} </div>
          <div class="building-input-item-icon" @click="deleteItem(index)">
            <uni-icons type="trash" size="16" color="red"></uni-icons>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import mockData from "./config/mockData";
export default {
  data() {
    return {
      title: "物料类别",
      rightText: '选择物料',
      materialName: '',
      total: 0,
      choosedList: [],
      renderList: [],
    };
  },

  components: { HeaderBar },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
      materialList: (state) => state.building.materialList,
    }),
  },

  onShow() {
    this.getChoosedList();
  },
  

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    jump() {
      uni.navigateTo({
        url: "./chooseMaterial",
      });
    },
    searchName() {
      // console.log(this.materialName)
      let renderList = [];
      this.choosedList.map(item => {
        if (item.name.indexOf(this.materialName) > -1) {
          renderList.push(item)
        }
      })
      this.renderList = renderList;
      this.total = this.renderList.length;
    },
    //获取已选物料列表
    getChoosedList() {
      console.log(this.materialList)
      let choosedList = [];
      this.materialList.map((item) => {
        item.list.map(itm => {
          if (itm.checked) {
          choosedList.push(itm);
        }
        })
      });
      this.choosedList = choosedList;
      this.searchName();
      // this.$store.commit("getChoosedMaterial", this.choosedList);

    },

    // 删除已选物料
    deleteItem(index) {
      let delType = this.renderList[index].type;
      this.materialList.map(item => {
        item.list.map(itm => {
          if (itm.type === delType) {
            this.$set(itm, 'checked', false);
          }
        })
      })
      
      this.getChoosedList();
      this.$store.commit("getMaterialList", this.materialList);
    },
  },
};
</script>
<style lang='scss' scoped>
</style>