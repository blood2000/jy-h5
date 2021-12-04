<template>
	<view class="u-page">
		<u-navbar title="运输计划" @leftClick="navigateBack" safeAreaInsetTop fixed placeholder>
		</u-navbar>
		<view class="ly-flex-pack-around">
			<view class="sendPlan box-comm" @click="receivePlan">
				<view class="ly-flex-align-center">
					<image src="../../static/transportPlan/send.png" style="width: 50rpx;height: 50rpx;"></image>
					<text class="bal">发货</text>
				</view>
				<view class="text-description">
					创建发货计划
				</view>
			</view>
			<view class="receivePlan box-comm" @click="sendPlan">
				<view class="ly-flex-align-center">
					<image src="../../static/transportPlan/send.png" style="width: 50rpx;height: 50rpx;"></image>
					<text class="bal">收货</text>
				</view>
				<view class="text-description">
					创建收货计划
				</view>
			</view>
		</view>
		<template v-if="cardList && cardList.length > 0">
			<view v-for="(item,index) in cardList" :key="index">
				<TransportCard v-model="cardList[index]" @share='share' @handlerClick="handlerClick(item)"></TransportCard>
			</view>
		</template>

		<NonePage v-else></NonePage>

		<uni-load-more v-if="cardList && cardList.length > 0" :status="status" :icon-size="16" :content-text="contentText" />

		<u-overlay :show="show" @click="show = false">
			<view class="qrcode ly-flex-v ly-flex-align-center">
				<view class="title">
					<image src="../../static/transportPlan/title.png" mode="aspectFill" style="height:50px;width:250px">
					</image>
				</view>
				<view class="qr" @tap.stop>
					<tki-qrcode cid="qrcode1" ref="qrcode" :val="qrcode.val" :size="qrcode.size" :unit="qrcode.unit" :background="qrcode.background"
						:foreground="qrcode.foreground" :pdground="qrcode.pdground" :icon="qrcode.icon" :iconSize="qrcode.iconsize" :lv="qrcode.lv"
						:onval="qrcode.onval" :loadMake="qrcode.loadMake" :usingComponents="true" @result="result" />
				</view>
				<view class="message mb10 mt10">
					司机扫码即可接单，您也可以分享链接到微信中让司机点击接单
				</view>
				<view class="btn ly-flex-pack-around">
					<button @click.stop="">保存到手机</button>
					<button @click.stop="wxshare">分享链接到微信</button>
				</view>
			</view>
		</u-overlay>
	</view>
</template>

