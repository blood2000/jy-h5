<template>
  <view>
    <!-- 选择筛选 -->
    <view class="pop-filter" v-show="!isShowMoreCompany && !isShowMoretransportPlan">
      <view class="pop-filter-title">
        <text>选择筛选条件</text>
        <i class="icon-close" @click="closePopFilter()"></i>
      </view>
      <view class="pop-filter-content">
        <view class="form-group">
          <!-- 过磅类型 -->
          <view class="form-item">
            <view class="form-label">过磅类型</view>
            <view class="form-cont">
              <view class="radio-group" @click="onChangeFilterForm">
                <view class="item-radio" :class="{'active': filterForm.weighType == item.id}" :data-value="item.id" data-formName="weighType" v-for="item in weighTypeList" :key="item.id">{{ item.name }}</view>
              </view>
            </view>
          </view>
          <!-- 收发企业 -->
          <view class="form-item">
            <view class="form-label">
              <text>收发企业</text>
              <text class="more" @click="isShowMoreCompany=true">更多企业</text>
            </view>
            <view class="form-cont">
              <view class="radio-group" @click="onChangeFilterForm">
                <view class="item-radio fill" :class="{'active': filterForm.companyId == item.id}" :data-value="item.id" data-formName="companyId" v-for="item in companyListNew" :key="item.id">{{ item.name }}</view>
              </view>
            </view>
          </view>
          <!-- 运输计划 -->
          <view class="form-item">
            <view class="form-label">
              <text>运输计划</text>
              <text class="more" @click="isShowMoretransportPlan=true">更多运输计划</text>
            </view>
            <view class="form-cont">
              <view class="radio-group" @click="onChangeFilterForm">
                <view class="item-radio fill" :class="{'active': filterForm.transportPlanId == item.id}" :data-value="item.id" data-formName="transportPlanId" v-for="item in transportPlanList" :key="item.id">{{ item.name }}</view>
              </view>
            </view>
          </view>
          <!-- 地磅 -->
          <view class="form-item">
            <view class="form-label">
              <text>地磅</text>
            </view>
            <view class="form-cont">
              <view class="radio-group" @click="onChangeFilterForm">
                <view class="item-radio" :class="{'active': filterForm.weighbridgeId == item.id}" :data-value="item.id" data-formName="weighbridgeId" v-for="item in weighbridgeList" :key="item.id">{{ item.name }}</view>
              </view>
            </view>
          </view>
          <!-- 称重状况 -->
          <view class="form-item">
            <view class="form-label">
              <text>称重状况</text>
            </view>
            <view class="form-cont">
              <view class="radio-group" @click="onChangeFilterForm">
                <view class="item-radio" :class="{'active': filterForm.weighStatus == item.id}" :data-value="item.id" data-formName="weighStatus" v-for="item in weighStatusList" :key="item.id">{{ item.name }}</view>
              </view>
            </view>
          </view>
        </view>
        <view class="btn-group">
          <view class="btn btn-cancel" @click="clearAllFormData">清空</view>
          <view class="btn btn-comfirm" @click="comfirm">确定(28条过磅记录）</view>
        </view>
      </view>
    </view>
    <!-- 更多收发企业 -->
    <view class="pop-filter-company" v-show="isShowMoreCompany">
      <view class="pop-filter-company-title">
        <i class="icon-back" @click="isShowMoreCompany=false"></i>
        <text>收发企业</text>
      </view>
      <view class="pop-filter-company-content">
        <input type="text" placeholder="输入企业名称" class="input-search" />
        <view class="list-company">
          <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y">
            <view class="radio-group" @click="onChangeFilterForm">
              <view class="item-radio fill" :class="{'active': filterForm.companyId == item.id}" :data-value="item.id" data-formName="companyId" v-for="item in companyList" :key="item.id">{{ item.name }}</view>
            </view>
          </scroll-view>
        </view>
        <view class="btn-group">
          <view class="btn-primary" @click="doComfirmCompany">确定</view>
        </view>
      </view>
    </view>
    <!-- 更多运输计划 -->
    <view class="pop-filter-company" v-show="isShowMoretransportPlan">
      <view class="pop-filter-company-title">
        <i class="icon-back" @click="isShowMoretransportPlan=false"></i>
        <text>运输计划</text>
      </view>
      <view class="pop-filter-company-content">
        <input type="text" placeholder="输入运输计划名称" class="input-search" />
        <view class="list-company">
          <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y">
            <view class="radio-group" @click="onChangeFilterForm">
              <view class="item-radio fill" :class="{'active': filterForm.transportPlanId == item.id}" :data-value="item.id" data-formName="transportPlanId" v-for="item in transportPlanList" :key="item.id">{{ item.name }}</view>
            </view>
          </scroll-view>
        </view>
        <view class="btn-group">
          <view class="btn-primary" @click="doComfirmTransportPlan">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'PopFilter',
    props: {
      value: {
        default: []
      },
      weighTypeList: { // 过磅类型（皮重过磅、毛重过磅）
        type: Array,
        default: () => []
      },
      companyList: { // 收发企业
        type: Array,
        default: []
      },
      transportPlanList: { // 运输计划
        type: Array,
        default: []
      },
      weighbridgeList: { // 地磅列表
        type: Array,
        default: []
      },
      weighStatusList: { // 称重状况（已完成、未完成）
        type: Array,
        default: []
      }
    },
    data () {
      return {
        scrollTop: 0,
        filterForm: {
          weighType: 1, // 1皮重过磅 2 毛重过磅
          companyId: 1, // 收发企业
          transportPlanId: 1, // 运输计划
          weighbridgeId: 1, // 地磅
          weighStatus: 1 // 称重状况
        },
        isShowMoreCompany: false, // 是否显示更多收发企业
        isShowMoretransportPlan: false // 是否显示更多运输计划
      }
    },
    methods: {
      closePopFilter() {
        this.$emit('closePopFilter')
      },
      /**
       * 选择类型
       */
      onChangeFilterForm(e) {
        console.log(e.target.dataset.value)
        if(e.target.dataset.value) {
          this.filterForm[e.target.dataset.formName] = e.target.dataset.value;
        }
      },
      /**
       * 清空
       */
      clearAllFormData() {
        this.filterForm = {
          weighType: '', // 1皮重过磅 2 毛重过磅
          companyId: '', // 收发企业
          transportPlanId: '', // 运输计划
          weighbridgeId: '', // 地磅
          weighStatusId: '' // 称重状况
        }
      },
      /**
       * 确定操作
       */
      comfirm() {
        this.$emit('input', this.filterForm);
        this.$emit('doFilter')
      },
      /**
       * 确定选择的收发企业
       */
      doComfirmCompany() {
        this.isShowMoreCompany = !this.isShowMoreCompany;
      },
      /**
       * 确定选择的收发企业
       */
      doComfirmTransportPlan() {
        this.isShowMoretransportPlan = !this.isShowMoretransportPlan;
      }
    },
    computed: {
      companyListNew() {
        return this.companyList.slice(0,2);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .radio-group {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -15upx;
    .item-radio {
      position: relative;
      height: 70upx;
      line-height: 70upx;
      font-size: 29upx;
      color: #333;
      padding: 0 28upx;
      border-radius: 6upx;
      margin: 0 15upx 15upx;
      background-color: rgba($color: #ccc, $alpha: 0.18);
      &::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
      }
      &.active {
        background-color: rgba($color: #3a65ff, $alpha: 0.12);
        color: #3a65ff;
        font-weight: bold;
      }
      &.fill {
        width: 100%;
      }
    }
  }
  .pop-filter {
		background-color: #fff;
		border-radius: 25upx 25upx 0px 0px;
		padding: 40upx 36upx;
		&-title {
			text-align: center;
			font-size: 33upx;
			position: relative;
			.icon-close {
				position: absolute;
				right: 0;
				top: 0;
				width: 32upx;
				height: 32upx;
				background: url(../../../static/weighRecord/icon_close.png) no-repeat;
				background-size: contain;
				display: block;
			}
		}
		.form-group {
			.form-item {
				margin-bottom: 30upx;
				.form-label {
					position: relative;
					margin-bottom: 25upx;
					.more {
						position: absolute;
						right: 0;
						top: 0;
						font-size: 29upx;
						color: #878787;
						display: flex;
						align-items: center;
						&::after {
							content: '';
							display: block;
							width: 18upx;
							height: 26upx;
							background: url(../../../static/weighRecord/arrow_left.png) no-repeat;
							background-size: contain;
							margin-left: 15upx;
						}
					}
				}
			}
		}
		.btn-group {
			display: flex;
			justify-content: space-between;
			margin: 50upx -15upx 0;
			.btn {
				padding: 0 78upx;
				height: 80upx;
				border-radius: 10upx;
				border: solid 1upx #3a65ff;
				margin: 0 15upx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 30upx;
				&.btn-cancel {
					color: #3a65ff;
					background-color: #fff;
				}
				&.btn-comfirm {
					color: #fff;
					background-color: #3a65ff;
				}
			}
		}
	}
  .pop-filter-company {
		background-color: #fff;
		border-radius: 25upx 25upx 0px 0px;
		padding: 40upx 36upx;
		&-title {
			text-align: center;
			font-size: 33upx;
			position: relative;
			margin-bottom: 30upx;
			font-weight: bold;
			.icon-back {
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 32upx;
				height: 32upx;
				background: url(../../../static/weighRecord/icon_back.png) no-repeat;
				background-size: contain;	
				display: block;
			}
		}
		&-content {
			overflow: hidden;
			.input-search {
				background-color: #f5f5f5;
			}
			.list-company {
				margin-top: 35upx;
				height: 600upx;
				overflow: hidden;
				overflow-y: scroll;
				.scroll-Y {
					height: 100%;
				}	
			}
			.btn-group {
				margin-top: 20upx;
				background-color: #fff;
			}
			.btn-primary {
				height: 80upx;
				background-color: #3a65ff;
				border-radius: 10upx;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30upx;
			}
		}
	}
</style>