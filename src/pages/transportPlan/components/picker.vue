<template>
	<picker :value="_value" :range="range" range-key="dictLabel" :disabled="disabled"
		@change="handlerChange($event)">
		<view class="ly-flex-pack-end">
			<slot>
				<view v-if="(_value || _value ===0) && range.length > 0" class="picker-input">
					{{ range[_value].dictLabel }}
				</view>
				<view class="picker-placeholder" v-else>{{placeholder}}</view>
			</slot>
			<u-icon name="arrow-down-fill" size='7' color="#999999" class="yangiwiss"></u-icon>
		</view>
	</picker>
</template>

<script>
	export default{
		props:{
			value:[Number,String],
			range:{
				type: Array,
				default:()=>[]
			},
			placeholder:String,
			disabled: {
				type: Boolean,
				default: false
			}
		},

		computed:{
			_value(){
				if(!this.value && this.value !== 0 && this.range.length <= 0) return

				const index = this.range.findIndex(e=> e.dictValue === this.value)

				if(index === -1) return

				return index
			}
		},

		methods:{
			handlerChange(e){
				const index = e.detail.value
				this.$emit('input', this.range[index].dictValue)
				this.$emit('change', this.range[index].dictValue)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.yangiwiss{
		margin-left: 13upx;
	}
</style>
