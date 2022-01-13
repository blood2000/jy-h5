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
						@scroll="handerlScroll"
						preLoadScreen="1.5"
						:lowerThreshold ='20'
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
						<uni-load-more v-if="indexList && indexList.length > 0" :status="status" :icon-size="16" :content-text="{
							contentdown: '上拉加载更多',
							contentrefresh: '加载中',
							contentnomore: '没有更多了'
						}" />
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
        pageSize: 20,

        orderName: undefined // 定价策略
      },
	  indexList: [],
	  total: 0,
	  cbData: null,

	  // 追加
	  status: true, // 0启用 1禁用
	  statusBar12: 0,

	  status:'more', // more|loading|noMore
	  isScollValue: false
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

	que(){
		return {
			...removePropertyOfNull(this.queryParams) 
		}
	}
  },
  async onLoad(options) {
	  const pages = getCurrentPages();
	console.log(pages, '当前页');
	console.log(options, '几次');

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

	// handerlScroll
	handerlScroll(ee){
		this.isScollValue = ee > 100
		
	},
	
	// s= 列表相关
	scrolltolower(e) {
		if(!this.isScollValue) return
		// console.log(e, '触底');
		this.loadmore()
	},

	loadmore(status) {
		if(status && status === 'init'){
			this.queryParams.pageNum = 1
		} else {
			if(this.status === 'noMore') return
			this.queryParams.pageNum++
		}

		uni.showLoading();
		this.status = 'loading'

		return orderInfoList(this.que, this.headerInfo).then(res=>{
			uni.hideLoading();
			this.status = 'more'

			
			this.total = res.data.total - 0

			if(res.data.list.length < this.que.pageSize){
				// 没有更多了
				this.status = 'noMore';
			}

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