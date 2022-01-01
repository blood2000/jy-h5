<template>
	<view class="home-page">
		<!-- 头部 -->
		<view class="title-frame">
			<view :style="{height:statusBarHeight*2+'upx'}"></view>
			<view class="title-bar size36 flex align-center justify-between">
				<view class="cuIcon-back" @click="handleBack"></view>
				<view class="text-bold">自定义统计</view>
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
			<view class="search-frame flex align-center">
				<picker @change="PickerChange" :value="index" :range="receiveTypePicker" style="width: 208upx;">
					<view class="flex align-center justify-between">
						<view v-if="index>-1" class="picker">{{ receiveTypePicker[index] }}</view>
						<view v-else class="picker text-grey">选择查询条件</view>
						<view class="cuIcon-triangledownfill size40 text-grey"></view>
					</view>
				</picker>
				<view class="text-grey" style="margin: 0 10upx;">|</view>
				<input class="search-input" v-model="queryParams.goodsTypeName" placeholder="按查询条件输入商品名称" name="input" @blur="changeName"></input>
				<view v-if="queryParams.receiveType || queryParams.endCreateTime" class="cuIcon-roundclose text-grey margin-mleft" @click="handleCleartype"></view>
			</view>
		</view>
		<!-- 背景 -->
		<view :style="{height:statusBarHeight*2 + 276 +'upx'}"></view>
		<view class="list-bgframe">
			<view :style="{height:statusBarHeight*2 + 268 +'upx'}"></view>
			<view class="list-bg"></view>
		</view>
		<!-- 列表 -->
		<view class="list-frame" v-for="(item, index) in list" :key="index">
			<view class="list-titleframe flex justify-between" :class="item.receiveType == 1?'list-bgreceive list-tagreceive':'list-bgdeliver list-tagdeliver'">
				<view class="flex">
					<image class="list-titleicon margin-sright" :src="item.receiveType == 1?'/static/statistics/icon_receive.png':'/static/statistics/icon_deliver.png'" mode=""></image>
					<view class="size32 text-bold">{{selectDictLabel(receiveTypeOptions, item.receiveType)}}</view>
				</view>
				<view class="">{{item.goodsTypeName || '无'}}</view>
			</view>
			<view class="list-numframe flex align-center justify-between flex-wrap">
				<view class="list-numlist">
					<view class="list-numcont">{{item.carNum || 0}}</view>
					<view class="list-numtitle margin-stop">总车数</view>
				</view>
				<view class="list-numlist">
					<view class="list-numcont">{{item.grossWeight || 0}}</view>
					<view class="list-numtitle margin-stop">总毛重（吨）</view>
				</view>
				<view class="list-numlist">
					<view class="list-numcont">{{item.tareWeight || 0}}</view>
					<view class="list-numtitle margin-stop">总皮重（吨）</view>
				</view>
				<view class="list-numlist">
					<view class="list-numcont">{{item.netWeight || 0}}</view>
					<view class="list-numtitle margin-stop">总净重（吨）</view>
				</view>
				<view class="list-numlist">
					<view class="list-numcont">{{item.realWeight || 0}}</view>
					<view class="list-numtitle margin-stop">总实重（吨）</view>
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
					startCreateTime: '',
					endCreateTime: '',
					receiveType: '',
					goodsTypeName: '',
					isInvalid: 0,
					pageNum: 1,
					pageSize: 10
				},
				list: [],
				receiveTypeOptions: [
					{ 'dictLabel': '收货', 'dictValue': 1 },
					{ 'dictLabel': '发货', 'dictValue': 2 }
				],
				index: -1,
				receiveTypePicker: ['收货', '发货'],
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
				statisticsList(this.quer, this.headerInfo).then(res => {
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
				this.queryParams.startCreateTime = e.detail.value
				if (this.queryParams.endCreateTime){
					this.clearQuery();
					this.queryParams = {
						...this.queryParams,
						pageNum: 1
					}
					this.getList();
				}
			},
			endDateChange(e) {
				this.queryParams.endCreateTime = e.detail.value
				if (this.queryParams.startCreateTime){
					this.clearQuery();
					this.queryParams = {
						...this.queryParams,
						pageNum: 1
					}
					this.getList();
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
			},
			handleCleartype() {
				this.clearQuery();
				this.queryParams = {
					...this.queryParams,
					receiveType: '',
					goodsTypeName: '',
					pageNum: 1
				}
				this.index = -1;
				this.getList();
			},
			// 条件选择
			PickerChange(e) {
				this.index = e.detail.value
				this.queryParams.receiveType = e.detail.value + 1
				if (this.queryParams.goodsTypeName){
					this.clearQuery();
					this.queryParams = {
						...this.queryParams,
						pageNum: 1
					}
					this.getList();
				}
			},
			changeName() {
				if (this.queryParams.goodsTypeName && this.queryParams.receiveType){
					this.clearQuery();
					this.queryParams = {
						...this.queryParams,
						pageNum: 1
					}
					this.getList();
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
::v-deep .uni-load-more__text{
	color: #999 !important;
}
::v-deep .uni-input-placeholder{
	color: #8799a3;
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
.search-frame{
	margin: 0 30upx 30upx;
	padding: 0 20upx;
	height: 70upx;
	background: #FFFFFF;
	border-radius: 10upx;
	.search-input{
		width: 360upx;
		font-size: 28upx;
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
	margin: 0 30upx;
	border-radius: 24upx;
	.list-titleframe{
		position: relative;
		top: 36upx;
		z-index: 2;
		height: 110upx;
		padding: 20upx;
		border-radius: 24upx;
		.list-titleicon{
			height: 42upx;
			width: 42upx;
		}
	}
	.list-bgdeliver{
		background: url('/static/statistics/bg_deliver.png') 0% 0% / 100% 100%;
	}
	.list-bgreceive{
		background: url('/static/statistics/bg_receive.png') 0% 0% / 100% 100%;
	}
	.list-tagdeliver{
		color: #3A65FF;
	}
	.list-tagreceive{
		color: #59BE32;
	}
	.list-numframe{
		position: relative;
		z-index: 3;
		padding: 0 30upx 43upx;
		border-radius: 24upx;
		background-color: #FFFFFF;
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
