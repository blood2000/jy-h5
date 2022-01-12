<template>
	<view class="content-page" :style="{'--statusBar12': (statusBar12) + 'px' }">
		<WhiteHeader :showBack="true" :showLine="true">
			<text slot="title">预约凭证信息</text>
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
						<text class="stationView_viewMorelabel">查看出入区信息</text>
					</view>
				</view>
			</view>
			<view class="timeView">
				<image class="companyView_icon" src="/static/appointment/appointment_time.png" mode="aspectFill">
				</image>
				<text class="stationView_nameLabel">场站现可预约时段</text>
			</view>
			<view class="timeGridView">
				<view v-for="(item,index) in appointmentInfo.canAppointmentTime" :key="index">
					<view :class="item.isAvailable==false?'timeGridView_button_gray': (item.isSelected==false?'timeGridView_button_unselected':'timeGridView_button_selected')">{{item.timeStr}}</view>
				</view>
			</view>
			<view class="form-button ly-flex ly-flex-pack-justify ly-flex-align-center">
				<view class="cancel" @click="handleCancle('form')">取消</view>
				<view class="sure" @click="handleSubmit('form')">确认预约</view>
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
				},
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

	.stationView_viewMorelabel {
		font-size: 24upx;
		color: #2366F2;
		padding-left: 19upx;
		padding-top: 23upx;
	}

	.timeView {
		display: flex;
		align-items: flex-start;
		flex-direction: row;
		justify-content: space-between;
		margin-left: 24upx;
		margin-right: 24upx;
		margin-top: 54upx;
	}

	/*表单按钮css*/
	.form-button {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 24upx 24upx 42upx;
		background: #fff;
	}

	.cancel,
	.sure {
		height: 90upx;
		line-height: 76upx;
		border-radius: 10upx;
		text-align: center;
		font-size: 32upx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #3A65FF;
	}

	.cancel {
		width: 48%;
		background: #FFFFFF;
		border: 1upx solid #3A65FF;
		color: #3A65FF;
	}

	.sure {
		width: 48%;
		background: #3A65FF;
		border: 1upx solid #3A65FF;
		color: #fff;
	}

	.timeGridView {
		margin-top: 12upx;
		margin-left: 88upx;
		margin-right: 88upx;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
	}
	
	.timeGridView_button_gray {
		margin-right: 30upx;
		margin-top: 30upx;
		width: 120upx;
		height: 64upx;
		border-radius: 10upx;
		color: #B3B3B3;
		background-color: #EDF2FA;
		font-size: 32upx;
		border: #000000;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: center;
	}
	
	.timeGridView_button_selected {
		margin-right: 30upx;
		margin-top: 30upx;
		width: 120upx;
		height: 64upx;
		border-radius: 10upx;
		color: #FFFFFF;
		background-color: #2366F2;
		font-size: 32upx;
		border: #000000;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: center;
	}
	
	.timeGridView_button_unselected {
		margin-right: 30upx;
		margin-top: 30upx;
		width: 120upx;
		height: 64upx;
		border-radius: 10upx;
		color: #2366F2;
		background-color: #FFFFFF;
		font-size: 32upx;
		border: 2upx dashed #2366F2;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: center;
	}
	
</style>
