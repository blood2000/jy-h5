<template>
	<view class="u-page">
		<u-navbar
			:title="this.form.code?'编辑司机':'新增司机'"
			@leftClick="navigateBack"
			safeAreaInsetTop
			fixed
			placeholder
		></u-navbar>
		
		<uni-forms :modelValue="form" label-width="150">
			<view class="ly-form-card">
				<uni-forms-item required name="name" label="司机姓名" class="border-bottom">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.name" placeholder="请输入司机姓名" />
				</uni-forms-item>
				<uni-forms-item required name="telphone" label="司机手机号">
					<uni-easyinput type="number" :inputBorder="false" :clearable="false" v-model="form.telphone" placeholder="请输入司机手机号" />
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item name="password" label="账号密码" class="border-bottom">
					<uni-easyinput type="password" :inputBorder="false" :clearable="false" v-model="form.password" :placeholder="form.id?'密码未修改可不填写':'初始密码abcd1234@'" />
				</uni-forms-item>
				<uni-forms-item required name="isDriverFreeze" label="账号状态">
					<picker
					 :value="form.isDriverFreeze"
					 :range="isFreezeOptions"
					 range-key="dictLabel"
					 @change="(e)=>pickerChange(isFreezeOptions, 'isDriverFreeze', e)">
						<view v-if="form.isDriverFreeze || form.isDriverFreeze === 0" class="picker-input text-right">
							{{ isFreezeOptions[isFreezeOptions.findIndex(res => res.dictValue===form.isDriverFreeze)].dictLabel }}
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
						<view class="picker-placeholder text-right" v-else>
							请选择账号状态
							<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
						</view>
					</picker>
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item name="licenseNumber" label="车辆" class="border-bottom">
					<view class="picker-placeholder text-right">
						请选择车辆
						<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
					</view>
				</uni-forms-item>
				<uni-forms-item name="teamCodes" label="调度者" class="border-bottom">
					<view class="picker-placeholder text-right">
						请选择调度者
						<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
					</view>
				</uni-forms-item>
				<uni-forms-item name="isChyDriver" label="同步提交S认证">
					<view class="text-right">
						<image class="icon-check" v-if="form.isChyDriver === 1" src="~@/static/capacity/check.png" @click="form.isChyDriver = 0"></image>
						<image class="icon-check" v-else src="~@/static/capacity/check_none.png" @click="form.isChyDriver = 1"></image>
					</view>
				</uni-forms-item>
			</view>
		</uni-forms>
		
		<view class="ly-form-button ly-flex ly-flex-pack-justify ly-flex-align-center">
			<view class="reset" @click="navigateBack">取消</view>
			<view class="submit" @click="handleSubmit">{{this.form.code?'确认修改':'确认创建'}}</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { getInfo, addInfo, updateInfo } from '@/config/service/capacity/driver.js';
	import { addTenantRel } from '@/config/service/capacity/rel';
	import { removePropertyOfNull } from '@/utils/ddc';
	export default {
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			})
		},
		data() {
			return {
				form: {
					driverType: 1, // 默认零散司机
					isDriverFreeze: 0,
					isChyDriver: 0
				},
				// 状态字典
				isFreezeOptions: [
					{ dictLabel: '正常', dictValue: 0 },
					{ dictLabel: '冻结', dictValue: 1 }
				]
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
		},
		methods: {
			navigateBack() {
				uni.navigateBack();
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
			// 确认创建
			handleSubmit() {
				if (this.form.isChyDriver === 1) {
					// 认证
					uni.navigateTo({
					    url: '/pages/capacity/driver/auth?token='+this.headerInfo.Authorization+'&info='+JSON.stringify(this.form)
					});
				} else {
					// ...车辆
					// ...调度者
					uni.showLoading({
						title: '保存中...',
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
		}
	}
</script>

<style lang="scss" scoped>
	.u-page{
		padding-bottom: 154upx;
	}
</style>
