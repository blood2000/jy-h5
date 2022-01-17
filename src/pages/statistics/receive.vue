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
			<view class="filter-wrap">
				<view class="time-frame flex align-center text-white text-bold">
					<image class="time-icon margin-mright" src="/static/statistics/icon_time.png" mode=""></image>
					<picker mode="date" :value="queryParams.startCreateTime" start="1900-01-01" :end="queryParams.endCreateTime?queryParams.endCreateTime:'3000-01-01'" @change="startDateChange">
						<view v-if="queryParams.startCreateTime" class="picker">{{queryParams.startCreateTime}}</view>
						<view v-else class="picker">选择开始时间</view>
					</picker>
					<view class="margin-lr">到</view>
					<picker mode="date" :value="queryParams.endCreateTime" :start="queryParams.startCreateTime?queryParams.startCreateTime:'1900-01-01'" end="3000-01-01" @change="endDateChange">
						<view v-if="queryParams.endCreateTime" class="picker">{{queryParams.endCreateTime}}</view>
						<view v-else class="picker">选择结束时间</view>
					</picker>
					<view v-if="queryParams.startCreateTime || queryParams.endCreateTime" class="cuIcon-roundclose size30 margin-mleft" @click="handleClear"></view>
				</view>
				<picker @change="bindPickerChange" :value="queryParams.completeFlag" :range="completeFlags" range-key="name" class="picker-select" @cancel="onCancel()" v-if="isShowPicker">
					<view class="uni-input">{{completeFlags[queryParams.completeFlag].name}}</view>
				</picker>
			</view>
		</view>
		<!-- 背景 -->
		<view :style="{height:statusBarHeight*2 + 176 +'upx'}"></view>
		<view class="list-bgframe">
			<view :style="{height:statusBarHeight*2 + 170 +'upx'}"></view>
			<view class="list-bg"></view>
		</view>
		<!-- 列表 -->
		<view class="list-frame" :class="{'list-frame-total': item.childList && item.childList.length > 0}" v-for="(item, index) in list" :key="index">
			<view class="list-frame-inner">
				<view class="list-componyframe flex align-center justify-between">
					<view class="list-namedeliver">{{item.orderPlanInfoName || '无'}}</view>
					<view class="list-goods">{{item.goodsTypeName || '无'}}</view>
				</view>
				<view class="list-numframe flex align-center flex-wrap">
					<view class="list-numlist">
						<view class="list-numcont">{{item.carNum || 0 }}</view>
						<view class="list-numtitle margin-stop"><template v-if="queryParams.completeFlag == 1">已完成</template><template v-else>未完成</template>车数</view>
					</view>
					<view class="list-numlist">
						<view class="list-numcont">{{item.deliverNetWeight || 0}}</view>
						<view class="list-numtitle margin-stop">总矿发（吨）</view>
					</view>
					<view class="list-numlist">
						<view class="list-numcont">{{(item.netWeight) || 0}}</view>
						<view class="list-numtitle margin-stop">总净重（吨）</view>
					</view>
					<view class="list-numlist">
						<view class="list-numcont">{{item.realWeight || 0}}</view>
						<view class="list-numtitle margin-stop">总实收（吨）</view>
					</view>
					<view class="list-numlist">
						<view class="list-numcont">{{item.lossWeight || 0}}</view>
						<view class="list-numtitle margin-stop">盈亏（吨）</view>
					</view>
				</view>
				<template v-if="item.childList && item.childList.length > 0">
					<block v-for="(itemChild, i) in item.childList" :key="i">
						<view class="list-componyframe flex align-center justify-between">
							<view class="list-namedeliver">{{itemChild.orderPlanInfoName || '无'}}</view>
								<view class="list-goods">{{itemChild.goodsTypeName || '无'}}</view>
							</view>
							<view class="list-numframe flex align-center flex-wrap">
								<view class="list-numlist">
							<view class="list-numcont">{{itemChild.carNum || 0}}</view>
							<view class="list-numtitle margin-stop"><template v-if="queryParams.completeFlag == 1">已完成</template><template v-else>未完成</template>车数</view>
						</view>
						<view class="list-numlist">
							<view class="list-numcont">{{itemChild.deliverNetWeight || 0}}</view>
							<view class="list-numtitle margin-stop">总矿发（吨）</view>
						</view>
						<view class="list-numlist">
							<view class="list-numcont">{{(itemChild.netWeight) || 0}}</view>
							<view class="list-numtitle margin-stop">总净重（吨）</view>
						</view>
						<view class="list-numlist">
							<view class="list-numcont">{{itemChild.realWeight || 0}}</view>
							<view class="list-numtitle margin-stop">总实收（吨）</view>
						</view>
						<view class="list-numlist">
							<view class="list-numcont">{{itemChild.lossWeight || 0}}</view>
							<view class="list-numtitle margin-stop">盈亏（吨）</view>
						</view>
						</view>
					</block>
				</template>
			</view>
			<view class="total" v-if="item.childList && item.childList.length > 0">
				<view class="item-total">
					<view class="total-label total-label-hj">合计</view>
				</view>
				<view class="item-total">
					<view class="total-label">车数</view>
					<view class="total-val">{{ item.totolCarNum }}</view>
				</view>
				<view class="item-total">
					<view class="total-label">矿发</view>
					<view class="total-val">{{ item.totolDeliverNetWeight }}</view>
				</view>
				<view class="item-total">
					<view class="total-label">净重</view>
					<view class="total-val">{{ item.totolNetWeight }}</view>
				</view>
				<view class="item-total">
					<view class="total-label">实收</view>
					<view class="total-val">{{ item.totolRealWeight }}</view>
				</view>
				<view class="item-total">
					<view class="total-label">盈亏</view>
					<view class="total-val">{{ item.totolLossWeight }}</view>
				</view>
			</view>
		</view>
		<uni-load-more v-if="list.length !== 0" :status="status" :icon-size="16" :content-text="contentText" />
		<NonePage v-else></NonePage>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { planStatisticsMergeList }from "@/config/service/statistics.js"
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
					pageSize: 10,
					completeFlag: 1,
					status: 30
				},
				list: [],
				completeFlags: [{
					name: '未完成',
					value: 0
				}, {
					name: '已完成',
					value: 1
				}],
				isShowPicker: true
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
				planStatisticsMergeList(this.quer, this.headerInfo).then(res => {
					if(res.rows.length === 0) {
						this.isEnd = true;
						this.status = 'noMore';
						return
					}
					if(res.rows.length < this.queryParams.pageSize){
						this.status = 'noMore';
					}
					let newList = res.rows;
					if(newList && newList.length > 0) {
						newList.forEach(el => {
							let totolCarNum = el.carNum || 0; // 总车量
							let totolDeliverNetWeight = el.deliverNetWeight || 0; // 总矿发
							let totolNetWeight = el.netWeight || 0; // 净重
							let totolRealWeight = el.realWeight || 0; // 实收
							let totolLossWeight = el.lossWeight || 0; // 盈亏
							if(el.childList && el.childList.length > 0) {
								el.childList.forEach(elChild => {
									totolCarNum = totolCarNum + (elChild.carNum || 0);
									totolDeliverNetWeight = totolDeliverNetWeight + (elChild.deliverNetWeight || 0);
									totolNetWeight = totolNetWeight + (elChild.netWeight || 0);
									totolRealWeight = totolRealWeight + (elChild.realWeight || 0);
									totolLossWeight = totolLossWeight + (elChild.lossWeight || 0);
								});
							}
							el.totolCarNum = totolCarNum;
							el.totolDeliverNetWeight = totolDeliverNetWeight.toFixed(2);
							el.totolNetWeight = totolNetWeight.toFixed(2);
							el.totolRealWeight = totolRealWeight.toFixed(2);
							el.totolLossWeight = totolLossWeight.toFixed(2);
						});
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
			bindPickerChange(e) {
				this.clearQuery();
				if(e.target.value == 0) {
					this.queryParams.notStatus = 30;
					delete this.queryParams.status;
				}
				else {
					this.queryParams.status = 30;
					delete this.queryParams.notStatus;
				}
				this.$set(this.queryParams, 'completeFlag', e.target.value);
				this.$set(this.queryParams, 'pageNum', 1);
				this.$nextTick(() => {
					this.getList();
				})
			},
			onCancel(e) {
				setTimeout(() => {
					this.isShowPicker = false;
					setTimeout(() =>{
						this.isShowPicker = true;
					}, 0);
				}, 300);
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
	margin: 0 30upx 24upx;
	&-total {
		margin: 0 30upx -14upx;
	}
	&-inner {
		position: relative;
		z-index: 2;
		background: #FFFFFF;
		border-radius: 24upx;
	}
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
			position: relative;
			font-size: 32upx;
			font-weight: bold;
			color: #333333;
			width: 50%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			padding-left: 52upx;
			&:before {
				position: absolute;
				left: 0;
				content: '';
				display: block;
				width: 42upx;
				height: 42upx;
				background: url('@/static/statistics/icon-company.png') no-repeat;
				background-size: cover;
				margin-right: 10upx;
				flex-shrink: 0;
			}
		}
		.list-namereceive{
			font-size: 24upx;
			color: #878787;
		}
		.list-goods{
			font-size: 28upx;
			font-weight: bold;
			color: #3A65FF;
			max-width: 50%;
			height: 40upx;
			line-height: 40upx;
			text-align: center;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			text-align: right;
			margin-left: 20upx;
			background-color: #ebefff;
			border-radius: 20upx;
			padding: 0 20upx;
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
	.total {
		position: relative;
		top: -40upx;
		background-color: #3a65ff;
		border-radius: 24upx;
		display: flex;
		flex-wrap: wrap;
		padding: 20upx 30upx;
		padding-top: 50upx;
		.item-total {
			display: flex;
			align-items: baseline;
			width: 33.33%;
			padding: 10upx;
			&:first-child {
				position: relative;
				&::after {
					position: absolute;
					right: 30upx;
					transform: translateY(-50%);
					top: 33upx;
					content: '';
					display: block;
					width: 2upx;
					height: 33upx;
					background-color: rgba($color: #fff, $alpha: 0.18);
				}
			}
			.total-label {
				color: #fff;
				font-size: 24upx;
				margin-right: 10upx;
				&-hj {
					width: 125upx;
					height: 37upx;
					line-height: 37upx;
					background-color: #ffffff;
					border-radius: 0 18px 18px 18px;
					font-size: 30upx;
					color: #3a65ff;
					font-weight: bold;
					text-align: center;
				}
			}
			.total-val {
				color: #fff;
				font-size: 34upx;
				font-weight: bold;
				font-family: Bahnschrift;
			}
		}
	}
}
.filter-wrap {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	.picker-select {
		padding: 0 30upx 30upx;
		color: #fff;
		display: flex;
		align-items: center;
		&::after {
			content: '';
			display: block;
			width:0;
			height:0;
			border-top: 12upx solid #fff;
			border-left: 10upx solid transparent;
			border-right: 10upx solid transparent;
			margin-left: 10upx;
		}
	}
}
</style>
