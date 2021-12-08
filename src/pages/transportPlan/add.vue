<template>
	<view class="u-page">
		<HeaderBar :title="this.form.type == 0?'创建收货计划':'创建发货计划'" @back="navigateBack"></HeaderBar>
		
		<uni-forms :key="formsUpdate" ref='form' :rules="rules" :modelValue="form" label-width="150" err-show-type="toast">
			
			<view class="ly-form-card">

				<uni-forms-item required name="name" label="计划名称" class="border-bottom">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.name"
						placeholder="请输入计划名称" />
				</uni-forms-item>

				<uni-forms-item required name="effectiveDate" label-width='100' label="计划有效期">
					<uni-datetime-picker 
					:key='oldDatePicker1' 
					ref='datepick' 
					:disabled="form.isForever.length > 0" 
					:border="false" 
					v-model="form.effectiveDate"
					type="daterange" 
					rangeSeparator="/" 
					@change="handlerPick" />
						<!--  (arr)=> oldDatePicker = arr  -->
					<u-checkbox-group v-model="form.isForever" style="float: right;">
						<u-checkbox size='14' label='长期有效' name="" labelSize='24upx'></u-checkbox>
					</u-checkbox-group>
				</uni-forms-item>
			</view>

			<view class="ly-form-card">

				<uni-forms-item required name="transId" label="运输公司" class="border-bottom">
					<pickers v-model="form.transId" :range="transIdOption" placeholder='请选择运输公司'></pickers>
				</uni-forms-item>

				<uni-forms-item required name="orderPlanTeanRelList" label="指定调度者">
					<view v-if="form.orderPlanTeanRelList && form.orderPlanTeanRelList.length > 0" style="width:100% ;flex-direction: row-reverse;" class="ly-flex-align-center picker-input text-right" @click="teamListShow = true">
						<u-icon name="arrow-down-fill" size='7' color="#999999" class="yangiwiss"></u-icon>
						{{ form.orderPlanTeanRelList.map(e=>e.name).join(',') }}
					</view>
					<view v-else style="width:100%; flex-direction: row-reverse;" class="ly-flex-align-center picker-placeholder text-right" @click="teamListShow = true">
						<u-icon name="arrow-down-fill" size='7' color="#999999" class="yangiwiss"></u-icon>
						请选择调度者
					</view>
					
				</uni-forms-item>

			</view>
			<view class="ly-form-card">
				<uni-forms-item required name="orderInfoId" label="货源" class="border-bottom">
					<pickers v-model="form.orderInfoId" :range="orderInfoIdOption" placeholder='请选择货源'></pickers>
				</uni-forms-item>

				<uni-forms-item required name="weight" label="货品总量">
					<view class="ly-flex-align-center">
						<uni-easyinput @blur="()=> olDweightType = form.weight" type="number" :disabled="form.weightType.length>0" :inputBorder="false" :clearable="false" v-model="form.weight" placeholder="两位小数数字" />
						<!-- height: 36px;
					display: flex;
					/* line-height: 36px; */
					align-items: center; -->
						<view style="height: 100%" class="ly-flex-align-center">
							<pickers v-model="form.du__snefniewew" :disabled="true || form.weightType.length>0" :range="[
								{dictLabel: '吨',dictValue:'0' }
							]">
							 <view class="ly-flex-pack-end">
								<view class="ly-flex ml10 g-color-gray picker-input" > {{ 
									[
										{dictLabel: '吨',dictValue:'0' }
									].find(e=> e.dictValue === form.du__snefniewew ).dictLabel
								}} </view>
							</view>
							</pickers>
						</view>
					</view>
					<u-checkbox-group v-model="form.weightType" style="float: right;">
						<u-checkbox size='14' label='不限' name='' labelSize='12rpx'></u-checkbox>
					</u-checkbox-group>
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<template v-if="form.type==0">
					<uni-forms-item required name="recCompnayInfoId" label="发货企业" >
						<pickers v-model="form.recCompnayInfoId" :range="recCompnayInfoIdOption" placeholder='请选择发货企业'></pickers>
					</uni-forms-item>
					<uni-forms-item required label="收货企业" class="border-bottom">
						<uni-easyinput type="text" :inputBorder="false" disabled :clearable="false" v-model="transceiverAddress" />
					</uni-forms-item>
				</template>

				<template v-else>
					<uni-forms-item required label="发货企业" >
						<uni-easyinput type="text" :inputBorder="false" disabled :clearable="false" v-model="transceiverAddress" />
					</uni-forms-item>
					<uni-forms-item required name="sedCompnayInfoId" label="收货企业" class="border-bottom">
						<pickers v-model="form.sedCompnayInfoId" :range="sedCompnayInfoIdOption" placeholder='请选择收货企业'></pickers>
					</uni-forms-item>
				</template>

				<!-- 运输起点 -->
				<uni-forms-item required name="startAddressId" label="运输起点" class="border-bottom">
					<pickers v-model="form.startAddressId" :range="shfuewnsdnsddssOption" placeholder="请输入运输起点" @change="handlerstartAddressId"></pickers>
				</uni-forms-item>

				<uni-forms-item required name="startAddressWlId" label="接单电子围栏" v-if="form.startAddressId" class="border-bottom">
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


				<uni-forms-item required name="unAliasName" label="运输终点别名">
					<uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.unAliasName" placeholder="请输入运输终点别名" />
				</uni-forms-item>
			</view>
			<view class="ly-form-card">
				<uni-forms-item required name="orderPolicyId" label="运输定价策略" class="border-bottom">
					<pickers v-model="form.orderPolicyId" :range="orderPolicyInfoOption" placeholder='请选择运输定价策略'></pickers>
				</uni-forms-item>
				<uni-forms-item required name="goodsPolicyId" label="货品定价策略" class="border-bottom">
					<pickers v-model="form.goodsPolicyId" :range="goodsPolicyIdOption" placeholder='请选择货品定价策略'></pickers>
				</uni-forms-item>
				<uni-forms-item required name="planFreightId" label="实重计算公式">
					<pickers v-model="form.planFreightId" :range="planFreightIdOption" placeholder='请选择实重计算公式'></pickers>
				</uni-forms-item>
			</view>


		</uni-forms>
		<view class="ly-form-button ly-flex ly-flex-pack-justify ly-flex-align-center mt">
			<view class="reset" @click="handleCancle('form')">{{ cbData?'取消':'重置' }}</view>
			<view class="submit" @click="handleSubmit('form')">{{ cbData?'确认修改': '确认创建' }}</view>
		</view>


		<TeamList
			ref="teamListRef"
			:show="teamListShow"
			:teamCodes="teamCodes"
			@close="teamListShow = false"
			@changeTeamCodes="changeTeamCodes"
		/>

	</view>
