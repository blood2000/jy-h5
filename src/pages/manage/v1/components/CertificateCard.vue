<!-- 凭证记录卡片组件 -->
<template>
  <div class="manage-box card-box">
    <div class="card-line">
      <div class="manage-title3">{{ cardData.companyName }}</div>
      <div class="card-title-time">
        <div class="card-title-sub">
          <uni-icons type="map-filled" size="20" color="#3a65ff"></uni-icons>
        </div>
        <div class="card-title-sub">
          <div class="card-title-sub-value">{{restNumber}}</div>
          <div class="card-title-sub-name">剩余</div>
        </div>
        <div class="card-title-sub">
          <div class="card-title-sub-value">{{cardData.reserveNumber}}</div>
          <div class="card-title-sub-name">总数</div>
        </div>
      </div>
    </div>
    <div class="manage-splite-line"></div>
    <div class="card-line">
      <div class="card-line-item">
        <div class="card-line-value">入场区域:</div>
        <div class="manage-title2 card-line-text">{{buildingName}}</div>
      </div>
    </div>
    <div class="card-line card-bg-line1">
      <div class="card-line-item">
        <div class="card-line-value1">
          <img
            class="card-icon"
            src="../../../../static/manage/goods.png"
            alt=""
          />
        </div>
        <div class="manage-title2 card-line-text card-line-text1">{{cardData.goodsName}}</div>
      </div>
      <div class="card-line-item">
        <div class="manage-title2 card-line-value1">{{cardData.number || 0}}</div>
        <div class="manage-title5">吨/方</div>
      </div>
    </div>

    <div class="card-line-one">
      <div class="card-line-value">有效日期</div>
      <div class="manage-title2 card-line-one-value">{{cardData.effectiveDate}} 至 {{cardData.expirationDate}}</div>
    </div>

    <div class="card-line-one">
      <div class="card-line-value">备注信息</div>
      <div class="manage-title2 card-line-one-value">
        {{cardData.remark || '无'}}
      </div>
    </div>

    <div class="card-line" >
      <div class="card-line-date">{{cardData.createTime}}</div>
    </div>

    <div class="card-line card-bg-line" v-if="status === 1">
      <div class="card-line-item">
        <div class="card-line-value">预约总量:</div>
        <div class="manage-title2 card-line-text">{{cardData.useNumber}}</div>
      </div>
      <div class="card-line-item">
        <div class="card-line-value">入场车次:</div>
        <div class="manage-title2 card-line-text">{{cardData.admissionNumber}}</div>
      </div>
    </div>

    <div class="manage-splite-line top-border"></div>
    <div class="card-line" v-if="status === 1">
      
      <div class="card-bottom-item">
        <uni-icons type="eye" color="#333" size="16"></uni-icons>
        <div class="manage-title2 card-line-item-ml">查看详情</div>
      </div>
      <div class="card-bottom-item" @click="deleteCertify">
        <uni-icons type="trash" color="red" size="16"></uni-icons>
        <div class="manage-title2 card-line-item-ml  manage-delete">删除</div>
      </div>
    </div>


    
    
    <div class="card-line" v-if="status === 0">
      <div class="card-bottom-item" @click="share">
        <div class="card-line-item-icon">
          <img src="../../../../static/manage/share.png" alt="" />
        </div>
        <div class="manage-title2 card-line-item-ml">分享</div>
      </div>
      <div class="card-bottom-item" @click="toDispatch">
        <div class="card-line-item-icon">
          <img src="../../../../static/manage/dispatch.png" alt="" />
        </div>
        <div class="manage-title2 card-line-item-ml">调号</div>
      </div>
      <div class="card-bottom-item">
        <div class="card-line-item-icon">
          <img src="../../../../static/manage/void.png" alt="" />
        </div>
        <div class="manage-title2 card-line-item-ml">作废</div>
      </div>
      <div class="card-bottom-item">
        <uni-icons type="trash" color="red" size="16"></uni-icons>
        <div class="manage-title2 card-line-item-ml  manage-delete">删除</div>
      </div>
    </div>
    
    
  </div>
