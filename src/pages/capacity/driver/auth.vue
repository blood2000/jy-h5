<template>
	<view class="u-page">
		<u-navbar
			title="提交S认证"
			@leftClick="navigateBack"
			safeAreaInsetTop
			fixed
			placeholder
		></u-navbar>
		
		<div class="notify-msg">提交S认证并通过后，该车辆可以承接无车承运开票运单</div>
		<uni-forms ref="form" :modelValue="form" label-width="160">
			<view class="ly-form-card">
				<uni-forms-item required label="请上传身份证件" label-position="top">
					<view class="upload-msg">上传身份证照片，图片大小不能超过3M</view>
					<uni-row class="demo-uni-row" :gutter="32">
					    <uni-col :span="12">
					        <UploadSingleImage
								v-model="form.identificationImage"
								label="上传身份证人像面"
								image-type="id-card"
								side="front"
								icon-type="idcard"
								:disabled="disabled"
								@fillForm="fillForm"
							/>
					    </uni-col>
						<uni-col :span="12">
						    <UploadSingleImage
								v-model="form.identificationBackImage"
								label="上传身份证国徽面"
								image-type="id-card"
								side="back"
								icon-type="idcard_back"
								:disabled="disabled"
								@fillForm="fillForm"
							/>
						</uni-col>
					</uni-row>
				</uni-forms-item>
				<uni-forms-item required name="identificationNumber" label="身份证号" class="border-bottom">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.identificationNumber" :disabled="disabled" placeholder="支持自动识别" />
				</uni-forms-item>
				<uni-forms-item required name="identificationBeginTime" label="生效日期" class="border-bottom">
					<picker mode="date" :value="form.identificationBeginTime" :start="startDate" :end="form.identificationEndTime" :disabled="disabled" @change="(e)=>bindDateChange('identificationBeginTime', e)">
						<view v-if="form.identificationBeginTime" class="uni-input picker-input text-right">
							{{form.identificationBeginTime}}
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
						<view v-else class="picker-placeholder text-right">
							请选择生效日期
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
					</picker>
				</uni-forms-item>
				<uni-forms-item :required="form.identificationEffective !== 1" name="identificationEndTime" label="失效日期" class="border-bottom">
					<picker mode="date" :value="form.identificationEndTime" :start="form.identificationBeginTime" :end="endDate" :disabled="disabled" @change="(e)=>bindDateChange('identificationEndTime', e)">
						<view v-if="form.identificationEndTime" class="uni-input picker-input text-right">
							{{form.identificationEndTime}}
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
						<view v-else class="picker-placeholder text-right">
							请选择失效日期
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
					</picker>
				</uni-forms-item>
				<uni-forms-item name="identificationEffective" label="长期有效" class="border-bottom">
					<picker
					 :value="form.identificationEffective"
					 :range="isOptions"
					 range-key="dictLabel"
					 :disabled="disabled"
					 @change="(e)=>pickerChange(isOptions, 'identificationEffective', e)">
						<view v-if="form.identificationEffective || form.identificationEffective === 0" class="picker-input text-right">
							{{ isOptions[isOptions.findIndex(res => res.dictValue===form.identificationEffective)].dictLabel }}
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
						<view class="picker-placeholder text-right" v-else>
							是否长期有效
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
					</picker>
				</uni-forms-item>
				<uni-forms-item name="homeAddress" label="所在区域">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.homeAddress" :disabled="disabled" placeholder="支持自动识别" />
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required label="请上传驾驶证件" label-position="top">
					<view class="upload-msg">上传驾驶证照片，图片大小不能超过3M</view>
					<uni-row class="demo-uni-row" :gutter="32">
					    <uni-col :span="12">
					        <UploadSingleImage
								v-model="form.driverLicenseImage"
								label="上传驾驶证内页"
								image-type="driver-license"
								icon-type="driver"
								:disabled="disabled"
								@fillForm="fillForm"
							/>
					    </uni-col>
						<uni-col :span="12">
						    <UploadSingleImage
								v-model="form.peopleImage"
								label="上传司机照片"
								icon-type="driver_head"
								:disabled="disabled"
							/>
						</uni-col>
					</uni-row>
				</uni-forms-item>
				<uni-forms-item name="driverLicense" label="驾驶证号" class="border-bottom">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.driverLicense" :disabled="disabled" placeholder="支持自动识别" />
				</uni-forms-item>
				<uni-forms-item required name="issuingOrganizations" label="驾驶证发证机关" class="border-bottom">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.issuingOrganizations" :disabled="disabled" placeholder="支持自动识别" />
				</uni-forms-item>
				<uni-forms-item name="driverLicenseType" label="驾驶证类型" class="border-bottom">
					<picker
					 :value="form.driverLicenseType"
					 :range="driverLicenseTypeOptions"
					 range-key="dictLabel"
					 :disabled="disabled"
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
					<picker mode="date" :value="form.validPeriodFrom" :start="startDate" :end="form.validPeriodTo" :disabled="disabled" @change="(e)=>bindDateChange('validPeriodFrom', e)">
						<view v-if="form.validPeriodFrom" class="uni-input picker-input text-right">
							{{form.validPeriodFrom}}
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
						<view v-else class="picker-placeholder text-right">
							请选择生效日期
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
					</picker>
				</uni-forms-item>
				<uni-forms-item :required="form.validPeriodAlways !== 1" name="validPeriodTo" label="失效日期" class="border-bottom">
					<picker mode="date" :value="form.validPeriodTo" :start="form.validPeriodFrom" :end="endDate" :disabled="disabled" @change="(e)=>bindDateChange('validPeriodTo', e)">
						<view v-if="form.validPeriodTo" class="uni-input picker-input text-right">
							{{form.validPeriodTo}}
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
						<view v-else class="picker-placeholder text-right">
							请选择失效日期
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
					</picker>
				</uni-forms-item>
				<uni-forms-item name="validPeriodAlways" label="长期有效">
					<picker
					 :value="form.validPeriodAlways"
					 :range="isOptions"
					 range-key="dictLabel"
					 :disabled="disabled"
					 @change="(e)=>pickerChange(isOptions, 'validPeriodAlways', e)">
						<view v-if="form.validPeriodAlways || form.validPeriodAlways === 0" class="picker-input text-right">
							{{ isOptions[isOptions.findIndex(res => res.dictValue===form.validPeriodAlways)].dictLabel }}
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
						<view class="picker-placeholder text-right" v-else>
							是否长期有效
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
					</picker>
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required label="请上传从业资格证" label-position="top">
					<view class="upload-msg">上传从业资格证，图片大小不能超过3M</view>
					<uni-row class="demo-uni-row" :gutter="32">
					    <uni-col :span="12">
					        <UploadSingleImage
								v-model="form.workLicenseImage"
								label="上传从业资格证"
								icon-type="work"
								:disabled="disabled"
							/>
					    </uni-col>
					</uni-row>
				</uni-forms-item>
				<uni-forms-item name="workLicense" label="从业资格证" class="border-bottom">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.workLicense" :disabled="disabled" placeholder="请输入从业资格证" />
				</uni-forms-item>
				<uni-forms-item name="workLicenseDueDate" label="到期日期" class="border-bottom">
					<picker mode="date" :value="form.workLicenseDueDate" :start="startDate" :end="endDate" :disabled="disabled" @change="(e)=>bindDateChange('workLicenseDueDate', e)">
						<view v-if="form.workLicenseDueDate" class="uni-input picker-input text-right">
							{{form.workLicenseDueDate}}
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
						<view v-else class="picker-placeholder text-right">
							请选择到期日期
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
					</picker>
				</uni-forms-item>
				<uni-forms-item name="workLicenseProvinceCode" label="从业证办理省份名称">
					<picker
					 :value="form.workLicenseProvinceCode"
					 :range="provinceCodeOptions"
					 range-key="provinceName"
					 :disabled="disabled"
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
			<view class="reset" @click="navigateBack">取消</view>
			<view class="submit" @click="handleSubmit">提交认证</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { getDicts, getProvinceList } from '@/config/service/common.js';
	import UploadSingleImage from '@/components/uploadSingleImage/uploadSingleImage.vue';
	import { isPeriodAlways, isPeriodFormate } from '@/utils/ddc.js';
	import { addInfo, updateInfo } from '@/config/service/capacity/driver.js';
	import { addTenantRel } from '@/config/service/capacity/rel';
	import { removePropertyOfNull } from '@/utils/ddc';
	import { idCardReg } from '@/utils/validate.js';
	export default {
		components: {
			UploadSingleImage
		},
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			}),
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
			disabled() {
			  if (this.form.id) {
				return true;
			  } else {
				return false;
			  }
			}
		},
		data() {
			return {
				form: {},
				// 驾驶证类型字典
				driverLicenseTypeOptions: [],
				// 省编码字典
				provinceCodeOptions: [],
				// 是否长期有效字典
				isOptions: [
					{ dictLabel: '否', dictValue: 0 },
					{ dictLabel: '是', dictValue: 1 }
				]
			}
		},
		onLoad(options){
			this.$store.dispatch('getLoginInfoAction', {
				'Authorization': options.token
			});
			this.form = JSON.parse(options.info);
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
			// 时间控件
			bindDateChange(key, e) {
				this.$set(this.form, key, e.target.value);
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
	
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 60;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			// 确认创建
			handleSubmit() {
				// 手动校验
				if (this.noValidate()) return;
				uni.showLoading({
					title: '保存中',
					mask: true
				})
				const driver = removePropertyOfNull(Object.assign({}, this.form));
				if (this.form.id) {
					// 编辑
					updateInfo(driver, this.headerInfo).then(res => {
						// 更新租户和司机的关系
						const vehicleInfoUpdateBos = driver.vehicleInfoList.map(el => {
							return {
								vehicleCode: el.code,
								isChyVehicle: el.isChyVehicle,
								isVehicleFreeze: el.isVehicleFreeze
							};
						});
						const params = {
							driverCode: driver.code,
							isChyDriver: driver.isChyDriver,
							isDriverFreeze: driver.isDriverFreeze,
							vehicleInfoUpdateBos: vehicleInfoUpdateBos
						};
						this.setRel(params);
					}).catch(e => {
						uni.hideLoading();
					});
				} else {
					// 新增
					addInfo(Object.assign({}, driver, { fromSource: 2 }), this.headerInfo).then(res => {
						// 添加租户和司机的关系
						const params = {
							driverCode: res.data.code,
							vehicleCode: res.data.vehicleInfo?res.data.vehicleInfo.code:undefined,
							isChyDriver: driver.isChyDriver,
							isChyVehicle: res.data.vehicleInfo?driver.vehicleInfo.isChyVehicle:undefined
						};
						this.setRel(params);
					}).catch(e => {
						uni.hideLoading();
					});
				}
			},
			/** 绑定司机和租户的关系 */
			setRel(params) {
				addTenantRel(params, this.headerInfo).then(result => {
					uni.hideLoading();
					uni.showToast({
						title: '保存成功',
						icon: 'none'
					});
					uni.redirectTo({
					    url: '/pages/capacity/driver/index?token='+this.headerInfo.Authorization
					});
				}).catch(e => {
					uni.hideLoading();
				});
			},
			// 校验
			noValidate() {
				if (!this.form.identificationImage || !this.form.identificationBackImage) {
					uni.showToast({
						title: '请上传身份证件',
						icon: 'none'
					});
					return true;
				}
				if (!this.form.identificationNumber) {
					uni.showToast({
						title: '身份证号不能为空',
						icon: 'none'
					});
					return true;
				}
				if (!idCardReg.test(this.form.identificationNumber)) {
					uni.showToast({
						title: '身份证号格式错误',
						icon: 'none'
					});
					return true;
				}
				if (
					!this.form.identificationBeginTime ||
					(this.form.identificationEffective !== 1 && !this.form.identificationEndTime)
				) {
					uni.showToast({
						title: '身份证有效期不能为空',
						icon: 'none'
					});
					return true;
				}
				if (!this.form.driverLicenseImage) {
					uni.showToast({
						title: '请上传驾驶证件',
						icon: 'none'
					});
					return true;
				}
				if (!this.form.peopleImage) {
					uni.showToast({
						title: '请上传司机照片',
						icon: 'none'
					});
					return true;
				}
				if (!this.form.issuingOrganizations) {
					uni.showToast({
						title: '驾驶证发证机关不能为空',
						icon: 'none'
					});
					return true;
				}
				if (
					!this.form.validPeriodFrom ||
					(this.form.validPeriodAlways !== 1 && !this.form.validPeriodTo)
				) {
					uni.showToast({
						title: '驾驶证有效期不能为空',
						icon: 'none'
					});
					return true;
				}
				if (!this.form.workLicenseImage) {
					uni.showToast({
						title: '请上传从业资格证',
						icon: 'none'
					});
					return true;
				}
			},
			/** 图片识别后回填 */
			fillForm(type, data, side) {
			  switch (type) {
				// 身份证
				case 'id-card':
				  if (side === 'front') {
					// if (data.name) {
					//   this.$set(this.form, 'name', data.name);
					// } else {
					//   this.$set(this.form, 'name', '');
					// }
					if (data.number) {
					  this.$set(this.form, 'identificationNumber', data.number);
					} else {
					  this.$set(this.form, 'identificationNumber', '');
					}
					if (data.address) {
					  this.$set(this.form, 'homeAddress', data.address);
					} else {
					  this.$set(this.form, 'homeAddress', '');
					}
				  }
				  if (side === 'back') {
					if (data.valid_from) {
					  this.$set(this.form, 'identificationBeginTime', isPeriodFormate(data.valid_from));
					} else {
					  this.$set(this.form, 'identificationBeginTime', '');
					}
					if (data.valid_to) {
					  if (isPeriodAlways(data.valid_to)) {
						this.$set(this.form, 'identificationEffective', 1);
					  } else {
						this.$set(this.form, 'identificationEndTime', isPeriodFormate(data.valid_to));
					  }
					} else {
					  this.$set(this.form, 'identificationEffective', 0);
					  this.$set(this.form, 'identificationBeginTime', '');
					}
				  }
				  break;
				// 驾驶证
				case 'driver-license':
				  if (data.number) {
					this.$set(this.form, 'driverLicense', data.number);
				  } else {
					this.$set(this.form, 'driverLicense', '');
				  }
				  if (data.issuing_authority) {
					this.$set(this.form, 'issuingOrganizations', data.issuing_authority);
				  } else {
					this.$set(this.form, 'issuingOrganizations', '');
				  }
				  if (data.valid_from) {
					this.$set(this.form, 'validPeriodFrom', isPeriodFormate(data.valid_from));
				  } else {
					this.$set(this.form, 'validPeriodFrom', '');
				  }
				  if (data.valid_to) {
					if (isPeriodAlways(data.valid_to)) {
					  this.$set(this.form, 'validPeriodAlways', 1);
					} else {
					  this.$set(this.form, 'validPeriodTo', isPeriodFormate(data.valid_to));
					}
				  } else {
					this.$set(this.form, 'validPeriodAlways', 0);
					this.$set(this.form, 'validPeriodTo', '');
				  }
				  if (data.class) {
					this.$set(this.form, 'driverLicenseType', data.class);
				  } else {
					this.$set(this.form, 'driverLicenseType', '');
				  }
				  break;
				default:
				  break;
			  }
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-page{
		padding-bottom: 154upx;
		.notify-msg{
			height: 66upx;
			line-height: 66upx;
			background: #FDF2F1;
			font-size: 24upx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #E55E50;
			padding: 0 24upx;
		}
	}
</style>
