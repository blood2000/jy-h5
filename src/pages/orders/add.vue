<template>
	<view class="u-page">
		<HeaderBar :title="cbData? '编辑货源' : '创建货源'" @back="navigateBack"></HeaderBar>
		
		<uni-forms ref="form" v-model="form" :rules="rules" label-width="150">
			<view class="ly-form-card">
				<uni-forms-item required name="orderName" label="货源名称" class="border-bottom">
					<uni-easyinput maxlength='30' trim :inputBorder="false" :clearable="false" v-model="form.orderName" placeholder="请输入货源名称" />
				</uni-forms-item>
				<uni-forms-item required name="tenantGoodsRelId" label="商品小类" class="border-bottom">
					<pickers v-model="form.tenantGoodsRelId" :range="tenantGoodsRelIdOption" placeholder='请选择商品小类' @change="(_data)=>{binddata('tenantGoodsRelId',_data,'form');handlerChange(_data)}"></pickers>
				</uni-forms-item> 
			</view>
			
		</uni-forms>
		
		<view class="ly-form-button ly-flex ly-flex-pack-justify ly-flex-align-center">
			<view class="reset" @click="navigateBack">取消</view>
			<view class="submit" @click="handleSubmit">{{ cbData?'确认修改':'确认创建'}}</view>
		</view>
		
	</view>
</template>

<script>
	import { orderInfoAdd, orderInfoUpdate, orderInfoUpdateStatus} from '@/config/service/orders/index'

	import {tenantGoodsRelList} from '@/config/service/material/index'
	
	import { removePropertyOfNull } from '@/utils/ddc';
	import { mapState } from 'vuex';
	import HeaderBar from '@/components/Building/HeaderBar2.vue';
	import pickers from './picker.vue';
	export default {
		components: {
		
			HeaderBar,
			pickers
		},
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			}),
		},
		data() {
			return {
				cbData: null,

				form: {
					orderName: undefined, 
					tenantGoodsRelId: undefined, 
					
				},

				rules: {
					orderName:{
						rules:[
							{ required: true, errorMessage: '请输入货源名称'},
							{
								minLength: 0,
								maxLength: 30,
								errorMessage: '货源名称长度在 {minLength} 到 {maxLength} 个字符',
							}
						]
					},
					tenantGoodsRelId:{
						rules:[
							{ required: true, errorMessage: '请选择商品小类' }
						]
					}
				},

				// 字典值
				tenantGoodsRelIdOption:[],
			}
		},
		async onLoad(options){
			await this.initData()
			if(options && options.cbData){
				this.cbData = JSON.parse(options.cbData)

				this.handlerChange(this.cbData.tenantGoodsRelId)
				this.form = {
					...this.form,
					...this.cbData
				}

			}
		},
		methods: {
			navigateBack() {
				uni.navigateBack();
			},
			// 初始化数据
			async initData(){
				uni.showLoading();
				
				const que = {
					pageNum: 1,
					pageSize: 10000
				};
				const res = await tenantGoodsRelList(que, this.headerInfo);

				this.tenantGoodsRelIdOption = res.data.list.map(e => {
					e.dictLabel = e.goodsTypeName;
					e.dictValue = e.id;
					return e;
				});

				uni.hideLoading();
			},

			// 通过货品类别查找对应的小类
			handlerChange(_data) {
				
				const _findObj = this.tenantGoodsRelIdOption.find(e => e.id === _data);
				if (!_findObj) return;

				this.form = {
					...this.form,
					tenantGoodsRelId: _findObj.id,
					goodsBigType: _findObj.goodsBigType,
					goodsBigTypeName: _findObj.goodsBigTypeName,
					goodsType: _findObj.goodsType,
					goodsTypeName: _findObj.goodsTypeName,
					idCode: _findObj.tenantCode,
					status: '0'
				};
			},

			// 确认创建/编辑
			handleSubmit() {
				this.$refs.form.validate().then(async res=>{
					// 提示(编辑/ 新增)
					uni.showLoading()
					// 请求
					const que = {
						...removePropertyOfNull(this.form) 
					};

					if (!!this.cbData) {
						await orderInfoUpdate(que, this.headerInfo);
					} else {
						await orderInfoAdd(que, this.headerInfo);
					}
					
					// 提示结束
					uni.showToast({
						title: `${this.cbData ? '修改' : '新增'}成功`,
						icon: 'none'
					});
					uni.hideLoading();
					// 返回
					setTimeout(()=>{
						uni.redirectTo({
							url: '/pages/orders/index'
						});
						this.cbData = null
					}, 700)
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.u-page{
		padding-bottom: 128upx;
		overflow-y: auto;
		height: 100vh;
	}
</style>
