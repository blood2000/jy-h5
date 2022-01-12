<template>
	<view class="u-page">
		<HeaderBar title="运价策略" @back="navigateBack">
			<text slot="right" @click="handleAdd">新增定价</text>
		</HeaderBar>
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="{'text-blue cur':!history}" @tap="detailList">
					定价列表
				</view>
				<view class="cu-item flex-sub" :class="{'text-blue cur':history}" @tap="historyList">
					历史定价
				</view>
			</view>
		</scroll-view>
		<!-- 列表 -->
		<view v-if="!history">
			<view class="ly-flex-pack-start good">
				<view class="">
					策略名称：
				</view>
				<input type="text" v-model="form.name" placeholder="请输入名称" />
			</view>
			<view class="main">
				<view class="list" v-if="priceData.length > 0">
					<view class="card-list" v-for="item,index in priceData" :key="index">
						<view class="list-item" :class="modalName=='move-box-'+ index?'move-cur':''"
						@touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index">
						<view class="flex">
							定价： 
							<view v-if="modifyName !== ('modify' + index)">
								{{item.price + selectDictLabel(unitRange,item.unit) }}
								<span :data-modify="'modify' + index" class="modify" @tap='modify'>修改</span>
							</view>
							<view class="flex" v-else>
								<input style="font-size: 28rpx; width: 100rpx;" type="number" v-model="item.price" focus/>
								<span class="modify"  @tap="endModify">确定</span>
							</view>
						</view> 
						<view class="">
							{{'状态：' + selectDictLabel(statusDict,item.takeEffectStatus)}}
						</view>
						<view class="">
							{{'开始时间：' + item.startTime}}
						</view>
						<view class="">
							{{'结束时间(不含当天)：' + (item.endTime ? item.endTime : '暂无')}}
						</view>
							<view class="move">
								<view  v-if="item.takeEffectStatus == 1 " class="bg-grey _btn" @tap="handleStart(item,index)">立即生效</view>
								<view class="bg-red _btn" @tap="handleDelete(item,index)">删除</view>
							</view>
						</view>
					</view>
				</view>
				<NonePage v-else></NonePage>
			</view>
			<view class="button">
				<button type="primary" @tap="submit" :loading="loading">提交</button>
			</view>
		</view>
		<!-- 历史列表 -->
		<view v-else>
			<view class="main">
				<view class="list" v-if="historyData.length > 0">
					<view class="card-list" v-for="item,index in historyData" :key="index">
						<view class="list-item">
							<view class="flex">
								定价： {{item.price + selectDictLabel(unitRange,item.unit) }}
							</view> 
							<view class="">
								{{'状态：' + selectDictLabel(statusDict,item.takeEffectStatus)}}
							</view>
							<view class="">
								{{'开始时间：' + item.startTime}}
							</view>
							<view class="">
								{{'结束时间(不含当天)：' + (item.endTime ? item.endTime : '暂无')}}
							</view>
						</view>
					</view>
				</view>
				<NonePage v-else></NonePage>
				<uni-load-more v-if="historyData.length > 0" :status="status" :icon-size="16" :content-text="contentText" />
			</view>
		</view>
		
		<!-- 定价弹窗 -->
		<view class="cu-modal" :class="{show:showModal}">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">新增定价</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="cu-form-group">
					<view class="title">开始日期：</view>
					<picker mode="date" :value="ruleForm.startTime" :start="timeLimit" :disabled="disabled" @change="DateChange">
						<view class="picker">
							 <span v-if="!ruleForm.startTime">请选择日期</span>
							 <span v-else>{{ruleForm.startTime}}</span>
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">定价：</view>
					<input v-model="ruleForm.price" style="text-align: left;" placeholder="请输入定价" type="number" />
					<picker :value="unitIndex" :range="unitRange" range-key="dictLabel" @change="unitChange">
						<view class="picker">
							<text>{{unitIndex > -1 ? unitRange[unitIndex].dictLabel : '单位'}}</text>
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">立即生效</view>
					<switch style="transform:scale(0.7)" :checked="ruleForm.isStart" type="checkbox" @change="isStartChange" />
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-blue" @tap="hideModal">取消</button>
						<button class="cu-btn bg-blue margin-left" @tap="addList(ruleForm)">确定</button>
				
					</view>
				</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { addStrategy, getDetailList, historyList, eidtStrategy } from '@/config/service/operate/pricingStrategy/index.js';
	import NonePage from '@/components/NonePage/NonePage.vue';
	import HeaderBar from '@/components/Building/HeaderBar2.vue';
	import Pickers from '@/pages/capacity/components/picker.vue';
	export default {
		components: {
			NonePage,
			HeaderBar,
			Pickers
		},
		computed: {
			...mapState({
				statusBarHeight: (state) => state.header.statusBarHeight,
				headerInfo: state => state.header.headerInfo
			}),
			unitIndex(){
				return this.ruleForm.unit === 2 ? 1 : 0
			}
		},
		data() {
			return {
				// 提交表单
				form:{
					id:undefined,
					oldId:undefined, // 原生效ID
					name:undefined,
					policyType: 1,
					orderPolicyDetailBoList:undefined // 完整列表
				}, 
				effectivePlanNum:0, // 关联计划数
				loading:false, // 按钮loading
				// 弹窗
				showModal:false,
				ruleForm: {
					startTime: undefined,
					price: undefined,
					unit: 1,
					isStart:false
				},
				oldTime:undefined,
				disabled:false,
				// 列表
				priceData:[],
				// 历史列表
				historyData: [],
				history:false, // 列表切换
				// 被删除的
				deleteData: [],
				
				timeLimit:this.parseTime(+new Date() + 8.64e7,'{y}-{m}-{d}'), // 日期限制
				
				// 查询相关
				status:'more',
				isEnd:false,
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了'
				},
				queryParams: {
					pageNum: 1,
					pageSize: 10
				},
				
				// 单位列表
				unitRange:[
					{dictLabel:'元/吨',dictValue:1},
					// {dictLabel:'元/公斤',dictValue:2}
				],
				// 状态字典
				statusDict:[
					{dictLabel:'正在生效',dictValue:0},
					{dictLabel:'未生效',dictValue:1},
					{dictLabel:'提前结束',dictValue:2},
					{dictLabel:'已失效',dictValue:3}
				],
				// 修改价格
				modifyName:null,
				// ListTouch(当前对象)
				modalName:null,
			}
		},
		onShow(){
			// this.handleQuery()
		},
		onLoad(option){
			// this.$store.dispatch('getLoginInfoAction', {
			// 	'Authorization': option.token
			// });
			option.statusBarHeight && this.$store.dispatch('getStatusBarHeightAction', option.statusBarHeight);
			if(option.id){
				uni.showLoading()
				this.form.id = +option.id
				this.effectivePlanNum = option.effectivePlanNum
				this.form.name = option.name
				this.getDetailList()
			}
		},
		onPullDownRefresh() {
			// this.handleQuery()
			// uni.stopPullDownRefresh();  //停止下拉刷新动画
		},
		// 触底加载
		onReachBottom() {
			if(this.history){
				if(!this.isEnd) {
					this.status = 'more';
					this.queryParams.pageNum++;
					this.historyList()
				}
			}
		},
		watch:{
			priceData:{
				handler(v){
					this.timeLimit = v.length ? this.parseTime(+new Date(v[v.length - 1].startTime) + 8.64e7,'{y}-{m}-{d}') : this.parseTime(+new Date() + 8.64e7,'{y}-{m}-{d}')
				},
				deep:true
			},
			'ruleForm.isStart':{
				handler(v){
					if(v){
						this.oldTime = this.ruleForm.startTime
						this.ruleForm.startTime = this.parseTime(new Date(),'{y}-{m}-{d}')
						this.disabled= true
					}else{
						this.ruleForm.startTime = this.oldTime
						this.disabled= false
					}
				}
			}
		},
		methods: {
			submit(){
				if (this.loading) return;
				if(this.form.name){
					if (this.priceData.length === 0) {
					            this.msgSuccess('至少需要一条定价');
					          } else {
					            if (this.effectivePlanNum == 0 || this.priceData.some(res => res.takeEffectStatus === 0)) {
								  this.loading = true
					              this.form.orderPolicyDetailBoList = this.form.id ? [...this.priceData, ...this.deleteData] : this.priceData
					              this.form.id
								  ? eidtStrategy(this.form,this.headerInfo).then(res => {
									   setTimeout(() => {
										  uni.navigateBack({delta:1})
										  },1000);
									   this.msgSuccess(res.msg); })
					              : addStrategy(this.form,this.headerInfo).then(res => {
									   setTimeout(() => {
										  uni.navigateBack({delta:1})
										  },1000);
									   this.msgSuccess(res.msg);
									}); // 提交策略
					            } else {
					              this.msgSuccess('当前策略存在有效计划关联，至少需要一条生效定价');
					            }
					          }
				}else{
						this.msgSuccess('请填写名称');
				}
			},
			navigateBack() {
				uni.navigateBack({
					delta:1
				})
			},
			// 关闭弹窗
			hideModal(){
				this.showModal = false
			},
			// 编辑定价
			modify(e){
				this.modifyName = e.currentTarget.dataset.modify
			},
			endModify(){
				this.modifyName = null
			},
			// 日期选择
			DateChange(e) {
				this.ruleForm.startTime = e.detail.value
			},
			// 单位变更
			unitChange(e){
				e.detail.value === 1 ? this.ruleForm.unit = 2 : this.ruleForm.unit = 1
			},
			// 立即生效
			isStartChange(e){
				this.ruleForm.isStart = e.detail.value
			},
			// handleQuery() {
			//   this.queryParams.pageNum = 1;
			//   this.list = [];
			//   this.isEnd = false;
			// },
			detailList(){
				this.history = false
				this.historyData = []
			},
			getDetailList() {
				this.history = false
			      return getDetailList({ id: this.form.id, pageNum:1 , pageSize:100 },this.headerInfo)
			        .then(res => {
			          this.priceData = res.data.list;
					  const oldid = this.priceData.find(res => res.takeEffectStatus === 0);
					  this.form.oldId = oldid && oldid.id || undefined;
			          this.sortList();
					  uni.hideLoading()
					  
					  this.priceData.forEach(item => {
					  				Object.keys(item).forEach(v => {
					  					if(item[v] === null ||item[v] === undefined ){
					  						item[v] = ''
					  					}
					  			})
					  	})
			        }); // .catch(e => e)
			    },
			async historyList() {
			  this.history = true
			  if(!this.form.id) return;
			  this.status = 'loading';
			  	uni.showLoading();
			  	const data = await historyList({ id: this.form.id, ...this.queryParams },this.headerInfo)
			  	uni.hideLoading();
			  	if (data.data.list.length === 0) {
			  		this.isEnd = true;
			  		this.status = 'noMore';
			  		return;
			  	}
			  	if(data.data.list.length < this.queryParams.pageSize){
			  		this.status = 'noMore';
			  	}
			  	this.historyData = [...this.historyData,...data.data.list]
				
			},
			// 新增定价
			handleAdd(){
				this.reset()
				this.showModal = true
			},
			// 删除
			handleDelete(item,index) {
				uni.showModal({
					title: '温馨提示',
					content: '确定要删除这条定价?',
					success: async res => {
						if (res.confirm) {
							this.priceData[index].id && (this.priceData[index].delFlag = 1, this.deleteData.push(this.priceData[index])); // 存放删除
							this.priceData.splice(index, 1);
							if (item.takeEffectStatus !== 2) { // 删除的不是失效时候执行
							  this.priceData[index] && (this.priceData[index].startTime = item.startTime); // 删除不是最后一条，下一条的开始时间提前
							  index === this.priceData.length && this.priceData[index - 1].takeEffectStatus !== 2 && (this.priceData[index - 1].endTime = ''); // 删除最后一条，前一条结束时间置空
							}
							this.sortList();
						}
					}
				})
			},
			// 立即开始
			handleStart(item,index) {
				uni.showModal({
					title: '温馨提示',
					content: '确定要立即失效这条定价?',
					success: async res => {
						if (res.confirm) {
							this.priceData.forEach((item, i) => {
							  if (item.takeEffectStatus === 0) { // 当前生效置为失效
							    item.endTime = this.parseTime(new Date(), '{y}-{m}-{d}');
							    item.takeEffectStatus = 2;
							  }
							  item.takeEffectStatus === 1 && i < index && item.id && (item.delFlag = 1, this.deleteData.push(item));
							  // item.endTime && new Date(item.endTime) < new Date(item.endTime) && (item.takeEffectStatus = 2); // 未生效的结束时间如果小于立即生效的结束时间的，置为生效
							  // item.isStart = 0;
							});
							// !item.endTime && (item.endTime = this.priceData.find(res => res.takeEffectStatus === 1).startTime || ''); // 设置立即生效的结束时间
							item.takeEffectStatus = 0; // 当前生效，开始日期为现在
							item.startTime = this.parseTime(new Date(), '{y}-{m}-{d}');
							const len = this.priceData.filter((res, i) => res.takeEffectStatus === 1 && i < index).length;
							this.priceData.splice(index - len, len);
							this.removeInvalid();
							this.sortList();
							this.priceData[this.priceData.length - 1].endTime = ''; // 最后一条结束时间为空
						}
					}
				})
			},
			// 列表排序
			sortList() {
			  this.priceData.sort(function(a, b) {
				return new Date(a.startTime) - new Date(b.startTime);
			  });
			  const ineffective = this.priceData.filter(res => res.takeEffectStatus === 1); // 未生效的第一条，时间小等于现在，立刻生效
			  ineffective[0] && new Date(ineffective[0].startTime) <= new Date() && (ineffective[0].takeEffectStatus = 0, ineffective[0].startTime = this.parseTime(new Date(), '{y}-{m}-{d}'));
			},
			// 新增时,不保留已失效的 (编辑时候保留有id的)
			removeInvalid() {
			  this.priceData = this.priceData.filter(res => res.takeEffectStatus !== 2 || res.id);
			},
			// 提交，添加列表
			addList(form) {
			  // 新增策略
				if(form.startTime && form.price){
					this.showModal = false;
					// 新增定价
					if (form.isStart) { // 选择立即启用
					  const isValid = this.priceData.find(res => res.takeEffectStatus === 0);
					  isValid && (isValid.takeEffectStatus = 2, isValid.endTime = this.parseTime(new Date(), '{y}-{m}-{d}')); // 如果立刻生效，已生效变失效
					  form.takeEffectStatus = 0;
					  this.priceData.forEach((res, i) => {
						res.takeEffectStatus === 1 && res.id && (this.priceData[i].delFlag = 1, this.deleteData.push(res));
					  });
					  this.priceData.length = isValid ? 1 : 0; // 立即生效，没生效过的都删除
					} else {
					  form.takeEffectStatus = 1
					  this.priceData.forEach((item, index) => { // 未选择立即开始，找到结束时间为空的，设置为新增的开始时间
						!item.endTime && (item.endTime = form.startTime);
					  });
					}
					this.priceData.push(form);
					this.sortList();
					this.removeInvalid();
				}else{
					this.msgSuccess('请将日期与价格填写完整')
				}
			},
			
			reset(){
				this.ruleForm= {
					startTime: undefined,
					price: undefined,
					unit: 1,
					isStart: false
				}
			},
			
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},
			
			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},
			
			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-page {
		padding: 0;
		height: 100vh;
		.good{
			height:70rpx;
			line-height: 70rpx;
			font-size: 32rpx;
			border-radius: 24rpx;
			margin: 24rpx 32rpx;
			padding:0 32rpx;
			background: #FFFFFF;
			input{
				height:70rpx
			}
		}
		.main{
			border-radius: 24rpx;
			margin: 24rpx 32rpx;
			background: #FFFFFF;
			.list{
				.card-list{
					&:not(:last-child){
						&::after {
							content: "";
							position: absolute;
							left: 0;
							right: 0;
							bottom: 1rpx;
							// top: 0;
							height: 1rpx;
							transform: scaleY(0.3);
							background:black;
						}
					}
					overflow: hidden;
					position: relative;
					width: 100%;
					background: #FFFFFF;
					border-radius: 16px;
					.list-item{
						padding: 20rpx;
						transition: all .6s ease-in-out 0s;
					}
					.move{
						display: flex;
						justify-content: flex-end;
						position: absolute;
						top: 0;
						right: 0;
						width: 240rpx;
						height: 100%;
						transform: translateX(100%);
						._btn{
							display: flex;
							width: 120rpx;
							justify-content: center;
							align-items: center
						}
					}
					.move-cur {
						transform: translateX(-240rpx)
					}
				}
				span{
					margin-left: 20rpx;
					color:#0081ff
				}
			}
		}
		.button{
			position:fixed;
			margin: auto;
			left: 0;
			right: 0;
			bottom: 100rpx;
			width: 80%;
		}
		.cu-modal{
			z-index: 998;
		}
	}
</style>