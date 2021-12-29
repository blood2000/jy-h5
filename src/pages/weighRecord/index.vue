<template>
	<view class="content-page" :style="{'--statusBar12': (statusBar12) + 'px' }">
		<HeaderBar title="货源管理" @back="navigateBack">
			<text style="color:#3A65FF" slot="right" @click="handleAdd">新增</text>
		</HeaderBar>
	  <!-- main -->
	  <view class="main-box"></view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { listUsually, listNews, userNotice, applicateList, getInfo }from "@/config/service/workbench.js"
	import uniData from '@/utils/uni.webview.1.5.2.js'
	import Tabbar from '@/components/Tabbar/Tabbar.vue';
	import HeaderBar from '@/components/Building/HeaderBar2.vue';
	
	export default {
		components: {
			Tabbar,
			HeaderBar
		},
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			})
		},
		data() {
			return {
				
			}
		},
		onLoad(option) {
			this.$store.dispatch('getLoginInfoAction', {
				'Authorization': option.token
			});
			this.headerInfo["App-Code"] = 'f3209f6c7353414e8dbb94dd23cf8b91'
		},
		onPullDownRefresh() {
			
		},
		methods: {
			
		}
	}
</script>

<style>
</style>
