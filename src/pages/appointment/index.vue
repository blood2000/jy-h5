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
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
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
			}
		},
		methods: {
			onClickScanAction() {
				console.log("点击了扫码");
			},
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
</style>
