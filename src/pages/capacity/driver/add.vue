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
					<uni-easyinput type="password" :inputBorder="false" :clearable="false" v-model="form.password" :placeholder="form.id?'密码未修改可不填写':'请输入密码'" />
				</uni-forms-item>
				<uni-forms-item required name="isDriverFreeze" label="账号状态">
					
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required name="licenseNumber" label="车牌号" class="border-bottom">
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
				<uni-forms-item required name="isChyDriver" label="同步提交S认证">
					
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
				form: {},
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
