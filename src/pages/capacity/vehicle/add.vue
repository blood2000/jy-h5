<template>
	<view class="u-page">
		<HeaderBar :title="this.form.code?'编辑车辆':'新增车辆'" @back="navigateBack"></HeaderBar>
		
		<uni-forms ref="form" :modelValue="form" label-width="150">
			<view class="ly-form-card">
				<uni-forms-item required label="车牌号" name="licenseNumber">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.licenseNumber" placeholder="请输入车牌号" @focus="handlecarBoard" />
					<u-keyboard
						ref="uKeyboard"
						mode="car"
						:show="carBoardShow"
						@change="carBoardChange"
						@close="carBoardClose"
						@confirm="carBoardConfirm"
						@cancel="carBoardCancel"
						@backspace="carBoardBackspace"
					>
					</u-keyboard>
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required name="vehicleLicenseColorCode" label="车牌颜色" class="border-bottom">
					<picker
					 :value="form.vehicleLicenseColorCode"
					 :range="licenseColorOptions"
					 range-key="dictLabel"
					 :disabled="disabled"
					 @change="(e)=>pickerChange(licenseColorOptions, 'vehicleLicenseColorCode', e)">
						<view v-if="form.vehicleLicenseColorCode && licenseColorOptions.length>0" class="picker-input text-right">
							{{ licenseColorOptions[licenseColorOptions.findIndex(res => res.dictValue===form.vehicleLicenseColorCode)].dictLabel }}
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
						<view class="picker-placeholder text-right" v-else>
							请选择车牌颜色
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
					</picker>
				</uni-forms-item>
				<uni-forms-item required name="vehicleTypeCode" label="车型">
					<picker
					 :value="form.vehicleTypeCode"
					 :range="vehicleTypeOptions"
					 range-key="dictLabel"
					 :disabled="disabled"
					 @change="(e)=>pickerChange(vehicleTypeOptions, 'vehicleTypeCode', e)">
						<view v-if="form.vehicleTypeCode && vehicleTypeOptions.length>0" class="picker-input text-right">
							{{ vehicleTypeOptions[vehicleTypeOptions.findIndex(res => res.dictValue===form.vehicleTypeCode)].dictLabel }}
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
						<view class="picker-placeholder text-right" v-else>
							请选择车型
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
					</picker>
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required name="vehicleTotalWeight" label="车辆总重量(皮重)" class="border-bottom">
					<uni-easyinput type="number" :inputBorder="false" :clearable="false" v-model="form.vehicleTotalWeight" :disabled="disabled" placeholder="请输入车辆总重量(皮重)" />
				</uni-forms-item>
				<uni-forms-item required name="vehicleLoadWeight" label="车辆可载重量" class="border-bottom">
					<uni-easyinput type="number" :inputBorder="false" :clearable="false" v-model="form.vehicleLoadWeight" :disabled="disabled" placeholder="请输入车辆可载重量" />
				</uni-forms-item>
				<uni-forms-item required name="vehicleRemainingLoadVolume" label="车辆可载立方">
					<uni-easyinput type="number" :inputBorder="false" :clearable="false" v-model="form.vehicleRemainingLoadVolume" :disabled="disabled" placeholder="请输入车辆可载立方" />
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required name="isVehicleFreeze" label="状态" class="border-bottom">
					<picker
					 :value="form.isVehicleFreeze"
					 :range="isFreezeOptions"
					 range-key="dictLabel"
					 :disabled="disabled"
					 @change="(e)=>pickerChange(isFreezeOptions, 'isVehicleFreeze', e)">
						<view v-if="form.isVehicleFreeze || form.isVehicleFreeze === 0" class="picker-input text-right">
							{{ isFreezeOptions[isFreezeOptions.findIndex(res => res.dictValue===form.isVehicleFreeze)].dictLabel }}
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
						<view class="picker-placeholder text-right" v-else>
							请选择账号状态
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
					</picker>
				</uni-forms-item>
				<uni-forms-item label="调度者" class="border-bottom">
					<view v-if="teamCodes && teamCodes.length > 0" class="picker-input text-right" @click="handleOpenTeamList">
						共{{teamCodes.length}}组
						<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
					</view>
					<view v-else class="picker-placeholder text-right" @click="handleOpenTeamList">
						请选择调度者
						<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
					</view>
				</uni-forms-item>
				<uni-forms-item name="isChyVehicle" label="同步提交S认证">
					<view class="text-right">
						<image class="icon-check" :class="disabled?'disabled':''" v-if="form.isChyVehicle === 1" src="~@/static/capacity/check.png" @click="disabled?'':form.isChyVehicle = 0"></image>
						<image class="icon-check" :class="disabled?'disabled':''" v-else src="~@/static/capacity/check_none.png" @click="disabled?'':form.isChyVehicle = 1"></image>
					</view>
				</uni-forms-item>
			</view>
		</uni-forms>
		
		<view class="ly-form-button ly-flex ly-flex-pack-justify ly-flex-align-center">
			<view class="reset" @click="navigateBack">取消</view>
			<view class="submit" @click="handleSubmit">{{this.form.code?'确认修改':'确认创建'}}</view>
		</view>
		
		<TeamList
			ref="teamListRef"
			:show="teamListShow"
			:teamCodes="teamCodes"
			@close="handleCloseTeamList"
			@changeTeamCodes="changeTeamCodes"
		/>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { getInfo, addInfo, updateInfo, selectInfo } from '@/config/service/capacity/vehicle.js';
	import { getDicts } from '@/config/service/common.js';
	import { addTenantRel } from '@/config/service/capacity/rel';
	import { removePropertyOfNull } from '@/utils/ddc';
	import { plateNoReg } from '@/utils/validate.js';
	import TeamList from '@/pages/capacity/components/teamList.vue';
	export default {
		components: {
			TeamList
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
				form: {
					vehicleLicenseColorCode: '1', // 车牌颜色默认为黄色
					isVehicleFreeze: 0,
					isChyVehicle: 0
				},
				// 车型字典
				vehicleTypeOptions: [],
				// 车牌颜色字典
				licenseColorOptions: [
					{ dictLabel: '黄色', dictValue: '1' }
				],
				// 状态字典
				isFreezeOptions: [
					{ dictLabel: '正常', dictValue: 0 },
					{ dictLabel: '冻结', dictValue: 1 }
				],
				// 车牌键盘
				carBoardShow: false,
				// 选择调度列表
				teamListShow: false,
				teamCodes: []
			}
		},
		onLoad(options){
			this.$store.dispatch('getLoginInfoAction', {
				'Authorization': options.token
			});
			this.form.code = options.code;
			if (options.code) {
				this.getInfoData(options.code);
			}
			this.getDictsList();
		},
		methods: {
			navigateBack() {
				uni.navigateBack();
			},
			/** 查询字典 */
			getDictsList() {
				// 车牌颜色
				getDicts('licenseColor', this.headerInfo).then(response => {
					this.licenseColorOptions = response.data;
				});
				// 车辆类型
				getDicts('vehicleClassification', this.headerInfo).then(response => {
					this.vehicleTypeOptions = response.data;
				});
			},
			// 获取详情
			getInfoData(code) {
				getInfo(code, this.headerInfo).then(res => {
					this.setForm(res.data);
				});
			},
			setForm(data) {
				this.form = data;
				// 回填选中的调度者
				if (this.form.teamCodes) {
					this.teamCodes = this.form.teamCodes.split(',');
				}
			},
			// picker选中
			pickerChange(arr, key, e) {
				this.$set(this.form, key, arr[e.detail.value].dictValue);
			},
			// 车牌键盘
			handlecarBoard() {
				this.carBoardShow = true;
				uni.hideKeyboard();
			},
			carBoardChange(val) {
				this.$set(this.form, 'licenseNumber', (this.form.licenseNumber?this.form.licenseNumber:'') + val);
			},
			carBoardClose() {
				this.carBoardShow = false;
				this.getUserAlreadyExist();
			},
			carBoardConfirm() {
				this.carBoardShow = false;
				this.getUserAlreadyExist();
			},
			carBoardCancel() {
				this.carBoardShow = false;
				this.getUserAlreadyExist();
			},
			carBoardBackspace() {
				if (this.form.licenseNumber && this.form.licenseNumber !== '') {
					this.$set(this.form, 'licenseNumber', this.form.licenseNumber.slice(0, this.form.licenseNumber.length - 1))
				}
			},
			// 确认创建
			handleSubmit() {
				// 手动校验
				if (this.noValidate()) return;
				if (this.form.isChyVehicle === 1) {
					// 认证
					uni.navigateTo({
						url: '/pages/capacity/vehicle/auth?token='+this.headerInfo.Authorization+'&info='+JSON.stringify(this.form)+'&teamCodes='+JSON.stringify(this.teamCodes)
					});
				} else {
					uni.showLoading({
						title: '保存中',
						mask: true
					})
					const driver = removePropertyOfNull(Object.assign({}, this.form));
					if (this.form.id) {
						// 编辑
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
			/** 车牌号码不能重复 */
			getUserAlreadyExist() {
			  if (this.form.licenseNumber) {
				selectInfo(this.form.licenseNumber, this.headerInfo).then(res => {
				  if (res.data) {
					// 已存在
					uni.showToast({
						title: '该车辆信息已存在，将为您展示该车辆详细信息',
						icon: 'none',
						duration: 2000
					});
					res.data.isChyVehicle = 1;
					this.setForm(res.data);
				  } else {
					// 不存在
					this.resetIdAndCode();
				  }
				});
			  } else {
				// 清空
				this.resetIdAndCode();
			  }
			},
			resetIdAndCode() {
			  this.form.id = null;
			  this.form.code = null;
			  this.form.teamCodes = null;
			  this.teamCodes = [];
			},
			// 校验
			noValidate() {
				if (!this.form.licenseNumber) {
					uni.showToast({
						title: '车牌号不能为空',
						icon: 'none'
					});
					return true;
				}
				if (!plateNoReg.test(this.form.licenseNumber)) {
					uni.showToast({
						title: '车牌号格式错误',
						icon: 'none'
					});
					return true;
				}
				if (!this.form.vehicleTypeCode) {
					uni.showToast({
						title: '车型不能为空',
						icon: 'none'
					});
					return true;
				}
				if (!this.form.vehicleTotalWeight || parseFloat(this.form.vehicleTotalWeight)==0) {
					uni.showToast({
						title: '车辆总重量(皮重)不能为空',
						icon: 'none'
					});
					return true;
				}
				if (!this.form.vehicleLoadWeight || parseFloat(this.form.vehicleLoadWeight)==0) {
					uni.showToast({
						title: '车辆可载重量不能为空',
						icon: 'none'
					});
					return true;
				}
				if (!this.form.vehicleRemainingLoadVolume) {
					uni.showToast({
						title: '车辆可载立方不能为空',
						icon: 'none'
					});
					return true;
				}
			},
			// 打开调度列表
			handleOpenTeamList() {
				this.teamListShow = true;
			},
			// 取消调度列表
			handleCloseTeamList() {
				this.teamListShow = false;
			},
			// 更改选中的调度者
			changeTeamCodes(data) {
				this.teamCodes = data;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-page{
		padding-bottom: 154upx;
	}
</style>
