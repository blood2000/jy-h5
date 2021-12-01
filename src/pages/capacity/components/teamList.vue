<template>
	<u-popup :show="show" round :closeable="true" :closeOnClickOverlay="false" @close="close" @open="open">
		<view class="popup-box">
			<view class="title">选择调度组</view>
			<view class="search">
				<uni-easyinput
					prefixIcon="search"
					type="text"
					:inputBorder="false"
					:clearable="true"
					v-model="queryParams.userName"
					placeholder="请输入调度组名称搜索"
					@confirm="handleConfirm"
					@input="handleInput"
				/>
			</view>
			<view class="list-box">
				<!-- 列表项 -->
				<view v-for="(item, index) in listData" :key="index" class="list-box-item ly-flex ly-flex-pack-justify">
					大白的车队
					<text>调度者：大白</text>
				</view>
			</view>
			<view class="button" @click="submit">确认</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		name: 'TeamList',
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
					userName: undefined
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
				this.queryParams.userName = undefined;
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
				if (this.queryParams.userName === '') {
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
			.uni-input-placeholder{
				color: #878787;
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
				>text{
					font-size: 28upx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #999999;
				}
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
