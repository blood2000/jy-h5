<template>
	<view class="u-page">
		<HeaderBar :title="cbData? '编辑物料类型' : '创建物料类型'" @back="navigateBack"></HeaderBar>
		
		<uni-forms ref="form" v-model="form" :rules="rules" label-width="150">
			<view class="ly-form-card">
				<!-- <uni-forms-item required name="telphone" label="司机手机号" class="border-bottom">
					<uni-easyinput type="number" :inputBorder="false" :clearable="false" v-model="form.telphone" placeholder="请输入司机手机号" @blur="getUserAlreadyExist" />
				</uni-forms-item>-->
				<uni-forms-item required name="goodsBigType" label="商品大类" class="border-bottom">
					<pickers v-model="form.goodsBigType" :range="goodsBigTypeOption" placeholder='请选择商品大类' @change="changeGoodsBigType"></pickers>
				</uni-forms-item> 
				<uni-forms-item required name="goodsType" label="商品小类" class="border-bottom">
					<pickers v-model="form.goodsType" :range="goodsTypeOption" placeholder='请选择商品小类' @change="(_data)=>binddata('goodsType',_data,'form')"></pickers>
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
	// import { getInfo, addInfo, updateInfo, selectInfo } from '@/config/service/capacity/driver.js';
	// import { addTenantRel } from '@/config/service/capacity/rel';
	// import { phoneReg } from '@/utils/validate.js';
	// import TeamList from '@/pages/capacity/components/teamList.vue'
	// import VehicleList from '@/pages/capacity/components/vehicleList.vue'
	import { removePropertyOfNull } from '@/utils/ddc';
	import { mapState } from 'vuex';
	import HeaderBar from '@/components/Building/HeaderBar2.vue';
	import pickers from './picker.vue';
	export default {
		components: {
			// TeamList,
			// VehicleList,
			HeaderBar,
			pickers
		},
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			}),
		},
		data() {
			// console.log(this.binddata);
			
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
				// // 状态字典
				// isFreezeOptions: [
				// 	{ dictLabel: '正常', dictValue: 0 },
				// 	{ dictLabel: '冻结', dictValue: 1 }
				// ],
				// // 选择调度列表
				// teamListShow: false,
				// teamCodes: [],
				// // 选择车辆列表
				// vehicleListShow: false,
				// vehicleInfoList: [],
				

				// 字典值
				goodsBigTypeOption:[],
				goodsTypeOption:[],
				standardsOption:[],
			}
		},
		async onLoad(options){
			await this.initData()
			if(options && options.cbData){
				this.cbData = JSON.parse(options.cbData)

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
				console.log(_data);

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
					this.cbData = null
					setTimeout(()=>{
						uni.redirectTo({
							url: '/pages/material/index'
						});
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
		height: 100%;
	}
</style>
