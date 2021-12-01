<template>
	<view class="u-page">
		<u-navbar :title="this.form.type == 0?'创建收货计划':'创建发货计划'" @leftClick="navigateBack" safeAreaInsetTop fixed placeholder>
		</u-navbar>
		<uni-forms ref='form' :rules="rules" :modelValue="form" label-width="150">

			<view class="ly-form-card">

				<uni-forms-item required name="name" label="计划名称" class="border-bottom">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.name"
						placeholder="请输入计划名称" />
						<!--  (_data)=> olDweightType = _data  -->
				</uni-forms-item>

				<uni-forms-item required name="effectiveDate" label-width='95' label="计划有效期">
					<uni-datetime-picker :key='oldDatePicker1' ref='datepick' :disabled="form.isForever.length > 0" :border="false" v-model="form.effectiveDate"
						type="daterange" rangeSeparator="/" @change="handlerPick" />
						<!--  (arr)=> oldDatePicker = arr  -->
					<u-checkbox-group v-model="form.isForever" style="float: right;">
						<u-checkbox size='14' label='长期有效' labelSize='12rpx'>
						</u-checkbox>
					</u-checkbox-group>
				</uni-forms-item>
			</view>

			<view class="ly-form-card">

				<uni-forms-item required name="transId" label="运输公司" class="border-bottom">
					<pickers v-model="form.transId" :range="transIdOption" placeholder='请选择运输公司'></pickers>
				</uni-forms-item>

				<uni-forms-item required name="h_sjfiejwejfwijfewejw" label="指定调度者">
					<pickers v-model="form.h_sjfiejwejfwijfewejw" :range="form.orderPlanTeanRelList" placeholder='请选择调度者'></pickers>
				</uni-forms-item>

			</view>
			<view class="ly-form-card">
				<uni-forms-item required name="orderInfoId" label="货源">
					<pickers v-model="form.orderInfoId" :range="orderInfoIdOption" placeholder='请选择货源'></pickers>
				</uni-forms-item>

				<uni-forms-item required name="weight" label="货品总量">
					<view class="ly-flex-align-center">
						<uni-easyinput @blur="()=> olDweightType = form.weight" type="number" :disabled="form.weightType.length>0" :inputBorder="false" :clearable="false" v-model="form.weight" placeholder="两位小数数字" />

						<pickers v-model="form.du__snefniewew" :disabled="form.weightType.length>0" :range="[
							{dictLabel: '吨',dictValue:'0' }
						]">
							<view class="ly-flex ml10 g-color-gray" style="line-height: 28rpx;"> {{ 
								[
									{dictLabel: '吨',dictValue:'0' }
								].find(e=> e.dictValue === form.du__snefniewew ).dictLabel
							}} </view>
						</pickers>
					</view>
					<u-checkbox-group v-model="form.weightType" style="float: right;">
						<u-checkbox size='14' label='不限' labelSize='12rpx'>
						</u-checkbox>
					</u-checkbox-group>
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<template v-if="form.type==0">
					<uni-forms-item required name="recCompnayInfoId" label="发货企业">
						<pickers v-model="form.recCompnayInfoId" :range="recCompnayInfoIdOption" placeholder='请选择发货企业'></pickers>
					</uni-forms-item>
					<uni-forms-item label="收货企业">
						<uni-easyinput type="text" :inputBorder="false" disabled :clearable="false" v-model="transceiverAddress" />
					</uni-forms-item>
				</template>

				<template v-else>
					<uni-forms-item label="发货企业">
						<uni-easyinput type="text" :inputBorder="false" disabled :clearable="false" v-model="transceiverAddress" />
					</uni-forms-item>
					<uni-forms-item required name="sedCompnayInfoId" label="收货企业">
						<pickers v-model="form.sedCompnayInfoId" :range="sedCompnayInfoIdOption" placeholder='请选择收货企业'></pickers>
					</uni-forms-item>
				</template>

				<!-- 运输起点 -->
				<uni-forms-item required name="startAddressId" label="运输起点">
					<pickers v-model="form.startAddressId" :range="shfuewnsdnsddssOption" placeholder="请输入运输起点" @change="handlerstartAddressId"></pickers>
				</uni-forms-item>

				<uni-forms-item required name="startAddressWlId" label="接单电子围栏" v-if="form.startAddressId">
					<pickers v-model="form.startAddressWlId" :range="startAddressIdOption" placeholder='请选择电子围栏'></pickers>
				</uni-forms-item>

				<!--  -->
				<uni-forms-item required name="aliasName" label="运输起点别名">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.aliasName"
						placeholder="请输入运输起点别名" />
				</uni-forms-item>
			</view>
			<view class="ly-form-card">

				<!-- 运输终点 -->
				<uni-forms-item required name="endAddressId" label="运输终点">
					<!-- <uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.endplace"
						placeholder="请输入运输终点别名" /> -->
						<pickers v-model="form.endAddressId" :range="shfuewnsdnsddssOption" placeholder="请输入运输起点" @change="handlerendAddressId"></pickers>
				</uni-forms-item>

				<template v-if="form.endAddressId">
					<u-alert v-if='form.type == 0' type="error" :description="description" fontSize='1'></u-alert>

					<uni-forms-item v-else required name="endAddressWlId" label="接单电子围栏">
						<pickers v-model="form.endAddressWlId" :range="endAddressIdOption" placeholder='请选择电子围栏'></pickers>
					</uni-forms-item>
				</template>


				<uni-forms-item required name="schedulers" label="运输终点别名">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.endplacealias"
						placeholder="请输入运输终点别名" />
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required name="orderPolicyId" label="运输定价策略">
					<pickers v-model="form.orderPolicyId" :range="orderPolicyInfoOption" placeholder='请选择运输定价策略'></pickers>
				</uni-forms-item>
				<uni-forms-item required name="goodsPolicyId" label="货品定价策略">
					<pickers v-model="form.goodsPolicyId" :range="goodsPolicyIdOption" placeholder='请选择货品定价策略'></pickers>
				</uni-forms-item>
				<uni-forms-item required name="planFreightId" label="实重计算公式">
					<pickers v-model="form.planFreightId" :range="planFreightIdOption" placeholder='请选择实重计算公式'></pickers>
				</uni-forms-item>
			</view>


		</uni-forms>
		<view class="ly-form-button ly-flex ly-flex-pack-justify ly-flex-align-center mt">
			<view class="reset" @click="handleCancle">取消</view>
			<view class="submit" @click="handleSubmit('form')">确认创建</view>
		</view>

	</view>
