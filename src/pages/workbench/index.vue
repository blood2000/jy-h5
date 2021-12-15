<template>
	<view class="home-page">
		<view class="search-container">
			<view :style="{height:statusBarHeight*2+'upx'}"></view>
			<view class="flex justify-between margin-mtop">
				<view class="flex align-center">
					<image class="top-avatar shadow-warp bg-white" :src="userInfo.avatar?userInfo.avatar:avatar" mode="aspectFill"></image>
					<view class="margin-mleft">
						<view class="flex align-center">
							<view class="size32 text-bold">Hi,{{userInfo.userName}}</view>
						</view>
						<view class="text-tag size20 margin-stop">{{userInfo.org?userInfo.org.orgName:'暂无'}}</view>
					</view>
				</view>
				<!-- <view class="size52 cuIcon-add text-bold" @click="moreFunction = !moreFunction"></view> -->
			</view>
			<view class="cu-bar search">
				<view class="search-form" @click="navToSearch">
					<text class="cuIcon-search"></text>
					<input :adjust-position="false" type="text" placeholder="请输入关键字搜索" disabled confirm-type="search" />
				</view>
			</view>
		</view>
		<view class="" style="overflow-y: auto;" @touchmove.stop>
			<view class="bg-white" style="padding: 0 0 24upx;">
				<view :style="{height:statusBarHeight*2 + 212 +'upx'}"></view>
				<!-- 官网新闻 -->
				<swiper class="screen-swiper square-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="500">
					<swiper-item v-for="(item,index) in newsList" :key="index" @click="navToWebsite">
						<image style="border-radius: 16upx;" :src="item.newsPrefaceImg" mode="aspectFill"></image>
						<view class="news-title">
							<view class="news-tag text-white">{{item.newsPreface}}</view>
						</view>
					</swiper-item>
				</swiper>
				<!-- 应用 -->
				<view class="flex align-center flex-wrap" style="margin: 0 10upx;">
					<view v-for="(item, index) in usuallyList" :key="index" class="app-frame" @click="navToApplicate(item)">
						<image class="app-icon" :src="'/static/icons/svg/' + item.icon + '.svg'" mode=""></image>
						<view class="app-name">{{item.menuName}}</view>
					</view>
					<view class="app-frame flex flex-direction align-center justify-center" @tap="showModal" data-target="DrawerModalR">
						<image class="app-icon" src="/static/workbench/icon_add.png" mode=""></image>
						<view class="app-name">添加</view>
					</view>
				</view>
			</view>
			<!-- 通知 -->
			<view class="app-container margin-mtop padding-m flex align-center justify-between" @click="navToNotice">
				<image class="notice-img" src="/static/workbench/icon_notice.png" mode=""></image>
				<view style="width: calc(100vw - 220upx);padding-left: 20upx;border-left: 1upx solid #EEEEEE;">
					 <!-- v-for="(item,index) in noticeList" :key="index" -->
					<view class="flex align-center justify-between size26">
						<view class="todo-title">暂无消息</view>
						<!-- new Date(item.createTime) -->
						<!-- <l-time class="margin-mleft" color="#999" computeMax="MM" :dateFormat="'MM/dd hh:mm'" :text="new Date() "></l-time> -->
					</view>
					<!-- <view class="flex align-center justify-between size26">
						<view class="todo-title">运输计划名称</view>
						<l-time class="margin-mleft" color="#999" computeMax="MM" :dateFormat="'MM/dd hh:mm'" :text="new Date() "></l-time>
					</view> -->
				</view>
			</view>
			<!-- 待办 -->
			<view class="app-container padding-m margin-mtop">
				<view class="flex align-center justify-between">
					 <!-- <text class="text-red">{{todoTotal}}</text> -->
					<view class="todo-title">今日事项</view>
					<!-- <view class="text-gray" @click="navToUpcoming">更多<text class="cuIcon-right"></text></view> -->
				</view>
				<view class="flex align-center justify-center" style="height: 500upx;">
					<image class="todo-img" src="/static/workbench/icon_expect.png" mode=""></image>
				</view>
			</view>
		</view>
		
		<!-- 底部操作栏 -->
		<Tabbar :cur="'work'" :height="true" />
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { listUsually, listNews, userNotice, applicateList, getInfo }from "@/config/service/workbench.js"
	import uniData from '@/utils/uni.webview.1.5.2.js'
	import Tabbar from '@/components/Tabbar/Tabbar.vue';

	// 待办事项
	// import { todoList } from "@/config/service/flowable/process";
	export default {
		components: {
			Tabbar
		},
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			})
		},
		data() {
			return {
				userInfo: {
					avatar: ''
				},
				// 默认头像
				avatar: '/static/avatar.png',
				CustomBar: this.CustomBar, // 顶部距离
				modalName: '',
				moreFunction: false, // 是否显示更多功能，扫一扫，我的名片
				newsList: [], // 新闻列表
				noticeList: [], // 通知列表
				text: '这是 NoticeBar 通告栏，这是 NoticeBar 通告栏，这是 NoticeBar 通告栏，这是 NoticeBar 通告栏',
				system: undefined,
				statusBarHeight: 0, // 状态栏高度
				titleHeight: 0, // 标题栏高度
				naviBarHeight: 0, // 导航栏高度
				usuallyList: [], // 常用应用列表
				applicateList: [], // 全部应用列表
				// 位置信息
				location: {},
				rankOptions: [], // 职级字典
				// 待办事项
				todoDataList: [],
				todoTotal: 0,
				query: {
					dataModelId: 36,
					paramsList: [
						{
							name: "user_code",
							value: uni.getStorageSync('userInfo').userCode
						},{
							endTime: "",
							name: "date_time",
							startTime: ""
						},{
							name: "leave_status",
							value: 7
						}
					]
				}
			}
		},
		onLoad(option) {
			// uni.setStorageSync('token', option.token)
			this.$store.dispatch('getLoginInfoAction', {
				'Authorization': option.token
			});
			this.headerInfo["App-Code"] = 'f3209f6c7353414e8dbb94dd23cf8b91'
			const res = uni.getSystemInfoSync()
			this.system = res.platform;
			this.statusBarHeight = option.statusBarHeight
			if (this.system === 'android') {
				this.titleHeight = (48 + this.statusBarHeight)
			} else if (this.system === 'ios') {
				this.titleHeight = (44 + this.statusBarHeight)
			}
			this.naviBarHeight = this.titleHeight - this.statusBarHeight;
			var that = this;
			window.getData = function() {
				that.getInfo();
			}

			if (option.token) {
				that.getInfo();
			}
		},
		// onShow() {
		// 	this.getList();
		// 	this.getData_1();
		// },
		onPullDownRefresh() {
			this.getInfo();
		},
		methods: {
			getInfo() {
				// 获取用户信息
				getInfo(this.headerInfo).then(res => {
					this.userInfo = res.data;
					uni.hideLoading();
					uni.stopPullDownRefresh();
				});
				this.getList();
				// this.getData_1();
			},
			getList() {
				uni.showLoading({mask: true});
				// 获取应用列表
				this.getUsuallyList();
				// this.getAllList();
				listNews({newsStatus: 0, newsType: 1}, this.headerInfo).then(res => {
					this.newsList = res.rows;
					uni.hideLoading();
					uni.stopPullDownRefresh();
				});
				// userNotice({pageNum: 1, pageSize: 2}, this.headerInfo).then(res => {
				// 	this.noticeList = res.data.rows;
				// });
			},
			// 获取常用应用列表
			getUsuallyList() {
				listUsually(this.headerInfo).then(res => {
					this.usuallyList = res.data;
				});
			},
			showModal() {
				// this.modalName = e.currentTarget.dataset.target
				uni.webView.navigateTo({
					url:"/pages/applicate/addUsually/index"
				})
			},
			// hideModal(e) {
			// 	this.modalName = null
			// },
			// 车辆列表触底事件
			scrolltolower(){
				if (this.dataOver) return;
				this.vehicleParams.pageNum++;
				this.getVehicle(1);
			},
			navToSearch(){
				uni.webView.navigateTo({
					url: '/pages/index/search'
				})
			},
			navToApplicate(item) {

				if (item.component) {
					uni.webView.navigateTo({
						url: item.component + '?name='+ item.path
					})
				} else {
					this.msgSuccess('暂未配置该应用路径，请联系管理员')
				}
			},
			navToWebsite() {
				uni.webView.navigateTo({
					url: '/pages/applicate/notificationCenter/website/index'
				})
			},
			navToNotice() {
				uni.webView.navigateTo({
					url: '/pages/applicate/notificationCenter/notice/index'
				})
			},
			navToCard() {
				uni.webView.navigateTo({
					url: '/pages/flowable/index?name=process_dzdj3njw'
				})
			},

			// s=待办事项 查询流程定义列表
			getData_1() {
				const que = {
					pageNum: 1,
					pageSize: 5,
				}

				todoList(que, this.headerInfo).then(response => {
					this.todoDataList = response.data.list
					this.todoTotal = response.data.total
				})
			},

			// 待办跳转
			navToInfoPage(dataItem, tabCur){
				uni.webView.navigateTo({
					url:`/pages/record/index?procInsId=${dataItem.procInsId}&deployId=${dataItem.deployId}&taskId=${dataItem.taskId}&finished=true&name=${dataItem.procDefName}`
				})
			}
			// e=
		}
	}
