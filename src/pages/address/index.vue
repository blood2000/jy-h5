<template>
	<view class="u-page">
		<HeaderBar title="地址管理" @back="navigateBack">
			<text slot="right" @click="handleAdd">新增地址</text>
		</HeaderBar>
		
		<view class="main">
			<view class="list" v-if="true">
				<view class="card-list" v-for="item,index in list" :key="index" @tap="handleEdit(item)">
					<view class="title">
						{{item.companyAddrName}}
					</view>
					<view class="address">
						{{item.detail}}
					</view>
					<view class="electric">
						<img src="../../static/address/electric.png" mode="" />
						<span>关联电子围栏数：{{item.zjFenceList ? item.zjFenceList.length : 0}}</span>
					</view>
					<view class="btn">
						<switch class="switch-sex" :class="!item.status?'checked':''" :checked="!item.status" @tap.stop @change="changeStatus(item)" />
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
	import {getList,tenantCompanyAddressInfoUpdateStatus as changeStatus} from '@/config/service/address/index'
	import NonePage from '@/components/NonePage/NonePage.vue';
	import HeaderBar from '@/components/Building/HeaderBar2.vue';
	export default {
		components: {
			NonePage,
			HeaderBar
		},
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			})
		},
		data() {
			return {
				list:[],
				status:'more',
				isEnd:false,
				location:undefined,
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了'
				},
				queryParams: {
					pageNum: 1,
					pageSize: 10
				},
			}
		},
		onShow(){
			
		},
		onLoad(option){
			this.$store.dispatch('getLoginInfoAction', {
				'Authorization': option.token
			});
			const {longitude,latitude} =option.location ? JSON.parse(option.location) : {longitude:116.397497,latitude:39.906888}
			this.location = longitude ? [longitude,latitude] : [116.397497,39.906888]
			option.statusBarHeight && this.$store.dispatch('getStatusBarHeightAction', option.statusBarHeight);
			this.handleQuery()
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
				this.list.forEach(res => {
					if(res.zjFenceList){
						res.zjFenceList.forEach(item => {
							Object.keys(item).forEach(v => {
								if(item[v] === null ||item[v] === undefined ){
									item[v] = ''
								}
							})
						})
					}
				})
			},
			handleAdd(){
				uni.navigateTo({
					url:"/pages/address/edit?location=" + JSON.stringify(this.location)
				})
			},
			handleEdit(item){
				uni.navigateTo({
					url:"/pages/address/edit?data=" + JSON.stringify(item)
				})
			},
			changeStatus(item){
				changeStatus({id:[item.id],status:(item.status ? 0 : 1)},this.headerInfo).then(() => {item.status = !item.status}) // this.handleQuery()
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
				position: relative;
				padding: 20rpx;
				// max-height: calc(100% - 75px) ;
				width: 100%;
				background: #FFFFFF;
				margin-bottom: 22rpx;
				border-radius: 16px;
				.title{
					width: 80%;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					font-size: 32rpx;
					font-weight: bold;
					margin-bottom: 12rpx;
				}
				.address{
					// width: 320px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					margin-bottom: 12rpx;
					color: #878787;
				}
				.electric{
					font-weight: bold;
					img{
						height: 42rpx;
						width: 42rpx;
						margin-right: 12rpx;
					}
					span{
						vertical-align: top;
					}
				}
				.btn{
					position: absolute;
					top:20rpx;
					right: 20rpx;
					.switch-sex{
						transform:scale(0.8)
					}
					.switch-sex::after {
						content: "开";
					}
					
					.switch-sex::before {
						content: "关";
					}
					
				}
			}
		}
		
	}
</style>