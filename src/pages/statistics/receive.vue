<template>
	<view class="home-page">
		<!-- 头部 -->
		<view class="title-frame">
			<view :style="{height:statusBarHeight*2+'upx'}"></view>
			<view class="title-bar size36 flex align-center justify-between">
				<view class="cuIcon-back" @click="handleBack"></view>
				<view class="text-bold">收货统计</view>
				<view class="cuIcon-back" style="opacity: 0;"></view>
			</view>
			<view class="time-frame flex align-center text-white text-bold">
				<image class="time-icon margin-mright" src="/static/statistics/icon_time.png" mode=""></image>
				<picker mode="date" :value="queryParams.startCreateTime" start="1900-01-01" end="3000-01-01" @change="startDateChange">
					<view v-if="queryParams.startCreateTime" class="picker">{{queryParams.startCreateTime}}</view>
					<view v-else class="picker">选择开始时间</view>
				</picker>
				<view class="margin-lr">到</view>
				<picker mode="date" :value="queryParams.endCreateTime" start="1900-01-01" end="3000-01-01" @change="endDateChange">
					<view v-if="queryParams.endCreateTime" class="picker">{{queryParams.endCreateTime}}</view>
					<view v-else class="picker">选择结束时间</view>
				</picker>
				<view v-if="queryParams.startCreateTime || queryParams.endCreateTime" class="cuIcon-roundclose size30 margin-mleft" @click="handleClear"></view>
			</view>
		</view>
		<!-- 背景 -->
		<view :style="{height:statusBarHeight*2 + 176 +'upx'}"></view>
		<view class="list-bgframe">
			<view :style="{height:statusBarHeight*2 + 170 +'upx'}"></view>
			<view class="list-bg"></view>
		</view>
		<!-- 列表 -->
		<view class="list-frame" v-for="(item, index) in list" :key="index">
			<view class="list-componyframe flex align-center justify-between">
				<view class="">
					<view class="flex align-center">
						<view class="list-tag list-tagbgreceive flex align-center justify-center">收</view>
						<view class="list-namedeliver">{{item.recCompnayInfoName || '无'}}</view>
					</view>
					<view class="flex align-center margin-stop">
						<view class="list-tag list-tagbgdeliver flex align-center justify-center">发</view>
						<view class="list-namereceive">{{item.sedCompnayInfoName || '无'}}</view>
					</view>
				</view>
				<view class="list-goods">{{item.goodsTypeName || '无'}}</view>
			</view>
			<view class="list-numframe flex align-center justify-between flex-wrap">
				<view class="list-numlist">
					<view class="list-numcont">{{item.carNum || 0}}</view>
					<view class="list-numtitle margin-stop">车数</view>
				</view>
				<view class="list-numlist">
					<view class="list-numcont">{{item.netWeight || 0}}</view>
					<view class="list-numtitle margin-stop">原发数（净重）</view>
				</view>
				<view class="list-numlist">
					<view class="list-numcont">{{item.realWeight || 0}}</view>
					<view class="list-numtitle margin-stop">实收数（实重）</view>
				</view>
				<view class="list-numlist">
					<view class="list-numcont">{{item.grossWeight || 0}}</view>
					<view class="list-numtitle margin-stop">总毛重</view>
				</view>
				<view class="list-numlist">
					<view class="list-numcont">{{item.tareWeight || 0}}</view>
					<view class="list-numtitle margin-stop">总皮重</view>
				</view>
				<view class="list-numlist">
					<view class="list-numcont">{{item.lossWeight || 0}}</view>
					<view class="list-numtitle margin-stop">亏涨吨</view>
				</view>
			</view>
		</view>
		<uni-load-more v-if="list.length !== 0" :status="status" :icon-size="16" :content-text="contentText" />
		<NonePage v-else></NonePage>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { planStatisticsList }from "@/config/service/statistics.js"
	import uniData from '@/utils/uni.webview.1.5.2.js'
	import NonePage from '@/components/NonePage/NonePage.vue';
	export default {
		components: {
			NonePage
		},
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			}),
			quer(){
				// startCreateTime: this.parseTime(getTodayUnix(), '{y}-{m}-{d} {h}:{i}:{s}'),
				// endCreateTime: this.parseTime(Date.now(), '{y}-{m}-{d} {h}:{i}:{s}'),

				return {
					...this.queryParams,
					startCreateTime: this.queryParams.startCreateTime?this.queryParams.startCreateTime + ' 00:00:00' : '',
					endCreateTime: this.queryParams.endCreateTime?this.queryParams.endCreateTime + ' 23:59:59' : '',
				}
			}
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
					startCreateTime: this.parseTime(Date.now(), '{y}-{m}-{d}'),
					endCreateTime: this.parseTime(Date.now(), '{y}-{m}-{d}'),
					isInvalid: 0,
					receiveType: 1,
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
			const res = uni.getSystemInfoSync()
			this.system = res.platform;
			this.statusBarHeight = option.statusBarHeight
			if (this.system === 'android') {
				this.titleHeight = (48 + this.statusBarHeight)
			} else if (this.system === 'ios') {
				this.titleHeight = (44 + this.statusBarHeight)
			}
			this.naviBarHeight = this.titleHeight - this.statusBarHeight;
			this.getList();
		},
		onPullDownRefresh() {
			this.clearQuery();
			this.queryParams = {
				...this.queryParams,
				startCreateTime: '',
				endCreateTime: '',
				pageNum: 1
			}
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
				uni.webView.navigateBack();
			},
			getList() {
				planStatisticsList(this.quer, this.headerInfo).then(res => {
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
				});
			},
			// 重置参数
			clearQuery() {
				this.isEnd = false;
				this.status = 'more';
				this.list = [];
			},
			startDateChange(e) {
				if (this.queryParams.endCreateTime){
					if (new Date(this.parseTime(this.queryParams.endCreateTime, '{y}/{m}/{d} {h}:{i}{s}')).getTime() < new Date(this.parseTime(this.queryParams.startCreateTime, '{y}/{m}/{d} {h}:{i}{s}')).getTime()){
						this.msgSuccess('开始时间必须小于或等于结束时间，请重新选择');
						this.queryParams.startCreateTime = null;
					} else {
						this.queryParams.startCreateTime = e.detail.value;
						this.clearQuery();
						this.queryParams = {
							...this.queryParams,
							pageNum: 1
						}
						this.getList();
					}
				} else {
					this.queryParams.startCreateTime = e.detail.value;
				}
			},
			endDateChange(e) {
				if (this.queryParams.startCreateTime){
					if (new Date(this.parseTime(this.queryParams.endCreateTime, '{y}/{m}/{d} {h}:{i}{s}')).getTime() < new Date(this.parseTime(this.queryParams.startCreateTime, '{y}/{m}/{d} {h}:{i}{s}')).getTime()){
						this.msgSuccess('结束时间必须大于或等于开始时间，请重新选择');
						this.queryParams.endCreateTime = '';
					} else {
						this.queryParams.endCreateTime = e.detail.value;
						this.clearQuery();
						this.queryParams = {
							...this.queryParams,
							pageNum: 1
						}
						this.getList();
					}
				} else {
					this.queryParams.endCreateTime = e.detail.value;
				}
			},
			handleClear() {
				this.clearQuery();
				this.queryParams = {
					...this.queryParams,
					startCreateTime: '',
					endCreateTime: '',
					pageNum: 1
				}
				this.getList();
			}
		}
	}
