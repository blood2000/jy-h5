<template>
	<view>
		<!-- html -->
		<html2canvas ref="html2canvas" :domId="domId" @renderFinish="renderFinish">

			<u-overlay :show="show" @click="()=>{show = false; cbData = null; domId = ''}">

				<view class="qrcode ly-flex-v ly-flex-align-center">
					<view class="poster ly-flex-v ly-flex-align-center" id="poster">
						<view class="titleView">
							<image src="../../static/appointment/qrTitle_left.png" mode="aspectFill"
								style="height:2upx;width:90upx;">
							</image>
							<text class="titleView_stationName">{{qrcodeInfo.stationName}}</text>
							<image src="../../static/appointment/qrTitle_right.png" mode="aspectFill"
								style="height:2upx;width:90upx;">
							</image>
						</view>
						<view class="licenseNumberView  ly-flex ly-flex-pack-justify ly-flex-align-start">
							<view class="licenseNumberValue">{{qrcodeInfo.licenseNumber}}</view>
							<view class="heapNumberValue">{{qrcodeInfo.heapNumber}}</view>
						</view>
						<view class="qr" :class="cbData && cbData.transRelType == 'chy' ? 'chy' : ''" @tap.stop>
							<image :src="qrcode.src" mode="aspectFill" style="height:400upx;width:400upx"></image>
							<tki-qrcode :show="false" cid="qrcode1" ref="qrcode" :val="qrcode.val" :size="qrcode.size"
								:unit="qrcode.unit" :background="qrcode.background" :foreground="qrcode.foreground"
								:pdground="qrcode.pdground" :icon="qrcode.icon" :iconSize="qrcode.iconsize"
								:lv="qrcode.lv" :onval="qrcode.onval" :loadMake="qrcode.loadMake"
								:usingComponents="true" @result="result" />
						</view>
						<view class="contents">
							<view class="contents-top ly-flex ly-flex-pack-justify ly-flex-align-start">
								<view class="name g-double-row">{{ qrcodeInfo.companyName }}</view>
							</view>
							<view class="contents-bottom ly-flex ly-flex-pack-justify ly-flex-align-center">
								<view class="g-single-row text">{{ qrcodeInfo.dateStr }}</view>
							</view>
						</view>
					</view>
				</view>

			</u-overlay>
		</html2canvas>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import html2canvas from '@/components/html2canvas/html2canvas.vue'
	import TkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
	import TransportCard from 'pages/transportPlan/components/TransportCard.vue'
	import {
		pathToBase64,
		base64ToPath
	} from 'image-tools'
	import {
		saveHeadImgFile
	} from '@/common/js/saveHeadImgFile'
	import {
		orderPlanInfoList as getList,
		buildQrCode
	} from '@/config/service/transportPlan/transportationPlan.js'
	export default {
		components: {
			TransportCard,
			TkiQrcode,
			html2canvas,
		},
		data() {
			return {
				ifOnShow: true,
				statusBar: '0px',
				// 二维码展示
				show: true,
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

				qrcodeInfo: {
					stationName: '五福洗煤场',
					licenseNumber: '闽A15235',
					heapNumber: '32号堆',
					companyName: '山西汇通上报有限公司',
					dateStr: '2021-12-29～2021-12-29',
				},
				
				domId: '',

				cbData: null,

				loading: false,
				queryParams: { // 请求参数
					pageNum: 1,
					pageSize: 10,
				},

				// 二维码配置
				//二维码 D:\my\zjjy-h5\src\static\download\driver.png

				qrcode: {
					val: '', // 要生成的二维码值
					size: 400, // 二维码大小
					unit: 'upx', // 单位
					background: '#FFFFFF', // 背景色
					foreground: '#000000', // 前景色
					pdground: '#000000', // 角标色
					icon: '../../static/jylogo.png', // 二维码中心图标
					iconsize: 53, // 二维码图标大小
					lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
					onval: true, // val值变化时自动重新生成二维码
					loadMake: true, // 组件加载完成后自动生成二维码
					src: '' // 二维码生成后的图片地址或base64
				},

				filePath: '', // 海报地址
				logoBase64: ''
			}
		},

		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			}),
			_queryParams() {
				return this.queryParams
			},
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
			if (!this.isEnd) {
				this.status = 'more';
				this.queryParams.pageNum++;
				this.getList();
			}
		},

		onHide() {
			console.log('this.ifOnShow=true')
			this.ifOnShow = true
		},

		async onShow() {
			console.log('我触发了!!!');
			if (this.ifOnShow) {
				this.queryParams.pageNum = 1
				// 是否无数据了
				this.isEnd = false,
					this.status = 'more',
					await this.getList('2')
			}
		},


		async onLoad(options) {
			// options.token = '7d37f0a1-a6ce-4b80-a6cb-97c72d677502'

			console.log('h5---------------------------', options.token, '---------------------------');
			// token赋值
			if (options.token) {
				this.$store.dispatch('getLoginInfoAction', {
					'Authorization': options.token
				});
				// options.token && uni.setStorageSync('token', options.token)
				// 高度要赋值
				options.statusBarHeight && this.$store.dispatch('getStatusBarHeightAction', options.statusBarHeight);

				// 转成线上地址
				try {
					const imgInfo = await uni.getImageInfo({
						src: "../../static/jylogo.jpg"
					});
					this.logoBase64 = imgInfo[1].path
				} catch (e) {
					//TODO handle the exception
				}

			}

			if (this.headerInfo.Authorization) {
				this.queryParams.pageNum = 1
				this.isEnd = false,
					this.status = 'more',
					this.getList('2')
			}
		},

		methods: {
			// s= 请求列表数据(固定字段名)
			getList(index) {
				this.status = 'loading';
				uni.showLoading();
				this.loading = true;
				return getList(this._queryParams, this.headerInfo).then(async res => {
					this.loading = false;
					uni.hideLoading();
					if (res.data.list.length === 0) {
						this.isEnd = true;
						this.status = 'noMore';
						return;
					}
					if (res.data.list.length < this._queryParams.pageSize) {
						this.status = 'noMore';
					}

					this.total = res.data.total || 0;
					if (index === '2') {
						this.cardList = res.data.list
					} else {
						this.cardList = [...this.cardList, ...res.data.list];
					}
				}).catch(() => {
					this.loading = false;
					uni.hideLoading();
				});
			},
			// e=

			navigateBack() {
				const pages = getCurrentPages().length;
				if (pages === 1) {
					uni.webView.navigateBack();
				} else {
					uni.webView.switchTab({
						url: '/pages/applicate/index'
					})
				}
			},
			share(row) {
				// console.log(row);
				this.cbData = row
				this.$set(this.qrcode, 'val',
					`https://api.chaohaoyun.cn/jysj/qrcode?code=${this.cbData.orderPlanCode}&type=1`)
				this.filePath = ''
				this.show = true
			},

			// 点击
			handlerClick(_data) {
				const {
					receiveType,
					id
				} = _data
				uni.redirectTo({
					url: `./add?type=${receiveType - 1}&id=${id}`
				})
			},

			sendPlan() {
				uni.redirectTo({
					url: './add?type=0'
				})
			},
			receivePlan() {
				uni.redirectTo({
					url: './add?type=1'
				})
			},

			// 二维码返回地址
			result(res) {
				base64ToPath(res).then(src => {
					this.qrcode.src = src
					this.domId = '#poster' // 返回后生成海报
				})
			},

			/**
			 * 渲染完毕接收图片
			 * @param {String} filePath
			 */
			async renderFinish(filePath) {
				this.filePath = await saveHeadImgFile(filePath)
			},


			// s=与应用交互
			// 保存海报
			saveImg() {
				if (this.filePath) {
					this.sendOption('save', this.filePath)
				} else {
					uni.showToast({
						title: "图片不存在",
						icon: "none",
						mask: true,
					})
				}
			},


			// 分享到微信
			wxshare() {


				const que = {
					path: 'pages/startPage/startPage',
					query: `code=${this.cbData.orderPlanCode}&type=1`
				};

				// console.log(que);

				// 请求一下地址
				buildQrCode(que, this.headerInfo).then(res => {
					// console.log(res);
					if (res.data.errmsg === 'ok') {

						// console.log('分享的连接是:' , this.qrcode.val);
						this.sendOption('onShare', {
							shareUrl: res.data.url_link, // 分享连接
							shareTitle: "承运链接", // 分享的标题
							shareContent: `点此接【${ this.cbData.name }】的运单`, // 分享的描述
							shareImg: this.logoBase64 ||
								"http://qn.kemean.cn//upload/202004/18/1587189024467w6xj18b1.jpg",
							appId: undefined, // 默认不传type的时候，必须传appId和appPath才会显示小程序图标
							appPath: undefined,
							appWebUrl: undefined
						})
					}

				})


			},

			// 应用交互
			sendOption(action, obj) {
				uni.webView.postMessage({
					data: {
						action: action,
						data: obj
					}
				});
			}
			// e=
		}
	}
