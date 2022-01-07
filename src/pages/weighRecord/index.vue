<template>
	<view class="content-page" :style="{'--statusBar12': (statusBar12) + 'px' }">
		<HeaderBar title="过磅记录" @back="navigateBack" :border="false"></HeaderBar>
	  <!-- main -->
	  <view class="main-box">
			<!-- 筛选 -->
			<view class="filter-wrap">
				<view class="item-filter">
					<!-- 选择时间 -->
					<datetimerangePicker v-model="effectiveDate" @getList="getList" />
				</view>
			</view>
			<!-- 磅房列表 -->
			<view class="list-wrap">
				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltolower="scrolltolower">
					<ListPoundRoom :list="dataList" />
					<uni-load-more :status="status" :icon-size="16" :content-text="contentText" />
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import HeaderBar from '@/components/Building/HeaderBar';
	import datetimerangePicker from './inc/DatetimerangePicker'
	import ListPoundRoom from './inc/ListPoundRoom'
	import { buildInfoList } from '@/config/service/weighRecord/index.js'
	import { mapState } from 'vuex';
	export default {
		components: {
			HeaderBar,
			datetimerangePicker,
			ListPoundRoom
		},
		data() {
			return {
				scrollTop: 0,
				statusBar12: 0,
				oldDatePicker1: Date.now(), // 改变key值重新渲染
				effectiveDate: [], // 转成 开始时间 和 结束时间
				dataList: [],
				status: 'more',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了'
				},
				pageNum: 1
			}
		},
		async onLoad(options) {
			if(options.token){
				this.$store.dispatch('getLoginInfoAction', {
					'Authorization': options.token
				});
				options.statusBarHeight && this.$store.dispatch('getStatusBarHeightAction', options.statusBarHeight);
			}
			this.statusBar12 = this.statusBarHeight;
			if(uni.getSystemInfoSync().platform == 'ios'){
				this.statusBar12 -= 10
			}

			// 获取jyzCode
			// const res = await queryUserInfo({ userCode: uni.getStorageSync('userInfo').userCode });
			this.jyzCode = '170234e12abb405aa0cd475e7c824866';

			this.getList();
		},
		methods: {
			/**
			 * 返回上一页
			 */
			navigateBack() {
				uni.navigateBack();
			},
			// 触底
			scrolltolower(e) {
				if(!this.isEnd) {
					this.pageNum++;
				}
			},
			/**
			 * 获取磅房列表
			 */
			getList(isRefresh=false) {
				if(isRefresh) {
					this.resetLoadMoreData();
				}
				this.status = 'loading';
				buildInfoList({
					pageNum: this.pageNum,
					pageSize: 10,
					buildingType: 1,
					jyzCode: this.jyzCode,
					startTime: this.parseTime(this.effectiveDate[0], '{y}-{m}-{d} {h}:{i}:{s}') || '',
					endTime: this.parseTime(this.effectiveDate[1], '{y}-{m}-{d} {h}:{i}:{s}') || ''
				}, this.headerInfo).then((res) => {
					this.dataList = res.data.list;
					if(!res.data.hasNextPage) {
						this.isEnd = !res.data.hasNextPage;
						this.status = 'noMore'
					}
					else {
						this.isEnd = false;
						this.status = 'more';
					}
				})
			},
			/**
			 * 重置分页数据
			 */
			resetLoadMoreData() {
				this.isEnd = false;
				this.pageNum = 1;
				this.dataList = [];
			}
		},
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			}),
		}
	}
</script>

<style lang="scss" scoped>
/deep/ .uni-load-more__text {
	font-size: 24upx;
}
.content-page {
	font-size: 28upx;
	font-family: PingFang SC;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	overflow: hidden;
}
.main-box{
	height: calc(100% - 88upx);
	padding: 24upx 30upx 0;
	background: url(@/static/weighRecord/bg.png) #f5f5f5 no-repeat;
	background-size: contain;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}
.filter-wrap {
	width: 100%;
	.item-filter {
		display: flex;
		align-items: center;
	}
}
.list-wrap {
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
	margin: 0 -30upx;
	margin-top: 28upx;
	padding: 0 30upx;
	.scroll-Y {
		height: 100%;
	}	
}
</style>
