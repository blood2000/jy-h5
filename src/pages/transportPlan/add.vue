<template>
	<view class="u-page">
		<u-navbar :title="this.form.type == 0?'创建收货计划':'创建发货计划'" @leftClick="navigateBack" safeAreaInsetTop fixed placeholder>
		</u-navbar>

		<uni-forms ref='form' :rules="rules" :modelValue="form" label-width="150">
			<view class="ly-form-card">
				<uni-forms-item required name="planName" label="计划名称" class="border-bottom">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.planName"
						placeholder="请输入计划名称" />
				</uni-forms-item>
				<uni-forms-item required name="dateRange" label-width='95' label="计划有效期">
					<uni-datetime-picker ref='datepick' :disabled="disable" :border="false" v-model="form.date"
						type="daterange" rangeSeparator="/" />
					<u-checkbox-group v-model="check" style="float: right;">
						<u-checkbox size='14' label='长期有效' labelSize='12rpx'>
						</u-checkbox>
					</u-checkbox-group>
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required name="company" label="运输公司" class="border-bottom">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.company"
						placeholder="请输入计划名称" />
				</uni-forms-item>
				<uni-forms-item required name="schedulers" label="指定调度者">
					<pickers :value="form.schedulersCode" :range="schedulersOptions" placeholder='请选择调度者'
						@change="pickerChange( schedulersOptions, 'schedulersCode',$event)"></pickers>
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required name="schedulers" label="货源">
					<pickers :value="form.schedulersCode" :range="schedulersOptions" placeholder='请选择货源'
						@change="pickerChange( schedulersOptions, 'schedulersCode',$event)"></pickers>
				</uni-forms-item>
				<uni-forms-item required name="dateRange" label="货品总量">
					<view class="ly-flex-align-center">
						<uni-easyinput type="number" :inputBorder="false" :clearable="false" v-model="form.planName"
							placeholder="两位小数数字" />
						<picker :range="schedulersOptions"
							@change="(e)=>pickerChange(schedulersOptions, 'schedulersCode', e)">
							<view class="ly-flex ml10 g-color-gray" style="line-height: 28rpx;">吨<u-icon
									name="arrow-down-fill" size='12'></u-icon>
							</view>
						</picker>
					</view>
					<u-checkbox-group v-model="check" style="float: right;">
						<u-checkbox size='14' label='不限' labelSize='12rpx'>
						</u-checkbox>
					</u-checkbox-group>
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required name="schedulers" label="发货企业">
					<pickers :value="form.schedulersCode" :range="schedulersOptions" placeholder='请选择发货企业'
						@change="pickerChange( schedulersOptions, 'schedulersCode',$event)"></pickers>
				</uni-forms-item>
				<uni-forms-item required name="schedulers" label="收货企业">
					<pickers :value="form.schedulersCode" :range="schedulersOptions" placeholder='请选择收货企业'
						@change="pickerChange( schedulersOptions, 'schedulersCode',$event)"></pickers>
				</uni-forms-item>
				<uni-forms-item required name="schedulers" label="运输起点">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.startplace"
						placeholder="请输入运输起点" />
				</uni-forms-item>
				<uni-forms-item required name="schedulers" label="接单电子围栏">
					<pickers :value="form.schedulersCode" :range="schedulersOptions" placeholder='请选择电子围栏'
						@change="pickerChange( schedulersOptions, 'schedulersCode',$event)"></pickers>
				</uni-forms-item>
				<uni-forms-item required name="schedulers" label="运输起点别名">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.startplacealias"
						placeholder="请输入运输起点别名" />
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required name="schedulers" label="运输终点">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.endplace"
						placeholder="请输入运输终点别名" />
				</uni-forms-item>
				<u-alert v-if='form.type == 0' type="error" :description="description" fontSize='1'></u-alert>
				<uni-forms-item v-else required name="schedulers" label="接单电子围栏">
					<pickers :value="form.schedulersCode" :range="schedulersOptions" placeholder='请选择电子围栏'
						@change="pickerChange( schedulersOptions, 'schedulersCode',$event)"></pickers>
				</uni-forms-item>
				<uni-forms-item required name="schedulers" label="运输终点别名">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.endplacealias"
						placeholder="请输入运输终点别名" />
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required name="schedulers" label="运输定价策略">
					<pickers :value="form.schedulersCode" :range="schedulersOptions" placeholder='请选择运输定价策略'
						@change="pickerChange( schedulersOptions, 'schedulersCode',$event)"></pickers>
				</uni-forms-item>
				<uni-forms-item required name="schedulers" label="货品定价策略">
					<pickers :value="form.schedulersCode" :range="schedulersOptions" placeholder='请选择货品定价策略'
						@change="pickerChange( schedulersOptions, 'schedulersCode',$event)"></pickers>
				</uni-forms-item>
				<uni-forms-item required name="schedulers" label="实重计算公式">
					<pickers :value="form.schedulersCode" :range="schedulersOptions" placeholder='请选择实重计算公式'
						@change="pickerChange( schedulersOptions, 'schedulersCode',$event)"></pickers>
				</uni-forms-item>
			</view>


		</uni-forms>
		<view class="ly-form-button ly-flex ly-flex-pack-justify ly-flex-align-center">
			<view class="reset" @click="handleCancle">取消</view>
			<view class="submit" @click="handleSubmit('form')">确认创建</view>
		</view>

	</view>
