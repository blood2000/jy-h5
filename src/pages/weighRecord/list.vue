<template>
	<view class="content-page" :style="{'--statusBar12': (statusBar12) + 'px' }">
		<HeaderBar title="过磅记录" @back="navigateBack" :border="false"></HeaderBar>
	  <!-- main -->
	  <view class="main-box">
			<!-- 筛选 -->
			<view class="filter-wrap">
				<view class="item-filter select">
					<!-- 选择时间 -->
					<datetimerangePicker v-model="effectiveDate" @getList="getList" />
					<!-- 筛选条件 -->
					<view class="btn-filter" @click="openPopFilter" :filterForm="filterForm">筛选</view>
				</view>
				<view class="item-filter input">
					<input type="text" placeholder="输入车牌或司机名字或手机号" class="input-search" v-model="searchKey" @input="onInputSearchKey" />
				</view>
			</view>
			<!-- 过磅记录 -->
			<view class="list-wrap">
				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltolower="scrolltolower">
					<!-- 记录列表 -->
					<ListRecord :list="dataList" :deviceNo="deviceNo" />
					<uni-load-more :status="status" :icon-size="16" :content-text="contentText" />
				</scroll-view>
			</view>
		</view>
		<!-- 筛选弹出窗 -->
		<uni-popup ref="popup" :mask-click="false" type="bottom">
			<PopFilter
				:filterForm="filterForm"
				:weighbridgeList="weighbridgeList"
				:weighStatusList="weighStatusList"
				:orderPlanList="orderPlanList"
				:companyList="companyList"
				:weighTypeList="weighTypeList"
				@closePopFilter="closePopFilter"
				@doFilter="doFilter"
				@clearAllFormData="clearAllFormData"
				ref="pop_filter"
				v-if="showPopFilter"
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
		import { findList, getTenantCompanyInfoList, getOrderPlanInfoList } from '@/config/service/weighRecord/index.js'
		import { DebounceFun, ThrottleFun } from '@/utils/ddc'
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
					dataList: [],
					// 是否无数据了
					isEnd: false,
					status: 'more',
					contentText: {
						contentdown: '上拉加载更多',
						contentrefresh: '加载中',
						contentnomore: '没有更多了'
					},
					pageNum: 1,
					effectiveDate: [], // 转成 开始时间 和 结束时间
					filterForm: {
						weighingType: '', // 1皮重过磅 2 毛重过磅
						compnayInfoId: '', // 收发企业
						orderPlanInfoCode: '', // 运输计划
						completeFlag: '' // 称重状况
					},
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
						id: 0
					}],
					weighTypeList: [{
						name: '皮重过磅',
						id: 1
					}, {
						name: '毛重过磅',
						id: 2
					}],
					companyList: [],
					searchKey: '', // 搜搜关键字
					showPopFilter: false
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
				this.deviceNo = options.deviceNo; // 设备编号
				this.getList();
				this.getTenantCompanyInfoList(); // 收发企业
				this.getOrderPlanInfoList(); // 运输计划
			},
			onReady() {
				let self = this;
				this.DebounceSearch = DebounceFun(function(){
					self.getList(true);
				}, 1000);
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
					this.showPopFilter = false;
					this.$nextTick(() => {
						this.showPopFilter = true;
					})
				},
				/**
				 * 关闭筛选弹出窗
				 */
				closePopFilter() {
					this.$refs.popup.close()
				},
				/**
				 * 确认筛选
				 */
				doFilter() {
					this.closePopFilter();
					this.getList(true);
				},
				// 触底
				scrolltolower(e) {
					if(!this.isEnd) {
						this.pageNum++;
						this.getList();
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
					findList({
						deviceNo: this.deviceNo,
						pageNum: this.pageNum,
						pageSize: 10,
						buildingType: 1,
						jyzCode: this.jyzCode,
						searchKey: this.searchKey,
						startCreateTime: this.parseTime(this.effectiveDate[0], '{y}-{m}-{d} {h}:{i}:{s}') || '',
						endCreateTime: this.parseTime(this.effectiveDate[1], '{y}-{m}-{d} {h}:{i}:{s}') || '',
						...this.filterForm
					}, this.headerInfo).then((res) => {
						if(res.rows.length == 0) {
							this.isEnd = true;
							this.status = 'noMore'
						}
						else {
							this.isEnd = false;
							this.status = 'more';
							if(isRefresh) {
								this.dataList = res.rows;
							}
							else {
								this.dataList = [...this.dataList, ...res.rows];
							}
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
				},
				/**
				 * 搜索关键字
				 */
				onInputSearchKey(e) {
					this.DebounceSearch();
				},
				/**
				 * 获取收发企业列表
				 */
				getTenantCompanyInfoList() {
					getTenantCompanyInfoList({
						pageNum: 1,
						pageSize: 100
					}, this.headerInfo).then((res) => {
						this.companyList = res.data.list;
					})
				},
				/**
				 * 获取运输计划列表
				 */
				getOrderPlanInfoList() {
					getOrderPlanInfoList(null, this.headerInfo).then(res => {
						this.orderPlanList = res.data.list;
					})
				},
				/**
				 * 清空
				 */
				clearAllFormData() {
					this.filterForm = {
						weighingType: '', // 1皮重过磅 2 毛重过磅
						compnayInfoId: '', // 收发企业
						orderPlanInfoCode: '', // 运输计划
						completeFlag: '' // 称重状况
					}
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