</template>

<script>
import format from "../../../../utils/format";
export default {
  data() {
    return {
      // company: "山西华汇通商贸有限公司",
      // goodsType: "石渣土",
      // status: this.tabIndex,
      // date: createDate,
      // time: "08:00",
      // enterArea: this.pageNum + "站台",
      // licenseNumber: "闽A123123",
      // driver: "辛弃疾",

    };
  },

  props: {
    status: {
      type: Number,
      default: 0,
    },
    cardData: {
      type: Object,
      required: true,
    },
  },

  components: {},

  computed: {
    buildingName() {
      if (this.cardData.buildingInfoVos) {
        return this.cardData.buildingInfoVos.buildingName;
      } else {
        return '暂无';
      }
  
    },
    restNumber() {
      return this.cardData.reserveNumber - this.cardData.useNumber;
    },
    
  },

  // mounted() {
  //   console.log("Card Show");
  // },

  methods: {
    deleteCertify() {
      console.log(this.cardData.id);
      uni.showModal({
        title: "提示",
        content: "确认删除该凭证?",
        success: (res) => {
          if (res.confirm) {
            this.$emit('deleteCertify', this.cardData.id);
          }
        },
      });
      
    },
    toDispatch() {
      this.$emit('toDispatch', this.cardData.code);
    },
    share() {
      this.$emit('share', this.cardData.code);
    },
  },
};
</script>
<style lang='scss' scoped>
.card-box {
  padding: 20rpx 30rpx 0;
}
.card-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  &-item {
    display: flex;
    align-items: center;
    &-icon {
      width: 40rpx;
      height: 40rpx;

      > img {
        width: 100%;
        height: 100%;
      }
    }

    &-mr {
      margin-right: 20rpx;
    }
    &-ml {
      margin-left: 10rpx;
    }
  }
  &-value {
    color: #878787;
    font-size: 28rpx;
    margin-right: 10rpx;
    display: flex;
    align-items: center;
  }

  &-value1 {
    color: #3a65ff;
    font-size: 28rpx;
    margin-right: 10rpx;
    display: flex;
    align-items: center;
  }

  &-date {
    font-size: 24rpx;
    color: #878787;
    font-weight: normal;
  }

  &-text {
    max-width: 200rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &-text1 {
    color: #3a65ff;
  }
}

.card-line:last-child {
  margin-bottom: 0;
}

.card-line-one {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20rpx;
  &-value {
    max-width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.card-bg-line {
  box-sizing: border-box;
  background: #f7f7f7;
  height: 66rpx;
  border-radius: 6rpx;
  padding: 0 20rpx;
}

.card-bg-line1 {
  box-sizing: border-box;
  background: #f0f3ff;
  height: 66rpx;
  border-radius: 6rpx;
  padding: 0 20rpx;
}

.card-icon {
  width: 32rpx;
  height: 32rpx;
}

.card-title-time {
  box-sizing: border-box;
  padding: 0 10rpx;
  width: 192rpx;
  height: 60rpx;
  background: #f0f3ff;
  border-radius: 6rpx;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title-sub {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  font-weight: bold;
  color: #3a65ff;
  transform: scale(0.9);
  &-value {
    padding-top: 4rpx;
    transform: scale(0.9) translateY(4rpx);
  }
  &-name {
    font-size: 24rpx;
    color: #b3b3b3;
    transform: scale(0.8) translateY(-4rpx);
  }
}

.manage-splite-line {
  margin: 10rpx -30rpx 16rpx;
}

.top-border {
  margin-bottom: 0;
}

.card-bottom-item {
  box-sizing: border-box;
  flex: 1;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1rpx solid #f0f0f0;
}

.card-bottom-item:last-child {
  border-right: none;
}

.card-date-item {
  box-sizing: border-box;
  height: 80rpx;
  display: flex;
  align-items: center;
}
</style>