<template>
	<view class="content-page" :style="{'--statusBar12': (statusBar12) + 'px' }">
		<HeaderBar title="过磅记录" @back="navigateBack" :border="false"></HeaderBar>
	  <!-- main -->
	  <view class="main-box">
			<!-- 筛选 -->
			<view class="filter-wrap">
				<view class="item-filter select">
					<!-- 选择时间 -->
					<view class="filter-date">
						<i class="icon-calendar"></i>
						<uni-datetime-picker
							class="datetime-picker"
							:key='oldDatePicker1' 
							ref='datepick' 
							:border="false" 
							v-model="filterForm.effectiveDate"
							type="daterange" 
							rangeSeparator="至" 
							@change="handlerPick" />
					</view>
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
					<view class="list-record" @click="navigateToDetail">
						<view class="item-record" v-for="(item, index) in dataList" :key="index" :data-id="index">
							<view class="item-head building-bottom-line">
								<text class="item-title">运输计划名称</text>
								<view class="item-head-right">
									<img src="@/static/weighRecord/logo_ji.png" alt="" class="item-logo">
									<i class="icon-arrow"></i>
								</view>
							</view>
							<view class="item-route building-bottom-line">
								<view class="route">
									<i class="icon-route delivery"></i>
									<text>衢州宝红建材有限公司</text>
								</view>
								<view class="route">
									<i class="icon-route receipt"></i>
									<text>浙江宝红商品砼有限公司</text>
								</view>
							</view>
							<view class="item-info">
								<view class="item-info-name">
									<view>
										<text class="label">货物：</text>
										<text class="val">小石头</text>
									</view>
									<view>
										<text class="label">过磅类型：</text>
										<text class="val">皮重</text>
									</view>
								</view>
								<view class="item-info-number">
									<view class="car-no">闽A12345</view>
									<view class="tel">兔斯基 13700000000</view>
								</view>
								<view class="item-info-time">
									过磅时间：2021-12-12 18:18:40
								</view>
							</view>
						</view>
					</view>
					<uni-load-more v-if="dataList && dataList.length > 0" :status="status" :icon-size="16" :content-text="contentText" />
				</scroll-view>
			</view>
		</view>
		<!-- 筛选弹出窗 -->
		<uni-popup ref="popup" :mask-click="false" type="bottom">
			<view class="pop-filter">
				<view class="pop-filter-title">
					<text>选择筛选条件</text>
					<i class="icon-close" @click="closePopFilter()"></i>
				</view>
				<view class="pop-filter-content">
					<view class="form-group">
						<!-- 过磅类型 -->
						<view class="form-item">
							<view class="form-label">过磅类型</view>
							<view class="form-cont">
								<view class="radio-group" @click="onChangeFilterForm">
									<view class="item-radio" :class="{'active': filterForm.weighType == 1}" data-value="1" data-formName="weighType">皮重过磅</view>
									<view class="item-radio" :class="{'active': filterForm.weighType == 2}" data-value="2" data-formName="weighType">毛重过磅</view>
								</view>
							</view>
						</view>
						<!-- 收发企业 -->
						<view class="form-item">
							<view class="form-label">
								<text>收发企业</text>
								<text class="more">更多企业</text>
							</view>
							<view class="form-cont">
								<view class="radio-group" @click="onChangeFilterForm">
									<view class="item-radio fill" :class="{'active': filterForm.companyId == item.id}" :data-value="item.id" data-formName="companyId" v-for="item in company" :key="item.id">{{ item.name }}</view>
								</view>
							</view>
						</view>
						<!-- 收发企业 -->
						<view class="form-item">
							<view class="form-label">
								<text>运输计划</text>
								<text class="more">更多运输计划</text>
							</view>
							<view class="form-cont">
								<view class="radio-group" @click="onChangeFilterForm">
									<view class="item-radio fill" :class="{'active': filterForm.transportPlanId == item.id}" :data-value="item.id" data-formName="transportPlanId" v-for="item in transportPlan" :key="item.id">{{ item.name }}</view>
								</view>
							</view>
						</view>
						<!-- 地磅 -->
						<view class="form-item">
							<view class="form-label">
								<text>地磅</text>
							</view>
							<view class="form-cont">
								<view class="radio-group" @click="onChangeFilterForm">
									<view class="item-radio" :class="{'active': filterForm.weighbridgeId == item.id}" :data-value="item.id" data-formName="weighbridgeId" v-for="item in weighbridge" :key="item.id">{{ item.name }}</view>
								</view>
							</view>
						</view>
						<!-- 称重状况 -->
						<view class="form-item">
							<view class="form-label">
								<text>称重状况</text>
							</view>
							<view class="form-cont">
								<view class="radio-group" @click="onChangeFilterForm">
									<view class="item-radio" :class="{'active': filterForm.weighStatusId == item.id}" :data-value="item.id" data-formName="weighStatusId" v-for="item in weighStatus" :key="item.id">{{ item.name }}</view>
								</view>
							</view>
						</view>
					</view>
					<view class="btn-group">
						<view class="btn btn-cancel" @click="clearAllFormData">清空</view>
						<view class="btn btn-comfirm">确定(28条过磅记录）</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
		import HeaderBar from '@/components/Building/HeaderBar.vue';
		export default {
			components: {
				HeaderBar
			},
			data() {
				return {
					range: ["2021-03-8", "2021-4-20"],
					oldDatePicker1: Date.now(), // 改变key值重新渲染
					scrollTop: 0,
					statusBar12: 0,
					dataList: [{
						id: 1
					}],
					// 是否无数据了
					isEnd: false,
					status: '',
					contentText: {
						contentdown: '上拉加载更多',
						contentrefresh: '加载中',
						contentnomore: '没有更多了'
					},
					filterForm: {
						effectiveDate: [], // 转成 开始时间 和 结束时间
						weighType: 1, // 1皮重过磅 2 毛重过磅
						companyId: 1, // 收发企业
						transportPlanId: 1, // 运输计划
						weighbridgeId: 1, // 地磅
						weighStatusId: 1 // 称重状况
					},
					company: [{ // 收发企业
						name: '衢州宝红建材有限公司',
						id: 1
					}, {
						name: '浙江宝红商品砼有限公司',
						id: 2
					}],
					transportPlan: [{ // 运输计划
						name: '东坡收原煤路线1',
						id: 1
					}, {
						name: '东坡收原煤路线2',
						id: 2
					}],
					weighbridge: [{ // 地磅
						name: '1号地磅',
						id: 1
					}, {
						name: '2号地磅',
						id: 2
					}, {
						name: '3号地磅',
						id: 3
					}],
					weighStatus: [{ // 称重状况
						name: '已完成',
						id: 1
					}, {
						name: '未完成',
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
				 * 跳转至过磅详情
				 * @param {Object} e 当前点击对象
				 */
				navigateToDetail(e) {
					if(e.target.dataset.id >= 0) {
						console.log('sss')
						uni.navigateTo({
							url: `/pages/weighRecord/detail?id=${e.target.dataset.id}`
						});
					}
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
				/**
				 * 选择类型
				 */
				onChangeFilterForm(e) {
					console.log(e.target.dataset.value)
					if(e.target.dataset.value) {
						this.filterForm[e.target.dataset.formName] = e.target.dataset.value;
					}
				},
				/**
				 * 清空
				 */
				clearAllFormData() {
					this.filterForm = {
						weighType: '', // 1皮重过磅 2 毛重过磅
						companyId: '', // 收发企业
						transportPlanId: '', // 运输计划
						weighbridgeId: '', // 地磅
						weighStatusId: '' // 称重状况
					}
				},
				// 触底
				scrolltolower(e) {
					console.log('触达底部')
					if(!this.isEnd) {
						this.status = 'loading';
					}
				},
				// 时间控件
				handlerPick(arr){
					if(arr[0] && arr[1]){
						if(arr[0] === arr[1]){
							// 日期加一天
							const time1 = new Date(arr[1]).getTime() + (1000 * 60 * 60 * 24);
							setTimeout(()=>{
								this.$set(this.form, 'effectiveDate', [arr[0], this.parseTime(time1, '{y}-{m}-{d}') ]);
								this.oldDatePicker1 = Date.now()
							}, 100)
							return
						} else {
							this.oldDatePicker = arr
						}
					}
				},
			}
		}
</script>

<style lang="scss" scoped>
	.datetime-picker {
		width: 380upx;
		margin: 0 -8upx;
		//
		/deep/ .uni-date-editor--x:hover .uni-date__icon-clear {
			right: -46upx;
			top: 2upx;
			border: 0;
		}
		/deep/ .uni-date-x {
			background-color: transparent;
			color: #fff;
			font-size: 28upx;
			padding: 0;
			width: 380upx;
			.uni-input-placeholder {
				color: #e1e1e1;
				font-size: 28upx;
			}
			.uni-date__icon-logo {
				display: none;
			}
			.uni-date__input {
				padding: 0 8upx;
				font-size: 28upx;
				height: 30upx;
			}
		}
	}
	/deep/ .uni-load-more__text {
		font-size: 28upx;
	}
	.building-bottom-line {
		position: relative;
		&::after {
			background: #f0f0f0;
		}
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
		background: url(../../static/weighRecord/bg.png) #f5f5f5 no-repeat;
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
			&.select {
				font-size: 28upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.filter-date {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.icon-calendar {
						background: url(../../static/weighRecord/icon_calendar.png);
						background-size: contain;
						width: 30upx;
						height: 30upx;
						display: block;
						margin-right: 10upx;
					}
					.to {
						margin: 0 5upx;
					}
					.icon-select {
						width: 30upx;
						height: 16upx;
						background: url(../../static/weighRecord/icon_select.png) no-repeat;
						background-size: contain;
						margin-left: 10upx;
					}
				}
				.btn-filter {
					font-size: 28upx;
					display: flex;
					align-items: start;
					line-height: 1;
					color: #fff;
					&::after {
						content: '';
						display: block;
						width: 30upx;
						height: 30upx;
						background: url(../../static/weighRecord/icon_filter.png) no-repeat;
						background-size: contain;
						margin-left: 10upx;
					}
				}
			}
			&.input {
				margin-top: 40upx;
				.input-search {
					height: 72upx;
					background-color: #fff;
					border-radius: 10upx;
					width: 100%;
					padding: 0 16upx;
					font-size: 28upx;
					/deep/ .uni-input-wrapper {
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: row;
						&::before {
							content: '';
							display: block;
							width: 32upx;
							height: 32upx;
							background: url(../../static/weighRecord/icon_search.png) no-repeat;
							background-size: contain;
							margin-right: 10upx;
						}
						.uni-input-placeholder {
							left: 42upx;
							width: calc(100% - 42upx);
						}
					}
				}
			}
		}
	}
	.filter-wrap-fixed {
		height: 150upx;
		width: 100%;
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
	.list-record {
		.item-record {
			position: relative;
			background-color: #fff;
			border-radius: 24upx;
			&:not(:last-child) {
				margin-bottom: 24upx;
			}
			&::after {
				content: "";
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				top: 0;
			}
			.item-head {
				height: 80upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 28upx;
				.item-title {
					font-size: 32upx;
					color: #333;
					font-weight: 700;
				}
				.item-logo {
					width: 120upx;
					height: 44upx;
					object-fit: contain;
				}
				&-right {
					display: flex;
					align-items: center;
				}
				.icon-arrow {
					width: 18upx;
					height: 26upx;
					background: url(../../static/weighRecord/arrow_left.png) no-repeat;
					background-size: contain;
					display: block;
					margin-left: 10upx;
				}
			}
			.item-route {
				position: relative;
				padding: 23upx 28upx;
				.route {
					display: flex;
					align-items: center;
					font-size: 28upx;
					color: #333;
					margin: 10upx 0;
					.icon-route {
						width: 30upx;
						height: 30upx;
						display: block;
						border-radius: 4upx;
						font-size: 20upx;
						color: #fff;
						font-style: normal;
						display: flex;
						justify-content: center;
						align-items: center;
						margin-right: 20upx;
						&.delivery {
							background-color: #3a65ff;
							&::before {
								content: '发';
								display: block;
							}
						}
						&.receipt {
							background-color: #59be32;
							&::before {
								content: '收';
								display: block;
							}
						}
					}
				}
			}
			.item-info {
				padding: 23upx 28upx;
				font-size: 28upx;
				&-name {
					display: flex;
					justify-content: space-between;
					.label {
						font-size: 26upx;
						color: #878787;
					}
					.val {
						font-weight: 700;
					}
				}
				&-number {
					background-color: rgba($color: #ccc, $alpha: .18);
					border-radius: 6upx;
					padding: 20upx;
					display: flex;
					justify-content: space-between;
					margin-top: 28upx;
					font-weight: bold;
					.car-no {
						display: flex;
						align-items: center;
						&::before {
							content: '';
							width: 32upx;
							height: 32upx;
							display: block;
							background: url(../../static/weighRecord/icon_car.png) no-repeat;
							background-size: contain;
							margin-right: 20upx;
						}
					}
				}
				&-time {
					color: #878787;
					margin-top: 25upx;
				}
			}
		}
	}
	.pop-filter {
		background-color: #fff;
		border-radius: 25upx 25upx 0px 0px;
		padding: 40upx 36upx;
		&-title {
			text-align: center;
			font-size: 33upx;
			position: relative;
			.icon-close {
				position: absolute;
				right: 0;
				top: 0;
				width: 32upx;
				height: 32upx;
				background: url(../../static/weighRecord/icon_close.png) no-repeat;
				background-size: contain;
				display: block;
			}
		}
		.form-group {
			.form-item {
				margin-bottom: 30upx;
				.form-label {
					position: relative;
					margin-bottom: 25upx;
					.more {
						position: absolute;
						right: 0;
						top: 0;
						font-size: 29upx;
						color: #878787;
						display: flex;
						align-items: center;
						&::after {
							content: '';
							display: block;
							width: 18upx;
							height: 26upx;
							background: url(../../static/weighRecord/arrow_left.png) no-repeat;
							background-size: contain;
							margin-left: 15upx;
						}
					}
				}
			}
		}
		.radio-group {
			display: flex;
			flex-wrap: wrap;
			margin: 0 -15upx;
			.item-radio {
				position: relative;
				height: 70upx;
				line-height: 70upx;
				font-size: 29upx;
				color: #333;
				padding: 0 28upx;
				border-radius: 6upx;
				margin: 0 15upx 15upx;
				background-color: rgba($color: #ccc, $alpha: 0.18);
				&::after {
					content: "";
					position: absolute;
					left: 0;
					right: 0;
					bottom: 0;
					top: 0;
				}
				&.active {
					background-color: rgba($color: #3a65ff, $alpha: 0.12);
					color: #3a65ff;
					font-weight: bold;
				}
				&.fill {
					width: 100%;
				}
			}
		}
		.btn-group {
			display: flex;
			justify-content: space-between;
			margin: 50upx -15upx 0;
			.btn {
				padding: 0 78upx;
				height: 80upx;
				border-radius: 10upx;
				border: solid 1upx #3a65ff;
				margin: 0 15upx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 30upx;
				&.btn-cancel {
					color: #3a65ff;
					background-color: #fff;
				}
				&.btn-comfirm {
					color: #fff;
					background-color: #3a65ff;
				}
			}
		}
	}
</style>