</script>

<style lang="scss" scoped>
	
	.titleView {
		margin-top: 36upx;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
	}
	
	.titleView_stationName {
		font-size: 36upx;
		font-weight: bold;
		color: #FFFFFF;
		padding-left: 15upx;
		padding-right: 15upx;
	}
	
	.licenseNumberView {
		margin-top: 27upx;
		margin-bottom: 19upx;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
	}
	
	.licenseNumberValue {
		font-size: 28upx;
		font-weight: bold;
		color: #FFFFFF;
		position: relative;
		left: -120upx;
	}
	
	.heapNumberValue {
		font-size: 24upx;
		color: #FFFFFF;
		text-align: right;
		border-radius: 17upx;
		border: 2upx solid #FFFFFF;
		padding-left: 14upx;
		padding-right: 14upx;
		position: relative;
		right: -120upx;
	}
	
	.qrcode {
		width: 580rpx;
		height: auto;
		background-color: #3c65fd;
		margin: auto;
		border-radius: 30rpx;
		padding-bottom: 0upx;

		>.poster {
			width: 100%;
			height: auto;
			background-color: #3c65fd;
			margin: auto;
			border-radius: 30rpx;
			padding-bottom: 38upx;
		}

		.qr {
			border-radius: 12rpx;
			width: 480rpx;
			height: 470rpx;
			background-color: #FFFFFF;
			padding: 35upx 40upx;

			&.chy {
				width: 480upx;
				height: 520upx;
				background: url('../../static/transportPlan/box-bg.png') no-repeat;
				background-size: 100% 100%;
				padding: 94upx 40upx 26upx 40upx;
			}
		}

		.contents {
			width: 480upx;
			background: rgba(255, 255, 255, 0);
			border-radius: 12upx;
			margin-top: 35upx;
			padding: 0 22upx;

			.contents-top {
				font-size: 26upx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #FFFFFF;
				line-height: 38upx;
				margin: 22upx 0;

				.tag {
					width: 60upx;
					height: 27upx;
					line-height: 27upx;
					text-align: center;
					background: #FFFFFF;
					border-radius: 16upx 14upx 14upx 0upx;
					font-size: 20upx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #3A65FF;
					margin-top: 5upx;
				}

				.name {
					width: calc(100% - 68upx);
				}
			}

			.contents-bottom {
				font-size: 28upx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #FFFFFF;
				padding: 24upx 0 10upx;
				border-top: 2upx solid rgba(255, 255, 255, 0.15);

				.img {
					height: 16upx;
					width: 64upx;
					margin: 0 22upx;
				}

				.text {
					width: calc(100% - 68upx);
				}
			}
		}

		.message {
			color: #FFFFFF;
			line-height: 50rpx;
			text-align: center;
			margin: 32upx 0 0;
			font-size: 28upx;
		}

		.btn {
			width: 500upx;

			button {
				width: 230upx;
				height: 80upx;
				line-height: 80upx;
				font-size: 28upx;
				font-weight: bold;
				padding: 0;

				&:first-child {
					color: #FFFFFF;
					background-color: transparent;
					border: 2upx solid #FFFFFF;
					line-height: 76upx;

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
</style>
