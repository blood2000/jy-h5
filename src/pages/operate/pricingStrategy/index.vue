<template>
	<view class="u-page">
		<HeaderBar title="运价策略" @back="navigateBack">
			<text slot="right" @click="handleAdd">新增策略</text>
		</HeaderBar>
		<view class="main">
			<view class="list" v-if="true">
				<view class="card-list"  v-for="item,index in list" :key="index">
					<view class="list-item" :class="modalName=='move-box-'+ index?'move-cur':''" 
					@touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index">
						<view class="title">
							{{item.name}}
						</view>
						<view class="">
							<span>当前定价：{{item.price ? item.price + '元' : 0}}</span>
						</view>
						<view class="">
							<span>定价有效期：{{item.endTime ? item.startTime + ' 到 ' + item.endTime : item.startTime ? '长期有效' : '暂无定价'}}</span>
						</view>
						<view class="move">
							<view class="bg-grey _btn" @tap="handleEdit(item)">编辑</view>
							<view class="bg-red  _btn" @tap="handleDelete(item)">删除</view>
						</view>
					</view>
					
				</view>
				
			</view>
			<uni-load-more v-if="list && list.length > 0" :status="status" :icon-size="16" :content-text="contentText" />
			<NonePage v-else></NonePage>
		</view>
		
		
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import {getList,deleteStrategy} from '@/config/service/operate/pricingStrategy/index'
	import NonePage from '@/components/NonePage/NonePage.vue';
	import HeaderBar from '@/components/Building/HeaderBar2.vue';
	export default {
		components: {
			NonePage,
			HeaderBar
		},
		computed: {
			...mapState({
				statusBarHeight: (state) => state.header.statusBarHeight,
				headerInfo: state => state.header.headerInfo
			})
		},
		data() {
			return {
				list:[],
				status:'more',
				isEnd:false,
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了'
				},
				queryParams: {
					pageNum: 1,
					pageSize: 10
				},
				modalName:null
			}
		},
		onShow(){
			this.handleQuery()
		},
		onLoad(option){
			this.$store.dispatch('getLoginInfoAction', {
				'Authorization': option.token
			});
			option.statusBarHeight && this.$store.dispatch('getStatusBarHeightAction', option.statusBarHeight);
			
			// this.getList();
		},
		onPullDownRefresh() {
			this.handleQuery()
			uni.stopPullDownRefresh();  //停止下拉刷新动画
		},
		// 触底加载
		onReachBottom() {
			if(!this.isEnd) {
				this.status = 'more';
				this.queryParams.pageNum++;
				this.getList();
			}
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
			handleQuery() {
			  this.queryParams.pageNum = 1;
			  this.list = [];
			  this.isEnd = false;
			  this.getList();
			},
			async getList() {
				this.status = 'loading';
				uni.showLoading();
				const data = await getList(this.queryParams, this.headerInfo);
				uni.hideLoading();
				// this.list = data.data.list
				if (data.data.list.length === 0) {
					this.isEnd = true;
					this.status = 'noMore';
					return;
				}
				if(data.data.list.length < this.queryParams.pageSize){
					this.status = 'noMore';
				}
				this.list = [...this.list,...data.data.list]
				// this.list.forEach(res => {
				// 	if(res.zjFenceList){
				// 		res.zjFenceList.forEach(item => {
				// 			Object.keys(item).forEach(v => {
				// 				if(item[v] === null ||item[v] === undefined ){
				// 					item[v] = ''
				// 				}
				// 			})
				// 		})
				// 	}
				// })
			},
			handleAdd(){
				uni.navigateTo({
					url:"/pages/operate/pricingStrategy/edit"
				})
			},
			handleEdit(item){
				uni.navigateTo({
					url:`/pages/operate/pricingStrategy/edit?id=${item.id}&name=${item.name}&effectivePlanNum=${item.orderPlanInfos ? item.orderPlanInfos.length : 0}`
				})
			},
			handleDelete(item){
				uni.showModal({
					title: '温馨提示',
					content: '确定要删除这条策略?',
					success: async res => {
						if (res.confirm) {
							deleteStrategy(item.id,this.headerInfo).then(res => {
								this.msgSuccess('res.msg')
								this.handleQuery()
							})
						}
					}
				})
			},
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},
			
			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},
			
			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-page {
		padding: 0;
		height: 100vh;
		.main{
			// height: calc(100% - 44px) ;
			padding: 24upx 32upx;
			background: #F5F5F5;
			.card-list{
				overflow: hidden;
				position: relative;
				// padding:	 20rpx;
				// max-height: calc(100% - 75px) ;
				width: 100%;
				background: #FFFFFF;
				margin-bottom: 22rpx;
				border-radius: 16px;
				.list-item{
					padding: 20rpx;
					transition: all .6s ease-in-out 0s;
					// transform: translateX(0rpx);
				}
				.title{
					width: 80%;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					font-size: 32rpx;
					font-weight: bold;
					margin-bottom: 12rpx;
				}
				.goods{
					// width: 320px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					margin-bottom: 12rpx;
					color: #878787;
				}
				.move{
					display: flex;
					position: absolute;
					top: 0;
					right: 0;
					width: 200rpx;
					height: 100%;
					transform: translateX(100%);
					._btn{
						display: flex;
						flex: 1;
						justify-content: center;
						align-items: center
					}
				}
				.move-cur {
					transform: translateX(-200rpx)
				}
			}
		}
		
	}
</style>