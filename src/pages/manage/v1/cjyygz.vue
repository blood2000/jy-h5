<!-- 创建预约规则 -->
<template>
  <div class="manage-content">
    <HeaderBar :title="title" @back="back"></HeaderBar>
    <div class="manage-main">
      <div class="manage-box">
        <div class="manage-box-line">
          <div class="manage-title2">
            规则名称 <span class="require">*</span>
          </div>
          <div class="manage-input-box">
            <input
              class="manage-input"
              type="text"
              placeholder="请输入规则名称"
              v-model="ruleName"
            />
          </div>
        </div>
      </div>
      <div class="manage-box">
        <div class="manage-box-line">
          <div class="manage-title2">
            生效日期 <span class="require">*</span>
          </div>
          <picker
            mode="date"
            :value="effDate"
            :end="invalidDate"
            @change="changeDate($event, 'effDate')"
          >
            <view class="picker-btn" v-if="effDate"> {{ effDate }}</view>
            <view class="picker-btn" v-else> 请选择生效日期 </view>
          </picker>
        </div>
        <div class="manage-box-line">
          <div class="manage-title2">
            失效日期 <span class="require">*</span>
          </div>
          <picker
            mode="date"
            :value="invalidDate"
            :start="effDate"
            @change="changeDate($event, 'invalidDate')"
          >
            <view class="picker-btn" v-if="invalidDate">
              {{ invalidDate }}</view
            >
            <view class="picker-btn" v-else> 请选择失效日期 </view>
          </picker>
        </div>
      </div>
      <!-- 排除日期添加 -->
      <div class="manage-box">
        <div class="manage-box-line" style="border-bottom: none">
          <div class="manage-title2">
            排除日期 <span class="require">*</span>
          </div>
          <picker
            mode="date"
            :value="outDate"
            @change="changeDate($event, 'outDate')"
          >
            <!-- <view class="picker-btn" v-if="outDate">
              {{ outDate }}</view
            > -->
            <view class="picker-btn"> 请添加日期 </view>
          </picker>
        </div>
        <div class="manage-box-area">
          <div
            class="manage-box-area-item"
            v-for="(item, index) in outDateArr"
            :key="index"
          >
            <div>{{ item }}</div>
            <uni-icons
              type="clear"
              size="14"
              color="#878787"
              @click="clearDate(index)"
            ></uni-icons>
          </div>
        </div>
      </div>
      <!-- 入场时段 -->
      <block v-for="(item, index) in enterTimeArr" :key="index">
        <div class="manage-box">
          <div class="manage-box-title">
            <div class="manage-box-title-item">
              <div class="manage-title2">入场时段 ({{ index * 1 + 1 }})</div>
              <div class="manage-subtitle">
                <div><uni-icons type="info" size="10"></uni-icons>请完善时段信息</div>
              </div>
            </div>
            <div class="manage-delete-box" @click="deleteTime(index)">
              <uni-icons type="trash" size="15" color="#F95757"></uni-icons>
              <div>删除时刻</div>
            </div>
          </div>
          <div class="manage-box-line">
            <div class="manage-title2">
              开始时间 <span class="require">*</span>
            </div>
            <picker
              mode="time"
              :value="item.startTime"
              :end="item.endTime"
              @change="changeTime($event, index, 'startTime')"
            >
              <view class="picker-btn" v-if="item.startTime">
                {{ item.startTime }}</view
              >
              <view class="picker-btn" v-else> 请选择时间 </view>
            </picker>
          </div>
          <div class="manage-box-line">
            <div class="manage-title2">
              结束时间 <span class="require">*</span>
            </div>
            <picker
              mode="time"
              :value="item.endTime"
              :start="item.startTime"
              @change="changeTime($event, index, 'endTime')"
            >
              <view class="picker-btn" v-if="item.endTime">
                {{ item.endTime }}</view
              >
              <view class="picker-btn" v-else> 请选择时间 </view>
            </picker>
          </div>
          <div class="manage-box-line">
            <div class="manage-title2">放号量</div>
            <div class="manage-input-box">
              <input
                class="manage-input"
                type="number"
                placeholder="请输入放号量"
                v-model="item.num"
              />
            </div>
          </div>
        </div>
      </block>
      <div class="add-time" @click="addTime">新增时段</div>
    </div>
    <div class="manage-btn-box">
      <div class="manage-btn">保存</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import formFilter from "../../../utils/filter";
import format from "../../../utils/format";
export default {
  data() {
    return {
      title: "创建预约规则",
      ruleName: "",
      effDate: "", //生效日期
      invalidDate: "", //失效日期
      outDate: "",
      outDateArr: [],
      enterTimeArr: [
        // { startTime: "10:25", endTime: "12:00", num: 12 },
        // { startTime: "12:25", endTime: "14:00", num: 8 },
      ],
      temInput: "", //放号量缓存数据，用于过滤
    };
  },

  components: { HeaderBar },

  computed: {},

  onShow() {},

  methods: {
    //日期选择
    changeDate(e, type) {
      this[type] = e.detail.value;
      if (type === "outDate") {
        this.outDateArr.push(e.detail.value);
      }
    },

    //关闭排除日期
    clearDate(index) {
      this.outDateArr.splice(index, 1);
    },

    //入场时间选择
    changeTime(e, index, type) {
      let time = e.detail.value;
      this.enterTimeArr[index][type] = time;
      // this.$set(this.enterTimeArr, index, value);
      console.log(this.enterTimeArr);
    },

    deleteTime(index) {
      uni.showModal({
        title: "提示",
        content: "删除该时段",
        success:  (res) => {
          if (res.confirm) {
            //点击确认
            this.enterTimeArr.splice(index, 1);
          }
        },
      });
    },
    
    addTime() {
      this.enterTimeArr.push({
        startTime: '',
        endTime: '',
        num: ''
      })
    },

    //数值输入
    filterInput(e, index) {
      setTimeout(() => {
        let value = e.detail.value;
        if (value != "" && formFilter.numberFilter(value)) {
          this.temInput = value;
        } else {
          if (value != "") {
            this.enterTimeArr[index].num = this.temInput;
          }
        }
      }, 0);
    },
  },
};
</script>
<style lang='scss' scoped>
.manage-main {
  padding: 30rpx 0 120rpx;
  overflow-y: auto;
}

.manage-btn-box {
  justify-content: center;
}

.manage-btn {
  width: 100%;
}
</style>