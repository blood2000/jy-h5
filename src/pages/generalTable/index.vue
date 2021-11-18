<template>
	<view class="general-table-container" :style="(dataModelDto.queryFields && dataModelDto.queryFields.length > 0) ? 'padding-top: 100upx;' : ''">
		<!-- <WhiteHeader :showBack="true" :showLine="true">
			<text slot="title">{{ barTitle }}</text>
		</WhiteHeader> -->
		
		<view class="search-form ly-flex ly-flex-align-center" v-if="dataModelDto.queryFields && dataModelDto.queryFields.length > 0" @touchmove.stop.prevent="">
			<uni-forms ref="queryForm" style="width: calc(100% - 70upx)">
				<!-- string -->
				<uni-forms-item v-if="dataModelDto.queryFields[0].dataItemInfo.itemType === 'string' && !item.dynamic" class="uni-form-item uni-column" label=" " left-icon="search" icon-color="#999">
					<uni-easyinput
						type="text"
						v-model="dataModelDto.queryFields[0].value"
						:placeholder="'请输入' + dataModelDto.queryFields[0].dataItemInfo.itemCn"
						confirm-type="search"
						@confirm="handleConfirm"
						@input="handleInput"
					/>
				</uni-forms-item>
				<uni-forms-item v-else class="uni-form-item uni-column" style="color: #1678ff; font-size: 28upx;">
					查询条件
				</uni-forms-item>
			</uni-forms>
			<image class="search-more-icon" src="~@/static/search_more.png" @click="handleShowSearchMore"></image>
		</view>
		
		<view v-show="showSearchMore" class="collapse-form" @touchmove.stop.prevent="">
			<view class="content">
				<view v-for="(item, index) in dataModelDto.queryFields" :key="index" v-show="index !== 0 || (index === 0 && item.dataItemInfo.itemType !== 'string')">
					<view v-if="!item.dynamic">
						<!-- string -->
						<view v-if="item.dataItemInfo.itemType === 'string'" class="form-frame">
							<view class="title">{{item.dataItemInfo.itemCn}}</view>
							<input class="text-right" v-model="item.value" :placeholder="'请输入'+item.dataItemInfo.itemCn" name="input" @confirm="hideKeyboard"></input>
						</view>
						<!-- number float float4 -->
						<view v-else-if="item.dataItemInfo.itemType === 'number' || item.dataItemInfo.itemType === 'float' || item.dataItemInfo.itemType === 'float4'" class="form-frame">
							<view class="title">{{item.dataItemInfo.itemCn}}</view>
							<view class="ly-flex ly-flex-pack-justify ly-flex-align-center">
								<input class="text-right" v-model="item.start" :placeholder="'请输入'+item.dataItemInfo.itemCn+'开始值'" name="input" @confirm="hideKeyboard"></input>
								<span style="padding: 0 20upx;">至</span>
								<input class="text-right" v-model="item.end" :placeholder="'请输入'+item.dataItemInfo.itemCn+'结束值'" name="input" @confirm="hideKeyboard"></input>
							</view>
						</view>
						<!-- date -->
						<view v-else-if="item.dataItemInfo.itemType === 'date'" class="form-frame">
							<view class="title">{{item.dataItemInfo.itemCn}}</view>
							<view class="ly-flex ly-flex-pack-justify ly-flex-align-center">
								<picker class="time-picker-view text-right" mode="date" :value="item.startTime" start="1900-01-01" end="3000-01-01" @change="(e)=>bindDateChange(item, e, 'startTime')">
									<view class="text-right" v-if="item.startTime">{{item.startTime}}</view>
									<view class="placeholder" v-else style="padding-left: 0;">开始时间</view>
								</picker>
								<span style="padding: 0 20upx;">至</span>
								<picker class="time-picker-view text-right" mode="date" :value="item.endTime" start="1900-01-01" end="3000-01-01" @change="(e)=>bindDateChange(item, e, 'endTime')">
									<view class="text-right" v-if="item.endTime">{{item.endTime}}</view>
									<view class="placeholder" v-else style="padding-left: 0;">结束时间</view>
								</picker>
							</view>
						</view>
						<!-- timestamp -->
						<view v-else-if="item.dataItemInfo.itemType === 'timestamp'" class="form-frame">
							<view class="title">{{item.dataItemInfo.itemCn}}</view>
							<view class="ly-flex ly-flex-pack-justify ly-flex-align-center">
								<uni-datetime-picker
									type="datetime"
									v-model="item.startTime"
									placeholder="开始时间"
									@change="(e)=>bindDateTimeChange(item, e, 'startTime')"
								/>
								<span style="padding: 0 20upx;">至</span>
								<uni-datetime-picker
									type="datetime"
									v-model="item.endTime"
									placeholder="结束时间"
									@change="(e)=>bindDateTimeChange(item, e, 'endTime')"
								/>
							</view>
						</view>
						<!-- enum custom -->
						<view v-else-if="item.dataItemInfo.itemType === 'enum' || item.dataItemInfo.itemType === 'custom'" class="form-frame">
							<view class="title">{{item.dataItemInfo.itemCn}}</view>
							<picker
							 :value="item.value"
							 :range="item.itemOptions"
							 range-key="dictLabel"
							 @change="(e)=>PickerChange(item, e)">
								<view v-if="item.value" class="picker text-right">{{ item.itemOptions[item.itemOptions.findIndex(res => res.dictValue===item.value)].dictLabel }}</view>
								<view class="placeholder text-right" v-else>{{ '请选择'+item.dataItemInfo.itemCn }}</view>
							</picker>
						</view>
					</view>
				</view>
			</view>
			<view class="collapse-button-box ly-flex ly-flex-pack-justify ly-flex-align-center">
				<view class="reset" @click="resetQuery">清空</view>
				<view class="submit" @click="handleQuery">筛选</view>
			</view>
		</view>
		
		<view class="card-list" v-if="dataList && dataList.length > 0">
			<view v-for="(item, index) in dataList" :key="index" class="card-item">
				<view v-for="(value, vIndex) in dataModelDto.tableFields" :key="vIndex" class="row-text">
					<text class="label">{{ value.fieldLabel }}:</text>
					<text class="content">{{ item[value.functionType ? value.functionFieldAlias : (value.nodeId+'_'+value.dataItemInfo.itemEn)] }}</text>
				</view>
			</view>
		</view>
		<NonePage v-else></NonePage>
		
		<uni-load-more v-if="dataList && dataList.length > 0" :status="status" :icon-size="16" :content-text="contentText" />
		
		<view v-show="showSearchMore" class="search-mask-view" @click="handleShowSearchMore" @touchmove.stop.prevent=""></view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { deepClone, removePropertyOfNull } from '@/utils/ddc';
