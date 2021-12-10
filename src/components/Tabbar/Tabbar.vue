<template>
	<view>
		<!-- 底部操作栏 :style="{background: skinList.find(res => res.mark === 'tabbg')?'url(' + skinList.find(res => res.mark === 'tabbg').url + ') 0% 0% / 100% 100%':'#FFFFFF' }"-->
		<view class="cu-bar tabbar bg-white bar-frame">
			<!-- 通讯录 -->
			<view v-if="cur === 'mail'" class="action" @click="navToMail">
				<image class="bar-icon" :src="'/static/tabbar/mail_cur.png'" mode=""></image>
				<view class="bar-title bar-ontitle">通讯录</view>
			</view>
			<view v-if="cur !== 'mail'" class="action" @click="navToMail">
				<image class="bar-icon" :src="'/static/tabbar/mail.png'" mode=""></image>
				<view class="bar-title">通讯录</view>
			</view>
			<!-- 应用 -->
			<view v-if="cur === 'app'" class="action" @click="navToApp">
				<image class="bar-icon" :src="'/static/tabbar/app_cur.png'" mode=""></image>
				<view class="bar-title bar-ontitle">应用</view>
			</view>
			<view v-if="cur !== 'app'" class="action" @click="navToApp">
				<image class="bar-icon" :src="'/static/tabbar/app.png'" mode=""></image>
				<view class="bar-title">应用</view>
			</view>
			<!-- 工作台 -->
			<view class="text-center bar-workframe" @click="navToWork">
				<image class="bar-work" :src="'/static/tabbar/work.png'" mode=""></image>
			</view>
			<!-- 待办 -->
			<view v-if="cur === 'todo'" class="action" @click="navToUpcoming">
				<image class="bar-icon" :src="'/static/tabbar/upcoming_cur.png'" mode=""></image>
				<view class="bar-title bar-ontitle">待办</view>
			</view>
			<view v-if="cur !== 'todo'" class="action" @click="navToUpcoming">
				<image class="bar-icon" :src="'/static/tabbar/upcoming.png'" mode=""></image>
				<view class="bar-title">待办</view>
			</view>
			<!-- 我的 -->
			<view v-if="cur === 'my'" class="action" @click="navToUser">
				<image class="bar-icon" :src="'/static/tabbar/my_cur.png'" mode=""></image>
				<view class="bar-title bar-ontitle">我的</view>
			</view>
			<view v-if="cur !== 'my'" class="action" @click="navToUser">
				<image class="bar-icon" :src="'/static/tabbar/my.png'" mode=""></image>
				<view class="bar-title">我的</view>
			</view>
		</view>
		<view v-if="height" style="height: 100upx;"></view>
	</view>
</template>

<script>
	import uniData from '@/utils/uni.webview.1.5.2.js'
	export default {
		props: {
			cur: {
				type: String,
				default: ''
			},
			height: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				skinList: uni.getStorageSync('skin'), // 主题样式
				tabcolor: '',
				ontabcolor: '',
			}
		},
		mounted() {
			// console.log(this.skinList);
			// this.ontabcolor = this.skinList.find(res => res.mark === 'ontabcolor')?this.skinList.find(res => res.mark === 'ontabcolor').url:'#1678FF';
			// this.tabcolor = this.skinList.find(res => res.mark === 'tabcolor')?this.skinList.find(res => res.mark === 'tabcolor').url:'#ACACAC';
		},
		onLoad() {
		},
		methods: {
			navToUpcoming(){
				uni.setStorageSync('TabCur', 1);
				uni.webView.switchTab({
					url:'/pages/upcoming/index'
				})
			},
			navToApp(){
				uni.webView.switchTab({
					url:'/pages/applicate/index'
				})
			},
			navToMail(){
				uni.webView.switchTab({
					url:'/pages/mailList/index'
				})
			},
			navToUser(){
				uni.webView.switchTab({
					url:'/pages/user/index'
				})
			},
			navToWork(){
				uni.webView.switchTab({
					url:'/pages/index/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
