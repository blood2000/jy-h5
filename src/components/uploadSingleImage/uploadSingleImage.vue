<template>
	<view class="upload-msg-box">
		<view class="img-box ly-flex ly-flex-align-center ly-flex-pack-center" @click="handleUpload">
			<img v-if="codeValue && codeValue !== ''" :src="pathValue" />
		</view>
		<view class="label">{{label}}</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import { uploadImgApi, getFile, uploadOcr } from '@/config/service/common.js'
	export default {
		name:"uploadSingleImage",
		props: {
		    value: {
		      type: String,
		      default: ''
		    },
			label: {
				type: String,
				default: ''
			},
			// 图片类型
			imageType: {
				type: String,
				default: null
			},
			// 图片正反面
			side: {
				type: String,
				default: null
			},
			// 图标类型
			iconType: {
				type: String,
				default: 'default'
			}
		},
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			})
		},
		data() {
			return {
				codeValue: '',
				pathValue: ''
			};
		},
		watch: {
		    value: {
				handler(value) {
					this.codeValue = value;
					this.handleGetFile(value);
				},
				deep: true,
				immediate: true
		    }
		},
		created() {
		    this.codeValue = this.value;
		},
		methods: {
			handleUpload() {
				const that = this;
				const urlFile = process.env.VUE_APP_BASE_API + uploadImgApi
				uni.chooseImage({
					count: 1,
					sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ["album"], //从相册选择
					success:(res)=> {
						const car_lic = res.tempFilePaths[0];
						uni.showLoading({
							title: '上传中...'
						});
						uni.uploadFile({
							url: urlFile, //仅为示例，非真实的接口地址
							filePath: car_lic,
							name: 'file',
							header: this.headerInfo,
							success: (uploadFileRes) => {
								const data = JSON.parse(uploadFileRes.data);
								const {code, path} = data.data
								console.log('code: ', code);
								console.log('path: ', path);
								// 保存code，回显path
								this.codeValue = code;
								this.pathValue = path;
								this.$emit('input', this.codeValue);
								// ocr识别
								this.handleOrc(this.pathValue);
							},
							complete: () => {
								uni.hideLoading();
							}
						});
					}
				})
			},
			// 根据code获取图片path
			handleGetFile(code) {
				if (code) {
					getFile(code, this.headerInfo).then(response => {
						if (response.data && response.data.length > 0) {
							this.pathValue = response.data[0].attachUrl;
						} else {
							this.pathValue = '';
						}
						console.log('getFile: ', this.pathValue)
					});
				}
			},
			// 图片识别
			handleOrc(url) {
				const formData = {};
				if (this.imageType) {
					formData.type = this.imageType;
				} else {
					return;
				}
				if (url) {
					formData.url = url;
				} else {
					return;
				}
				if (this.side) {
					formData.side = this.side;
				}
				uploadOcr(formData, Object.assign(
					{}, 
					this.headerInfo, 
					{'Content-Type':'application/x-www-form-urlencoded'})
				).then(response => {
					if (response.data) {
						if (this.side) {
							this.$emit('fillForm', this.imageType, response.data, this.side);
						} else {
							this.$emit('fillForm', this.imageType, response.data);
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.upload-msg-box{
		width: 100%;
		background: #F3F8FC;
		padding: 20upx;
		>.img-box{
			height: 150upx;
			background: rgba(0,0,0,0.05);
			>img{
				max-width: 100%;
				max-height: 100%;
			}
		}
		>.label{
			font-size: 20upx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #333333;
			text-align: center;
			margin-top: 8upx;
		}
	}
</style>
