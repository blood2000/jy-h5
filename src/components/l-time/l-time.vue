<template>
	<text @click="onClick" :style="[{fontSize: size + 'rpx',lineHeight:  size + 'rpx',color: color},customStyle]">{{temp}}</text>
</template>  

<script>
	import _time_ from './time.js';
	export default {
		name: 'l-time',
		props: {
			//日期字符串
			text: {
				type: [String,Number,Date],
				default: ''
			},
			//返回日期格式
			dateFormat: {
				type: String,
				default: 'yyyy-MM-dd HH:mm:ss'
			},
			/**
			 * 当前年单独设置日期格式
			 * 未设置默认返回dateFormat
			 */
			currentYear: {
				type: String,
				default: ''
			},
			//是否计算
			isCompute: {
				type: Boolean,
				default: true
			},
			//计算范围
			computeMax: {
				type: String,
				default: 'hh'
			},
			/**
			 * 是否显示大于当前时间日期
			 * true:显示日期、false：大于显示刚刚
			 * 仅isCompute为true时有效
			 */
			maxDate: {
				type: Boolean,
				default: false
			},
			//字体大小rpx
			size: {
				type: [Number,String],
				default: 24
			},
			//颜色
			color: {
				type: String,
				default: '#000'
			},
			//自定义样式
			customStyle: {
				type: Object,
				default:()=>{}
			},
		},
		data() {
			return {
				textVal: this.text,
			}
		},
		watch:{
			text(){
			  this.textVal = this.text;
			}
		  },
		computed: {
			temp() {
				return this.getText();
			}
		},
		methods: {
			getText() {
				let self = this;
				let dateFormat = self.dateFormat;
				if (this.currentYear){
					dateFormat = this.isCurrentYear()
				}
				if (!self.isCompute) {
					return self.textVal ? new Date(self.textVal).pattern(dateFormat) : '';
				}
				let timeVal = _time_.getFormatTime(self.textVal,self.maxDate,dateFormat,self.computeMax);
				if (timeVal&&(timeVal.endsWith("刚刚") || timeVal.endsWith("分钟前"))) {
					setTimeout(() => {  
						let temp = self.textVal;
						self.textVal = "";
						self.textVal = temp; 
					},60000);
				}
				return (this.textVal ? timeVal : "");
			},
			onClick() {
				this.$emit('click',this.textVal);
			},
			isCurrentYear() {
				let cY = new Date().pattern('yyyy');
				let tY = new Date(this.textVal).pattern('yyyy');
				if (cY == tY) {
					return this.currentYear;
				} else {
					return this.dateFormat
				}
			}
		}
	}
</script>

<style>

</style>
