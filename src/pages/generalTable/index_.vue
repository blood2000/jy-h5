<template>
	<view class="general-table-container" :style="(dataModelDto.queryFields && dataModelDto.queryFields.length > 0) ? 'padding-top: 100upx;' : ''">
		<WhiteHeader :showBack="true" :showLine="true">
			<text slot="title">{{ barTitle }}</text>
		</WhiteHeader>
		
		<view class="search-form ly-flex ly-flex-align-center" v-if="dataModelDto.queryFields && dataModelDto.queryFields.length > 0">
			<uni-forms ref="queryForm" :style="dataModelDto.queryFields.length > 1 ? 'width: calc(100% - 70upx);' : 'width: 100%;'">
				<!-- string -->
				<uni-forms-item v-if="dataModelDto.queryFields[0].dataItemInfo.itemType === 'string'" class="uni-form-item uni-column" label=" " left-icon="search" icon-color="#999">
					<uni-easyinput
						type="text"
						v-model="dataModelDto.queryFields[0].value"
						:placeholder="'请输入' + dataModelDto.queryFields[0].dataItemInfo.itemCn"
						confirm-type="search"
						@confirm="handleConfirm"
						@input="handleInput"
					/>
				</uni-forms-item>
				<!-- 整数类型|浮点类型 -->
				<uni-forms-item v-else-if="dataModelDto.queryFields[0].dataItemInfo.itemType === 'number' || dataModelDto.queryFields[0].dataItemInfo.itemType === 'float' || dataModelDto.queryFields[0].dataItemInfo.itemType === 'float4'" class="uni-form-item uni-column ly-flex ly-flex-pack-justify ly-flex-align-center">
					<input v-model="dataModelDto.queryFields[0].start" :placeholder="'请输入'+dataModelDto.queryFields[0].dataItemInfo.itemCn+'开始值'" name="input" @confirm="handleConfirm"></input>
					<span style="padding: 0 30upx;">至</span>
					<input v-model="dataModelDto.queryFields[0].end" :placeholder="'请输入'+dataModelDto.queryFields[0].dataItemInfo.itemCn+'结束值'" name="input" @confirm="handleConfirm"></input>
				</uni-forms-item>
				<!-- 时间类型 yyyy-MM-dd -->
				<uni-forms-item v-else-if="dataModelDto.queryFields[0].dataItemInfo.itemType === 'date'" class="uni-form-item uni-column ly-flex ly-flex-pack-justify ly-flex-align-center">
					<picker class="time-picker-view" mode="date" :value="dataModelDto.queryFields[0].startTime" start="1900-01-01" end="3000-01-01" @change="(e)=>bindDateChange(dataModelDto.queryFields[0], e, 'startTime')">
						<view v-if="dataModelDto.queryFields[0].startTime">{{dataModelDto.queryFields[0].startTime}}</view>
						<view class="placeholder" v-else style="padding-left: 0;">开始时间</view>
					</picker>
					<span style="padding: 0 30upx;">至</span>
					<picker class="time-picker-view" mode="date" :value="dataModelDto.queryFields[0].endTime" start="1900-01-01" end="3000-01-01" @change="(e)=>bindDateChange(dataModelDto.queryFields[0], e, 'endTime')">
						<view v-if="dataModelDto.queryFields[0].endTime">{{dataModelDto.queryFields[0].endTime}}</view>
						<view class="placeholder" v-else style="padding-left: 0;">结束时间</view>
					</picker>
				</uni-forms-item>
				<!-- 时间戳类型 yyyy-MM-dd HH:mm:ss -->
				<uni-forms-item v-else-if="dataModelDto.queryFields[0].dataItemInfo.itemType === 'timestamp'" class="uni-form-item uni-column ly-flex ly-flex-pack-justify ly-flex-align-center">
					<uni-datetime-picker
						type="datetime"
						v-model="dataModelDto.queryFields[0].startTime"
						@change="(e)=>bindDateTimeChangeSearch(dataModelDto.queryFields[0], e, 'startTime')"
					/>
					<span style="padding: 0 30upx;">至</span>
					<uni-datetime-picker
						type="datetime"
						v-model="dataModelDto.queryFields[0].endTime"
						@change="(e)=>bindDateTimeChangeSearch(dataModelDto.queryFields[0], e, 'endTime')"
					/>
				</uni-forms-item>
				<!-- 枚举类型|自定义枚举类型 -->
				<uni-forms-item v-else-if="dataModelDto.queryFields[0].dataItemInfo.itemType === 'enum' || dataModelDto.queryFields[0].dataItemInfo.itemType === 'custom'" class="uni-form-item uni-column">
					<picker
					 :value="dataModelDto.queryFields[0].value"
					 :range="dataModelDto.queryFields[0].itemOptions"
					 range-key="dictLabel"
					 style="width: 100%;"
					 @change="(e)=>handleConfirmPicker(dataModelDto.queryFields[0], e)">
						<view class="picker" v-if="dataModelDto.queryFields[0].value">{{ dataModelDto.queryFields[0].itemOptions[dataModelDto.queryFields[0].itemOptions.findIndex(res => res.dictValue===dataModelDto.queryFields[0].value)].dictLabel }}</view>
						<view class="placeholder" v-else>{{ '请选择'+dataModelDto.queryFields[0].dataItemInfo.itemCn }}</view>
					</picker>
				</uni-forms-item>
			</uni-forms>
			<image v-if="dataModelDto.queryFields.length > 1" class="search-more-icon" src="~@/static/search_more.png" @click="handleShowSearchMore"></image>
		</view>
		
		<view v-show="showSearchMore" class="collapse-form">
			<view class="content">
				<view v-for="(item, index) in dataModelDto.queryFields" :key="index" v-show="index !== 0">
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
							<span style="padding: 0 30upx;">至</span>
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
							<span style="padding: 0 30upx;">至</span>
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
							<span style="padding: 0 30upx;">至</span>
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
			<view class="collapse-button-box ly-flex ly-flex-align-center">
				<button class="form-btn bg-blue" form-type="submit" @click="handleQuery">查询</button>
				<button class="bg-white form-btn line-blue" form-type="reset" @click="resetQuery">重置</button>
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
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { deepClone } from '@/utils/ddc';
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
	async onLoad(options){
		await this.$onLaunched;
		this.modelId = options.id ? options.id : 38;
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
			searchDataModel(Object.assign({}, this.dataModelDto, { dataModelId: this.modelId }), this.headerInfo).then(res => {
				this.loading = false;
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
			});
		},
		/** input搜索 */
		handleConfirm() {
			this.handleQuery();
			this.hideKeyboard();
		},
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
		
	.search-form{
		position: fixed;
		top: 95upx; // headertbar的高度
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
	
	.collapse-form{
		position: fixed;
		top: 195upx;
		left: 0;
		right: 0;
		z-index: 9;
		border-bottom: 1upx solid #ebebeb;
		.uni-collapse-cell{
			border-color: #ebebeb;
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
			border: 1upx solid #ebebeb;
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
			border-top: 1upx solid #ebebeb;
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
			border-top: 1upx solid #ebebeb;
			background: #fff;
			padding: 20upx 0;
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
	
	.card-list{
		padding: 32upx;
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
}
</style>