</template>

<script>
	import { listInfo, orderInfoList, tenantCompanyInfoList, getDispatcherTeam, tenantCompanyAddressInfoList, 
	tenantGoodsPolicyInfo,
	getEffectiveGoodsList as goodspriceList,
	orderPlanFreightList } from "@/config/service/transportPlan/transportationPlan.js"

	import jsfunPicker from '@/components/jsfun-picker/jsfun-picker.vue'
	import pickers from './components/picker.vue'
	import { mapState} from 'vuex';

	export default {
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			}),
		},
		watch: {
			'form.isForever': {
				handler(val) {
					if(val && val.length>0){
						this.$refs.datepick.clear()
					} else {
						this.$set(this.form, 'effectiveDate', this.oldDatePicker)
						this.oldDatePicker1 = Date.now()
					}
				},
				deep: true
			},
			'form.weightType': {
				handler(val) {
					if(val && val.length>0){
						this.$set(this.form, 'weight', undefined)
					} else {
						this.$set(this.form, 'weight', this.olDweightType)
					}
				},
				deep: true
			},
		},
		components: {
			pickers,
			jsfunPicker
		},
		data() {
			return {
				description: '收货企业为本集运站，自动采用地磅称重数据作为卸货凭证',
				// 表单数据
				form: {
					name: undefined,
					effectiveDate: [],
					isForever: [], // 有长度为true
					transId: undefined,
					orderInfoId: undefined,
					du__snefniewew: '0',
					weight: undefined,
					weightType: [],  // 有长度为true
					startAddressId: undefined,
					aliasName: undefined,
					endAddressId: undefined,
					sedCompnayInfoId: undefined,
					recCompnayInfoId: undefined,
					startAddressWlId: undefined,
					endAddressWlId: undefined,
					unAliasName: undefined,
					orderPlanTeanRelList: [],
					h_sjfiejwejfwijfewejw: undefined, // 测试单选 调度者
					orderPolicyId: undefined,
					goodsPolicyId: undefined,
					planFreightId: undefined,
					receiveType: this.sOr,
					status: '0',

					du_priceDefault:'25.00,30.00,35.00'
				},
				// // 长期有效
				// check: [],
				// // 有效期禁用
				// disable: false,
				
				// schedulersOptions: [
				// 	{
				// 		dictValue: 1,
				// 		dictLabel: '福建大道成物流有限公司'
				// 	},
				// 	{
				// 		dictValue: 2,
				// 		dictLabel: 'ww'
				// 	},
				// 	{
				// 		dictValue: 3,
				// 		dictLabel: 'ee'
				// 	}
				// ],
				rules: {
					planName: {
						rules: [{
							required: true,
							errorMessage: '请输入姓名'
						}],
					}
				},
				// s= 其他数据
				oldDatePicker:[],
				oldDatePicker1: Date.now(), // 改变key值重新渲染
				olDweightType: undefined,
				// e=

				transceiverAddress: '',
				// 字典值
				transIdOption:[],
				orderInfoIdOption:[],
				recCompnayInfoIdOption:[],
				sedCompnayInfoIdOption:[],
				shfuewnsdnsddssOption:[],
				startAddressIdOption: [],
				endAddressIdOption:[],

				orderPolicyInfoOption: [], // 运价策略
				goodsPolicyIdOption: [], // 货价策略
				planFreightIdOption: [] // 计算公式
			}
		},
		async onLoad(options) {
			// this.$store.dispatch('getLoginInfoAction', {
			// 	'Authorization': options.token
			// });
			this.form.type = options.type;
			await this.gettransId();
			await this.getorderInfoIdOption();
			await this.getTransceiverAddress();
			await this.getOrderPlanTeanRelList();
			await this.getshfuewnsdnsddssOption();
			await this.getorderPolicyInfoOption();
			await this.getgoodsPolicyIdOption();
			await this.getplanFreightIdOption();
			
		},
		methods: {
			// 获取运输公司
			async gettransId() {
				const _data = (await listInfo()).list;
				this.transIdOption = _data.map(e => {
					return {
					dictLabel: e.transName,
					dictValue: e.id
					};
				});
			},
			// 获取货源列表
			async getorderInfoIdOption(queData) {
				const que = {
					'pageNum': queData?.page || 1,
					'pageSize': 10
				};

				const _data = (await orderInfoList(que)).data.list;
				this.orderInfoIdOption = _data.map(e => {
					return {
						dictLabel: e.orderName,
						dictValue: e.id
					};
				});
			},
			// 获取收发企业
			async getTransceiverAddress() {
				console.log(this.form.type == 0);
				if (this.form.type == 0) {
					return this.getrecCompnayInfoIdOption();
				} else {
					return this.getsedCompnayInfoIdOption();
				}
			},
			// 获取收货企业
			async getrecCompnayInfoIdOption(queData) {
				const que = {
					'pageNum': queData?.page || 1,
					'pageSize': 10
				};

				const _data = (await tenantCompanyInfoList(que)).data.list;
				this.recCompnayInfoIdOption = _data.map(e => {
					if (e.isCurrent === 1) {
						this.form.sedCompnayInfoId = e.id;
						this.transceiverAddress = e.companyName;
					}
					return {
						dictLabel: e.companyName,
						dictValue: e.id
					};
				});
			},

			// 获取发货企业
			async getsedCompnayInfoIdOption(queData) {
				const que = {
					'pageNum': queData?.page || 1,
					'pageSize': 10
				};

				const _data = (await tenantCompanyInfoList(que)).data.list;
				this.sedCompnayInfoIdOption = _data.map(e => {
					if (e.isCurrent === 1) {
						this.form.recCompnayInfoId = e.id;
						this.transceiverAddress = e.companyName;
					}

					return {
						dictLabel: e.companyName,
						dictValue: e.id
					};
				});
			},

			// 调度者
			async getOrderPlanTeanRelList(queData) {
				const que = {
					'pageNum': queData?.page || 1,
					'pageSize': 10
				};
				const _data = (await getDispatcherTeam(que)).list

				this.form.orderPlanTeanRelList = _data.map(e => {
					return {
						dictLabel: e.name,
						dictValue: e.id
					};
				});
				console.log(this.form.orderPlanTeanRelList);

			},

			// 获取运输起点
			async getshfuewnsdnsddssOption(queData) {
				const que = {
					'pageNum': queData?.page || 1,
					'pageSize': 10
				};

				const _data = (await tenantCompanyAddressInfoList(que)).data.list;

				this.shfuewnsdnsddssOption = _data.map(e => {
					return {
						...e,
						dictLabel: e.companyAddrName,
						dictValue: e.id
					};
				});
				console.log(this.shfuewnsdnsddssOption);
			},

			// 处理地址下面的电子围栏数据
			handlerstartAddressId(m_id) {
				this.form.startAddressWlId = undefined;
				const m_findData = this.shfuewnsdnsddssOption.find(e => e.id === m_id);
				if (m_findData) {
					this.startAddressIdOption = m_findData.tenantAddressWlInfoList.map(e => {
						return {
							dictLabel: e.name,
							dictValue: e.id
						};
					});
				}
			},
			// 处理地址下面的电子围栏数据
			handlerendAddressId(m_id) {
				this.form.endAddressWlId = undefined;
				const m_findData = this.shfuewnsdnsddssOption.find(e => e.id === m_id);
				if (m_findData) {
					this.endAddressIdOption = m_findData.tenantAddressWlInfoList.map(e => {
					return {
						dictLabel: e.name,
						dictValue: e.id
					};
					});
				}
			},

			// 获取运价策略
			async getorderPolicyInfoOption(queData) {
				const que = {
					'pageNum': queData?.page || 1,
					'pageSize': 10
				};
				const _data = (await tenantGoodsPolicyInfo(que)).data;

				this.orderPolicyInfoOption = _data.map(e => {
					return {
					dictLabel: e.name,
					dictValue: e.id
					};
				});
			},

			// 获取运价策略
			async getgoodsPolicyIdOption(queData) {
				const que = {
					'pageNum': queData?.page || 1,
					'pageSize': 10
				};
				const _data = (await goodspriceList(que)).data;

				this.goodsPolicyIdOption = _data.map(e => {
					return {
					dictLabel: e.name,
					dictValue: e.id
					};
				});
			},

			// 获取计算公式
			async getplanFreightIdOption(queData) {
				const que = {
					'pageNum': queData?.page || 1,
					'pageSize': 10
				};
				const _data = (await orderPlanFreightList(que)).data.list;
				this.planFreightIdOption = _data.map(e => {
					return {
					dictLabel: e.name,
					dictValue: e.id
					};
				});
			},


			// e= 初始数据结束

			handlerPick(arr){
				if(arr[0] && arr[1]){
					this.oldDatePicker = arr
				}
			},
			handlerBlur(val){
				console.log(val);
			},

			navigateBack() {
				uni.navigateBack();
			},
			// dateChange(val){
			// if(val[0]){this.oldDate = val}
			// },
			/** 查询字典 */
			// getDictsList() {
			// 	// 车牌颜色
			// 	getDicts('licenseColor', this.headerInfo).then(response => {
			// 		this.licenseColorOptions = response.data;
			// 	});
			// 	// 车辆类型
			// 	getDicts('vehicleClassification', this.headerInfo).then(response => {
			// 		this.vehicleTypeOptions = response.data;
			// 	});
			// },
			// // 获取详情
			// getInfoData(code) {
			// 	getInfo(code, this.headerInfo).then(res => {
			// 		this.form = res.data;
			// 	});
			// },
			// picker选中
			pickerChange(arr, key, e) {
				console.log(e);
				this.$set(this.form, key, arr[e.detail.value].dictValue);
			},
			// 取消
			handleCancle() {

			},
			// 确认创建
			handleSubmit(formName) {
				this.$refs[formName].validate().then(valid => {
					if (valid) {
						uni.showToast({
							title: '112'
						})
					} else {
						return false
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	// .u-page {
	// 	padding-bottom: 20upx;
	// }

	.ml10 {
		margin-left: 10px;
	}

	.g-color-gray {
		color: #999999;
	}
	.ly-form-button.mt{
		position: static;
		padding-bottom: 20upx;
	}
		
</style>
