<!-- 选择物料 -->
<template>
  <div class="building-content">
    <HeaderBar :title="title" @back="back"></HeaderBar>
    <div class="building-main">
      <div class="building-main-side">
        <!-- 侧边栏 -->
        <SiderBar :siderList="materialList" @changeSiderBar="changeMaterial" />
        <!-- 内容区域 -->
      </div>
      <div class="building-main-content">
        <div class="building-box-1 building-bottom-line">
          <div class="building-box-left flex-1">共{{ total }}条记录</div>
        </div>

        <div class="building-main-content-body">
          <div class="building-main-content-body-container">
            <div
              class="building-item-box"
              v-for="(item, index) in curMaterialList"
              :key="index"
              @click="triggleChoose(item)"
            >
              <div class="building-item-box-title me-text-beyond">
                {{ item.dict_label }}
              </div>
              <div class="building-item-box-content">
                <div
                  class="building-item-ascheck"
                  :class="item.checked ? 'checked' : ''"
                >
                  <uni-icons
                    v-show="item.checked"
                    type="checkmarkempty"
                    size="16"
                    color="#3a65ff"
                  ></uni-icons>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="building-bottom">
      <div class="building-btn" @click="submit">
        已选 {{ choosedCount }} 类，确认提交
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import SiderBar from "../../../components/Building/SiderBar.vue";
import buildingRequest from "../../../config/buildingRequest";
export default {
  data() {
    return {
      title: "选择物料",
      activeIndex: 0,
      total: 0,
      materialList: [], //物料,
      curMaterialList: [],
      choosedList: [], //已选物料
      choosedCount: 0,
      insertList: [], //新勾选物料
      delList: [], //取消勾选的物料
    };
  },

  components: { HeaderBar, SiderBar },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
      choosedMaterial: (state) => state.building.choosedMaterial,
    }),
  },

  mounted() {
    this.getMaterial();
    // console.log(this.materialList)
    // this.total = this.materialList[this.activeIndex].list.length;
  },

  onLoad(option) {
    this.choosedList = JSON.parse(option.choosedList);
  },

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    getMaterial() {
      const config = {
        url: "getMaterial",
        header: this.headerInfo,
      };
      buildingRequest(config).then((res) => {
        console.log("获取所有物料", res);
        console.log(this.choosedList);
        if (res.code === 200) {
          this.materialList = res.data.reverse();
          this.curMaterialList = this.materialList[this.activeIndex].goodsType;
          this.total = this.curMaterialList.length;
          this.materialList.map((mItem) => {
            mItem.goodsType.map((gItem) => {
              this.choosedList.map((cItem) => {
                if (gItem.dict_value === cItem.goodsType) {
                  this.$set(gItem, "checked", true);
                  this.choosedCount++;
                }
              });
            });
          });
        }
      });
    },

    changeMaterial(index) {
      this.activeIndex = index;
      this.curMaterialList = this.materialList[this.activeIndex].goodsType;
      this.total = this.curMaterialList.length;
    },

    triggleChoose(item) {
      if (item.checked) {
        this.$set(item, "checked", false);
        this.choosedCount--;
      } else {
        this.$set(item, "checked", true);
        this.choosedCount++;
      }

      console.log(this.materialList);
      // this.$store.commit("getMaterialList", this.materialList);
    },
    //处理数据用于请求
    handleList() {
      //goodsBigType大类，goodsType小类
      let insertList = [];
      let delList = [];
      this.materialList.map((mItem) => {
        mItem.goodsType.map((gItem) => {
          let insertLeap = true;
          this.choosedList.map((cItem) => {
            gItem.dict_value === cItem.goodsType && (insertLeap = false);
            if (gItem.dict_value === cItem.goodsType && !gItem.checked) {
              delList.push(gItem.dict_value);
            }
          });
          if (insertLeap && gItem.checked) {
            insertList.push({
              goodsBigType: mItem.dict_value,
              goodsType: gItem.dict_value,
            });
          }
        });
      });
      this.insertList = insertList;
      this.delList = delList;
    },

    submit() {
      this.handleList();
      console.log(this.insertList);
      console.log(this.delList);
      const config = {
        url: "updateAddedGoods",
        method: "POST",
        header: this.headerInfo,
        data: {
          list: this.insertList,
          del: this.delList,
        },
      };
      buildingRequest(config).then((res) => {
        console.log("更新物料", res);
        if (res.code === 200) {
          uni.showModal({
            title: "提示",
            content: '操作成功',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                //点击确认
                this.back();
              }
            },
          });
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.building-btn {
  width: 100%;
}
</style>