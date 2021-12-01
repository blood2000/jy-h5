<template>
	<picker :value="value" :range="range" range-key="dictLabel"
		@change="e => $emit('change',e)">
		<view class="ly-flex-pack-end">
			<view v-if="value" class="picker-input">
				{{ range[range.findIndex(res => res.dictValue===value)].dictLabel }}
			</view>
			<view class="picker-placeholder" v-else>{{placeholder}}</view>
			<u-icon name="arrow-down-fill" size='12'></u-icon>
		</view>
	</picker>
</template>

<script>
	export default{
		props:{
			value:Number,
			range:Array,
			placeholder:String
		},
	}
</script>

<style>
</style>
