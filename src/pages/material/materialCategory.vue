<template>
	<view class="u-page">
		<HeaderBar :title="cbData? '编辑物料类型' : '创建物料类型'" @back="navigateBack"></HeaderBar>
		
		<uni-forms ref="form" v-model="form" :rules="rules" label-width="150">
			<view class="ly-form-card">
				<uni-forms-item required name="goodsBigType" label="商品大类" class="border-bottom">
					<pickers :disabled="!!cbData" v-model="form.goodsBigType" :range="goodsBigTypeOption" placeholder='请选择商品大类' @change="changeGoodsBigType"></pickers>
				</uni-forms-item> 
				<uni-forms-item required name="goodsType" label="商品小类" class="border-bottom">
					<pickers :disabled="!!cbData || !form.goodsBigType" v-model="form.goodsType" :range="goodsTypeOption" placeholder='请选择商品小类' @change="(_data)=>binddata('goodsType',_data,'form')"></pickers>
				</uni-forms-item> 
				<uni-forms-item required name="standards" label="物料规格">
					<pickers v-model="form.standards" :range="standardsOption" placeholder='请选择物料规格' @change="(_data)=>binddata('standards',_data,'form')"></pickers>
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
	import {tenantGoodsRelUpdate, tenantGoodsRelAdd} from '@/config/service/material'
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
					goodsBigType: undefined, 
					goodsType: undefined, 
					standards: undefined, 
					
				},

				rules: {
					goodsBigType:{
						rules:[
							{ required: true, errorMessage: '请选择商品大类'}
						]
					},
					goodsType:{
						rules:[
							{ required: true, errorMessage: '请选择商品小类' }
						]
					},
					standards:{
						rules:[
							{ required: true, errorMessage: '请选择物料规格' }
						]
					},
				},

				// 字典值
				goodsBigTypeOption:[],
				goodsTypeOption:[],
				standardsOption:[],
			}
		},
		async onLoad(options){
			this.cbData = options.cbData && JSON.parse(options.cbData)
			await this.initData()
			if(options && options.cbData){
				await this.changeGoodsBigType(this.cbData.goodsBigType)
				this.form = {
					...this.form,
					...this.cbData,
					standards: this.cbData.standards + ''
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
				// 获取商品大类
				const { data } = await this.listByDict({
					dictPid: '0',
					dictType: 'goodsType'
				}, this.headerInfo);
				this.goodsBigTypeOption = data;
				// 获取物料规格
				const res = await this.getDicts('jyz_goods_spec', this.headerInfo);
				this.standardsOption = res.data;

				uni.hideLoading();
			},

			// 选中大类请求小类
			async changeGoodsBigType(_data){

				this.binddata('goodsBigType',_data,'form')
				
				const findData = this.goodsBigTypeOption.find(e => e.dictValue === _data);
				if (findData) {
					const { data } = await this.listByDict({
						dictPid: findData.dictCode,
						dictType: 'goodsType'
					}, this.headerInfo);
					this.goodsTypeOption = data;
					this.form.goodsType = undefined;
					this.$refs.form.clearValidate('goodsType');
				}
			},

			// 确认创建/编辑
			handleSubmit() {
				// 手动验证空值
				// if(!this.noValidate()) return
				this.$refs.form.validate().then(async res=>{
					// 提示(编辑/ 新增)
					uni.showLoading()
					// 请求
					const que = {
						...removePropertyOfNull(this.form) 
					};

					if (!!this.cbData) {
						await tenantGoodsRelUpdate(que, this.headerInfo);
					} else {
						await tenantGoodsRelAdd(que, this.headerInfo);
					}

					// 返回
					uni.hideLoading();
					uni.showToast({
						title: `${this.cbData ? '修改' : '新增'}成功`,
						icon: 'none'
					});
					
					setTimeout(()=>{
						uni.redirectTo({
							url: '/pages/material/index'
						});
						this.cbData = null
					}, 700)
				})
			},

			// 手动验证空
			noValidate(formName='form', rulesName='rules' ){
				for (const key in this[rulesName]) {
					if (Object.hasOwnProperty.call(this[rulesName], key)) {
						const rule = this[rulesName][key];
						for (let index = 0; index < rule.rules.length; index++) {
							const r = rule.rules[index];
							if(r.required){
								if(r.type === 'array' && this[formName][key].length <=0 ){
									uni.showToast({
										title: r.errorMessage,
										icon: 'none'
									});
									return false
								}

								// 去掉空格
								if(!this[formName][key] && typeof this[formName][key] !== 'boolean' && this[formName][key] !== 0){
									uni.showToast({
										title: r.errorMessage,
										icon: 'none'
									});
									return false
								} 
							}
						}
					}
				}

				return true
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
