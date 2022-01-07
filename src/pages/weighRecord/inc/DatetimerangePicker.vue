<template>
  <!-- 选择时间 -->
  <view class="datetimerange-picker">
    <i class="icon-calendar"></i>
    <uni-datetime-picker
      class="datetime-picker-weigh"
      :key='oldDatePicker1' 
      ref='datepick' 
      :border="false" 
      v-model="datetimerange"
      type="daterange" 
      return-type="timestamp"
      rangeSeparator="至"
      @change="handlerPick" />
    <i class="icon-select"></i>
  </view>
</template>

<script>
  export default {
    name: 'DatetimerangePicker',
    props: {
      value: {
        default: []
      },
    },
    data() {
      return {
        datetimerange: [], // 时间范围
        oldDatePicker1: Date.now() // 改变key值重新渲染
      }
    },
    methods: {
      // 时间控件
			handlerPick(arr){
        console.log(arr)
				if(arr[0] && arr[1]){
					if(arr[0] === arr[1]){
						// 日期加一天
            this.$nextTick(function() {
              const time1 = arr[1] + (1000 * 60 * 60 * 24);
              const newDateArr = [arr[0], time1];
              this.datetimerange = newDateArr;
              this.oldDatePicker1 = Date.now()
              this.$emit('input', newDateArr)
            })
					} else {
						this.oldDatePicker = arr
            this.$emit('input', arr)
					}
          this.$nextTick(() => {
            this.$emit('getList', true);
          })
				}
			},
    }
  }
</script>

<style lang="scss" scoped>
.datetimerange-picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .icon-calendar {
    background: url(@/static/weighRecord/icon_calendar.png);
    background-size: contain;
    width: 30upx;
    height: 30upx;
    display: block;
    margin-right: 10upx;
  }
  .icon-select {
    width: 30upx;
    height: 16upx;
    background: url(@/static/weighRecord/icon_select.png) no-repeat;
    background-size: contain;
    margin-left: 10upx;
  }
}
.datetime-picker-weigh {
	width: 380upx;
	margin: 0 -8upx;
	::v-deep .uni-date-editor--x:hover .uni-date__icon-clear {
		right: -46upx;
		top: 2upx;
		border: 0;
	}
	::v-deep .uni-date-x {
		background-color: transparent;
		color: #fff;
		font-size: 28upx;
		padding: 0;
		width: 380upx;
		.uni-input-placeholder {
			color: #e1e1e1;
			font-size: 28upx;
		}
		.uni-date__icon-logo {
			display: none;
		}
		.uni-date__input {
			padding: 0 8upx;
			font-size: 28upx;
			height: 30upx;
			line-height: 30upx;
		}
	}
}
</style>