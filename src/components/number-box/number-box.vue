<template>
	<view class="uni-numbox">
		<!-- <input :disabled="disabled" @input="onKeyInput" @blur="_onBlur" class="uni-numbox__value" type="number" v-model="inputValue" /> -->

        <input :disabled="disabled" v-model="inputValue" :maxlength="max" type="number" @input="onKeyInput" @blur="_onBlur" :placeholder="placeholder" />
	</view>
</template>
<script>
	/**
	 * NumberBox 数字输入框
	 * @description 带加减按钮的数字输入框
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=31
	 * @property {Number} value 输入框当前值
	 * @property {Number} min 最小值
	 * @property {Number} max 最大值
	 * @property {Number} step 每次点击改变的间隔大小
	 * @property {Boolean} disabled = [true|false] 是否为禁用状态
	 * @event {Function} change 输入框值改变时触发的事件，参数为输入框当前的 value
	 */
	export default {
		name: "UniNumberBox",
		props: {
			value: {
				type: [Number, String],
				default: undefined
			},
			min: {
				type: Number,
				default: 0
			},
			max: {
				type: Number,
				default: 100
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			},
			placeholder: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				inputValue: undefined,
			};
		},
		watch: {
			value(val) {
               //正则表达试
                // let value = (val - 0) + ''
                let value = Math.round((val - 0)*100)/100 
                // console.log(value.match(/^\d*(\.?\d{0,2})/g));
                // value = (value.match(/^\d*(\.?\d{0,2})/g)[0]) || null

				//重新赋值给input
				this.$nextTick(() => {
					this.inputValue= value
				})
			},
			inputValue(newVal, oldVal) {
                this.$emit("input", newVal);
			}
		},
		created() {
			this.inputValue = this.value
		},
		methods: {
              //输入框实时获取输入内容
			 onKeyInput: function(event) {
			    this.inputValue = event.target.value;
			 },
            
			
			_onBlur(event) {
				this.$emit("blur", this.inputValue);
			}
		}
	};
</script>
<style scoped>
	.uni-numbox {
		width: 100%;
	}
	
</style>
<!-- 
 四舍五入
// var f = parseFloat(event.target.value);
// if (isNaN(f)) {
// 	return false;
// }
// var f = event.target.value;
// var s = f.toString();
// var rs = s.indexOf('.');
// if (rs < 0) {
// 	 rs = s.length;
// 	 s += '.';
// }
// //拼接小数位数  在此处修改 小数位数
// while (s.length <= rs + 1) {
// 		 s += '0';
// }
// event.target.value = s; 
 -->