</template>

<script>

	import HeaderBar from '@/components/Building/HeaderBar2.vue'
	import { listInfo, orderInfoList, tenantCompanyInfoList, getDispatcherTeam, tenantCompanyAddressInfoList, 
	tenantGoodsPolicyInfo,
	getEffectiveGoodsList as goodspriceList,
	orderPlanFreightList, orderPlanInfoAdd, orderPlanInfoUpdate, orderPlanInfoDetatil } from "@/config/service/transportPlan/transportationPlan.js"

	// import { orderPlanInfoList as getList, orderPlanInfoAdd, orderPlanInfoUpdate, orderPlanInfoUpdateStatus, teamSelectTeamListByCodes } from '@/config/service/transportPlan/transportationPlan.js'
	
	import TeamList from '@/pages/capacity/components/teamList.vue'

	import jsfunPicker from '@/components/jsfun-picker/jsfun-picker.vue'
	import pickers from './components/picker.vue'
	import { mapState} from 'vuex';

	import { removePropertyOfNull } from '@/utils/ddc';


	export default {
		
		
		components: {
			pickers,
			jsfunPicker,
			TeamList,
			HeaderBar
		},
		data() {
			return {
				
				teamList:[],
				teamListShow: false,
				teamCodes:[],
				description: '收货企业为本集运站，自动采用地磅称重数据作为卸货凭证',


				form: {
					name: undefined,
					effectiveDate: [], // 转成 开始时间 和 结束时间
					isForever: [], // 转成 数字值 有长度为true 
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
					teamCodes: undefined, // 测试单选 调度者
					orderPolicyId: undefined,
					goodsPolicyId: undefined,
					planFreightId: undefined,
					receiveType: this.sOr,
					status: '0',

					type: 0
				},

				rules: {
					name:{
						rules:[
							{ required: true, errorMessage: '请输入计划名称' }
						]
					},
					effectiveDate:{
						rules:[
							{ type: 'array', required: true, errorMessage: '请输入计划有效期' }
						]
					},
					transId:{
						rules:[
							{ required: true, errorMessage: '请选择运输公司' }
						]
					},
					orderPlanTeanRelList:{
						rules:[
							{ type: 'array', required: true, errorMessage: '请输入指定调度者' }
						]
					},
					
					orderInfoId:{
						rules:[
							{ required: true, errorMessage: '请选择货源' }
						]
					},
					weight:{
						rules:[
							{ required: true, errorMessage: '请输入货品总量' }
						]
					},

					sedCompnayInfoId:{
						rules:[
							{ required: true, errorMessage: '请选择发货企业' }
						]
					},

					recCompnayInfoId:{
						rules:[
							{ required: true, errorMessage: '请选择收货企业' }
						]
					},

					startAddressId:{
						rules:[
							{ required: true, errorMessage: '请选择运输起点' }
						]
					},
					startAddressWlId:{
						rules:[
							{ required: true, errorMessage: '请选择接单电子围栏' }
						]
					},
					
					aliasName:{
						rules:[
							{ required: true, errorMessage: '请输入运输起点别名' },
							{
								minLength: 1,
								maxLength: 30,
								errorMessage: '请输入运输起点别名 {minLength} 到 {maxLength} 个字符',
							}
						]
					},

					
					endAddressId:{
						rules:[
							{ required: true, errorMessage: '请选择运输终点' }
						]
					},

					endAddressWlId:{
						rules:[
							{ required: true, errorMessage: '请选择卸货电子围栏' }
						]
					},

					unAliasName:{
						rules: [
							{ required: true, errorMessage: '请输入运输终点别名'},
							{
								minLength: 1,
								maxLength: 30,
								errorMessage: '请输入运输终点别名 {minLength} 到 {maxLength} 个字符',
							}
						],
					},

					orderPolicyId:{
						rules:[
							{ required: true, errorMessage: '请选择运输定价策略' }
						]
					},
					goodsPolicyId:{
						rules:[
							{ required: true, errorMessage: '请选择货品定价策略' }
						]
					},
					planFreightId:{
						rules:[
							{ required: true, errorMessage: '请选择实重计算公式' }
						]
					},
				},
				// s= 其他数据
				oldDatePicker:[],
				formsUpdate: Date.now(),
				oldDatePicker1: Date.now(), // 改变key值重新渲染
				olDweightType: undefined,
				// e=
				cbData: null,
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

		watch: {
			'form.isForever': {
				handler(val,oval) {
					console.log(this.oldDatePicker);
					if(val === oval ) return
					if(!(val && Array.isArray(val))) return
					if(val.length>0){
						this.$refs.datepick.clear()
						// 要去掉验证
					} else {
						this.$set(this.form, 'effectiveDate', this.oldDatePicker)
						this.oldDatePicker1 = Date.now()
					}
				},
				deep: true
			},
			'form.weightType': {
				handler(val) {
					console.log(888);
					if(!(val && Array.isArray(val))) return
					if(val.length>0){
						this.$set(this.form, 'weight', undefined)
					} else {
						this.$set(this.form, 'weight', this.olDweightType)
					}
				},
				deep: true
			},
		},

		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			}),
		},
		async onLoad(options) {
			
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			this.form.type = options.type -0;
			await this.gettransId();
			await this.getorderInfoIdOption();
			await this.getTransceiverAddress();
			await this.getOrderPlanTeanRelList();
			await this.getshfuewnsdnsddssOption();
			await this.getorderPolicyInfoOption();
			await this.getgoodsPolicyIdOption();
			await this.getplanFreightIdOption();

			this.$set(this.rules.recCompnayInfoId,'rules', [
				{ required: this.form.type == 0, errorMessage: '请选择发货企业' }
			])
			this.$set(this.rules.sedCompnayInfoId,'rules', [
				{ required: this.form.type == 1, errorMessage: '请选择收货企业' }
			])
			this.$set(this.rules.endAddressWlId,'rules', [
				{ required: this.form.type == 1, errorMessage: '请选择卸货电子围栏' }
			])

			if(options.id){
				const { data } = await orderPlanInfoDetatil(options.id)
				this.cbData = data

				this.handlerstartAddressId(this.cbData.startAddressId);
      			this.handlerendAddressId(this.cbData.endAddressId);
				
				if(this.cbData.isForever == 0){
					this.oldDatePicker = [this.cbData.effectiveDateStart, this.cbData.effectiveDateEnd]
				}
				this.olDweightType = this.cbData.weight

				this.teamCodes = this.cbData.teamCodeList.map(e=> e.objCode)
				this.changeTeamCodes(this.teamCodes)

				this.form = {
					...this.form,
					...this.cbData,
					status: this.cbData.status + '',
					effectiveDate: this.oldDatePicker,
					isForever: this.cbData.isForever === 1? ['']: [],
					weightType: this.cbData.weightType === 1? ['']: [],
					du__snefniewew: '0'
				};
				this.formsUpdate = Date.now()
			}

			uni.hideLoading();

			
			
		},

		methods: {
			// 获取运输公司
			async gettransId() {
				const _data = (await listInfo()).list;
				this.transIdOption = _data.map(e => {
					return {
						dictLabel: e.transName,
						dictValue: e.id,
						disable: e.delFlag !== '0'
					};
				}).filter(e=> !e.disable);
				console.log(this.transIdOption);
			},
			// 获取货源列表
			async getorderInfoIdOption(queData) {
				const que = {
					'pageNum': queData?.page || 1,
					'pageSize': 10,
				};

				const _data = (await orderInfoList(que)).data.list;
				this.orderInfoIdOption = _data.map(e => {
					return {
						dictLabel: e.orderName,
						dictValue: e.id,
						disable: e.status !== 0
					};
				}).filter(e=> !e.disable);
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
					'pageSize': 10,
				};

				const _data = (await tenantCompanyInfoList(que)).data.list;
				this.recCompnayInfoIdOption = _data.map(e => {
					if (e.isCurrent === 1) {
						this.form.sedCompnayInfoId = e.id;
						this.transceiverAddress = e.companyName;
					}
					return {
						dictLabel: e.companyName,
						dictValue: e.id,
						disable: e.status !== 0
					};
				}).filter(e=> !e.disable);
			},

			// 获取发货企业
			async getsedCompnayInfoIdOption(queData) {
				const que = {
					'pageNum': queData?.page || 1,
					'pageSize': 10,
				};

				const _data = (await tenantCompanyInfoList(que)).data.list;
				this.sedCompnayInfoIdOption = _data.map(e => {
					if (e.isCurrent === 1) {
						this.form.recCompnayInfoId = e.id;
						this.transceiverAddress = e.companyName;
					}

					return {
						dictLabel: e.companyName,
						dictValue: e.id,
						disable: e.status !== 0
					};
				}).filter(e=> !e.disable);
			},

			// 调度者
			async getOrderPlanTeanRelList(queData) {
				const que = {
					'pageNum': queData?.page || 1,
					'pageSize': 10
				};
				const _data = (await getDispatcherTeam(que)).list

				this.teamList = _data.map(e => {
					return {
						...e,
						dictLabel: e.name,
						dictValue: e.id
					};
				});
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
						dictValue: e.id,
						disable: e.status !== 0
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
							dictValue: e.id,
							disable: e.status !== 0
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
						dictValue: e.id,
						disable: e.status !== 0
					};
					});
				}
			},

			// 获取运价策略
			async getorderPolicyInfoOption(queData) {
				const que = {
					'pageNum': queData?.page || 1,
					'pageSize': 10,
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
					'pageSize': 10,
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
					'pageSize': 10,
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

			// s=其他

			// 更改选中的调度者
			changeTeamCodes(data) {
				this.form.orderPlanTeanRelList = []
				this.teamCodes = data;
				this.teamList.forEach(e=>{
					this.teamCodes.forEach(ee=>{
						if(ee === e.code){
							this.form.orderPlanTeanRelList.push(
								{objCode: ee, isDel: 0, type: 1, name: e.name}
							)
						}
					})
				})

			},

			// 时间控件
			handlerPick(arr){
				if(arr[0] && arr[1]){

					if(arr[0] === arr[1]){
						// 日期加一天
						const time1 = new Date(arr[1]).getTime() + (1000 * 60 * 60 * 24);

						setTimeout(()=>{
							this.$set(this.form, 'effectiveDate', [arr[0], this.parseTime(time1, '{y}-{m}-{d}') ]);
							this.oldDatePicker1 = Date.now()
						}, 100)

						return
					} else {
						this.oldDatePicker = arr
					}
				}
			},
			

			navigateBack() {
				// 跳回当前h5页面
				uni.navigateBack();
			},
			
			
			// 取消 (重置)
			handleCancle(formName) {
				if(this.cbData){
					uni.navigateBack();
					return
				}

				this.oldDatePicker = []
				this.olDweightType = undefined
				this.form = {
					name: undefined,
					effectiveDate: [], // 转成 开始时间 和 结束时间
					isForever: [], // 转成 数字值 有长度为true 
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
					teamCodes: undefined, // 测试单选 调度者
					orderPolicyId: undefined,
					goodsPolicyId: undefined,
					planFreightId: undefined,
					receiveType: this.sOr,
					status: '0',
					type: 0
				},
				this.formsUpdate = Date.now()
				this.oldDatePicker1 = Date.now()
			},
			// 确认创建
			handleSubmit(formName) {
				console.log(this.form);
				// 手动验证空值
				if(!this.noValidate()) return

				// s= 判断一下电子围栏是否重复
				if (this.form.startAddressId === this.form.endAddressId && this.form.startAddressWlId === this.form.endAddressWlId) {
					this.msgError(`接单电子围栏 和 卸货电子围栏 不能相同`);
					return;
				}
				// e=

				this.$refs[formName].validate().then(res=>{
					
					const que = {
						...this.form,
						effectiveDateStart: this.form.effectiveDate ? this.form.effectiveDate[0] : undefined,
						effectiveDateEnd: this.form.effectiveDate ? this.form.effectiveDate[1] : undefined,
						effectiveDate: undefined,

						isForever: this.form.isForever.length>0 ? 1 : 0,
						weightType: this.form.weightType.length>0 ? 1 : 2,
						orderPlanTeanRelList: this.form.orderPlanTeanRelList.map(e=> {
							delete e.name
							return e
						}),
						// [
						// 	{objCode: "517a12b2f4db4270866d2132bd878cef", isDel: 0, type: 1}
						// ], // 调度者
						teamCodes: undefined,
						du__snefniewew: undefined, // 单位不用
            			status: this.form.status - 0, // 默认: 0
						receiveType: (this.form.type - 0) + 1, // 1发 2收
						type: undefined
					}

					this.onSubmit(removePropertyOfNull(que))
				}).catch(err =>{
					console.log('表单错误信息：', err);
				})
			},

			// s= 新增/编辑
			async onSubmit(data) {
				
				const isEdit = !!data.id; // true 为编辑
				uni.showLoading({
					mask: true
				})
				const que = {
					...data
				};

				if (isEdit) {
					await orderPlanInfoUpdate(que);
				} else {
					await orderPlanInfoAdd(que);
				}

				uni.hideLoading();
				uni.showToast({
					title: `${isEdit ? '修改' : '新增'}成功`,
					icon: 'none'
				});
				this.cbData = null
				setTimeout(()=>{
					uni.redirectTo({
						url: '/pages/transportPlan/index'
					});
				}, 700)

			},

			// 手动验证空
			noValidate(formName='form', rulesName='rules' ){
				for (const key in this[rulesName]) {
					if (Object.hasOwnProperty.call(this[rulesName], key)) {
						const rule = this[rulesName][key];
						for (let index = 0; index < rule.rules.length; index++) {
							const r = rule.rules[index];
							if(r.required){
								// console.log(this[formName][key]);
								if(r.type === 'array' && this[formName][key].length <=0 ){
									uni.showToast({
										title: r.errorMessage,
										icon: 'none'
									});
									return false
								}

								// 去掉空格
								// console.log(this[formName][key]);
								if(!this[formName][key] && typeof this[formName][key] !== 'boolean' && this[formName][key] !== 0){
									console.log(r, '验证不通过 返回false');
									uni.showToast({
										title: r.errorMessage,
										icon: 'none'
									});
									return false
								} 
							}
						}
					}
				}

				return true
			}
		}
	}
</script>

<style lang="scss" scoped>

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
	.yangiwiss{
		margin-left: 13upx;
	}
		
</style>