</script>

<style lang="scss" scoped>
.more-section{
	position: fixed;
	right: 36upx;
	z-index: 20;
	width: 229upx;
	height: 201upx;
	background: #000000;
	opacity: 0.92;
	border-radius: 16upx;
	.more-frame{
		position: relative;
		bottom: 32upx;
		left: 4upx;
		height: 0;
		text-align: right;
		.more-triangle{
			color: #000000;
			opacity: 0.92;
		}
	}
}
.top-avatar{
	height: 88upx;
	width: 88upx;
	border-radius: 50%;
}
.top-tag{
	font-size: 24upx;
	line-height: 30upx;
	margin-left: 20upx;
	padding: 0 20upx 0 0;
}
.tag-1, .tag-2, .tag-3{
	background-color: #FAECE0;
	color: #D28B56;
}
.tag-4, .tag-5, .tag-6{
	background-color: #EEEEEE;
	color: #B0B0B0;
}
.tag-7, .tag-8, .tag-9{
	background-color: #FFF4E4;
	color: #F0B860;
}
.tag-10{
	background-color: #E0EDFF;
	color: #1678FF;
}
.tag-11{
	background-color: #F6F2FF;
	color: #9285D3;
}
.top-favor{
	margin: 0 10upx 0 4upx;
	height: 22upx;
	width: 22upx;
}
.notice{
	max-width: 360upx;
	overflow: hidden; //超出隐藏
	white-space: nowrap; //
	text-overflow: ellipsis;
}
::v-deep .cu-modal{
	z-index: 100;
}
.screen-swiper{
	margin: 0 32upx;
	min-height: 300upx;
}
.news-title{
	position: relative;
	height: 0;
	width: 100%;
	padding: 0 20upx;
	bottom: 80upx;
	left: 0;
	z-index: 999;
	.news-tag{
		background-color: rgba(0, 0, 0, 0.5);
		font-size: 24upx;
		padding: 6upx;
		overflow: hidden; //超出隐藏
		white-space: nowrap; //
		text-overflow: ellipsis;
	}
}
.search-container{
	position: fixed;
	top: 0;
	width: 100vw;
	background: #FFFFFF;
	// background: linear-gradient(180deg, #EFF5FF 0%, #FFFFFF 100%);
	z-index: 10;
	padding: 0 32upx;
	.search-form{
		background-color: #F5F6F8;
		border-radius: 12upx;
		margin: 0;
	}
	.search-btn{
		width: 125upx;
		font-size: 32upx;
		font-weight: bold;
		color: #1678FF;
		line-height: 48upx;
		text-align: center;
		border-left: 1upx solid #D0E4FF;
	}
}
.home-page{
	width: 100vw;
	height: 100%;
	padding: 0 0 30upx;
	font-family: 'PingFang Regular';
	overflow: scroll;
}
::v-deep .uni-noticebar{
	margin-bottom: 0;
}
.app-container{
	.todo-frame{
		padding: 30upx 0;
	}
	.todo-frame + .todo-frame{
		border-top: 1upx solid #EBEBEB;
	}
	.clock-frame{
		margin-top: 20upx;
		background-color: #F5F5F5;
		border-radius: 10upx;
		padding: 20upx;
		.todo-tag{
			margin-left: 10upx;
			padding: 4upx;
			border-radius: 8upx;
			border: 1upx solid #FFA200;
			color: #FFA200;
			font-size: 20upx;
		}
	}
	.clock-time{
		margin-top: 10upx;
		font-size: 24upx;
		color: #999999;
		font-weight: 400;
	}
	.clock-to{
		margin-top: 20upx;
		// padding: 20upx 0 0;
		// border-top: 1upx solid #EBEBEB;
	}
	.notice-img{
		width: 97upx;
		height: 87upx;
	}
}
.app-frame{
	width: 25%;
	margin: 30upx 0 0;
	text-align: center;
	.app-icon{
		height: 80upx;
		width: 80upx;
		margin-bottom: 18upx;
	}
	.app-name{
		font-size: 24upx;
		color: #333333;
		overflow: hidden; //超出隐藏
		white-space: nowrap; //
		text-overflow: ellipsis;
	}
}
.appall-frame{
	text-align: left;
	padding: 24upx;
	margin-bottom: 20upx;
	.appall-icon{
		margin-right: 20upx;
		width: 66upx;
		height: 66upx;
	}
	.appall-add{
		font-size: 24upx;
		color: #FFFFFF;
		background-color: #1678FF;
		margin: 0;
		line-height: 24upx;
		padding: 10upx 20upx;
	}
	.appall-delete{
		font-size: 24upx;
		color: #e54d42;
		border: 1upx solid #e54d42;
		margin: 0;
		line-height: 24upx;
		padding: 10upx 20upx;
	}
}
.todo-icon{
	height: 36upx;
	width: 36upx;
}
.todo-title{
	font-size: 32upx;
	font-weight: bold;
	color: #333333;
}
.todo-cont{
	margin-right: 10upx;
	padding-right: 10upx;
	line-height: 22upx;
	border-right: 1upx solid #999999;
}
.todo-bu{
	border-radius: 22upx;
	text-align: center;
	width: 102upx;
	height: 44upx;
	background: #F5F5F5;
	font-size: 20upx;
	font-weight: bold;
	line-height: 44upx;
	color: #1678FF;
}
.todo-type{
	text-align: center;
	width: 84upx;
	height: 84upx;
	background: #51A3F7;
	border-radius: 50%;
	font-size: 24upx;
	font-weight: 400;
	line-height: 84upx;
	color: #FFFFFF;
}
.todo-img{
	width: 419upx;
	height: 262upx;
}
</style>
