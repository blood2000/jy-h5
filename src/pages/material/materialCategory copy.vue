<!-- 添加物料 -->
<template>
  <view class="building-content">
	<u-navbar title="选择物料" @leftClick="navigateBack" safeAreaInsetTop fixed placeholder />
    <!-- <HeaderBar :title="title" @back="back"></HeaderBar> -->
    <!-- main -->
    <div class="building-main material-main">
      <div class="building-main-side">
        <!-- 菜单栏 -->
        <SiderBar :siderList="buildingList" @changeBuilding="changeBuilding" />
        <div class="building-main-side-add" @click="toAddBuildingType">
          <uni-icons type="plus-filled" color="#3A65FF" size="30"></uni-icons>
        </div>
      </div>
      <!-- 内容区域 -->
      <div class="building-main-content material-box">
        <div class="building-box-1 building-bottom-line">
          <div class="building-box-left flex-1">
            共  <text class="record-number"> {{ activeBuilding.num }} </text> 条记录
          </div>
          <div class="building-box-right">
            <div class="btn-mat building-as-btn building-default">编辑分类</div>
            <div class="btn-mat building-as-btn" @click="addBuilding">确认创建</div>
          </div>
        </div>

        <div class="building-main-content-body material-main-content-body">
          <div
            class="building-item-box"
            v-for="(item, index) in activeBuilding.list"
            :key="index"
          >
            <div class="building-item-box-title">{{ item.name }}</div>
            <div class="building-item-box-content activeed">
				<u-icon class='checked-mark' name="checkbox-mark" color="#fff" size="20"></u-icon>
			</div>
          </div>
        </div>
      </div>
    </div>
  </view>
</template>

<script>
import { mapState } from "vuex";
// import mockData from "./mockData.js";
import SiderBar from "../../components/Building/SiderBar.vue";
import HeaderBar from "../../components/Building/HeaderBar.vue";
export default {
  data() {
    return {
      buildingList: [],
      activeIndex: 0,
      activeBuilding: {},
    };
  },

  components: { SiderBar, HeaderBar },
  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
    }),
  },
  async onLoad() {
    
  },
  onShow() {
    this.getGoodsType();
  },

  onPullDownRefresh() {
    console.log("下拉刷新");
    setTimeout(() => {
      uni.stopPullDownRefresh(); //停止下拉刷新动画
    }, 1000);
  },

  methods: {
    navigateBack() {
    	uni.navigateBack({
    		delta: 1
    	})
    },
    // //获取场区数据
    // getBuildingList() {
    //   this.buildingList = mockData.buildingList;
    //   this.renderBuilding();
    // },

    // s= 获取货物
    async getGoodsType() {
      this.addLoading = true;
      const { data } = await this.listByDict({
        dictPid: '0',
        dictType: 'goodsType'
      });
      this.goodsBigTypeOption = data;

      // 获取物料规则
      const res = await this.getDicts('jyz_goods_spec');
      this.standardsOption = res.data;

      this.addLoading = false;
    },


    //场区数据显示
    renderBuilding() {
      this.activeBuilding = this.buildingList[this.activeIndex];
    },

    changeBuilding(index) {
      console.log(index), (this.activeIndex = index);
      this.renderBuilding();
    },

    // 添加场区分类
    toAddBuildingType() {
      uni.navigateTo({
        url: "./buildingType",
      });
    },

    // 添加场区
    addBuilding() {
      uni.navigateTo({
          url: "./addBuilding?type=" + this.activeIndex,
        });
    },
  },
};
</script>
<style lang='scss' scoped>
	.material-main{
		border-top: 1upx solid #EDEDED;
		
		.building-box-left{
			font-size: 26upx;
			font-weight: 500;
			color: #999999;
			.record-number{
				color: #333333;
				padding: 0 10upx;
			}
		}
		
		.btn-mat{
			border: 1px solid #3A65FF;
			font-size: 26upx;
			font-weight: bold;
			padding: 0 38upx;
		}
		
		.building-main-side{
			border-right: none;
		}
		::v-deep {
			.building-siderBar .active-sider{
				background-color: #F3F7FF;
				color:#3A65FF  ;
			} 
			.building-siderBar-item{
				background-color: #fff;
				color: #999999;
			}			
		}
	}
	
	.material-box{
		padding: 0 24upx;
		.building-box-1{
			padding: 0;
		}
		.building-bottom-line::after{
			display: none;
		}
		
		.material-main-content-body{
			margin-top:10upx ;
			width: 100%;
			background: #FFFFFF;
			box-shadow: 5upx 0upx 28upx 1upx rgba(181, 181, 181, 0.13);
			border-radius: 20upx;
			.building-item-box{
				height:193upx ;
				border: 2upx solid #DCE3FC;
				display: flex;
				flex-direction: column;
				.building-item-box-title{
					background: #F0F3FF;
					font-size: 26upx;
					font-weight: bold;
					color: #3A65FF;
					border-bottom: none;
				}
				.building-item-box-content{
					flex: 1;
					position: relative;	
					overflow: hidden;
				}
				.building-item-box-content::after{
					content: '';
					position: absolute;
					bottom: 0;
					right: 0;
					width: 41upx;
					height: 33upx;
					background: #DCE3FC;
					border-radius: 10upx 0upx 10upx 0upx;
					
				}
				.checked-mark{
					position: absolute;
					bottom: -4upx;
					right: 0;
					z-index: 1;
					display: none;
				}
				.activeed.building-item-box-content::after{
					background: #3A65FF;
				}
				.activeed .checked-mark{
					display: block;
				}
				
			}
		}
	}
.detail-container {
  overflow-y: hidden;
  padding-bottom: 0;
}
</style>