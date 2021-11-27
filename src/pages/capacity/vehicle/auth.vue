<template>
	<view class="u-page">
		<u-navbar
			title="提交S认证"
			@leftClick="navigateBack"
			safeAreaInsetTop
			fixed
			placeholder
		></u-navbar>
		
		<uni-forms :modelValue="form" label-width="160">
			<view class="ly-form-card">
				<uni-forms-item required name="chassisNumber" label="车辆识别码" class="border-bottom">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.chassisNumber" placeholder="请输入车辆识别码" />
				</uni-forms-item>
				<uni-forms-item required name="vehicleEnergyType" label="车辆能源类型" class="border-bottom">
					<picker
					 :value="form.vehicleEnergyType"
					 :range="energyTypesOptions"
					 range-key="dictLabel"
					 @change="(e)=>pickerChange(energyTypesOptions, 'vehicleEnergyType', e)">
						<view v-if="form.vehicleEnergyType" class="picker-input text-right">
							{{ energyTypesOptions[energyTypesOptions.findIndex(res => res.dictValue===form.vehicleEnergyType)].dictLabel }}
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
						<view class="picker-placeholder text-right" v-else>
							请选择车辆能源类型
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
					</picker>
				</uni-forms-item>
				<uni-forms-item name="vehicleLength" label="车长" class="border-bottom">
					<picker
					 :value="form.vehicleLength"
					 :range="vehicleLengthOptions"
					 range-key="dictLabel"
					 @change="(e)=>pickerChange(vehicleLengthOptions, 'vehicleLength', e)">
						<view v-if="form.vehicleLength" class="picker-input text-right">
							{{ vehicleLengthOptions[vehicleLengthOptions.findIndex(res => res.dictValue===form.vehicleLength)].dictLabel }}
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
						<view class="picker-placeholder text-right" v-else>
							请选择车长
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
					</picker>
				</uni-forms-item>
				<uni-forms-item name="vehicleWidth" label="车宽" class="border-bottom">
					<picker
					 :value="form.vehicleWidth"
					 :range="vehicleWidthOptions"
					 range-key="dictLabel"
					 @change="(e)=>pickerChange(vehicleWidthOptions, 'vehicleWidth', e)">
						<view v-if="form.vehicleWidth" class="picker-input text-right">
							{{ vehicleWidthOptions[vehicleWidthOptions.findIndex(res => res.dictValue===form.vehicleWidth)].dictLabel }}
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
						<view class="picker-placeholder text-right" v-else>
							请选择车宽
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
					</picker>
				</uni-forms-item>
				<uni-forms-item name="roadTransportCertificateNumber" label="道路运输许可证号" class="border-bottom">
					<uni-easyinput type="number" :inputBorder="false" :clearable="false" v-model="form.roadTransportCertificateNumber" placeholder="请输入道路运输许可证号" />
				</uni-forms-item>
				<uni-forms-item name="vehicleColorCode" label="车身颜色" class="border-bottom">
					<picker
					 :value="form.vehicleColorCode"
					 :range="carBodyColorOptions"
					 range-key="dictLabel"
					 @change="(e)=>pickerChange(carBodyColorOptions, 'vehicleColorCode', e)">
						<view v-if="form.vehicleColorCode" class="picker-input text-right">
							{{ carBodyColorOptions[carBodyColorOptions.findIndex(res => res.dictValue===form.vehicleColorCode)].dictLabel }}
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
						<view class="picker-placeholder text-right" v-else>
							请选择车身颜色
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
					</picker>
				</uni-forms-item>
				<uni-forms-item name="axesNumber" label="轴数">
					<picker
					 :value="form.axesNumber"
					 :range="axisTypeOptions"
					 range-key="dictLabel"
					 @change="(e)=>pickerChange(axisTypeOptions, 'axesNumber', e)">
						<view v-if="form.axesNumber" class="picker-input text-right">
							{{ axisTypeOptions[axisTypeOptions.findIndex(res => res.dictValue===form.axesNumber)].dictLabel }}
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
						<view class="picker-placeholder text-right" v-else>
							请选择轴数
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
					</picker>
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required label="请上传行驶证">
					
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required label="道路运输许可证">
					
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required label="车头正面照">
					
				</uni-forms-item>
			</view>
		</uni-forms>
		
		<view class="ly-form-button ly-flex ly-flex-pack-justify ly-flex-align-center">
			<view class="reset" @click="handleCancle">取消</view>
			<view class="submit" @click="handleSubmit">提交认证</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { getDicts } from '@/config/service/common.js';
	export default {
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			})
		},
		data() {
			return {
				form: {},
				// 能源类型字典
				energyTypesOptions: [],
				// 车身颜色字典
				carBodyColorOptions: [],
				// 车长字典
				vehicleLengthOptions: [],
				// 车宽字典
				vehicleWidthOptions: [],
				// 轴数字典
				axisTypeOptions: [],
			}
		},
		onLoad(options){
			this.$store.dispatch('getLoginInfoAction', {
				'Authorization': options.token
			});
			this.getDictsList();
		},
		methods: {
			navigateBack() {
				uni.navigateBack();
			},
			/** 查询字典 */
			getDictsList() {
				// 能源类型
				getDicts('energyTypes', this.headerInfo).then(response => {
					this.energyTypesOptions = response.data;
				});
				// 车身颜色
				getDicts('CarBodyColor', this.headerInfo).then(response => {
					this.carBodyColorOptions = response.data;
				});
				// 车长
				getDicts('vehicleLength', this.headerInfo).then(response => {
					this.vehicleLengthOptions = response.data;
				});
				// 车宽
				getDicts('vehicleWidth', this.headerInfo).then(response => {
					this.vehicleWidthOptions = response.data;
				});
				// 轴数
				getDicts('axis_type', this.headerInfo).then(response => {
					this.axisTypeOptions = response.data;
				});
			},
			// picker选中
			pickerChange(arr, key, e) {
				this.$set(this.form, key, arr[e.detail.value].dictValue);
			},
			// 取消
			handleCancle() {
				
			},
			// 确认创建
			handleSubmit() {
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-page{
		padding-bottom: 154upx;
	}
</style>
