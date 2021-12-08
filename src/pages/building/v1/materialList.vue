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
      <div class="building-body-title building-title2">共{{ total }}条记录</div>
      <div class="building-input-box">
        <div
          class="building-input-item"
          v-for="(item, index) in renderList"
          :key="index"
        >
          <div class="building-input-item-name">{{ item.goodsName }}</div>
          <div class="building-input-item-icon" @click="chooseItem(item)" v-if="checkMode === 1">
            <div class="as-checkbox" >
              <uni-icons
                v-show="item.checked"
                type="checkmarkempty"
                size="16"
                color="#3A65FF"
              ></uni-icons>
            </div>
            
          </div>
          <div class="building-input-item-icon" @click="deleteItem(index)" v-else>
            <uni-icons
             
              type="trash"
              size="16"
              color="red"
              
            ></uni-icons>
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
import mockData from "./config/mockData";
export default {
  data() {
    return {
      title: "物料类别",
      rightText: "选择物料",
      materialName: "",
      total: 0,
      choosedList: [],
      renderList: [],
      checkMode: 0, //是否用复选模式
    };
  },

  components: { HeaderBar },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
      choosedMaterial: (state) => state.building.choosedMaterial,
    }),
  },

  onLoad(option) {
    console.log(option)
    if (option.check) {
      this.checkMode = option.check * 1;
    } else {
      this.checkMode = 0;
    }
    this.getAddedGoods();
  },

  onShow() {
    
    // this.getChoosedList();
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
      this.choosedList.map((item) => {
        if (item.goodsName.indexOf(this.materialName) > -1) {
          renderList.push(item);
        }
      });
      this.renderList = renderList;
      this.total = this.renderList.length;
    },
    //获取已添加到选项的物料列表
    getAddedGoods() {
      const config = {
        url: "getAddedGoods",
        header: this.headerInfo,
        querys: {
          name: this.materialName,
        },
      };
      buildingRequest(config).then((res) => {
        console.log("获取已添加物料列表", res);
        if (res.code === 200) {
          let choosedList = [];
          res.data.map((item) => {
            this.choosedMaterial.map(cItem => {
              if (cItem.goodsType === item.goodsType) {
                item.checked = true;
              }
            })
            choosedList.push(item);
          });
          this.choosedList = choosedList;
          console.log(this.choosedList)

          // this.$store.commit('getChoosedMaterial', this.choosedList);
          this.searchName();
        }
      });
    },
    //选择物料
    chooseItem(item) {
      console.log(this.choosedList)
      this.$set(item, 'checked', !item.checked);
      let choosedMaterial = [];
      this.choosedList.map(cItem => {
        if (item.goodsType === cItem.goodsType) {
          this.$set(cItem, 'checked', item.checked);
        }
        (cItem.checked )&& (choosedMaterial.push(cItem))
      })
      this.$store.commit('getChoosedMaterial', choosedMaterial);
      // let list = [];
      // this.renderList.map(itm => {
      //   if (itm.checked) {
      //     list.push(itm)
      //   }
      // })
      // this.$store.commit('getChoosedMaterial', list);
      // console.log(this.choosedMaterial)
    },

    // 删除已选物料
    deleteItem(index) {
      let delType = this.renderList[index].type;
      this.materialList.map((item) => {
        item.list.map((itm) => {
          if (itm.type === delType) {
            this.$set(itm, "checked", false);
          }
        });
      });

      this.getChoosedList();
      this.$store.commit("getMaterialList", this.materialList);
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