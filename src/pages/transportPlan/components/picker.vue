<template>
	<picker :value="_value" :range="range" range-key="dictLabel" :disabled="disabled"
		@change="handlerChange($event)">
		<view class="ly-flex-pack-end">
			<slot>
				<view v-if="value" class="picker-input">
					{{ range[range.findIndex(res => res.dictValue===value)].dictLabel }}
				</view>
				<view class="picker-placeholder" v-else>{{placeholder}}</view>
			</slot>
			<u-icon name="arrow-down-fill" size='12'></u-icon>
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
			_value:{
				get(){
					const index = this.range.findIndex(e=> e.dictValue === this.value)
					return index
				}
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

<style>
</style>
