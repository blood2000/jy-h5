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
			<view class="list-box" v-if="dataList.length > 0">
				<!-- 列表项 -->
				<view v-for="(item, index) in dataList" :key="index" class="list-box-item ly-flex ly-flex-pack-justify">
					<view class="name g-single-row">
						<!-- <image class="icon-check" src="~@/static/capacity/check.png"></image> -->
						<image class="icon-check" src="~@/static/capacity/check_none.png" @click="handleCheck"></image>
						{{ item.name }}
					</view>
					<view class="leader g-single-row">调度者：{{ item.teamLeaderName }}</view>
				</view>
			</view>
			<view class="list-box" v-else>
				<!-- 无数据 -->
				<NonePage></NonePage>
			</view>
			<view class="button" @click="submit">确认</view>
		</view>
	</u-popup>
</template>

<script>
	import { mapState } from 'vuex';
	import { listInfo } from '@/config/service/capacity/team.js';
	import NonePage from '@/components/NonePage/NonePage.vue';
	export default {
		name: 'TeamList',
		components: {
			NonePage
		},
		props: {
			show: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			})
		},
		data() {
			return {
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					userName: undefined
				},
				dataList: []
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
			async getList() {
				this.loading = true;
				const data = await listInfo(this.queryParams, this.headerInfo);
				this.loading = false;
				this.dataList = [...this.dataList, ...data.list];
			},
			/** 搜索按钮操作 */
			handleQuery() {
				this.queryParams.pageNum = 1;
				this.dataList = [];
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
			},
			/** 选中 */
			handleCheck() {
				
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
				>.name{
					width: 60%;
				}
				>.leader{
					width: 40%;
					font-size: 28upx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #999999;
					text-align: right;
				}
				.icon-check{
					width: 50upx;
					height: 60upx;
					vertical-align: middle;
					margin: -6upx 14upx 0 0;
					padding: 10upx 10upx 10upx 0;
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
