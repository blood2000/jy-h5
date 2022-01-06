<template>
	<view class="home-page">
		<view class="header-container">
			<view class="headerView">
				<image class="top-avatar shadow-warp bg-white" :src="avatar" mode="aspectFill"></image>
			</view>
			<view class="scanView">
				<image class="top-avatar shadow-warp bg-white" :src="avatar" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		  name:'appointment',
		  components: {  },
		data() {
			return {
				avatar: '/static/avatar.png',
			}
		},
		methods: {
			
		}
	}
</script>

<style>
.home-page{
	width: 100vw;
	height: 100vh;
	padding: 0 0 30upx;
	font-family: 'PingFang Regular';
	overflow: scroll;
}
.header-container{
	margin-left: 20upx;
	margin-right: 20upx;
	margin-top: 20upx;
	height: 140upx;
	display: flex;
	align-items: center;
	flex-direction: row;
	justify-content: space-between;
}
.headerView{
	background: #FF0000;
	height: 140upx;
	border-radius: 10upx;
	width: calc(100% - 160upx);
}
.scanView{
	background: #00FF00;
	width: 140upx;
	height: 140upx;
	border-radius: 10upx;
}
.top-avatar{
	height: 88upx;
	width: 88upx;
	border-radius: 50%;
}
</style>