import { getDataModel, searchDataModel, getCustomEnumById } from '@/config/service/general.js';
import { getDicts } from '@/config/service/common.js';
import WhiteHeader from '@/components/Header/WhiteHeader.vue';
import NonePage from '@/components/NonePage/NonePage.vue';
export default {
	components: {
		WhiteHeader,
		NonePage
	},
	computed: {
		...mapState({
			headerInfo: state => state.header.headerInfo
		})
	},
	data() {
		return {
			modelId: null,
			queryFields: [],
			tableFields: [],
			// 总条数
			total: 0,
			loading: false,
			// 列表数据
			dataList: [],
			dataModelDto: {
				queryFields: [],
				tableFields: [],
				page: {
					pageNum: 1,
					pageSize: 10
				}
			},
			barTitle: '',
			// 是否无数据了
			isEnd: false,
			status: 'more',
			contentText: {
				contentdown: '上拉加载更多',
				contentrefresh: '加载中',
				contentnomore: '没有更多了'
			},
			// 更多搜索条件面板
			showSearchMore: false
		}
	},
	onLoad(options){
		this.modelId = options.id;
		this.$store.dispatch('getLoginInfoAction', {
			'Authorization': options.token
		});
		this.getData();
	},
	onPullDownRefresh() {
		// this.dataList = [];
		// this.dataModelDto.page.pageNum = 1;
		// this.getList();
		uni.stopPullDownRefresh();  //停止下拉刷新动画
	},
	// 触底加载
	onReachBottom() {
		if(!this.isEnd) {
			this.status = 'more';
			this.dataModelDto.page.pageNum++;
			this.getList();
		}
	},
	methods: {
		/** 获取模型数据 */
		getData() {
			getDataModel(this.modelId, this.headerInfo).then(res => {
				if (res.data && res.data.dataModelDto) {
					const dataModelDto = res.data.dataModelDto;
					uni.setNavigationBarTitle({
					    title: res.data.name
					});
					this.barTitle = res.data.name;
					// 如果是枚举类型，要请求字典
					if (dataModelDto.queryFields) {
						dataModelDto.queryFields.forEach((el, i) => {
							if (el.dataItemInfo.itemKey && el.dataItemInfo.itemKey !== '') {
								if (el.dataItemInfo.itemType === 'enum') {
									getDicts(el.dataItemInfo.itemKey, this.headerInfo).then(value => {
										dataModelDto.queryFields[i].itemOptions = value.data;
										dataModelDto.queryFields[i].pickerOptions = value.data.map(el => {
											return el.dictLabel;
										});
									});
								}
								if (el.dataItemInfo.itemType === 'custom') {
									getCustomEnumById(el.dataItemInfo.id, this.headerInfo).then(value => {
										dataModelDto.queryFields[i].itemOptions = value.data;
										dataModelDto.queryFields[i].pickerOptions = value.data.map(el => {
											return el.dictLabel;
										});
									});
								}
							}
						});
					}
					// 缓存数据
					this.$nextTick(() => {
						const { queryFields, tableFields } = dataModelDto;
						this.queryFields = queryFields || [];
						this.tableFields = tableFields || [];
						this.dataModelDto = deepClone(dataModelDto);
					});
					setTimeout(() => {
						this.resetQuery();
					}, 300);
				}
			});
		},
		/** 搜索按钮操作 */
		handleQuery() {
			uni.showLoading({mask: true});
			this.dataModelDto.page.pageNum = 1;
			this.dataList = [];
			this.isEnd = false;
			this.getList();
			this.showSearchMore = false;
		},
		/** 重置按钮操作 */
		resetQuery() {
			this.dataModelDto.queryFields = deepClone(this.queryFields);
			this.dataModelDto.tableFields = deepClone(this.tableFields);
			// this.resetForm('queryForm');
			this.handleQuery();
		},
		/** 模型查询 */
		getList() {
			this.status = 'loading';
			this.loading = true;
			// 
			const obj = removePropertyOfNull(Object.assign({}, this.dataModelDto, { dataModelId: this.modelId }));
			searchDataModel({isArrayQuery: JSON.stringify(obj)}, this.headerInfo).then(res => {
				this.loading = false;
				uni.hideLoading();
				if (res.data) {
					const { list, total } = res.data;
					if (list.length === 0) {
						this.isEnd = true;
						this.status = 'noMore';
						return;
					}
					if(list.length < this.dataModelDto.page.pageSize){
						this.status = 'noMore';
					}
					this.total = total || 0;
					this.dataList = [...this.dataList, ...list];
				}
			}).catch(() => {
				uni.hideLoading();
			});;
		},
		/** input搜索 */
		handleConfirm() {
			this.handleQuery();
			this.hideKeyboard();
		},
		/** 收起键盘 */
		hideKeyboard() {
			uni.hideKeyboard();
		},
		/** input清空 */
		handleInput() {
			if (this.dataModelDto.queryFields[0].value === '') {
				this.handleQuery();
			}
		},
		/** 枚举picker选中 */
		handleConfirmPicker(item , e) {
			this.PickerChange(item, e);
			this.handleQuery();
		},
		PickerChange(item, e) {
			this.$set(item, 'value', item.itemOptions[e.detail.value].dictValue);
		},
		/** 时间选中 */
		bindDateChange(item, e, key) {
			this.$set(item, key, e.detail.value); 
		},
		bindDateTimeChange(item, e, key) {
			if (e.length === 11) {
				e = e + '00:00:00'; 
			}
			this.$nextTick(() => {
				this.$set(item, key, e);
			})
		},
		bindDateTimeChangeSearch(item, e, key) {
			this.bindDateTimeChange(item, e, key);
			setTimeout(()=>{
				this.handleQuery();
			},0)
		},
		/** 打开查询更多 */
		handleShowSearchMore() {
			this.showSearchMore = !this.showSearchMore;
		}
	}
}
</script>

