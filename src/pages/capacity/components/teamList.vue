<template>
	<u-popup :show="show" round :closeable="true" :closeOnClickOverlay="false" @close="close" @open="open">
		<view class="popup-box" :style="{height: contentHeight}">
			<view class="title">选择调度组</view>
			<view class="search">
				<uni-easyinput
					prefixIcon="search"
					type="text"
					:inputBorder="false"
					:clearable="true"
					v-model="queryParams.userName"
					placeholder="请输入调度组名称搜索"
					@confirm="handleConfirm"
					@input="handleInput"
				/>
			</view>
			<view v-if="loading" class="list-box ly-flex ly-flex-align-center ly-flex-pack-center">
				<!-- loading -->
				<u-loading-icon mode="circle" text=""></u-loading-icon>
			</view>
			<view class="list-box" v-if="!loading && dataList.length > 0">
				<!-- 列表项 -->
				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltolower="scrolltolower">
					<view v-for="(item, index) in dataList" :key="index" class="list-box-item ly-flex ly-flex-pack-justify">
						<view class="name g-single-row ellipsis">
							<image v-if="!!checkMap[item.code]" class="icon-check" src="~@/static/capacity/check.png" @click="handleCheck(item)"></image>
							<image v-else class="icon-check" src="~@/static/capacity/check_none.png" @click="handleCheck(item)"></image>
							{{ (isFilter&&item.isTeamFreeze==1?'(已禁用)':'')+item.name }}
						</view>
						<view class="leader g-single-row">调度者：{{ item.teamLeaderName }}</view>
					</view>
					<uni-load-more v-if="dataList && dataList.length > 0" :status="status" :icon-size="16" :content-text="contentText" />
				</scroll-view>
			</view>
			<view class="list-box" v-if="!loading && dataList.length === 0">
				<!-- 无数据 -->
				<NonePage></NonePage>
			</view>
			<view class="button" @click="submit">确认</view>
		</view>
	</u-popup>
</template>

<script>
	import { mapState } from 'vuex';
	import { listInfo } from '@/config/service/capacity/team.js';
	import NonePage from '@/components/NonePage/NonePage.vue';
	export default {
		name: 'TeamList',
		components: {
			NonePage
		},
		props: {
			show: {
				type: Boolean,
				default: false
			},
			teamCodes: {
				type: Array,
				default: () => {
					return [];
				}
			},
			isFilter: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			})
		},
		data() {
			return {
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					userName: undefined
				},
				dataList: [],
				loading: false,
				checkMap: {},
				scrollTop: 0,
				// 是否无数据了
				isEnd: false,
				status: 'more',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了'
				},
				contentHeight: '860upx',
				defaultPhoneHeight:'', //屏幕默认高度
				nowPhoneHeight:'', //屏幕现在的高度
				system:'ios'
			}
		},
		watch: {
			show: {
				handler(val) {
					if (val) {
						this.reset();
						this.setForm();
						this.handleQuery();
						this.nowPhoneHeight = window.innerHeight
						window.onresize = ()=>{
							this.nowPhoneHeight = window.innerHeight
						}
					} else {
						window.onresize = null;
					}
				},
				immediate: true
			},
			nowPhoneHeight(){
				if(this.defaultPhoneHeight != this.nowPhoneHeight){
					//手机键盘被唤起了。
					if (this.system === 'android') {
						this.contentHeight = '500upx'
					}
				}else{
					//手机键盘被关闭了。
					this.contentHeight = '860upx'
				}
			}
		},
		mounted() {
			//监听软键盘获取当前屏幕高度的事件
			this.defaultPhoneHeight = window.innerHeight;
			const res = uni.getSystemInfoSync();
			this.system = res.platform;
		},
		methods: {
			close() {
				this.$emit('close');
			},
			reset() {
				this.queryParams.userName = undefined;
				this.isEnd = false;
				this.status = 'more';
			},
			setForm() {
				// 回填选中的调度者
				this.checkMap = {};
				if (this.teamCodes && this.teamCodes.length > 0) {
					this.teamCodes.forEach(el => {
						this.checkMap[el] = true;
					})
				}
			},
			submit() {
				const teamCodes = [];
				for (let key in this.checkMap) {
					teamCodes.push(key);
				}
				this.$emit('changeTeamCodes', teamCodes);
				this.close();
			},
			// 触底
			scrolltolower(e) {
				if(!this.isEnd) {
					this.status = 'more';
					this.queryParams.pageNum++;
					this.getList();
				}
			},
			async getList() {
				this.status = 'loading';
				const data = await listInfo(this.queryParams, this.headerInfo);
				this.loading = false;
				if (data.list.length === 0) {
					this.isEnd = true;
					this.status = 'noMore';
					return;
				}
				if(data.list.length < this.queryParams.pageSize){
					this.status = 'noMore';
				}
				this.dataList = [...this.dataList, ...data.list];
			},
			/** 搜索按钮操作 */
			handleQuery() {
				this.queryParams.pageNum = 1;
				this.dataList = [];
				this.loading = true;
				this.getList();
			},
			/** input搜索 */
			handleConfirm() {
				this.handleQuery();
				this.hideKeyboard();
			},
			/** 收起键盘 */
			hideKeyboard() {
				uni.hideKeyboard();
			},
			/** input清空 */
			handleInput() {
				if (this.queryParams.userName === '') {
					this.handleQuery();
				}
			},
			/** 选中 */
			handleCheck(item) {
				if (!!this.checkMap[item.code]) {
					delete this.checkMap[item.code];
				} else {
					if (this.isFilter && item.isTeamFreeze == 1) return;
					this.checkMap[item.code] = true;
				}
				this.$forceUpdate();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup-box{
		height: 860upx;
		padding: 30upx 0 44upx;
		overflow: hidden;
		>.title{
			line-height: 36upx;
			font-size: 32upx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #333333;
			text-align: center;
			margin-bottom: 28upx;
		}
		>.search{
			margin: 0 36upx;
			.uni-easyinput{
				background: #F3F3F3;
				border-radius: 10upx;
			}
			.uni-input-placeholder{
				color: #878787;
			}
		}
		>.list-box{
			height: 540upx;
			overflow-y: hidden;
			>.scroll-Y{
				height: 100%;
			}
			.list-box-item{
				height: 106upx;
				line-height: 106upx;
				border-bottom: 1upx solid #EBEBEB;
				margin: 0 50upx;
				font-size: 32upx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #333333;
				>.name{
					width: 60%;
				}
				>.leader{
					width: 40%;
					font-size: 28upx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #999999;
					text-align: right;
				}
				.icon-check{
					width: 50upx;
					height: 60upx;
					vertical-align: middle;
					margin: -6upx 14upx 0 0;
					padding: 10upx 10upx 10upx 0;
				}
			}
		}
		>.button{
			height: 80upx;
			line-height: 80upx;
			background: #3A65FF;
			border-radius: 10upx;
			font-size: 32upx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #FFFFFF;
			text-align: center;
			margin-top: 24upx;
			margin: 24upx 36upx 0;
		}
	}
</style>
