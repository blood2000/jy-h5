<template>
	<view class="building-content">
		<u-navbar placeholder safeAreaInsetTop :title="title" @leftClick="back" @rightClick="chosenMaterial">
			<view slot='right' style="color:#9AcaFc">选择物料</view>
		</u-navbar>
		<!-- <view class="building-main"> -->
		<view class="main">
			<!-- <u-search bgColor='white' :show-action="true" actionText="搜索" :animation="true"></u-search> -->
			<uni-search-bar bgColor='white' v-model="value" @confirm="search" @input="input"></uni-search-bar>
			共3条记录
			<view class="u-page">
				<u-list height="100%" @scrolltolower="scrolltolower">
					<u-list-item v-for="(item, index) in indexList" :key="index">
						<u-cell :title="`列表长度-${index + 1}`">
							<u-icon slot='right-icon' name="trash" color="red" size="20" @click='deleteMaterial(index)'>
							</u-icon>
						</u-cell>
					</u-list-item>
				</u-list>
			</view>
		</view>
		<!-- </view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '物料类别',
				value: '',
				indexList: [{
					title: 1,
					b: 2
				}, {
					title: 3,
					d: 4
				}],
				indexList1: [{
					title: 1,
					b: 2
				}, {
					title: 3,
					d: 4
				}]
			};
		},
		components: {},
		onPullDownRefresh() {
			console.log("下拉刷新");
			setTimeout(() => {
				uni.stopPullDownRefresh(); //停止下拉刷新动画
			}, 1000);
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			search() {

			},
			input(val) {
				!val ? this.indexList = this.indexList1 : this.indexList = this.indexList.filter(res => res.title == val)
			},
			scrolltolower() {

			},
			chosenMaterial() {

			},
			deleteMaterial(index) {
				this.indexList.splice(index, 1)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-page {
		background-color: white;
		margin-top: 10px;
		border-radius: 5px;
	}

	.main {
		margin: 0 auto;
		width: 90vw;
	}

	.uni-searchbar {
		padding-left: 0;
		padding-right: 0;
	}
</style>
