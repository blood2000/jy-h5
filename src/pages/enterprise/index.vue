<!-- 企业管理 -->
<template>
  <view class="content-page">
	<HeaderBar title="企业管理" @back="navigateBack">
			<text style="color:#3A65FF" slot="right" @click="handleAdd">新增</text>
	</HeaderBar>
    <!-- main -->
    <view class="main-box">
		<template>
			<!-- 列表 -->
			<view v-if="!!listData.length">
				<view class="list-item" v-for="(row) in listData" :key="row.id">
					<view class="title-abbreviation ellipsis">{{ row.companyAbbreviation }}</view>
					<view class="right-box">
						<switch :key="switchKey" :disabled="row.isCurrent === 1" :checked="row.status === 0" class="m-switch" @change.stop="({ detail })=> handlerChange(row, detail.value)" />
						<view class="vertical-line">|</view>
						<view class="medit-button" @click="handlerEdit(row)">编辑</view>
					</view>
				</view>

				<uni-load-more :status="status" :icon-size="16" :content-text="{
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了'
				}" />
			</view>

			<NonePage v-else></NonePage>

			<view>
				<u-popup :show="show" round :closeable="false" :closeOnClickOverlay="true" @close="close" @open="open">
					<view class="popup-box" :style="{height: '488upx'}">
						<view class="title">新增/编辑企业</view>
						
						<view>
							<uni-forms :key="formKey" ref="form" v-model="form" :rules="rules" label-width="150">
								<uni-forms-item required name="companyAbbreviation" label="企业简称" class="forms-item border-bottom">
									<uni-easyinput
										type="text"
										:inputBorder="false"
										:clearable="false"
										:maxlength="10"
										cursorSpacing="10"
										v-model="form.companyAbbreviation"
										placeholder="请输入企业简称"
										@input="(_data)=>binddata('companyAbbreviation',_data,'form')"
									/>
								</uni-forms-item> 
								<uni-forms-item>
									<view class="text-prompt">企业名称默认同简称，如需修改请到web端</view>
								</uni-forms-item>
								<uni-forms-item>
									<view class="button-m-box">
										<view class="button" @click="close">取消</view>
										<view class="button success" @click="handleSubmit">确认</view>
									</view>
								</uni-forms-item>
							</uni-forms>
						</view>
					</view>
				</u-popup>
			</view>

			
		</template>
		
    </view>

	
	
  </view>
</template>

<script>

