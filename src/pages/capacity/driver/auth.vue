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
				<uni-forms-item required label="请上传身份证件">
					
				</uni-forms-item>
				<uni-forms-item required name="identificationNumber" label="身份证号" class="border-bottom">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.identificationNumber" placeholder="支持自动识别" />
				</uni-forms-item>
				<uni-forms-item required name="identificationBeginTime" label="生效日期" class="border-bottom">
					
				</uni-forms-item>
				<uni-forms-item required name="identificationEndTime" label="失效日期" class="border-bottom">
					
				</uni-forms-item>
				<uni-forms-item name="identificationEffective" label="长期有效" class="border-bottom">
					
				</uni-forms-item>
				<uni-forms-item name="homeAddress" label="所在区域">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.homeAddress" placeholder="支持自动识别" />
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required label="请上传驾驶证件">
					
				</uni-forms-item>
				<uni-forms-item name="driverLicense" label="驾驶证号" class="border-bottom">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.driverLicense" placeholder="支持自动识别" />
				</uni-forms-item>
				<uni-forms-item required name="issuingOrganizations" label="驾驶证发证机关" class="border-bottom">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.issuingOrganizations" placeholder="支持自动识别" />
				</uni-forms-item>
				<uni-forms-item name="driverLicenseType" label="驾驶证类型" class="border-bottom">
					<picker
					 :value="form.driverLicenseType"
					 :range="driverLicenseTypeOptions"
					 range-key="dictLabel"
					 @change="(e)=>pickerChange(driverLicenseTypeOptions, 'driverLicenseType', e)">
						<view v-if="form.driverLicenseType" class="picker-input text-right">
							{{ driverLicenseTypeOptions[driverLicenseTypeOptions.findIndex(res => res.dictValue===form.driverLicenseType)].dictLabel }}
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
						<view class="picker-placeholder text-right" v-else>
							支持自动识别
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
					</picker>
				</uni-forms-item>
				<uni-forms-item required name="validPeriodFrom" label="生效日期" class="border-bottom">
					
				</uni-forms-item>
				<uni-forms-item required name="validPeriodTo" label="失效日期" class="border-bottom">
					
				</uni-forms-item>
				<uni-forms-item name="validPeriodAlways" label="长期有效">
					
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required label="请上传从业资格证">
					
				</uni-forms-item>
				<uni-forms-item name="workLicense" label="从业资格证" class="border-bottom">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.workLicense" placeholder="请输入从业资格证" />
				</uni-forms-item>
				<uni-forms-item name="workLicenseDueDate" label="到期日期" class="border-bottom">
					
				</uni-forms-item>
				<uni-forms-item name="workLicenseProvinceCode" label="从业证办理省份名称">
					<picker
					 :value="form.workLicenseProvinceCode"
					 :range="provinceCodeOptions"
					 range-key="provinceName"
					 @change="(e)=>pickerProvinceChange(provinceCodeOptions, 'workLicenseProvinceCode', e)">
						<view v-if="form.workLicenseProvinceCode" class="picker-input text-right">
							{{ provinceCodeOptions[provinceCodeOptions.findIndex(res => res.provinceCode===form.workLicenseProvinceCode)].provinceName }}
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
						<view class="picker-placeholder text-right" v-else>
							请选择省份
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
					</picker>
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
	import { getDicts, getProvinceList } from '@/config/service/common.js';
	export default {
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			})
		},
		data() {
			return {
				form: {},
				// 驾驶证类型字典
				driverLicenseTypeOptions: [],
				// 省编码字典
				provinceCodeOptions: [],
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
				// 驾驶证类型
				getDicts('driver_license_type', this.headerInfo).then(response => {
					this.driverLicenseTypeOptions = response.data;
				});
				// 省
				getProvinceList({}, this.headerInfo).then((response) => {
					this.provinceCodeOptions = response.rows;
				});
			},
			// picker选中
			pickerChange(arr, key, e) {
				this.$set(this.form, key, arr[e.detail.value].dictValue);
			},
			pickerProvinceChange(arr, key, e) {
				this.$set(this.form, key, arr[e.detail.value].provinceCode);
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
