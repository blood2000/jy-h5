<template>
	<view class="u-page">
		<u-navbar
			:title="this.form.code?'编辑车辆':'新增车辆'"
			@leftClick="navigateBack"
			safeAreaInsetTop
			fixed
			placeholder
		></u-navbar>
		
		<uni-forms :modelValue="form" label-width="150">
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
					 @change="(e)=>pickerChange(licenseColorOptions, 'vehicleLicenseColorCode', e)">
						<view v-if="form.vehicleLicenseColorCode" class="picker-input text-right">{{ licenseColorOptions[licenseColorOptions.findIndex(res => res.dictValue===form.vehicleLicenseColorCode)].dictLabel }}</view>
						<view class="picker-placeholder text-right" v-else>请选择车牌颜色</view>
					</picker>
				</uni-forms-item>
				<uni-forms-item required name="vehicleTypeCode" label="车型">
					<picker
					 :value="form.vehicleTypeCode"
					 :range="vehicleTypeOptions"
					 range-key="dictLabel"
					 @change="(e)=>pickerChange(vehicleTypeOptions, 'vehicleTypeCode', e)">
						<view v-if="form.vehicleTypeCode" class="picker-input text-right">{{ vehicleTypeOptions[vehicleTypeOptions.findIndex(res => res.dictValue===form.vehicleTypeCode)].dictLabel }}</view>
						<view class="picker-placeholder text-right" v-else>请选择车型</view>
					</picker>
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required name="vehicleTotalWeight" label="车辆总重量(皮重)" class="border-bottom">
					<uni-easyinput type="number" :inputBorder="false" :clearable="false" v-model="form.vehicleTotalWeight" placeholder="请输入车辆总重量(皮重)" />
				</uni-forms-item>
				<uni-forms-item required name="vehicleLoadWeight" label="车辆可载重量" class="border-bottom">
					<uni-easyinput type="number" :inputBorder="false" :clearable="false" v-model="form.vehicleLoadWeight" placeholder="请输入车辆可载重量" />
				</uni-forms-item>
				<uni-forms-item required name="vehicleRemainingLoadVolume" label="车辆可载立方">
					<uni-easyinput type="number" :inputBorder="false" :clearable="false" v-model="form.vehicleRemainingLoadVolume" placeholder="请输入车辆可载立方" />
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required name="isVehicleFreeze" label="状态" class="border-bottom">
					
				</uni-forms-item>
				<uni-forms-item required name="isChyVehicle" label="同步提交S认证">
					
				</uni-forms-item>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { getInfo, addInfo, updateInfo } from '@/config/service/capacity/vehicle.js';
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
				// 车型字典
				vehicleTypeOptions: [],
				// 车牌颜色字典
				licenseColorOptions: [],
				// 车牌键盘
				carBoardShow: false
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
					this.form = res.data;
				});
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
			},
			carBoardConfirm() {
				this.carBoardShow = false;
			},
			carBoardCancel() {
				this.carBoardShow = false;
			},
			carBoardBackspace() {
				if (this.form.licenseNumber && this.form.licenseNumber !== '') {
					this.$set(this.form, 'licenseNumber', this.form.licenseNumber.slice(0, this.form.licenseNumber.length - 1))
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