<style lang="scss" scoped>
.general-table-container{
	position: relative;
	font-size: 28upx;
	font-weight: 500;
	color: #333333;
	min-height: 100vh;
	
	.uni-input-placeholder{
		font-size: 28upx;
		color: #999999;
	}
	::v-deep.uni-input-input{
		font-size: 28upx;
	}
		
	// 查询表单
	.search-form{
		position: fixed;
		top: 0; // headertbar的高度
		left: 0;
		width: 100%;
		height: 100upx;
		z-index: 9;
		background: #FFFFFF;
		padding: 0 32upx;
		// input
		::v-deep.uni-forms-item__inner{
			padding-bottom: 0;
		}
		::v-deep.uni-easyinput__content-input{
			padding-left: 60upx !important;
		}
		::v-deep.uni-forms-item__label{
			width: 0 !important;
			.label-icon{
				margin-left: 30upx;
				margin-top: 2upx;
			}
		}
		.search-more-icon{
			width: 40upx;
			height: 40upx;
			margin-left: 20upx;
		}
		// picker
		uni-picker{
			height: 100%;
			border: 1px solid #c8c7cc;
			border-radius: 4px;
			.picker{
				line-height: 60upx;
				padding-left: 20upx;
				color: #333;
			}
			.placeholder{
				line-height: 60upx;
				padding-left: 20upx;
				color: #999;
			}
		}
		.time-picker-view{
			border: none !important;
		}
		// range
		::v-deep.uni-forms-item__content{
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}
	
	// 查询更多表单
	.collapse-form{
		position: fixed;
		top: 99upx;
		left: 0;
		right: 0;
		z-index: 9;
		padding-top: 10upx;
		background: #fff;
		.uni-collapse-cell{
			border-color: rgba(229, 229, 229, 0.9);
		}
		::v-deep.uni-collapse-cell__title{
			background: #fff;
		}
		.form-btn{
			margin: 0 30upx;
			width: 50%;
			line-height: 70upx;
		}
		.uni-forms-item{
			padding: 0 30upx;
		}
		::v-deep select{
			width: 100%;
			border: 1upx solid rgba(229, 229, 229, 0.9);
			border-radius: 4upx;
			height: 72upx;
		}
		.cont-frame{
			padding: 20upx;
			background-color: #FFFFFF;
			margin: 24upx 24upx 0;
			border-radius: 20upx;
		}
		.form-frame{
			background: #FFFFFF;
			border-bottom: 1upx solid rgba(229, 229, 229, 0.9);
			padding: 0px 30upx;
			min-height: 100upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.title {
				color: #999999;
				min-width: calc(4em + 30upx);
				text-align: justify;
				padding-right: 30upx;
				font-size: 28upx;
				position: relative;
				height: 60upx;
				line-height: 60upx;
			}
		}
		.collapse-button-box{
			background: #fff;
			height: 100upx;
			>.reset, >.submit{
				width: 50%;
				height: 100upx;
				line-height: 100upx;
				text-align: center;
				font-size: 28upx;
			}
			>.reset{
				color: #999;
				border-right: 1px solid rgba(229, 229, 229, 0.9);
			}
			>.submit{
				color: #fff;
				background: rgba(22, 120, 255, 0.9);
			}
		}
		// picker
		uni-picker{
			.placeholder{
				line-height: 60upx;
				padding-left: 20upx;
				color: #999;
			}
		}
	}
	
	// 列表
	.card-list{
		padding: 32upx 32upx 0;
		>.card-item{
			min-height: 100upx;
			background: #FFFFFF;
			border-radius: 20upx;
			margin-bottom: 32upx;
			position: relative;
			padding: 20upx 32upx;
			&::before{
				content: '';
				position: absolute;
				left: 0;
				top: 30upx;
				width: 6upx;
				height: 30upx;
				background: #1678FF;
				border-radius: 3upx;
			}
			.row-text{
				line-height: 50upx;
				>.label{
					font-size: 28upx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #999999;
					margin-right: 20upx;
				}
				>.content{
					font-size: 28upx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #333333;
					word-break: break-all;
				}
			}
		}
	}
	
	// 遮罩
	.search-mask-view{
		position: fixed;
		z-index: 8;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0,0,0,.5);
	}
}
</style>
