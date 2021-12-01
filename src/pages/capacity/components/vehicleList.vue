<template>
	<u-popup :show="show" round :closeable="true" :closeOnClickOverlay="false" @close="close" @open="open">
		<view class="popup-box">
			<view class="title">选择车辆</view>
			<view class="search">
				<uni-easyinput
					prefixIcon="search"
					type="text"
					:inputBorder="false"
					:clearable="true"
					v-model="queryParams.licenseNumber"
					placeholder="请输入车牌号搜索"
					@confirm="handleConfirm"
					@input="handleInput"
				/>
			</view>
			<view class="list-box">
				<!-- 列表项 -->
				<view v-for="(item, index) in listData" :key="index" class="list-box-item">
					闽A12345
				</view>
			</view>
			<view class="button" @click="submit">确认</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		name: 'VehicleList',
		props: {
			show: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					licenseNumber: undefined
				},
				listData: []
			}
		},
		watch: {
			show: {
				handler(val) {
					if (val) {
						this.reset();
						this.handleQuery();
					}
				},
				immediate: true
			}
		},
		methods: {
			close() {
				this.$emit('close');
			},
			reset() {
				this.queryParams.licenseNumber = undefined;
			},
			submit() {
				this.close();
			},
			getList() {
				this.listData = [{},{},{},{},{},{},{},{},{},{},{}]
			},
			/** 搜索按钮操作 */
			handleQuery() {
				this.queryParams.pageNum = 1;
				this.listData = [];
				this.getList();
			},
			/** input搜索 */
			handleConfirm() {
				this.handleQuery();
				this.hideKeyboard();
			},
			/** 收起键盘 */
			hideKeyboard() {
				uni.hideKeyboard();
			},
			/** input清空 */
			handleInput() {
				if (this.queryParams.licenseNumber === '') {
					this.handleQuery();
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup-box{
		height: 960upx;
		padding: 30upx 0 44upx;
		>.title{
			line-height: 36upx;
			font-size: 32upx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #333333;
			text-align: center;
			margin-bottom: 28upx;
		}
		>.search{
			margin: 0 36upx;
			.uni-easyinput{
				background: #F3F3F3;
				border-radius: 10upx;
			}
		}
		>.list-box{
			height: 640upx;
			overflow-y: scroll;
			>.list-box-item{
				height: 106upx;
				line-height: 106upx;
				border-bottom: 1upx solid #EBEBEB;
				margin: 0 50upx;
				font-size: 32upx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #333333;
			}
		}
		>.button{
			height: 80upx;
			line-height: 80upx;
			background: #3A65FF;
			border-radius: 10upx;
			font-size: 32upx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #FFFFFF;
			text-align: center;
			margin-top: 24upx;
			margin: 24upx 36upx 0;
		}
	}
</style>
