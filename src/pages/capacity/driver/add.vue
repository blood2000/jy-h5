<template>
	<view class="u-page">
		<u-navbar
			title="新增司机"
			@leftClick="navigateBack"
			safeAreaInsetTop
			fixed
			placeholder
		></u-navbar>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { getInfo, addInfo, updateInfo } from '@/config/service/capacity/driver.js';
	export default {
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			})
		},
		data() {
			return {
				
			}
		},
		onLoad(options){
			this.$store.dispatch('getLoginInfoAction', {
				'Authorization': options.token
			});
		},
		methods: {
			navigateBack() {
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
