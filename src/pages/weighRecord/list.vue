<template>
	<view class="content-page" :style="{'--statusBar12': (statusBar12) + 'px' }">
		<HeaderBar title="过磅记录" @back="navigateBack" :border="false"></HeaderBar>
	  <!-- main -->
	  <view class="main-box">
			<!-- 筛选 -->
			<view class="filter-wrap">
				<view class="item-filter select">
					<!-- 选择时间 -->
					<datetimerangePicker v-model="effectiveDate" />
					<!-- 筛选条件 -->
					<view class="btn-filter" @click="openPopFilter">筛选</view>
				</view>
				<view class="item-filter input">
					<input type="text" placeholder="输入车牌或司机名字或手机号" class="input-search" />
				</view>
			</view>
			<!-- 过磅记录 -->
			<view class="list-wrap">
				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltolower="scrolltolower">
					<!-- 记录列表 -->
					<ListRecord :list="dataList" />
					<uni-load-more v-if="dataList && dataList.length > 0" :status="status" :icon-size="16" :content-text="contentText" />
				</scroll-view>
			</view>
		</view>
		<!-- 筛选弹出窗 -->
		<uni-popup ref="popup" :mask-click="false" type="bottom">
			<PopFilter
				v-model="filterForm"
				:weighbridgeList="weighbridgeList"
				:weighStatusList="weighStatusList"
				:transportPlanList="transportPlanList"
				:companyList="companyList"
				:weighTypeList="weighTypeList"
				@closePopFilter="closePopFilter"
				@doFilter="doFilter"
				ref="pop_filter"
				 />
		</uni-popup>
	</view>
</template>

<script>
		import HeaderBar from '@/components/Building/HeaderBar';
		import datetimerangePicker from './inc/DatetimerangePicker';
		import ListRecord from './inc/ListRecord';
		import PopFilter from './inc/PopFilter';
		import { mapState} from 'vuex';
		export default {
			components: {
				HeaderBar,
				datetimerangePicker,
				PopFilter,
				ListRecord
			},
			data() {
				return {
					scrollTop: 0,
					statusBar12: 0,
					dataList: [{ // 过磅记录
						id: 1
					},{
						id: 2
					},{
						id: 3
					},{
						id: 4
					},{
						id: 5
					},{
						id: 6
					},{
						id: 7
					}],
					// 是否无数据了
					isEnd: false,
					status: '',
					contentText: {
						contentdown: '上拉加载更多',
						contentrefresh: '加载中',
						contentnomore: '没有更多了'
					},
					effectiveDate: [], // 转成 开始时间 和 结束时间
					filterForm: {
						weighType: '', // 1皮重过磅 2 毛重过磅
						companyId: '', // 收发企业
						transportPlanId: '', // 运输计划
						weighbridgeId: '', // 地磅
						weighStatusId: '' // 称重状况
					},
					companyList: [{ // 收发企业
						name: '衢州宝红建材有限公司',
						id: 1
					}, {
						name: '浙江宝红商品砼有限公司',
						id: 2
					}],
					weighbridgeList: [{ // 地磅
						name: '1号地磅',
						id: 1
					}, {
						name: '2号地磅',
						id: 2
					}, {
						name: '3号地磅',
						id: 3
					}],
					weighStatusList: [{ // 称重状况
						name: '已完成',
						id: 1
					}, {
						name: '未完成',
						id: 2
					}],
					companyList: [{ // 全部收发企业
						name: '衢州宝红建材有限公司',
						id: 1
					}, {
						name: '浙江宝红商品砼有限公司',
						id: 2
					}, {
						name: '浙江宝红商品砼有限公司',
						id: 3
					}, {
						name: '浙江宝红商品砼有限公司',
						id: 4
					}, {
						name: '浙江宝红商品砼有限公司',
						id: 5
					}, {
						name: '浙江宝红商品砼有限公司',
						id: 6
					}, {
						name: '浙江宝红商品砼有限公司',
						id: 7
					}, {
						name: '浙江宝红商品砼有限公司',
						id: 8
					}, {
						name: '浙江宝红商品砼有限公司',
						id: 9
					}, {
						name: '浙江宝红商品砼有限公司',
						id: 10
					}, {
						name: '浙江宝红商品砼有限公司',
						id: 11
					}, {
						name: '浙江宝红商品砼有限公司',
						id: 12
					}],
					transportPlanList: [{ // 运输计划
						name: '东坡收原煤路线1',
						id: 1
					}, {
						name: '东坡收原煤路线2',
						id: 2
					}],
					weighTypeList: [{ // 过磅类型
						name: '皮重过磅',
						id: 1
					}, {
						name: '毛重过磅',
						id: 2
					}]
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
			},
			onReady() {
			},
			onReachBottom() {
				console.log('到底了')
			},
			methods: {
				/**
				 * 返回上一页
				 */
				navigateBack() {
					uni.navigateBack();
				},
				/**
				 * 打开筛选弹出窗
				 */
				openPopFilter() {
					this.$refs.popup.open()
				},
				/**
				 * 关闭筛选弹出窗
				 */
				closePopFilter() {
					this.$refs.popup.close()
				},
				// 触底
				scrolltolower(e) {
					console.log('触达底部')
					if(!this.isEnd) {
						this.status = 'loading';
					}
				},
				/**
				 * 确认筛选
				 */
				doFilter() {
					this.closePopFilter();
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
	.input-search {
		height: 72upx;
		background-color: #fff;
		border-radius: 10upx;
		width: 100%;
		padding: 0 16upx;
		font-size: 28upx;
		::v-deep .uni-input-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: row;
			&::before {
				content: '';
				display: block;
				width: 32upx;
				height: 32upx;
				background: url(@/static/weighRecord/icon_search.png) no-repeat;
				background-size: contain;
				margin-right: 10upx;
			}
			.uni-input-placeholder {
				left: 42upx;
				width: calc(100% - 42upx);
			}
		}
	}
	::v-deep .uni-load-more__text {
		font-size: 28upx;
	}
	.filter-wrap {
		width: 100%;
		.item-filter {
			display: flex;
			align-items: center;
			&.select {
				font-size: 28upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.btn-filter {
					font-size: 28upx;
					display: flex;
					align-items: flex-start;
					line-height: 1;
					color: #fff;
					&::after {
						content: '';
						display: block;
						width: 30upx;
						height: 30upx;
						background: url(@/static/weighRecord/icon_filter.png) no-repeat;
						background-size: contain;
						margin-left: 10upx;
					}
				}
			}
			&.input {
				margin-top: 40upx;
			}
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