<script>

	import TkiQrcode from '../../components/tki-qrcode/tki-qrcode.vue'
	import TransportCard from './components/TransportCard.vue'
	import { orderPlanInfoList as getList, orderPlanInfoAdd, orderPlanInfoUpdate, orderPlanInfoUpdateStatus, teamSelectTeamListByCodes } from '@/config/service/transportPlan/transportationPlan.js'
	export default {
		components: {
			TransportCard,
			TkiQrcode,
		},
		data() {
			return {
				// 二维码展示
				show: false,
				// 运输计划列表
				cardList: [],
				// 是否无数据了
				isEnd: false,
				status: 'more',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多了'
				},


				loading: false,
				queryParams: { // 请求参数
					pageNum: 1,
					pageSize: 10,
				},

				// 二维码配置
				//二维码 D:\my\zjjy-h5\src\static\download\driver.png
				qrcode: {
					val: 'https://api.chaohaoyun.cn/qrcode/cym;999d295b69764d399c7de6a0223b77fe', // 要生成的二维码值
					size: 460, // 二维码大小
					unit: 'upx', // 单位
					background: '#FFFFFF', // 背景色
					foreground: '#000000', // 前景色
					pdground: '#000000', // 角标色
					icon: '../../static/download/driver.png', // 二维码图标
					iconsize: 80, // 二维码图标大小
					lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
					onval: true, // val值变化时自动重新生成二维码
					loadMake: true, // 组件加载完成后自动生成二维码
					src: '' // 二维码生成后的图片地址或base64
				},


			}
		},

		computed:{
			_queryParams(){
				return this.queryParams
			}
		},

		async onPullDownRefresh() {
			console.log('下拉刷新');
			this.queryParams.pageNum = 1
			// 是否无数据了
			this.isEnd = false,
			this.status = 'more',
			await this.getList('2')
			console.log('下拉刷新关闭');
			uni.stopPullDownRefresh();
			
		},

		// 触底加载
		onReachBottom() {
			if(!this.isEnd) {
				this.status = 'more';
				this.queryParams.pageNum++;
				this.getList();
			}
		},

		onLoad(options){
			console.log('请求头',options.token);
			this.$store.dispatch('getLoginInfoAction', {
				'Authorization': options.token
			});
			this.getList();
		},

		methods: {
			// s= 请求列表数据(固定字段名)
			getList(index) {
				this.status = 'loading';
				uni.showLoading();
				this.loading = true;
				return getList(this._queryParams).then(async res => {
					console.log(res);
					this.loading = false;
					uni.hideLoading();
					if (res.data.list.length === 0) {
						this.isEnd = true;
						this.status = 'noMore';
						return;
					}
					if(res.data.list.length < this._queryParams.pageSize){
						this.status = 'noMore';
					}

					this.total = res.data.total || 0;
					if(index==='2'){
						this.cardList = res.data.list
					} else {
						this.cardList = [...this.cardList, ...res.data.list];
					}
				}).catch(() => { this.loading = false; });
			},
			// e=

			navigateBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			share(row) {
				console.log(row);
				this.show = true
			},

			// 点击
			handlerClick(_data){
				console.log(_data);
				// uni.$emit('caback')
				const { receiveType, id } = _data
				uni.navigateTo({
					url: `./add?type=${receiveType - 1}&id=${id}`
				})
			},

			sendPlan(){
				uni.navigateTo({
					url:'./add?type=0'
				})
			},
			receivePlan(){
				uni.navigateTo({
					url:'./add?type=1'
				})
			},

			// 二维码返回地址
			result(res) {
				console.log(res)
				this.qrcode.src = res
			},
			
			// 分享到微信
			wxshare(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sendPlan,
	.receivePlan{
		margin-top: 20rpx;
		border-radius: 20rpx;
		width: 45%;
		height: 150rpx;
	}
	.box-comm{
		padding:28upx 36upx;
		.bal{
			padding-left: 9upx;
			font-size: 32upx;
			font-weight: bold;
			color: #FFFFFF;
		}
		
		.text-description{
			margin-top: 12upx;
			font-size: 24upx;
			font-weight: 400;
			color: #FFFFFF;
			opacity: 0.7;
		}
	}
	.sendPlan{
		background:#3a65ff url(../../static/transportPlan/sendbg.png) no-repeat 150rpx 32rpx;
		background-size:200rpx;
	}
	.receivePlan{
		background:#5abe00 url(../../static/transportPlan/receivebg.png) no-repeat 150rpx 42rpx;
		background-size:200rpx
	}
	.qrcode {
		width: 600rpx;
		height: 850rpx;
		background-color: #3c65fd;
		margin: auto;
		border-radius: 30rpx;

		.qr {
			border-radius: 20rpx;
			width: 500rpx;
			height: 500rpx;
			background-color: #FFFFFF;
			// display: flex;
			// align-content: center;
			// justify-content: center;
			padding: 20upx;
		}

		.message {
			width: 80%;
			color: #FFFFFF;
			line-height: 50rpx;
		}

		.btn {
			width: 90%;

			button {
				width: 240upx;
				height: 80upx;
				line-height: 80upx;
				font-size: 24upx;
				font-weight: bold;

				&:first-child {
					color: #FFFFFF;
					background-color: #7897ff;

					&:active {
						background-color: #6c88e5;
					}
				}

				&:last-child {
					color: #3c65fd;
				}
			}
		}
	}

	.mb10 {
		margin-bottom: 20rpx;
	}

	.mt10 {
		margin-top: 20rpx;
	}
</style>
