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
			<view class="historyListView">
				<view v-for="(item,index) in appointmentInfo.history" :key="index">
					<view class="historyListView_row">
						<image class="historyListView_row_ring" :src="item.isFinished?greenRing:redRing"
							mode="aspectFill">
						</image>
						<view
							:class="item.isFinished?'historyListView_row_statusLabel_finished':'historyListView_row_statusLabel_noFinished'">
							{{item.isFinished?'已完成':'未完成'}}
						</view>
						<view class="historyListView_row_columnView">
							<view class="historyListView_row_licenseLabel">{{item.licenseNumber}}</view>
							<view class="historyListView_row_dateLabel">{{item.dateStr}}</view>
							<view class="historyListView_row_line"></view>
						</view>
					</view>
				</view>
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
				redRing: '/static/appointment/appointment_redRing.png',
				greenRing: '/static/appointment/appointment_greenRing.png',
				appointmentInfo: {
					companyName: '山西汇通上报有限公司',
					stationName: '五福洗煤场/32号堆',
					goodsType: '原煤',
					dateStr: '2021-12-29～2021-12-29',
					canAppointmentCount: '10086',
					haveShipCount: '99',
					history: [{
							isFinished: false,
							licenseNumber: '闽A12345',
							dateStr: '2021/12/13  12:26:12'
						},
						{
							isFinished: true,
							licenseNumber: '闽A12345',
							dateStr: '2021/12/05  12:26:12'
						},
						{
							isFinished: true,
							licenseNumber: '闽A12345',
							dateStr: '2021/12/03  12:26:12'
						}
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

	.historyListView {
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		justify-content: space-between;
		margin-left: 44upx;
		margin-right: 44upx;
		margin-top: 34upx;
		position: relative;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 18px;
			height: 100%;
			width: 4px;
			background: #d7e4ed;
		}
	}

	.historyListView_row {
		display: flex;
		align-items: flex-start;
		flex-direction: row;
		justify-content: center;
		margin-left: 44upx;
	}

	.historyListView_row_statusLabel_noFinished {
		font-size: 28upx;
		color: #EE3D54;
		padding-left: 13upx;
		flex-shrink: 0;
	}

	.historyListView_row_ring {
		width: 16upx;
		height: 16upx;
		flex-shrink: 0;
		margin-top: 12upx;
	}

	.historyListView_row_statusLabel_finished {
		font-size: 28upx;
		color: #24B494;
		padding-left: 13upx;
		flex-shrink: 0;
	}

	.historyListView_row_columnView {
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		justify-content: space-between;
		margin-left: 40upx;
		margin-right: 44upx;
	}

	.historyListView_row_licenseLabel {
		font-size: 32upx;
		font-weight: bold;
		color: #333333;
		font-family: PingFang SC;
	}

	.historyListView_row_dateLabel {
		font-size: 28upx;
		color: #999999;
		font-family: PingFang SC;
		padding-top: 28upx;
	}

	.historyListView_row_line {
		font-size: 28upx;
		color: #999999;
		margin-top: 34upx;
		padding-bottom: 33upx;
		width: calc(100vw - 238upx);
		height: 1upx;
		border-top: solid #EBEBEB 1upx;
	}
</style>