</template>

<script>
	import pickers from './components/picker.vue'
	import {
		mapState
	} from 'vuex';
	import {
		getInfo,
		addInfo,
		updateInfo
	} from '@/config/service/capacity/vehicle.js';
	import {
		getDicts
	} from '@/config/service/common.js';

	export default {
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			}),
		},
		watch: {
			check: {
				handler(val) {
					this.$refs.datepick.clear()
					// val.length ? this.$refs.datepick.clear() : this.form.date = this.oldDate 
					this.disable = !this.disable
				},
				deep: true
			}
		},
		components: {
			pickers
		},
		data() {
			return {
				description: '收货企业为本集运站，自动采用地磅称重数据作为卸货凭证',
				form: {
					planName: '',
					date: []
				},
				// 长期有效
				check: [],
				// 有效期禁用
				disable: false,
				// 存放date
				// oldDate:['','']
				schedulersOptions: [
					{
						dictValue: 1,
						dictLabel: '福建大道成物流有限公司'
					},
					{
						dictValue: 2,
						dictLabel: 'ww'
					},
					{
						dictValue: 3,
						dictLabel: 'ee'
					}
				],
				rules: {
					planName: {
						rules: [{
							required: true,
							errorMessage: '请输入姓名'
						}],
					}
				}
			}
		},
		onLoad(options) {
			this.$store.dispatch('getLoginInfoAction', {
				'Authorization': options.token
			});
			this.form.type = options.type;
			// if (options.code) {
			// 	this.getInfoData(options.code);
			// }
			// this.getDictsList();
		},
		methods: {
			navigateBack() {
				uni.navigateBack();
			},
			// dateChange(val){
			// if(val[0]){this.oldDate = val}
			// },
			/** 查询字典 */
			// getDictsList() {
			// 	// 车牌颜色
			// 	getDicts('licenseColor', this.headerInfo).then(response => {
			// 		this.licenseColorOptions = response.data;
			// 	});
			// 	// 车辆类型
			// 	getDicts('vehicleClassification', this.headerInfo).then(response => {
			// 		this.vehicleTypeOptions = response.data;
			// 	});
			// },
			// // 获取详情
			// getInfoData(code) {
			// 	getInfo(code, this.headerInfo).then(res => {
			// 		this.form = res.data;
			// 	});
			// },
			// picker选中
			pickerChange(arr, key, e) {
				console.log(e);
				this.$set(this.form, key, arr[e.detail.value].dictValue);
			},
			// 取消
			handleCancle() {

			},
			// 确认创建
			handleSubmit(formName) {
				this.$refs[formName].validate().then(valid => {
					if (valid) {
						uni.showToast({
							title: '112'
						})
					} else {
						return false
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.u-page {
		padding-bottom: 154upx;
	}

	.ml10 {
		margin-left: 10px;
	}

	.g-color-gray {
		color: #999999;
	}
</style>
