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
						<view v-if="form.isDriverFreeze" class="picker-input text-right">
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
				<uni-forms-item name="teamCode" label="调度者" class="border-bottom">
					<view class="picker-placeholder text-right">
						请选择调度者
						<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
					</view>
				</uni-forms-item>
				<uni-forms-item name="isChyDriver" label="同步提交S认证">
					
				</uni-forms-item>
			</view>
		</uni-forms>
		
		<view class="ly-form-button ly-flex ly-flex-pack-justify ly-flex-align-center">
			<view class="reset" @click="handleCancle">取消</view>
			<view class="submit" @click="handleSubmit">确认创建</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { getInfo, addInfo, updateInfo } from '@/config/service/capacity/driver.js';
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
			// 取消
			handleCancle() {
				
			},
			// 确认创建
			handleSubmit() {
				if (this.form.isChyDriver === 1) {
					// 认证
					uni.navigateTo({
					    url: '/pages/capacity/driver/auth?token='+this.headerInfo.Authorization
					});
				} else {
					// 创建
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-page{
		padding-bottom: 154upx;
	}
</style>
