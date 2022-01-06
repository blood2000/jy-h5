<template>
	<view class="home-page">
		<view class="header-container">
			<view class="headerView">
				<image class="top-avatar shadow-warp bg-white" :src="userInfo.avatar?userInfo.avatar:avatar"
					mode="aspectFill"></image>
				<view class="margin-mleft">
					<view class="flex align-center">
						<view class="size36 text-bold text-white">{{userInfo.userName}}</view>
					</view>
					<view class="licenseNumberBgView">
						<text class="licenseNumberLabel">{{userInfo.licenseNumber?userInfo.licenseNumber:'暂无'}}</text>
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
			<view class="canAppointView" v-for="(sub, index) in canAppointList" v-bind:key="index">
				<view class="canAppointViewLeft">
					<image class="history-icon bg-white" :src="avatar" mode="aspectFill"></image>
				</view>
				<view class="canAppointViewCenter">
					<text class="canAppointViewCenterLabel">预约场站：{{sub.nameStr}}</text>
					<text class="canAppointViewCenterLabel">预约场站2：{{sub.nameStr}}</text>
					<text class="canAppointViewCenterLabel">预约场站3：{{sub.nameStr}}</text>
					<text class="canAppointViewCenterLabel">预约场站4：{{sub.nameStr}}</text>
				</view>
				<view class="canAppointViewRight">
					<text class="canAppointViewRightLabel">预约</text>
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
					licenseNumber: '闽A*888SW'
				},
				avatar: '/static/appointment/appointment_avatar.png', // 默认头像
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
		height: 206upx;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
	}

	.headerView {
		background-image: linear-gradient(#283565, #4B528F);
		height: 183upx;
		border-radius: 20upx 0upx 0upx 20upx;
		width: calc(100% - 256upx);
		display: flex;
		align-items: center;
	}

	.licenseNumberBgView {
		background-image: linear-gradient(#FFF4DB, #FFDB8F);
		height: 47upx;
		border-radius: 22.5upx;
		width: 175upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 15upx;
	}

	.licenseNumberLabel {
		font-size: 24upx;
		font-weight: bold;
		color: #734100;
		padding-top: 7upx;
	}

	.scanView {
		background: #FFFFFF;
		width: 256upx;
		height: 206upx;
		border-radius: 20upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.top-avatar {
		height: 120upx;
		width: 120upx;
		border-radius: 50%;
		margin-left: 22upx;
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

	.canAppointView {
		background-color: #FFFFFF;
		border-radius: 15upx;
		margin-left: 20upx;
		margin-right: 20upx;
		margin-top: 15upx;
		height: 200upx;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
	}

	.canAppointViewLeft {
		background-color: #13D1BE;
		height: 200upx;
		width: 50upx;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
		border-radius: 15upx 0upx 0upx 15upx;
		float: left;
	}

	.history-icon {
		height: 30upx;
		width: 30upx;
		border-radius: 50%;
		margin-left: 10upx;
	}

	.canAppointViewRight {
		background-color: #13D1BE;
		height: 200upx;
		width: 80upx;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
		border-radius: 0upx 15upx 15upx 0upx;
		float: right;
	}

	.canAppointViewRightLabel {
		font-size: 20upx;
		color: #FFFFFF;
		padding-left: 20upx;
	}

	.canAppointViewCenter {
		background-color: #FFFFFF;
		width: 100%;
		height: 200upx;
		display: flex;
		flex-direction: column;
	}

	.canAppointViewCenterLabel {
		font-size: 20upx;
		color: #000000;
		padding-left: 15upx;
	}
</style>