</script>

<style lang="scss" scoped>
::v-deep .uni-load-more__text{
	color: #999 !important;
}
.home-page{
	font-family: 'PingFang Regular';
}
.title-frame{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 10;
	background-color: #3A65FF;
	.title-bar{
		padding: 30upx;
		color: #FFFFFF;
	}
}
.time-frame{
	padding: 0 30upx 30upx;
	.time-icon{
		height: 25upx;
		width: 25upx;
	}
}
.list-bgframe{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 0;
	.list-bg{
		height: 394upx;
		background: linear-gradient(0deg, rgba(58, 101, 255, 0) 0%, #3A65FF 100%);;
	}
}
.list-frame{
	position: relative;
	z-index: 1;
	margin: 0 30upx 30upx;
	background: #FFFFFF;
	border-radius: 24upx;
	.list-componyframe{
		padding: 43upx 30upx 24upx;
		border-bottom: 1upx solid #F0F0F0;
		.list-tag{
			margin-right: 25upx;
			width: 30upx;
			height: 30upx;
			border-radius: 4upx;
			font-size: 20upx;
			color: #FFFFFF;
		}
		.list-tagbgdeliver{
			background: #3A65FF;
		}
		.list-tagbgreceive{
			background: #59BE32;
		}
		.list-namedeliver{
			font-size: 32upx;
			font-weight: bold;
			color: #333333;
		}
		.list-namereceive{
			font-size: 24upx;
			color: #878787;
		}
		.list-goods{
			font-size: 32upx;
			font-weight: bold;
			color: #3A65FF;
		}
	}
	.list-numframe{
		padding: 0 30upx 43upx;
		.list-numlist{
			margin-top: 40upx;
			width: 33%;
			.list-numcont{
				font-size: 40upx;
				font-weight: bold;
				color: #333333;
			}
			.list-numtitle{
				font-size: 24upx;
				font-weight: 400;
				color: #878787;
			}
		}
	}
}
</style>
