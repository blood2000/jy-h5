<template>
	<view class="home-page">
		<!-- 头部 -->
		<view :style="{height:statusBarHeight*2 + 108 +'upx'}"></view>
		<view class="title-frame">
			<view :style="{height:statusBarHeight*2+'upx'}"></view>
			<view class="title-bar size36 flex align-center justify-between">
				<view class="cuIcon-back" @click="handleBack"></view>
				<view class="text-bold">货品汇总</view>
				<view class="cuIcon-back" style="opacity: 0;"></view>
			</view>
		</view>
		<view v-for="(item,index) in list" :key="index" class="list-frame flex align-center flex-wrap">
			<view class="list-item" style="border-right: 1upx solid #ebebeb;width: 30%;">
				<view class="list-title ellipsis">{{item.goodsTypeName}}</view>
			</view>
			<view class="list-item flex align-center" style="width: 30%;">
				<view class="list-tag">车数</view>
				<view class="list-num">{{item.carNum}}</view>
			</view>
			<view class="list-item flex align-center" style="width: 40%;">
				<view class="list-tag">总毛重</view>
				<view class="list-num">{{item.grossWeight}}</view>
			</view>
			<view class="list-item flex align-center" style="width: 30%;">
				<view class="list-tag">备注</view>
				<view class="list-num">{{item.overloadRemark}}</view>
			</view>
			<view class="list-item flex align-center" style="width: 30%;">
				<view class="list-tag">净重</view>
				<view class="list-num">{{item.netWeight}}</view>
			</view>
			<view class="list-item flex align-center" style="width: 40%;">
				<view class="list-tag">总净重</view>
				<view class="list-num">{{floor(item.overloadRemark + item.netWeight)}}</view>
			</view>
		</view>
		<uni-load-more v-if="list.length !== 0" :status="status" :icon-size="16" :content-text="contentText" />
		<NonePage v-else></NonePage>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { statisticsList }from "@/config/service/statistics.js"
	import uniData from '@/utils/uni.webview.1.5.2.js'
	import NonePage from '@/components/NonePage/NonePage.vue';
	export default {
		components: {
			NonePage
		},
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			})
		},
		data() {
			return {
				system: null,
				statusBarHeight: 0, // 状态栏高度
				titleHeight: 0, // 标题栏高度
				naviBarHeight: 0, // 导航栏高度
				isEnd: false,
				status: 'more',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了'
				},
				queryParams: {
					startCreateTime: this.parseTime(Date.now(), '{y}-{m}-{d} 00:00:00'),
					endCreateTime: this.parseTime(Date.now(), '{y}-{m}-{d} 23:59:59'),
					receiveType: 2,
					isInvalid: 0,
					pageNum: 1,
					pageSize: 10
				},
				list: []
			}
		},
		onLoad(option) {
			this.$store.dispatch('getLoginInfoAction', {
				'Authorization': option.token
			});
			this.statusBarHeight = option.statusBarHeight;
			console.log(option);
			this.queryParams = JSON.parse(option.quer);
			console.log(this.queryParams);
			this.getList();
		},
		onPullDownRefresh() {
			this.clearQuery();
			this.queryParams.pageNum = 1
			this.getList();
		},
		onReachBottom() {
			console.log("触底")
			if(!this.isEnd) {
				this.status = 'more';
				this.queryParams.pageNum ++
				this.getList();
			}
		},
		methods: {
			handleBack() {
				uni.navigateBack();
			},
			getList() {
				statisticsList(this.queryParams, this.headerInfo).then(res => {
					if(res.rows.length === 0) {
						this.isEnd = true;
						this.status = 'noMore';
						return
					}
					if(res.rows.length < this.queryParams.pageSize){
						this.status = 'noMore';
					}
					this.list = [...this.list, ...res.rows];
					uni.stopPullDownRefresh();
					console.log(this.list)
				});
			},
			// 重置参数
			clearQuery() {
				this.isEnd = false;
				this.status = 'more';
				this.list = [];
			}
		}
	}
</script>

<style lang="scss" scoped>
.title-frame{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 10;
	background-color: #FFFFFF;
	.title-bar{
		padding: 30upx;
		color: #333333;
	}
}
.list-frame{
	margin: 24upx 30upx 0;
	padding: 0 20upx 30upx;
	background: #FFFFFF;
	border-radius: 24upx;
	.list-item{
		margin-top: 30upx;
		padding: 0 10upx;
		// width: 33%;
		.list-title{
			text-align: center;
			// letter-spacing: 10upx;
			margin: 0 auto 0 0;
			padding: 0 10upx;
			font-weight: bold;
			color: #FFFFFF;
			height: 37upx;
			line-height: 37upx;
			background: #3A65FF;
			border-radius: 0 18upx 18upx 18upx;
		}
		.list-tag{
			margin-right: 10upx;
			font-size: 24upx;
			font-weight: 500;
			color: #878787;
		}
		.list-num{
			font-size: 32upx;
			font-family: Bahnschrift;
			font-weight: normal;
			color: #333333;
			line-height: 1;
		}
	}
	
}
</style>
