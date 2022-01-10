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
				<view class="flex align-center">
					<view class="scanView_label">扫码预约</view>
					<view class="scanView_arrow_right"></view>
				</view>
				<image class="scanView_icon" src="/static/appointment/appointment_scan.png" mode="aspectFit"></image>
			</view>
		</view>
		<view class="info-container">
			<view v-if="appointmentInfo.station">
				<view class="info_station">
					<image class="info_icon_station" src="/static/appointment/appointment_station.png" mode="aspectFit">
					</image>
					<view class="info_station_content">
						<view class="info_station_content_valueView">
							<view class="info_station_content_value">{{appointmentInfo.station}}</view>
							<view class="info_station_content_navigation">导航</view>
						</view>
						<view class="info_station_content_name">预约场站</view>
					</view>
				</view>
				<view class="info_company">
					<image class="info_icon_company" src="/static/appointment/appointment_company.png" mode="aspectFit">
					</image>
					<view class="info_station_content">
						<view class="info_station_content_value">{{appointmentInfo.companyName}}</view>
						<view class="info_station_content_name">货主名称</view>
					</view>
				</view>
				<view class="info_date">
					<image class="info_icon_time" src="/static/appointment/appointment_time.png" mode="aspectFit">
					</image>
					<view class="info_station_content">
						<view class="info_station_content_value">{{appointmentInfo.date}}</view>
						<view class="info_station_content_name">预约时间</view>
					</view>
				</view>
				<view class="info_bottom">
					<view class="info_station_bottom_carTime">还有32辆车未入场，预计60分钟</view>
					<image class="info_station_bottom_qr" src="/static/appointment/appointment_qr.png" mode="aspectFit">
					</image>
				</view>
			</view>
			<view v-else class="info_noContentView">
				<image class="noContent_icon" src="/static/appointment/appointment_noContent.png" mode="aspectFill">
				</image>
				<text class="noContent_label">暂无预约信息哦</text>
			</view>
		</view>
		<view class="list-container">
			<view class="switchHead">
				<view v-for="(item,index) in tabTitleData" class="boxList" :class="{activeCss:activeIndex==index}"
					:key="index">
					<text @click="clickTab(index)">{{item.name}}</text>
					<view v-if="activeIndex==index" class="switchLine"></view>
				</view>
			</view>
			<view class="canAppointView" v-for="(sub, index) in activeIndex==0?canAppointList:invalidAppointList"
				v-bind:key="index">
				<view class="canAppointViewLeft">
					<text class="canAppointViewLeftLabel">预约场站：{{sub.nameStr}}</text>
					<text class="canAppointViewLeftLabel">预约场站2：{{sub.nameStr}}</text>
					<text class="canAppointViewLeftLabel">预约场站3：{{sub.nameStr}}</text>
					<text class="canAppointViewLeftLabel">预约场站4：{{sub.nameStr}}</text>
				</view>
				<view :class="activeIndex==0?'canAppointViewRight':'canAppointViewRight2'">
					<text v-if="activeIndex==0" class="canAppointViewRightLabel">预约</text>
					<text v-else class="canAppointViewRightLabel">详情</text>
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
				appointmentInfo: {
					station: '五福洗煤厂/32号堆 五福洗煤厂/32号堆 五福洗煤厂/32号堆',
					companyName: '山西华汇通商贸无限公司',
					date: '2021/01/05',
					time: '08:00',
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
					}, {
						nameStr: '山西五福洗煤厂 / 1 号堆'
					},
					{
						nameStr: '山西五福洗煤厂 / 2 号堆'
					},
					{
						nameStr: '山西五福洗煤厂 / 3 号堆'
					}, {
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

	.top-avatar {
		height: 120upx;
		width: 120upx;
		border-radius: 50%;
		margin-left: 22upx;
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
	}

	.scanView_label {
		font-size: 28upx;
		font-weight: bold;
		color: #333333;
		padding-left: 16upx;
		padding-top: 10upx;
	}

	.scanView_arrow_right {
		width: 0;
		height: 0;
		border-left: 8.3upx solid transparent;
		border-right: 8.3upx solid transparent;
		border-bottom: 8.3upx solid #000000;
		font-size: 0;
		line-height: 0;
		transform: rotate(90deg);
		margin-top: 10upx;
	}

	.scanView_icon {
		height: 141upx;
		width: 100%;
		margin-top: 0upx;
		padding-left: 80upx;
	}

	.info-container {
		background: #FFFFFF;
		margin-left: 24upx;
		margin-right: 24upx;
		margin-top: 40upx;
		margin-bottom: 40upx;
/* 		height: 400upx; */
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		justify-content: space-between;
		border-radius: 16upx;
	}

	.info_station {
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: flex-start;
		margin-left: 32upx;
		margin-top: 32upx;
	}

	.info_company {
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: flex-start;
		margin-left: 32upx;
		margin-top: 32upx;
	}

	.info_date {
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: flex-start;
		margin-left: 32upx;
		margin-top: 32upx;
	}

	.info_icon_station {
		width: 58upx;
		height: 58upx;
	}

	.info_station_content_value {
		font-size: 32upx;
		font-weight: bold;
		color: #333333;
	}

	.info_station_content_name {
		font-size: 24upx;
		color: #999999;
	}

	.info_station_content_navigation {
		font-size: 24upx;
		color: #2366F2;
		border: solid #2366F2 1upx;
		padding-left: 9upx;
		padding-right: 9upx;
		border-radius: 4upx;
		margin-left: 14upx;
	}

	.info_station_content {
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		justify-content: space-between;
		margin-left: 12upx;
	}

	.info_station_content_valueView {
		display: flex;
		align-items: flex-start;
		flex-direction: row;
		justify-content: space-between;
	}

	.info_icon_company {
		width: 58upx;
		height: 58upx;
	}

	.info_icon_time {
		width: 58upx;
		height: 58upx;
	}

	.info_noContentView {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: space-between;
		padding-top: 60upx;
	}

	.info_bottom {
		width: 100%;
		height: 80upx;
		margin-top: 38upx;
		background-color: #2366F2;
		border-radius: 0upx 0upx 16upx 16upx;
		display: flex;
		align-items: flex-start;
		flex-direction: row;
		justify-content: space-between;
	}
	
	.info_station_bottom_carTime {
		padding-left: 20upx;
		padding-top: 17upx;
		padding-right: 70upx;
		color: #FFFFFF;
	}
	
	.info_station_bottom_qr {
		width: 54upx;
		height: 54upx;
		margin-top: 14upx;
		margin-right: 23upx;
	}
	
	.noContent_icon {
		width: 362upx;
		height: 203upx;
	}

	.noContent_label {
		font-size: 32upx;
		color: #121212;
		padding-top: 70upx;
		opacity: 0.5;
	}

	.switchHead {
		height: 35px;
		display: flex;
		justify-content: flex-start;
		align-items: baseline;
		color: #333333;
		margin-left: 50upx;
	}

	.boxList {
		height: 100%;
		margin-right: 68upx;
		font-size: 30upx;
	}

	.switchLine {
		width: 58upx;
		height: 6upx;
		margin-left: 14upx;
		border-top: solid #2366F2 6upx;
	}

	.activeCss {
		font-size: 32upx;
		font-weight: bold;
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
		background-color: #FFFFFF;
		width: 100%;
		height: 200upx;
		display: flex;
		flex-direction: column;
		border-radius: 15upx 0upx 0upx 15upx;
	}

	.canAppointViewLeftLabel {
		font-size: 28upx;
		color: #333333;
		padding-left: 15upx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
	}

	.canAppointViewRight {
		background-color: #2366F2;
		height: 200upx;
		width: 138upx;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
		border-radius: 0upx 15upx 15upx 0upx;
		float: right;
	}

	.canAppointViewRight2 {
		background-color: #24B2B4;
		height: 200upx;
		width: 138upx;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
		border-radius: 0upx 15upx 15upx 0upx;
		float: right;
	}

	.canAppointViewRightLabel {
		font-size: 32upx;
		font-weight: bold;
		color: #FFFFFF;
		padding-left: 30upx;
	}
</style>
