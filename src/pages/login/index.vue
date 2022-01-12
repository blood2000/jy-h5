<template>
	<view class="register">
		<view :style="{height:statusBarHeight*2+'upx'}"></view>
		<view class="padding text-right text-bold size32" @click="navToCodeLogin">验证码登录</view>
		<view class="title">账号密码登录</view>
		<view class="form-section">
			<view class="form-frame flex align-center" :class="telno?'border-on':''">
				<image class="form-phone" src="/static/icon-phone.png" mode=""></image>
				<input class="form-input" v-model="form.telno" placeholder="请输入账号" name="input" @focus="focus('telno')" @blur="blur('telno')" />
			</view>
			<view v-show="telno && accountList.length>0" class="account-frame">
				<view class="account-cont">
					<view v-for="(item,index) in accountList" :key="index" class="account-telno" @tap="handleAccount(item)">{{item.telno}}</view>
				</view>
			</view>
			<view class="text-red margin-stop" style="font-size: 22upx;height: 70upx;">{{!telnoValidate?'账号不能为空':''}}</view>
			<view class="form-frame flex align-center" :class="password?'border-on':''">
				<image class="form-password" src="/static/icon-password.png" mode=""></image>
				<input class="form-input" v-model="form.password" :password="showPassword" placeholder="请输入密码" name="input" @focus="focus('password')" @blur="blur('password')" />
				<view class="form-icon" @click="changePassword">
					<image class="form-pass" :src="!showPassword?'/static/icon-show.png':'/static/icon-hidden.png'" mode=""></image>
				</view>
			</view>
			<view class="text-red margin-stop" style="font-size: 22upx;height: 50upx;">{{!passwordValidate?'密码不能为空':''}}</view>
			<view class="flex align-center justify-between">
				<view class="flex align-center" @click="handleRemember">
					<view class="size36" :class="remember?'cuIcon-squarecheckfill text-blue':'cuIcon-square text-gray'"></view>
					<view class="margin-sleft">记住密码</view>
				</view>
				<view style="color: #878787;">忘记密码</view>
			</view>
		</view>
		<button class="btn-yes" type="default" @click="loginConfirm">确认登录</button>
	</view>
</template>

