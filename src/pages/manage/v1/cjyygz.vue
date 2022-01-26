<!-- 创建/编辑预约规则 -->
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
      <div class="manage-box" v-if="effDate && invalidDate">
        <div class="manage-box-line" style="border-bottom: none">
          <div class="manage-title2">排除日期</div>
          <picker
            mode="date"
            :value="outDate"
            :start="effDate"
            :end="invalidDate"
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
            <div>{{ item.excludeDate }}</div>
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
        <div class="manage-box" v-if='!isEdit || !item.deleted'>
          <div class="manage-box-title">
            <div class="manage-box-title-item">
              <div class="manage-title2">入场时段 ({{ index * 1 + 1 }})</div>
              <div class="manage-subtitle">
                <div>
                  <uni-icons type="info" size="10"></uni-icons>请完善时段信息
                </div>
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
            <div class="manage-title2">
              放号量 <span class="require">*</span>
            </div>
            <div class="manage-input-box">
              <input
                class="manage-input"
                type="number"
                placeholder="请输入放号量"
                v-model="item.largesse"
              />
            </div>
          </div>
        </div>
      </block>
      <div class="add-time" @click="addTime">新增时段</div>
    </div>
    <div class="manage-btn-box">
      <div class="manage-btn" @click="submit">保存</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderBar from "../../../components/Building/HeaderBar.vue";
import buildingRequest from "../../../config/buildingRequest";
import formFilter from "../../../utils/filter";
import format from "../../../utils/format";
export default {
  data() {
    return {
      title: "创建预约规则",
      jyzCode: "",
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
      isEdit: false,
      editData: {
        code: "",
        id: "",
      },
    };
  },

  components: { HeaderBar },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
      isAndroid: (state) => state.header.isAndroid,
      isiOS: (state) => state.header.isiOS,
      statusBarHeight: (state) => state.header.statusBarHeight,
    }),
  },

  onLoad(option) {
    if (option.code) {
      this.editData.code = option.code;
      this.isEdit = true;
      this.getDetail();
    } else {
      this.isEdit = false;
    }
    this.jyzCode = uni.getStorageSync('jyzCode');
  },

  methods: {
    back() {
      uni.navigateBack({
        delta: 1,
      });
    },
    getDetail() {
      const config = {
        url: "getRuleDetail",
        header: this.headerInfo,
        querys: {
          code: this.editData.code,
        },
      };
      buildingRequest(config).then((res) => {
        console.log("获取规则详情", res);
        let resData = res.data;
        this.effDate = resData.effectiveDate;
        this.invalidDate = resData.expirationDate;
        this.ruleName = resData.ruleName;
        this.outDateArr = resData.ruleExcludeDates;
        this.enterTimeArr = resData.ruleAdmissionTimeIntervals;
        this.editData.id = resData.id;
        // this.editData.ruleAdmissionTimeIntervalUpdateBos = resData.ruleAdmissionTimeIntervals;
      });
    },
    //日期选择
    changeDate(e, type) {
      this[type] = e.detail.value;
      if (type === "outDate") {
        this.outDateArr.push({ excludeDate: e.detail.value });
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
        success: (res) => {
          if (res.confirm) {
            //编辑状态下删除的时段只存id传给后端
            let id =  this.enterTimeArr[index].id;
            if (this.isEdit && id) {
              this.$set(this.enterTimeArr, index, {id, deleted: true});
            } else {
              this.enterTimeArr.splice(index, 1);
            }
            
          }
        },
      });
    },

    addTime() {
      this.enterTimeArr.push({
        startTime: "",
        endTime: "",
        largesse: "",
      });
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

    formValid() {
      if (!this.ruleName) {
        uni.showToast({
          title: "请输入规则名称",
          icon: "none",
          duration: 1500,
        });
        return false;
      }
      if (!this.effDate) {
        uni.showToast({
          title: "请选择生效日期",
          icon: "none",
          duration: 1500,
        });
        return false;
      }
      if (!this.invalidDate) {
        uni.showToast({
          title: "请选择失效日期",
          icon: "none",
          duration: 1500,
        });
        return false;
      }
      if (this.enterTimeArr.length === 0) {
        uni.showToast({
          title: "请添加入场时段",
          icon: "none",
          duration: 1500,
        });
        return false;
      }
      let leap = true;
      for (let i = 0; i < this.enterTimeArr.length; i++) {
        leap = !(
          !this.enterTimeArr[i].startTime ||
          !this.enterTimeArr[i].endTime ||
          !this.enterTimeArr[i].largesse
        );
        leap = leap || this.enterTimeArr[i].deleted;
        if (!leap) {
          uni.showToast({
            title: "请完善入场时段",
            icon: "none",
            duration: 1500,
          });
          break;
        }
      }

      return leap;
    },

    submit() {
      if (!this.formValid()) return;

      let data = {
        jyzCode: this.jyzCode,
        ruleName: this.ruleName,
        effectiveDate: this.effDate,
        expirationDate: this.invalidDate,
        ruleExcludeDateBos: this.outDateArr,
      };
      let config = {};
      if (this.isEdit) {
        let enterArr = [];
        this.enterTimeArr.map(item => {
          if (item.deleted) {
            enterArr.push({id: item.id})
          } else {
            enterArr.push(item)
          }
        })
        data.ruleAdmissionTimeIntervalUpdateBos = enterArr;
        data.id = this.editData.id;
        data.code = this.editData.code;
        config = {
          url: "updateRules",
          method: "put",
          header: this.headerInfo,
          data: data,
        };
      } else {
        data.ruleAdmissionTimeIntervalInsertBos = this.enterTimeArr;
        config = {
          url: "setRules",
          method: "POST",
          header: this.headerInfo,
          data: data,
        };
      }
      console.log("添加规则参数", data);
      // return;
      buildingRequest(config).then((res) => {
        console.log("增加/修改预约规则请求", res);
        uni.showModal({
          title: "提示",
          content: res.msg,
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              //点击确认
              uni.navigateBack({
                delta: 1,
              });
            }
          },
        });
      });
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