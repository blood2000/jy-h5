<template>
	<view class="home-page">
		<view class="header-container">
			<view class="headerView">
				<image class="top-avatar shadow-warp bg-white" :src="userInfo.avatar?userInfo.avatar:avatar"
					mode="aspectFill"></image>
				<view class="margin-mleft">
					<view class="flex align-center">
						<view class="size32 text-bold">{{userInfo.userName}}</view>
					</view>
					<view class="text-tag size20 margin-stop">{{userInfo.licenseNumber?userInfo.licenseNumber:'暂无'}}
					</view>
				</view>
			</view>
			<view class="scanView" @click="onClickScanAction()">
				<image class="top-scaner shadow-warp bg-white" src="/static/icon_station.png" mode="aspectFit"></image>
				<view class="text-tag size20 margin-stop">
					扫码预约
				</view>
			</view>
		</view>
		<view class="info-container">

		</view>
		<view class="list-container">
			<view class="switchHead">
				<view v-for="(item,index) in tabTitleData" class="boxList" :class="{activeCss:activeIndex==index}"
					:key="index">
					<text @click="clickTab(index)">{{item.name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import {
		getInfo
	} from "@/config/service/workbench.js"
	export default {
		name: 'appointment',
		components: {},
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			})
		},
		data() {
			return {
				userInfo: {
					avatar: '',
					userName: '张三',
					licenseNumber: '闽A54332'
				},
				avatar: '/static/avatar.png', // 默认头像
				activeIndex: '0',
				tabTitleData: [{
						name: '可预约'
					},
					{
						name: '已失效'
					}
				],
				canAppointList: [{
						nameStr: '山西五福洗煤厂 / 1 号堆'
					},
					{
						nameStr: '山西五福洗煤厂 / 2 号堆'
					},
					{
						nameStr: '山西五福洗煤厂 / 3 号堆'
					},
				],
				invalidAppointList: [{
						nameStr: '山西五福洗煤厂 / 4 号堆'
					},
					{
						nameStr: '山西五福洗煤厂 / 5 号堆'
					},
				],
			}
		},
		onLoad(option) {
			this.getInfo();
		},
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
				//this.getList();
			},
			onClickScanAction() {
				console.log("点击了扫码");
			},
			clickTab(index) {
				this.activeIndex = index;
			}
		}
	}
</script>

<style>
	.home-page {
		width: 100vw;
		height: 100vh;
		padding: 0 0 30upx;
		font-family: 'PingFang Regular';
		overflow: scroll;
	}

	.header-container {
		margin-left: 20upx;
		margin-right: 20upx;
		margin-top: 20upx;
		height: 140upx;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
	}

	.headerView {
		background: #FFFFFF;
		height: 140upx;
		border-radius: 10upx;
		width: calc(100% - 160upx);
		display: flex;
		align-items: center;
	}

	.scanView {
		background: #FFFFFF;
		width: 140upx;
		height: 140upx;
		border-radius: 10upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.top-avatar {
		height: 88upx;
		width: 88upx;
		border-radius: 50%;
		margin-left: 20upx;
	}

	.top-scaner {
		height: 68upx;
		width: 68upx;
	}

	.info-container {
		background: #FFFFFF;
		margin-left: 20upx;
		margin-right: 20upx;
		margin-top: 20upx;
		height: 200upx;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
	}

	.switchHead {
		height: 35px;
		display: flex;
		justify-content: space-around;
		align-items: center;
		color: #FFFFFF;
		background-color: #13D1BE;
	}

	.boxList {
		height: 100%;
	}

	.activeCss {
		border-bottom: 2px solid yellow;
		color: yellow;
	}
</style>
