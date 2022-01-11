<template>
	<view class="content-page" :style="{'--statusBar12': (statusBar12) + 'px' }">
		<HeaderBar title="预约凭证信息" @back="navigateBack" :border="false"></HeaderBar>
	</view>
</template>

<script>
	import HeaderBar from '@/components/Building/HeaderBar2';
	export default {
		components: {
			HeaderBar,
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
					canAppointmentTime:[
						{
							timeStr: '9:00',
							isAvailable: false
						},
						{
							timeStr: '10:00',
							isAvailable: true
						},
						{
							timeStr: '11:00',
							isAvailable: true
						},
						{
							timeStr: '12:00',
							isAvailable: true
						},
					],
				},
			}
		}
	}
</script>

<style>
</style>
