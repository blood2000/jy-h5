<template>
	<view class="u-page">
		<HeaderBar :title="title" @back="navigateBack"></HeaderBar>
		
		<uni-forms ref="form" :modelValue="form" label-width="150">
			<view class="ly-form-card">
				<uni-forms-item required name="telphone" label="司机手机号" class="border-bottom">
					<uni-easyinput type="number" :inputBorder="false" :clearable="false" v-model="form.telphone" placeholder="请输入司机手机号" @blur="getUserAlreadyExist" />
				</uni-forms-item>
				<uni-forms-item required name="name" label="司机姓名">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.name" :disabled="disabled" placeholder="请输入司机姓名" />
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item name="password" label="账号密码" class="border-bottom">
					<uni-easyinput type="password" :inputBorder="false" :clearable="false" v-model="form.password" :disabled="disabled" :placeholder="form.id?'密码未修改可不填写':'初始密码abcd1234@'" />
				</uni-forms-item>
				<uni-forms-item required name="isDriverFreeze" label="账号状态">
					<pickers v-model="form.isDriverFreeze" :range="isFreezeOptions" placeholder='请选择账号状态' :disabled="disabled"></pickers>
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item label="车辆" class="border-bottom">
					<view v-if="vehicleInfoList && vehicleInfoList.length > 0" class="picker-input text-right" @click="handleOpenVehicleList">
						共{{vehicleInfoList.length}}辆
						<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
					</view>
					<view v-else class="picker-placeholder text-right" @click="handleOpenVehicleList">
						请选择车辆
						<uni-icons custom-prefix="custom-icon" type="arrowright" size="16" color="#999999"></uni-icons>
					</view>
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
				<uni-forms-item name="isChyDriver" label="同步提交S认证">
					<view class="text-right">
						<image class="icon-check" :class="disabled?'disabled':''" v-if="form.isChyDriver === 1" src="~@/static/capacity/check.png" @click="disabled?'':form.isChyDriver = 0"></image>
						<image class="icon-check" :class="disabled?'disabled':''" v-else src="~@/static/capacity/check_none.png" @click="disabled?'':form.isChyDriver = 1"></image>
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
		<VehicleList
			ref="VehicleListRef"
			:show="vehicleListShow"
			:vehicleInfoList="vehicleInfoList"
			@close="handleCloseVehicleList"
			@changeVehicleInfoList="changeVehicleInfoList"
		/>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { getInfo, addInfo, updateInfo, selectInfo } from '@/config/service/capacity/driver.js';
	import { addTenantRel } from '@/config/service/capacity/rel';
	import { removePropertyOfNull } from '@/utils/ddc';
	import { phoneReg } from '@/utils/validate.js';
	import TeamList from '@/pages/capacity/components/teamList.vue'
	import VehicleList from '@/pages/capacity/components/vehicleList.vue'
	import HeaderBar from '@/components/Building/HeaderBar2.vue';
	import pickers from '../components/picker.vue';
	export default {
		components: {
			TeamList,
			VehicleList,
			HeaderBar,
			pickers
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
					driverType: 1, // 默认零散司机
					isDriverFreeze: 0,
					isChyDriver: 0
				},
				// 状态字典
				isFreezeOptions: [
					{ dictLabel: '正常', dictValue: 0 },
					{ dictLabel: '冻结', dictValue: 1 }
				],
				// 选择调度列表
				teamListShow: false,
				teamCodes: [],
				// 选择车辆列表
				vehicleListShow: false,
				vehicleInfoList: [],
				title: ''
			}
		},
		onLoad(options){
			this.$store.dispatch('getLoginInfoAction', {
				'Authorization': options.token
			});
			this.form.code = options.code;
			this.title = options.title;
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
					this.setForm(res.data);
				});
			},
			setForm(data) {
				this.form = data;
				// 回填选中的车辆
				if (this.form.vehicleInfoList) {
					this.vehicleInfoList = this.form.vehicleInfoList;
				}
				// 回填选中的调度者
				if (this.form.teamCodes) {
					this.teamCodes = this.form.teamCodes.split(',');
				}
			},
			// 确认创建
			handleSubmit() {
				// 手动校验
				if (this.noValidate()) return;
				if (this.form.isChyDriver === 1) {
					// 认证
					uni.navigateTo({
						url: '/pages/capacity/driver/auth?token='+this.headerInfo.Authorization+'&info='+JSON.stringify(this.form)+'&teamCodes='+JSON.stringify(this.teamCodes)+'&vehicleInfoList='+JSON.stringify(this.vehicleInfoList)
					});
				} else {
					uni.showLoading({
						title: '保存中',
						mask: true
					})
					let driver = (Object.assign({}, this.form));
					driver.vehicleInfoList = null;
					driver.vehicleInfo = null;
					driver = removePropertyOfNull(driver);
					if (this.form.id) {
						// 编辑
						updateInfo(driver, this.headerInfo).then(res => {
							// 更新租户和司机的关系
							const vehicleInfoUpdateBos = this.vehicleInfoList.map(el => {
								return {
									vehicleCode: el.code,
									isChyVehicle: el.isChyVehicle,
									isVehicleFreeze: el.isVehicleFreeze
								};
							});
							const params = {
								teamCodes: this.teamCodes.join(','),
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
							const vehicleInfoUpdateBos = this.vehicleInfoList.map(el => {
								return {
									vehicleCode: el.code,
									isChyVehicle: el.isChyVehicle,
									isVehicleFreeze: el.isVehicleFreeze
								};
							});
							const params = {
								teamCodes: this.teamCodes.join(','),
								driverCode: res.data.code,
								isChyDriver: driver.isChyDriver,
								vehicleInfoUpdateBos: vehicleInfoUpdateBos
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
				addTenantRel({isArrayQuery: JSON.stringify(params)}, this.headerInfo).then(result => {
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
			/** 手机号码不能重复 */
			getUserAlreadyExist() {
			  if (this.form.telphone) {
				selectInfo(this.form.telphone, this.headerInfo).then(res => {
				  if (res.data) {
					// 已存在
					uni.showToast({
						title: '该司机信息已存在，将为您展示该司机详细信息',
						icon: 'none',
						duration: 2000
					});
					res.data.isChyDriver = 1;
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
			  this.form.authStatus = 0;
			  this.form.teamCodes = null;
			  this.teamCodes = [];
			  this.vehicleInfoList = [];
			},
			// 校验
			noValidate() {
				if (!this.form.name) {
					uni.showToast({
						title: '司机姓名不能为空',
						icon: 'none'
					});
					return true;
				}
				if (!this.form.telphone) {
					uni.showToast({
						title: '司机手机号不能为空',
						icon: 'none'
					});
					return true;
				}
				if (!phoneReg.test(this.form.telphone)) {
					uni.showToast({
						title: '司机手机号格式错误',
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
			},
			// 打开车辆列表
			handleOpenVehicleList() {
				this.vehicleListShow = true;
			},
			// 取消车辆列表
			handleCloseVehicleList() {
				this.vehicleListShow = false;
			},
			// 更改选中的车辆
			changeVehicleInfoList(data) {
				this.vehicleInfoList = data;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-page{
		padding-bottom: 128upx;
	}
</style>
