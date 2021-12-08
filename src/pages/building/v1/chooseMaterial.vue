<!-- 选择物料 -->
<template>
  <div class="building-content">
    <HeaderBar :title="title" @back="back"></HeaderBar>
    <div class="building-main">
      <div class="building-main-side">
        <!-- 侧边栏 -->
        <SiderBar :siderList="materialList"  @changeSiderBar="changeMaterial" />
        <!-- 内容区域 -->
      
      </div>
      <div class="building-main-content">
        <div class="building-box-1 building-bottom-line">
          <div class="building-box-left flex-1">
            共{{ total }}条记录
          </div>
          
        </div>

        <div class="building-main-content-body">
          <div
            class="building-item-box"
            v-for="(item, index) in materialList[activeIndex].list"
            :key="index"
            @click="triggleChoose(item)"
          >
            <div class="building-item-box-title">{{ item.name }}</div>
            <div class="building-item-box-content">
              <div class="building-item-ascheck" :class="item.checked ? 'checked' : ''">
                <uni-icons v-show="item.checked" type="checkmarkempty" size="16" color="#3a65ff"></uni-icons>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="building-bottom">
      <div class="building-btn">添加</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import SiderBar from "../../../components/Building/SiderBar.vue";
export default {
  data () {
    return {
      title: '选择物料',
      activeIndex: 0,
      total: 0,
    };
  },

  components: {HeaderBar, SiderBar},

  computed: {
    ...mapState({
      materialList: (state) => state.building.materialList,
      choosedMaterial: (state) => state.building.choosedMaterial,
    }),
  },

  mounted() {
    console.log(this.materialList)
    this.total = this.materialList[this.activeIndex].list.length;
  },
  

 
  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    changeMaterial(index) {
      this.activeIndex = index;
      this.total = this.materialList[index].list.length;
    },

    triggleChoose(item) {
      if (item.checked) {
        this.$set(item,'checked',false)
      } else {
        this.$set(item,'checked',true)
      }

      console.log(this.materialList)
      this.$store.commit("getMaterialList", this.materialList);
    },
  }
}

</script>
<style lang='scss' scoped>
.building-btn {
  width: 100%;
}
</style>