<template>
	<view class="content-page" :style="{'--statusBar12': (statusBar12) + 'px' }">
		<WhiteHeader :showBack="true" :showLine="true">
			<text slot="title">凭证信息</text>
		</WhiteHeader>
		<view class="home-page">
			<view class="companyView">
				<image class="companyView_icon" src="/static/appointment/appointment_company.png" mode="aspectFill">
				</image>
				<text class="companyView_label">{{appointmentInfo.companyName}}</text>
			</view>
			<view class="stationView">
				<image class="companyView_icon" src="/static/appointment/appointment_station.png" mode="aspectFill">
				</image>
				<view class="stationView_list">
					<text class="stationView_nameLabel">{{appointmentInfo.stationName}}</text>
					<text class="stationView_label">货品类型：{{appointmentInfo.goodsType}}</text>
					<text class="stationView_label">预约时段：{{appointmentInfo.dateStr}}</text>
					<text class="stationView_label">可预约数：{{appointmentInfo.canAppointmentCount}}</text>
					<view class="stationView_viewMoreView">
						<text class="stationView_label">已承运数：{{appointmentInfo.haveShipCount}}</text>
					</view>
				</view>
			</view>
			<view class="historyView">
				<image class="companyView_icon" src="/static/appointment/appointment_ship.png" mode="aspectFill">
				</image>
				<text class="stationView_nameLabel">承运记录</text>
			</view>
		</view>
	</view>
</template>

<script>
	import WhiteHeader from '@/components/Header/WhiteHeader.vue';

	export default {
		components: {
			WhiteHeader,
		},
		data() {
			return {
				statusBar12: 0,
				appointmentInfo: {
					companyName: '山西汇通上报有限公司',
					stationName: '五福洗煤场/32号堆',
					goodsType: '原煤',
					dateStr: '2021-12-29～2021-12-29',
					canAppointmentCount: '10086',
					haveShipCount: '99',
					canAppointmentTime: [{
							timeStr: '9:00',
							isAvailable: false,
							isSelected: false
						},
						{
							timeStr: '10:00',
							isAvailable: true,
							isSelected: true
						},
						{
							timeStr: '11:00',
							isAvailable: true,
							isSelected: false
						},
						{
							timeStr: '12:00',
							isAvailable: true,
							isSelected: false
						}, {
							timeStr: '9:00',
							isAvailable: false,
							isSelected: false
						},
						{
							timeStr: '10:00',
							isAvailable: true,
							isSelected: false
						},
						{
							timeStr: '11:00',
							isAvailable: true,
							isSelected: false
						},
						{
							timeStr: '12:00',
							isAvailable: true,
							isSelected: false
						}, {
							timeStr: '9:00',
							isAvailable: false,
							isSelected: false
						},
						{
							timeStr: '10:00',
							isAvailable: true,
							isSelected: false
						},
						{
							timeStr: '11:00',
							isAvailable: true,
							isSelected: false
						},
						{
							timeStr: '12:00',
							isAvailable: true,
							isSelected: false
						},
					],
				}
			}
		}
	}
</script>

<style>
	.content-page {
		background: #FFFFFF;
		background-size: 100% 100%;
		width: 100%;
		height: 100%;
		position: fixed;
	}
	
	.home-page {
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		justify-content: space-between;
	}
	
	.companyView {
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
		margin-left: 24upx;
		margin-right: 24upx;
		margin-top: 45upx;
	}
	
	.companyView_icon {
		width: 58upx;
		height: 58upx;
		flex-shrink: 0;
	}
	
	.companyView_label {
		font-size: 32upx;
		font-weight: bold;
		color: #333333;
		padding-left: 13upx;
	}
	
	.stationView {
		display: flex;
		align-items: flex-start;
		flex-direction: row;
		justify-content: space-between;
		margin-left: 24upx;
		margin-right: 24upx;
		margin-top: 51upx;
	}
	
	.stationView_list {
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		justify-content: space-between;
	}
	
	.stationView_nameLabel {
		font-size: 32upx;
		font-weight: bold;
		color: #333333;
		padding-left: 13upx;
		padding-top: 8upx;
	}
	
	.stationView_label {
		font-size: 28upx;
		color: #333333;
		padding-left: 13upx;
		padding-top: 23upx;
	}
	
	.stationView_viewMoreView {
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: center;
	}
	
	.historyView {
		display: flex;
		align-items: flex-start;
		flex-direction: row;
		justify-content: space-between;
		margin-left: 24upx;
		margin-right: 24upx;
		margin-top: 54upx;
	}
</style>
