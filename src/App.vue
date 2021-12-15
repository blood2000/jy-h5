<script>
	import { mapState } from 'vuex'
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		computed: {
			...mapState({
			  headerInfo: state => state.header.headerInfo,
			  statusBarHeight: state => state.header.statusBarHeight,
			})
		},
		watch: {
			headerInfo: {
				handler(value) {
					// 模拟拦截
					if(value && JSON.stringify(value) !== '{}') {
						this.$isResolve();
					}
				},
				deep: true,
				immediate: true
			},
		}
	}
</script>

<style lang='scss'>
	@import "@/common/css/tabbar.scss";
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "uview-ui/index.scss";
	.app-container{
		background-color: #FFFFFF;
		border-radius: 16upx;
		overflow: hidden;
		margin: 0 24upx;
	}
	.padding-m{
		padding: 24upx;
	}
	.margin-stop{
		margin-top: 10upx;
	}
	.margin-mtop{
		margin-top: 24upx;
	}
	.margin-sbottom{
		margin-bottom: 10upx;
	}
	.margin-mbottom{
		margin-bottom: 20upx;
	}
	.margin-sright{
		margin-right: 10upx;
	}
	.margin-mright{
		margin-right: 20upx;
	}
	.margin-sleft{
		margin-left: 10upx;
	}
	.margin-mleft{
		margin-left: 20upx;
	}
	.margin-stb{
		margin: 10upx 0;
	}
	.margin-mtb{
		margin: 20upx 0;
	}
	.padding-stb{
		padding: 10upx 0;
	}
	.padding-mbottom{
		padding-bottom: 20upx;
	}
	.border-bottom{
		border-bottom: 1upx solid #EBEBEB;
	}
	.size20{
		font-size: 20upx;
	}
	.size24{
		font-size: 24upx;
	}
	.size26{
		font-size: 26upx;
	}
	.size30{
		font-size: 30upx;
	}
	.size32{
		font-size: 32upx;
	}
	.size36{
		font-size: 36upx;
	}
	.size40{
		font-size: 40upx;
	}
	.size46{
		font-size: 46upx;
	}
	.size52{
		font-size: 52upx;
	}
	.text-title{
		color: #333333;
	}
	.text-cont{
		color: #666666;
	}
	.text-tag{
		color: #999999;
	}
	.ellipsis{
		overflow: hidden; //超出隐藏
		white-space: nowrap; //
		text-overflow: ellipsis;
	}
	
	.form-group-to +.form-group-to{
		border-top: 0.5px solid #eee;
	}
	.form-group-to{
		border-top: 0.5px solid #eee;
	}
	/*每个页面公共css */
	uni-page-wrapper{
		background: #F3F3F3;
	}
	uni-page-body {
		width: 100%;
		height: 100%;
		/* overflow: hidden; */
	}
	/* uni-swipe-action */
	.uni-swipe_button{
		padding: 0 24upx !important;
		font-size: 32upx !important;
		font-weight: bold;
	}
	/* u-navbar */
	.u-navbar__content__title{
		font-size: 36upx !important;
		font-family: PingFang SC;
		font-weight: bold;
		color: #333333;
	}
	/* u-popup */
	.u-popup__content__close--top-right{
		top: 34upx !important;
		.u-icon__icon{
			font-size: 36upx !important;
		}
	}


	
</style>
