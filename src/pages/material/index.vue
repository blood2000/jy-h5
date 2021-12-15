<!-- 场区管理 -->
<template>
  <view class="content-page">
	<HeaderBar title="选择物料" @back="navigateBack">
			<text slot="right" @click="handleAdd">添加</text>
	</HeaderBar>
    <!-- main -->
    <view class="mainsieejiwjfiw">
    	<!-- 搜索框 -->
		<u-search shape="square" bgColor="#fff" :showAction="false" placeholder="请输入物料名称" v-model="sfaijidsss"></u-search>
		
		<template v-if="true">
			<view class="sifhwiwiewewe">
				共 <text class="hfehiehwweee">3</text> 条记录
			</view>
			<!-- 列表 -->
			<view class="lsit-box">
				<view class="sfwefwfewefwsddd">
					<u-list
						@scrolltolower="scrolltolower"
						preLoadScreen="1.5"
					>
						<u-list-item
							v-for="(item, index) in indexList"
							:key="index"
						>
							<u-cell
								:title="`列表长度-${index + 1}`"
							>
								<u-avatar
									slot="icon"
									shape="square"
									size="35"
									:src="item.url"
									customStyle="margin: -3px 5px -3px 0"
								></u-avatar>
							</u-cell>
						</u-list-item>
					</u-list>
				</view>
			</view>
		</template>
		
		<NonePage v-else></NonePage>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
import mockData from "./mockData.js";
import uniData from '@/utils/uni.webview.1.5.2.js';
import HeaderBar from '@/components/Building/HeaderBar2.vue';
import SiderBar from "../../components/Building/SiderBar.vue";
export default {
  data() {
    return {
	  wdheight: '',
      sfaijidsss:'',
	  
	  indexList: [],
		urls: [
			'https://cdn.uviewui.com/uview/album/1.jpg',
			'https://cdn.uviewui.com/uview/album/2.jpg',
			'https://cdn.uviewui.com/uview/album/3.jpg',
			'https://cdn.uviewui.com/uview/album/4.jpg',
			'https://cdn.uviewui.com/uview/album/5.jpg',
			'https://cdn.uviewui.com/uview/album/6.jpg',
			'https://cdn.uviewui.com/uview/album/7.jpg',
			'https://cdn.uviewui.com/uview/album/8.jpg',
			'https://cdn.uviewui.com/uview/album/9.jpg',
			'https://cdn.uviewui.com/uview/album/10.jpg',
		]
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
  async onLoad(options) {
	this.$store.dispatch('getLoginInfoAction', {
		'Authorization': options.token
	});
	options.statusBarHeight && this.$store.dispatch('getStatusBarHeightAction', options.statusBarHeight);
	// this.getList();

    // await this.$onLaunched;
	// let _this = this
	// uni.getSystemInfo({
	// 	success: function (res) {
	// 		// console.log(res.windowHeight);
	// 		_this.wdheight = (res.windowHeight -122 -44)*2 +"upx" // 502
	// 	}
	// });
	
	
	this.loadmore()
  },
  onShow() {
  },

  onPullDownRefresh() {
    console.log("下拉刷新");
    setTimeout(() => {
      uni.stopPullDownRefresh(); //停止下拉刷新动画
    }, 1000);
  },

  methods: {
    navigateBack() {
    	const pages = getCurrentPages().length;
		if (pages === 1) {
			uni.webView.navigateBack();
		} else {
			uni.webView.switchTab({
				url: '/pages/applicate/index'
			})
		}
    },
	// 新增
	handleAdd() {
		uni.navigateTo({
			url: '/pages/material/materialCategory'
		});
	},
	// s= 列表相关
	scrolltolower() {
		this.loadmore()
	},
	loadmore() {
		for (let i = 0; i < 30; i++) {
			this.indexList.push({
				url: this.urls[uni.$u.random(0, this.urls.length - 1)]
			})
		}
	},
	
	// e=
	
	
    //获取场区数据
    getBuildingList() {
      this.buildingList = mockData.buildingList;
      this.renderBuilding();
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
	.content-page{
		font-size: 28upx;
		font-family: PingFang SC;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: felx;
		flex-direction: column;
	}
	.hwiunefwiniwn{
		font-weight: 400;
		color: #3A65FF;
	}
	.mainsieejiwjfiw{
		height: calc(100% - 44px) ;
		padding: 24upx 32upx;
		background: #F5F5F5;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.sifhwiwiewewe{
		font-weight: bold;
		margin: 24upx 0;
		color: #878787;
		.hfehiehwweee{
			color: #333333;
			padding: 0 10upx;
		}
	}
	
	.lsit-box{
		max-height: calc(100% - 75px) ;
		width: 100%;
		padding: 22upx;
		background: #FFFFFF;
		border-radius: 16px;
		.sfwefwfewefwsddd{
			height: 100%;
			overflow: hidden;
		}
	}
	
	
</style>