<script>
	import { login, bindCid, getCid } from "@/config/service/login"
	import {
		getInfo
	} from "@/config/service/workbench.js"
	import {mapMutations, mapState} from 'vuex'; 

	export default {
		components: {
		},
		data() {
			return {
				statusBarHeight: this.StatusBar, // 状态栏高度
				form: {
					telno: null,
					password: null
				},
				accountList: [],
				modalName: null,
				telnoValidate: true,
				passwordValidate: true,
				telno: false,
				password: false,
				showPassword: true,
				remember: false,
				scanErr: false,
				scanCode: null,
				cid: undefined,
				img: 'https://css-backup-1579076150310.obs.cn-south-1.myhuaweicloud.com/image_directory/1634722139501276c5f.png'
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			var pinf = plus.push.getClientInfo();
			this.cid = pinf.clientid;//客户端标识
			uni.setStorageSync('cid', this.cid); // 缓存cid
			// #endif
			// uni.removeStorageSync('account');
			this.accountList = uni.getStorageSync('account') || []; // 获取缓存的账号列表
			// if(this.accountList.length){
			// 	this.accountList.reverse();
			// }
			this.remember = uni.getStorageSync('remember');
			if (this.remember) {
				this.form.telno = uni.getStorageSync('telno');
				this.form.password = uni.getStorageSync('password');
			}
		},
		methods: {
			 ...mapMutations(['SET_INFO', 'SET_NICKNAME']),
			loginConfirm(){
				setTimeout(() => {
					if (this.telnoValidate && this.passwordValidate && this.form.password && this.form.telno){
						// 设置账号密码缓存
						if (this.remember) {
							uni.setStorageSync('telno', this.form.telno);
							uni.setStorageSync('password', this.form.password);
							uni.setStorageSync('remember', this.remember);
						}else{
							uni.setStorageSync('remember', this.remember);
						}
						uni.showLoading({ mask: true });
						const que = {
							telno: this.form.telno,
							password: btoa(this.form.password)
						}
						login(que).then(res => {
							uni.hideLoading();
							// 缓存token
							uni.setStorageSync('token', res.data.access_token);
							// 获取用户信息
							getInfo({"Authorization":res.data.access_token,"App-Type":"2","App-Code":"f3209f6c7353414e8dbb94dd23cf8b91","Terminal-Type":"web","App-Version":"1.0","Produce-Code":"2c3c8c43b487432b9d67934a6c4dcbbe","statusBarHeight":0}).then(res => {
								uni.setStorageSync('userInfo', res.data);
								this.SET_INFO(res.data)
								this.SET_NICKNAME(res.data.nickName)
							});
							// #ifdef APP-PLUS
							getCid().then(res => {
								if(res.data) {
									if(res.data === this.cid) {
										this.navToIndex();
									}else{
										const that = this;
										uni.showModal({
											title: '提示',
											content: '当前设备不是常用设备，是否继续登录？',
											success: function (res) {
												if (res.confirm) {
													that.setCid();
												} else if (res.cancel) {
													uni.showToast({title: '取消登录成功',icon: 'none', duration: 1000});
												}
											}
										});
									}
								} else {
									this.setCid();
								}
							})
							// #endif
							// #ifndef APP-PLUS
								this.navToIndex();
							// #endif
						}).catch(() => {
							this.form.password = null;
							uni.hideLoading();
						})
					} else {
						this.msgSuccess('请输入手机号与密码');
					}
				}, 100)
			},
			// 绑定设备唯一标识cid
			setCid() {
				bindCid(this.cid).then(() => {
					this.navToIndex();
				});
			},
			// 登录成功跳转首页
			navToIndex() {
				this.setAccount();
				uni.showToast({title: '登录成功',icon: 'none', duration: 1000});
				setTimeout(() => {
					uni.reLaunch({
						url: "/pages/index/index"
					})
				}, 1000)
			},
			// 缓存账户列表，最多保存十个
			setAccount() {
				if (this.accountList.length>0){
					const accountIndex = this.accountList.findIndex(res => res.telno === this.form.telno);
					if(accountIndex !== -1) {
						this.accountList.splice(accountIndex, 1);
						this.accountList.unshift(this.form);
						// this.accountList[accountIndex] = this.form;
					} else {
						if(this.accountList.length===10) {
							this.accountList.splice(9, 1);
						}
						this.accountList.unshift(this.form);
					}
				} else {
					this.accountList.unshift(this.form);
				}
				uni.setStorageSync('account', this.accountList);
			},
			// 选择常用账号
			handleAccount(item) {
				this.form = JSON.parse(JSON.stringify(item));
			},
			// 显隐密码
			changePassword() {
			    this.showPassword = !this.showPassword;
			},
			// 记住密码
			handleRemember() {
				this.remember = !this.remember;
			},
			// 输入框聚焦
			focus(type){
				if(type === 'telno') {
					this.telno = true;
				} else if(type === 'password') {
					this.password = true
				}
			},
			// 输入框失焦
			blur(type) {
				setTimeout(() => {
					if(type === 'telno') {
						this.telno = false;
						if(this.form.telno){
							this.form.telno = this.form.telno.replace(/[, ]/g,'')
							if(this.form.telno) {
								this.telnoValidate = true;
							} else {
								this.telnoValidate = false;
							}
						} else {
							this.telnoValidate = false;
						}
					} else if(type === 'password') {
						this.password = false;
						if (this.form.password){
							this.passwordValidate = true;
						} else {
							this.passwordValidate = false;
						}
					}
				})
				
			},
			navToCodeLogin() {
				uni.reLaunch({
					url: '/pages/public/login'
				})
			}
		},
		computed: {
			...mapState({
				headerInfo: state => state.header.headerInfo
			})
		},
	}
</script>

<style lang="scss" scoped>
	.title{
		margin-top: 150upx;
		text-align: center;
		font-family: 'PingFang Regular';
		font-size: 56upx;
		font-weight: bold;
		color: #000000;
	}
	.register{
		background-color: #FFFFFF;
		height: 100vh;
		overflow: hidden;
	}
	.bg-img{
		position: fixed;
		top: 0;
		left: 0;
		z-index: 5;
		width: 100%;
		height: 498upx;
	}
	.top-section{
		position: relative;
		z-index: 6;
		margin-top: 200upx;
		padding:  0 60upx;
		.top-title{
			font-size: 52upx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #FFFFFF;
		}
		.top-tag{
			margin-top: 35upx;
			font-size: 28upx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #FFFFFF;
		}
	}
	.form-section{
		position: relative;
		z-index: 6;
		margin-top: 100upx;
		background-color: #FFFFFF;
		width: 100%;
		// height: 100vh;
		border-radius: 50upx 50upx 0 0;
		padding: 54upx 54upx 0;
		.border-on{
			border: 3upx solid #4478E4;
		}
		.border-no{
			border: 1upx solid #E6E6E6;
		}
		.form-frame{
			// margin: 0 0 37upx;
			padding: 36upx 24upx;
			height: 96upx;
			background: #F8F8F8;
			border-radius: 10upx;
			.form-input{
				margin-left: 30upx;
				padding-left: 30upx;
				border-left: 1upx solid #E6E6E6;
				width: 72%;
			}
			.form-phone{
				height: 44upx;
				width: 44upx;
				// margin-right: 6upx;
			}
			.form-password{
				height: 44upx;
				width: 44upx;
			}
			.form-icon{
				padding: 6upx 30upx;
				.form-pass{
					height: 20upx;
					width: 36upx;
				}
			}
		}
		.account-frame{
			position: relative;
			z-index: 10;
			height: 0;
			top: 10upx;
			left: 90upx;
			.account-cont{
				max-height: 300upx;
				width: 550upx;
				border: 1upx solid #ebebeb;
				background-color: #F6F2FF;
				border-radius: 10upx;
				overflow: scroll;
				.account-telno{
					padding: 20upx;
				}
			}
		}
	}
	.btn-yes{
		margin: 80upx 70upx 30upx;
		height: 88upx;
		background: #4478E4;
		border-radius: 10upx;
		font-size: 36upx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
	}
</style>
