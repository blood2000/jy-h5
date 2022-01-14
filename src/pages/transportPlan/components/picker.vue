<template>
	<picker :value="_value" :range="range" range-key="dictLabel" :disabled="disabled"
		@change="handlerChange($event)">
		<view class="ly-flex-pack-end">
			<slot>
				<view v-if="(_value || _value ===0) && range.length > 0" class="limitWide picker-input g-single-row" :class="{ 'clos': close}" >
					{{ range[_value].dictLabel }}
				</view>
				<view class="picker-placeholder" v-else>{{placeholder}}</view>
			</slot>
			<view class="closeicon" @click.stop="handlerClose" v-if="close && (_value || _value ===0) && range.length > 0">
				<u-icon name="close-circle" size='16' color="#999999" class="yangiwiss"></u-icon>
			</view>
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
			},
			close:{
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
				if(this.range[index].disable){
					uni.showToast({title: '此项已禁用',icon: 'none', duration: 1000});
					return
				}
				this.$emit('input', this.range[index].dictValue)
				this.$emit('change', this.range[index].dictValue)
			},

			handlerClose(){
				this.$emit('input', undefined)
			}
		}
	}
</script>

<style lang="scss" scoped>

	.ly-flex-pack-end{
		position: relative;
		.closeicon{
			// position: absolute;
			// top: 20upx;
			// right: 32upx;
			display: flex;
			align-items: center;

			cursor:pointer;
		}
	}
	.ly-flex-pack-end .limitWide{
		width: 300upx;
		&.clos{
			// padding-right: 30upx;
		}
	}

	.yangiwiss{
		margin-left: 13upx;
	}
	.picker-input{
		position: relative;
		width: 100%;
		height: 100%;
		text-align: right;
	}
	
</style>