import {
	tenantCompanyInfoList,
	tenantCompanyInfoAdd,
	tenantCompanyInfoUpdate,
	tenantCompanyInfoUpdateStatus,
} from '../../config/service/shipper'
import { mapState } from "vuex";
import HeaderBar from '@/components/Building/HeaderBar2.vue';
import { removePropertyOfNull } from '@/utils/ddc';
export default {
  name:'enterprise',
  components: { HeaderBar },

  data() {
    return {
	  queryParams: { // 请求参数
        pageNum: 1,
        pageSize: 10,

        // goodsTypeName: undefined // 定价策略
      },
	  listData: [],
	  total: 0,
	  status:'more', // more|loading|noMore
	  cbData: null,

	  // 新
	  show: false,
	  form:{
		"companyAbbreviation": undefined,
		"companyName": "",
		// "delFlag": 0,
		// "id": 0,
		// "isCurrent": 0,
		// "linkName": "",
		// "linkTel": "",
		// "pageNum": 0,
		// "pageSize": 0,
		"status": 0,
		// "tenantCode": ""
	  },
	  rules:{
		  	companyAbbreviation:{
				rules:[
					{ required: true, errorMessage: '请输入企业简称'}
				]
			},
	  },

	  switchKey: Date.now(),
	  formKey: Date.now(),

    };
  },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
    }),
	que(){
		return {
			...removePropertyOfNull(this.queryParams) 
		}
	}
  },
  async onLoad(options) {
	if(options.token){
		this.$store.dispatch('getLoginInfoAction', {
			'Authorization': options.token
		});
		options.statusBarHeight && this.$store.dispatch('getStatusBarHeightAction', options.statusBarHeight);
		
	}
	if(this.headerInfo.Authorization){
		this.loadmore('init')
	}
  },
  onShow() {
	  
  },

  async onPullDownRefresh() {
    // console.log("下拉刷新");
	await this.loadmore('init')
    setTimeout(() => {
      uni.stopPullDownRefresh(); //停止下拉刷新动画
    }, 700);
  },

  onReachBottom(){
	  console.log('触底');
	  this.loadmore()
  },

  methods: {
	// 新
	open() {
		// console.log('open');
	},

	close() {
		this.cbData = null
		this.show = false
		this.$refs.form.resetFields()
		this.binddata('companyAbbreviation', undefined,'form')
	},
	
	handleSubmit(){
		this.$refs.form.validate().then(async res=>{
			uni.showLoading({mask:true})
			// 开始
			if(!!this.cbData){
				const que = {
					...this.form,
					companyName: this.form.companyAbbreviation === this.cbData.companyAbbreviation ? this.form.companyName : this.form.companyAbbreviation
				}
				
				await tenantCompanyInfoUpdate(removePropertyOfNull(que), this.headerInfo)
			} else {
				const que = {
					companyAbbreviation: this.form.companyAbbreviation,
					companyName: this.form.companyAbbreviation,
					status: 0
				}
				await tenantCompanyInfoAdd(removePropertyOfNull(que), this.headerInfo)
			}

			// 结束
			uni.hideLoading();
			uni.showToast({
				title: `${!!this.cbData ? '修改' : '新增'}成功`,
				icon: 'none',
			});
			setTimeout(()=>{
				this.loadmore('init')
				this.close()
			}, 700)
			
		}).catch(()=> false)
	},

	// 启用|禁用
	handlerChange(row, value){
		// 提示
		uni.showModal({
			title: '提示',
			content: `是否确定要${ value? '启用': '禁用'}`,
			success: async (res)=> {
				if (res.confirm) {
					
					const que = {
						status: value? 0 : 1,
						id: [row.id]
					}
					uni.showLoading({mask:true})

					await tenantCompanyInfoUpdateStatus({isArrayQuery: JSON.stringify(que)}, this.headerInfo)
					
					uni.hideLoading();

					uni.showToast({
						title: `${value ? '启用' : '禁用'}成功`,
						icon: 'none',
					});

					this.loadmore('init')
					// setTimeout(()=>{
					// }, 700)


				} else if (res.cancel) {
					this.switchKey = Date.now()
				}
			}
		});

		// 请求

		// 告知
	},
	// e

	// 返回
    navigateBack() {
    	const pages = getCurrentPages().length;
		if (pages === 1) {
			uni.webView && uni.webView.navigateBack();
		} else {
			uni.webView && uni.webView.switchTab({
				url: '/pages/applicate/index'
			})
		}
    },
	
	// 加载数据
	loadmore(status) {
		if(status && status === 'init'){
			this.queryParams.pageNum = 1
		} else {
			if(this.status === 'noMore') return
			this.queryParams.pageNum++
		}

		uni.showLoading();
		this.status = 'loading'

		return tenantCompanyInfoList(this.que, this.headerInfo).then(res=>{

			uni.hideLoading();
			this.status = 'more'

			this.total = res.data.total - 0

			if(res.data.list.length < this.que.pageSize){
				// 没有更多了
				this.status = 'noMore';
			}

			let listData = []
			if(status && status === 'init'){
				listData = res.data.list;
			} else {
				listData = [...this.listData, ...res.data.list];
			}

			this.listData = listData.sort((a,b)=> a.id - b.id)
			
		})

	},
	// 新增
	handleAdd() {
		this.cbData = null
		this.show = true
	},
	// 编辑
	handlerEdit(row){
		this.cbData = row
		this.form = {
			...this.form,
			...this.cbData
		}
		this.show = true
	},
	
	// e=
  },
};
</script>
<style lang='scss' scoped>
	// 新
	.main-box{
		padding: 24upx 24upx;
		font-size: 32upx;
	}
	.list-item{
		width: 100%;
		height: 106upx;
		background: #FFFFFF;
		border-radius: 20upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 29upx 0 23upx;
		margin-bottom: 24upx;
		.title-abbreviation{
			width: 430upx;
			font-size: 32upx;
			font-weight: bold;
			color: #333333;
		}
		.right-box{
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			.m-switch{
				transform: scale(0.8) translateX(20upx);
				& ::v-deep .uni-switch-wrapper .uni-switch-input.uni-switch-input-checked {
					background: rgb(0, 122, 255) !important;
				}
				&::before {
					display: none;
				}
			}
			.vertical-line{
				width: 1upx;
				height: 50upx;
				color: #F5F5F5;
				margin: 0 28upx;
			}
			.medit-button{
				// width: 54upx;
				white-space: nowrap;
				font-size: 28upx;
				font-weight: 400;
				color: #333333;
			}
		}
	}

	.congtentpopup{
		background: #fff;
	}

	// 
	.popup-box{
		padding: 44upx 32upx 55upx;
		.title{
			width: 100%;
			text-align: center;
			height: 31upx;
			font-size: 32upx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #333333;
		}
		.uni-forms{
			margin-top: 45upx;
		}

		.forms-item  ::v-deep .uni-input-wrapper{
			text-align: right;
		}

		.text-prompt{
			width: 100%;
			height: 28upx;
			font-size: 28upx;
			text-align: center;
			font-family: PingFang SC;
			margin-top: 38upx;
			font-weight: 400;
			color: #333333;
		}
		.button-m-box{
			display: flex;
			justify-content: space-between;
			.button{
				width: 331upx;
				height: 80upx;
				background: #FFFFFF;
				border: 1upx solid #3A65FF;
				border-radius: 10upx;
				text-align: center;
				line-height: 80upx;

				font-size: 32upx;
				font-weight: bold;
				color: #3A65FF;
			}
			.button.success{
				background: #3A65FF;
				
				color: #FFFFFF;
			}
		}
	}

	::v-deep .uni-error-message{
		width: 100%;
		text-align: right;
	}
	
	
	
</style>