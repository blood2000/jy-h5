<!-- 货源管理 -->
<template>
  <view class="content-page" :style="{'--statusBar12': (statusBar12) + 'px' }">
	<HeaderBar title="货源管理" @back="navigateBack">
			<text style="color:#3A65FF" slot="right" @click="handleAdd">新增</text>
	</HeaderBar>
    <!-- main -->
    <view class="main-box">
    	<!-- 搜索框 -->
		<view>
			<u-search shape="square" bgColor="#fff" :showAction="false" placeholder="请输入货源名称" v-model="queryParams.orderName" 
			@clear="loadmore('init')" 
			@search="loadmore('init')"></u-search>
		</view>
		
		<template>
			<view class="totl-box">
				共 <text class="totl-text">{{ total }}</text> 条记录
			</view>
			<!-- 列表 -->
			<view class="lsit-box" v-if="!!indexList.length">
				<view class="list-view">
					<u-list
						@scrolltolower="scrolltolower"
						preLoadScreen="1.5"
					>
						<u-list-item
							v-for="(item, index) in indexList"
							:key="index"
							
						>

							<u-cell @click="handlerEdit(item)">	
							  <view
								slot="title"
							>
								<view class="title-style">{{item.orderName}}</view>

							</view>

							  <view slot="right-icon" @click.stop="()=>{}">
								<u-switch v-model="item._status" size="20" @change="changeStatus(item)"></u-switch>
							  </view>
							</u-cell>
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

import { mapState } from "vuex";
import HeaderBar from '@/components/Building/HeaderBar2.vue';
import { removePropertyOfNull } from '@/utils/ddc';

// 请求接口
import {orderInfoList, orderInfoUpdateStatus} from '@/config/service/orders/index'
export default {
  name:'orders',
  data() {
    return {
	  queryParams: { // 请求参数
        pageNum: 1,
        pageSize: 10,

        orderName: undefined // 定价策略
      },
	  indexList: [],
	  total: 0,
	  cbData: null,

	  // 追加
	  status: true, // 0启用 1禁用
	  statusBar12: 0
    };
  },

  components: { HeaderBar },
  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
	  isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
    }),
	// statusBar12(){
	// 	let height = this.statusBarHeight - 0

	// 	let platform=uni.getSystemInfoSync().platform
	// 	if(platform=='ios'){
	// 		height -= 10
	// 	}
	// 	return height
	// },	
	

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

	this.statusBar12 = this.statusBarHeight - 0
	let platform=uni.getSystemInfoSync().platform
	if(platform=='ios'){
		this.statusBar12 -= 10
	}
  },
  onShow() {},

  async onPullDownRefresh() {
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

		uni.showLoading();
		return orderInfoList(this.que, this.headerInfo).then(res=>{
			uni.hideLoading();

			
			this.total = res.data.total - 0

			const _data = res.data.list.map(e=> {
			    e._status = e.status === 0
				return e
			})

			if(status && status === 'init'){
				this.indexList = _data
			} else {
				if (_data.length === 0) {
					return;
				}
			
				this.indexList = [...this.indexList, ..._data];
			}
			
		})
	},
	// 新增
	handleAdd() {
		uni.navigateTo({
			url: '/pages/orders/add'
		});
	},
	// 编辑
	handlerEdit(row){
		uni.navigateTo({
			url: '/pages/orders/add?cbData=' + JSON.stringify(row)
		});
	},

	// 启用/禁用
	async changeStatus(_data){
		const que = {
			status: _data._status? 0 : 1,
			id: [_data.id]
		};

		await orderInfoUpdateStatus( {isArrayQuery: JSON.stringify(que)},this.headerInfo);

		uni.showToast({
			title: _data._status? '启用成功': '禁用成功'
		});
	},
	
	// e=
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
		height: calc(100vh);
		overflow: hidden;
		display: felx;
		flex-direction: column;
	}
	.hwiunefwiniwn{
		font-weight: 400;
		color: #3A65FF;
	}
	.main-box{
		height: calc(100% - 100upx - var(--statusBar12));
		padding: 24upx 32upx;
		background: #F5F5F5;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.totl-box{
		font-weight: bold;
		margin: 24upx 0;
		color: #878787;
		.totl-text{
			color: #333333;
			padding: 0 10upx;
		}
	}
	
	.lsit-box{
		max-height: calc(100% - 150upx);
		overflow: hidden;
		width: 100%;
		padding: 22upx;
		background: #FFFFFF;
		border-radius: 16upx;
		.list-view{
			height: 100%;
			overflow: hidden;
		}
	}
	.u-list{
		height: calc(100vh - 334upx) !important;
		
	}
	
	.title-style{
		font-size: 28upx;
		font-weight: bold;
		color: #333333;
	}
	.tag-box{
		display: flex;
		
	}
	
</style>