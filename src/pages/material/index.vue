<!-- 场区管理 -->
<template>
  <view class="content-page">
	<HeaderBar title="货品维护" @back="navigateBack">
			<text style="color:#3A65FF" slot="right" @click="handleAdd">新增</text>
	</HeaderBar>
    <!-- main -->
    <view class="mainsieejiwjfiw">
    	<!-- 搜索框 -->
		<view>
			<u-search shape="square" bgColor="#fff" :showAction="false" placeholder="请输入运输商品小类名称" v-model="queryParams.goodsTypeName" 
			@clear="loadmore('init')" 
			@search="loadmore('init')"></u-search>
		</view>
		
		<template>
			<view class="sifhwiwiewewe">
				共 <text class="hfehiehwweee">{{ total }}</text> 条记录
			</view>
			<!-- 列表 -->
			<view class="lsit-box" v-if="!!indexList.length">
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
								@click="handlerEdit(item)"
								:title="`${item.goodsBigTypeName} -- ${item.goodsTypeName} -- ${item.standardsName}`"
							>	
							  <view slot="right-icon" @click.stop="handlerDelete(item)">
								<u-icon name="trash-fill" color="#E55E50" size="24"></u-icon>
							  </view>
							</u-cell>
								<!-- <u-avatar
									slot="icon"
									shape="square"
									size="35"
									:src="item.url"
									customStyle="margin: -3px 5px -3px 0"
								></u-avatar> -->
								<!-- 

									code: "5c39e9d5edc948a09486554dd1376ca9"
									delFlag: 0
									goodsBigType: "0100"
									goodsBigTypeName: "煤炭及制品"
									goodsType: "0100004"
									goodsTypeName: "焦煤"
									id: 30
									standards: 1
									standardsName: "块"
									tenantCode: "b1d93e730331434d941873d660a08433"
								 -->
						</u-list-item>
					</u-list>
				</view>
			</view>
			<NonePage v-else></NonePage>
		</template>
		
    </view>
	
  </view>
</template>

<script>

import {tenantGoodsRelList, tenantGoodsRelDelete} from '../../config/service/material/index'
import { mapState } from "vuex";
import mockData from "./mockData.js";
import uniData from '@/utils/uni.webview.1.5.2.js';
import HeaderBar from '@/components/Building/HeaderBar2.vue';
import SiderBar from "../../components/Building/SiderBar.vue";
import { removePropertyOfNull } from '@/utils/ddc';
export default {
  name:'material',
  data() {
    return {
	  queryParams: { // 请求参数
        pageNum: 1,
        pageSize: 10,

        goodsTypeName: undefined // 定价策略
      },
	  indexList: [],
	  total: 0,
	  cbData: null,

	  wdheight: '',
      

	  
	  
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

	que(){
		return {
			...removePropertyOfNull(this.queryParams) 
		}
	}
  },
  async onLoad(options) {
	if(options.token){
		this.$store.dispatch('getLoginInfoAction', {
			'Authorization': options.token
		});
		options.statusBarHeight && this.$store.dispatch('getStatusBarHeightAction', options.statusBarHeight);
		
	}
	if(this.headerInfo.Authorization){
		this.loadmore('init')
	}
  },
  onShow() {
	  
  },

  async onPullDownRefresh() {
    // console.log("下拉刷新");
	await this.loadmore('init')
    setTimeout(() => {
      uni.stopPullDownRefresh(); //停止下拉刷新动画
    }, 700);
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
	
	// s= 列表相关
	scrolltolower() {
		this.loadmore()
	},

	loadmore(status) {
		if(status && status === 'init'){
			this.queryParams.pageNum = 1
		} else {
			this.queryParams.pageNum++
		}

		// console.log( status, '触发!!!');
		// console.log( tenantGoodsRelList, '触发!!!');
		// console.log( this.que, '触发!!!');
		uni.showLoading();
		return tenantGoodsRelList(this.que, this.headerInfo).then(res=>{
			uni.hideLoading();
			console.log(res);
			this.total = res.data.total - 0

			if(status && status === 'init'){
				this.indexList = res.data.list
			} else {
				if (res.data.list.length === 0) {
					return;
				}
				// if(res.data.list.length < this.queryParams.pageSize){
				// 	this.status = 'noMore';
				// }
				this.indexList = [...this.indexList, ...res.data.list];
			}
			
		})




		

		// for (let i = 0; i < 30; i++) {
		// 	this.indexList.push({
		// 		url: this.urls[uni.$u.random(0, this.urls.length - 1)]
		// 	})
		// }
	},
	// 新增
	handleAdd() {
		uni.navigateTo({
			url: '/pages/material/materialCategory'
		});
	},
	// 编辑
	handlerEdit(row){
		uni.navigateTo({
			url: '/pages/material/materialCategory?cbData=' + JSON.stringify(row)
		});
	},

	// 删除
	handlerDelete(row){
		uni.showModal({
			title: '温馨提示',
			content: '确定要删除"'+ row.goodsTypeName +'"吗？',
			success: async res => {
				if (res.confirm) {
					await tenantGoodsRelDelete(row.id, this.headerInfo);
					this.queryParams.goodsTypeName = undefined
					this.loadmore('init')
					uni.showToast({
						title: '删除成功'
					});
				}
			}
		})
		
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