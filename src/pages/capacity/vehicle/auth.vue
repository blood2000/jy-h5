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
				<uni-forms-item required name="chassisNumber" label="车辆识别码" class="border-bottom">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.chassisNumber" :disabled="disabled" placeholder="支持自动识别" />
				</uni-forms-item>
				<uni-forms-item required name="vehicleEnergyType" label="车辆能源类型" class="border-bottom">
					<picker
					 :value="form.vehicleEnergyType"
					 :range="energyTypesOptions"
					 range-key="dictLabel"
					 :disabled="disabled"
					 @change="(e)=>pickerChange(energyTypesOptions, 'vehicleEnergyType', e)">
						<view v-if="form.vehicleEnergyType && energyTypesOptions.length>0" class="picker-input text-right">
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
					 :disabled="disabled"
					 @change="(e)=>pickerChange(vehicleLengthOptions, 'vehicleLength', e)">
						<view v-if="form.vehicleLength && vehicleLengthOptions.length>0" class="picker-input text-right">
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
					 :disabled="disabled"
					 @change="(e)=>pickerChange(vehicleWidthOptions, 'vehicleWidth', e)">
						<view v-if="form.vehicleWidth && vehicleWidthOptions.length>0" class="picker-input text-right">
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
					<uni-easyinput type="number" :inputBorder="false" :clearable="false" v-model="form.roadTransportCertificateNumber" :disabled="disabled" placeholder="请输入道路运输许可证号" />
				</uni-forms-item>
				<uni-forms-item name="vehicleColorCode" label="车身颜色" class="border-bottom">
					<picker
					 :value="form.vehicleColorCode"
					 :range="carBodyColorOptions"
					 range-key="dictLabel"
					 :disabled="disabled"
					 @change="(e)=>pickerChange(carBodyColorOptions, 'vehicleColorCode', e)">
						<view v-if="form.vehicleColorCode && carBodyColorOptions.length>0" class="picker-input text-right">
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
					 :disabled="disabled"
					 @change="(e)=>pickerChange(axisTypeOptions, 'axesNumber', e)">
						<view v-if="form.axesNumber && axisTypeOptions.length>0" class="picker-input text-right">
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
				<uni-forms-item required label="请上传行驶证" label-position="top">
					<view class="upload-msg">上传行驶证照片，图片大小不能超过3M</view>
					<uni-row class="demo-uni-row mb20" :gutter="32">
					    <uni-col :span="12">
					        <UploadSingleImage
								v-model="form.vehicleLicenseImg"
								label="上传行驶证"
								image-type="vehicle-license"
								side="front"
								icon-type="vehicle"
								:disabled="disabled"
								@fillForm="fillForm"
							/>
					    </uni-col>
					    <uni-col :span="12">
					        <UploadSingleImage
								v-model="form.vehicleLicenseSecondImg"
								label="上传行驶证副页"
								image-type="vehicle-license"
								side="back"
								icon-type="vehicle_back"
								:disabled="disabled"
								@fillForm="fillForm"
							/>
					    </uni-col>
					</uni-row>
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required label="道路运输许可证" label-position="top">
					<view class="upload-msg">上传道路运输许可证，图片大小不能超过3M</view>
					<uni-row class="demo-uni-row mb20" :gutter="32">
					    <uni-col :span="12">
					        <UploadSingleImage
								v-model="form.roadTransportCertificateImg"
								label="上传道路运输许可证"
								icon-type="transport"
								:disabled="disabled"
							/>
					    </uni-col>
					</uni-row>
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required label="车头正面照" label-position="top">
					<view class="upload-msg">上传车头正面照，图片大小不能超过3M</view>
					<uni-row class="demo-uni-row mb20" :gutter="32">
					    <uni-col :span="12">
							<UploadSingleImage
								v-model="form.vehicleImage"
								label="上传车头正面照"
								icon-type="vehicle_head"
								:disabled="disabled"
							/>
					    </uni-col>
					</uni-row>
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
	import { getDicts } from '@/config/service/common.js';
	import UploadSingleImage from '@/components/uploadSingleImage/uploadSingleImage.vue';
	import { addInfo, updateInfo } from '@/config/service/capacity/vehicle.js';
	import { addTenantRel } from '@/config/service/capacity/rel';
	import { removePropertyOfNull } from '@/utils/ddc';
	export default {
		components: {
			UploadSingleImage
		},
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			}),
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
				// 车型字典
				vehicleTypeOptions: [],
				teamCodes: []
			}
		},
		onLoad(options){
			this.$store.dispatch('getLoginInfoAction', {
				'Authorization': options.token
			});
			this.form = JSON.parse(options.info);
			this.teamCodes = JSON.parse(options.teamCodes);
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
				// 车辆类型
				getDicts('vehicleClassification', this.headerInfo).then(response => {
					this.vehicleTypeOptions = response.data;
				});
			},
			// picker选中
			pickerChange(arr, key, e) {
				this.$set(this.form, key, arr[e.detail.value].dictValue);
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
					// ...调度者
					updateInfo(driver, this.headerInfo).then(res => {
					  // 添加租户和车辆的关系
					  const params = {
						teamCodes: this.teamCodes.join(','),
						vehicleCode: driver.code,
						isChyVehicle: driver.isChyVehicle,
						isVehicleFreeze: driver.isVehicleFreeze
					  };
					  this.setRel(params);
					}).catch(e => {
					  uni.hideLoading();
					});
				} else {
					// 新增
					addInfo(Object.assign({}, driver, { fromSource: 2 }), this.headerInfo).then(res => {
					  // 添加租户和车辆的关系
					  const params = {
						teamCodes: this.teamCodes.join(','),
						vehicleCode: res.data.code,
						isChyVehicle: driver.isChyVehicle
					  };
					  this.setRel(params);
					}).catch(e => {
					  uni.hideLoading();
					});
				}
			},
			/** 绑定车辆与租户关系 */
			setRel(params) {
				addTenantRel(params, this.headerInfo).then(result => {
					uni.hideLoading();
					uni.showToast({
						title: '保存成功',
						icon: 'none'
					});
					uni.redirectTo({
					    url: '/pages/capacity/vehicle/index?token='+this.headerInfo.Authorization
					});
				}).catch(e => {
					uni.hideLoading();
				});
			},
			// 校验
			noValidate() {
				if (!this.form.chassisNumber) {
					uni.showToast({
						title: '车辆识别码不能为空',
						icon: 'none'
					});
					return true;
				}
				if (!this.form.vehicleEnergyType) {
					uni.showToast({
						title: '车辆能源类型不能为空',
						icon: 'none'
					});
					return true;
				}
				if (!this.form.vehicleLicenseImg) {
					uni.showToast({
						title: '请上传行驶证',
						icon: 'none'
					});
					return true;
				}
				if (!this.form.vehicleLicenseSecondImg) {
					uni.showToast({
						title: '请上传行驶证副页',
						icon: 'none'
					});
					return true;
				}
				if (!this.form.roadTransportCertificateImg) {
					uni.showToast({
						title: '请上传道路运输许可证',
						icon: 'none'
					});
					return true;
				}
				if (!this.form.vehicleImage) {
					uni.showToast({
						title: '请上传车头正面照',
						icon: 'none'
					});
					return true;
				}
			},
			/** 图片识别后回填 */
			fillForm(type, data, side) {
			  switch (type) {
				// 行驶证
				case 'vehicle-license':
				  // 正面
				  if (side === 'front') {
					// 车牌号码
					// if (data.number) {
					//   this.$set(this.form, 'licenseNumber', data.number);
					// } else {
					//   this.$set(this.form, 'licenseNumber', '');
					// }
					// 车辆类型 vehicleTypeCode
					// if (data.vehicle_type) {
					//   // form
					//   this.$set(this.form, 'vehicleTypeCode', this.getVehicleTypeKey(data.vehicle_type));
					// } else {
					//   this.$set(this.form, 'vehicleTypeCode', '');
					// }
					// 车辆识别码 chassisNumber
					if (data.vin) {
					  this.$set(this.form, 'chassisNumber', data.vin);
					} else {
					  this.$set(this.form, 'chassisNumber', '');
					}
					// 发动机号 engineNumber
					if (data.engine_no) {
					  this.$set(this.form, 'engineNumber', data.engine_no);
					} else {
					  this.$set(this.form, 'engineNumber', '');
					}
				  }
				  // 副页
				  if (side === 'back') {
					// 车辆总重量 vehicleTotalWeight
					// if (data.gross_mass) {
					//   var num = data.gross_mass.indexOf('kg');
					//   var value = data.gross_mass.substr(0, num);
					//   this.$set(this.form, 'vehicleTotalWeight', (value / 1000).toFixed(3));
					// } else {
					//   this.$set(this.form, 'vehicleTotalWeight', '0');
					// }
					// // 车辆可载重量 vehicleLoadWeight
					// if (data.unladen_mass) {
					//   num = data.unladen_mass.indexOf('kg');
					//   value = data.unladen_mass.substr(0, num);
					//   this.$set(this.form, 'vehicleLoadWeight', (value / 1000).toFixed(3));
					// }
				  }
				  break;
				default:
				  break;
			  }
			},
			// 根据车牌类型的value值获取对应的key
			getVehicleTypeKey(value) {
			  let key = null;
			  this.vehicleTypeOptions.forEach(el => {
				if (value === el.dictLabel) {
				  key = el.dictValue;
				}
			  });
			  return key || 'X99';
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
