<template>
  <view class="u-page">
    <HeaderBar :title="title" @back="navigateBack"></HeaderBar>

    <uni-forms
      :key="formsUpdate"
      ref="form"
      :rules="rules"
      :modelValue="form"
      label-width="120"
      err-show-type="toast"
    >
      <view class="ly-form-card">
        <uni-forms-item
          required
          name="name"
          label="计划名称"
          class="border-bottom"
        >
          <uni-easyinput
            type="text"
            :inputBorder="false"
            :clearable="false"
            v-model="form.name"
            placeholder="请输入计划名称"
          />
        </uni-forms-item>

        <uni-forms-item
          required
          name="effectiveDate"
          label-width="95"
          label="计划有效期"
        >
          <uni-datetime-picker
            :key="oldDatePicker1"
            ref="datepick"
            :disabled="form.isForever.length > 0"
            :border="false"
            v-model="form.effectiveDate"
            type="daterange"
            rangeSeparator="/"
            @change="handlerPick"
          />
          <!--  (arr)=> oldDatePicker = arr  -->
          <u-checkbox-group v-model="form.isForever" style="float: right">
            <u-checkbox
              size="14"
              label="长期有效"
              name=""
              labelSize="24upx"
            ></u-checkbox>
          </u-checkbox-group>
        </uni-forms-item>
      </view>

      <view class="ly-form-card">
        <uni-forms-item
          required
          name="transId"
          label="运输公司"
          class="border-bottom"
        >
          <pickers
            v-model="form.transId"
            :range="transIdOption"
            placeholder="请选择运输公司"
            @change="onChangeTransId"
          ></pickers>
        </uni-forms-item>

        <uni-forms-item
          required
          name="transId"
          v-if="currentItem && currentItem.type == 'chy'"
          label="装货预估时间间隔(分钟)"
          class="border-bottom forms-item-interval-time"
        >
          <view class="uni-form-item input-time" required>
            <input
              name="intervalStarTime"
              class="uni-input"
              v-model="form.intervalStarTime"
              type="number"
              placeholder="最小时间"
            />
            <span style="margin: 0 20upx">至</span>
            <input
              name="intervalEndTime"
              v-model="form.intervalEndTime"
              class="uni-input"
              type="number"
              placeholder="最大时间"
            />
            <span style="width: 140upx; margin-left: 20upx">分钟</span>
          </view>
        </uni-forms-item>

        <uni-forms-item required name="orderPlanTeanRelList" label="指定调度者">
          <view
            v-if="
              form.orderPlanTeanRelList && form.orderPlanTeanRelList.length > 0
            "
            style="width: 100%; flex-direction: row-reverse"
            class="ly-flex-align-center picker-input text-right"
            @click="teamListShow = true"
          >
            <u-icon
              name="arrow-down-fill"
              size="7"
              color="#999999"
              class="yangiwiss"
            ></u-icon>
            <view
              class="g-single-row"
              style="width: 360upx; line-height: 1.2"
              >{{
                form.orderPlanTeanRelList
                  .map((e) => e.name + (e.isTeamFreeze == 1 ? "(已禁用)" : ""))
                  .join(",")
              }}</view
            >
          </view>
          <view
            v-else
            style="width: 100%; flex-direction: row-reverse"
            class="ly-flex-align-center picker-placeholder text-right"
            @click="teamListShow = true"
          >
            <u-icon
              name="arrow-down-fill"
              size="7"
              color="#999999"
              class="yangiwiss"
            ></u-icon>
            请选择调度者
          </view>
        </uni-forms-item>
      </view>
      <view class="ly-form-card">
        <uni-forms-item
          required
          name="orderInfoId"
          label="货源"
          class="border-bottom"
        >
          <pickers
            v-model="form.orderInfoId"
            :range="orderInfoIdOption"
            placeholder="请选择货源"
          ></pickers>
        </uni-forms-item>

        <uni-forms-item required name="weight" label="货品总量">
          <view class="ly-flex-align-center">
            <NumberBox
              :max="15"
              @blur="() => (olDweightType = form.weight)"
              type="number"
              :disabled="form.weightType.length > 0"
              v-model="form.weight"
              placeholder="请输入货品总量"
            />

            <!-- height: 36px;
					display: flex;
					/* line-height: 36px; */
					align-items: center; -->
            <view style="height: 100%" class="ly-flex-align-center">
              <pickers
                v-model="form.unit"
                :disabled="true || form.weightType.length > 0"
                @change="handlerunit"
                :range="[
                  { dictLabel: '吨', dictValue: '1' },
                  { dictLabel: '车', dictValue: '2' },
                ]"
              >
                <view class="ly-flex-pack-end">
                  <view class="ly-flex ml10 g-color-gray picker-input">
                    {{
                      [
                        { dictLabel: "吨", dictValue: "1" },
                        { dictLabel: "车", dictValue: "2" },
                      ].find((e) => e.dictValue === form.unit).dictLabel
                    }}
                  </view>
                </view>
              </pickers>
            </view>
          </view>
          <u-checkbox-group
            v-model="form.weightType"
            style="float: right"
            v-if="form.unit === '1'"
          >
            <u-checkbox
              size="14"
              label="不限"
              name=""
              labelSize="24upx"
            ></u-checkbox>
          </u-checkbox-group>
        </uni-forms-item>
      </view>
      <view class="ly-form-card">
        <template v-if="form.type == 0">
          <uni-forms-item required label="收货企业">
            <uni-easyinput
              type="text"
              :inputBorder="false"
              disabled
              :clearable="false"
              v-model="transceiverAddress"
            />
          </uni-forms-item>
          <uni-forms-item
            required
            name="sedCompnayInfoId"
            label="发货企业"
            class="border-bottom"
          >
            <pickers
              v-model="form.sedCompnayInfoId"
              :range="sedCompnayInfoIdOption"
              placeholder="请选择发货企业"
              @change="(_data) => handlerChange(_data, 'sedCompnayList')"
            ></pickers>
          </uni-forms-item>
        </template>

        <template v-else>
          <uni-forms-item required name="recCompnayInfoId" label="收货企业">
            <pickers
              v-model="form.recCompnayInfoId"
              :range="recCompnayInfoIdOption"
              placeholder="请选择收货企业"
              @change="(_data) => handlerChange(_data, 'recCompnayList')"
            ></pickers>
          </uni-forms-item>
          <uni-forms-item required label="发货企业" class="border-bottom">
            <uni-easyinput
              type="text"
              :inputBorder="false"
              disabled
              :clearable="false"
              v-model="transceiverAddress"
            />
          </uni-forms-item>
        </template>

        <!-- 运输起点 -->
        <uni-forms-item
          required
          name="startAddressId"
          label="运输起点"
          class="border-bottom"
        >
          <pickers
            :disabled="!!cbData"
            v-model="form.startAddressId"
            :range="shfuewnsdnsddssOption"
            placeholder="请输入运输起点"
            @change="handlerstartAddressId"
          ></pickers>
        </uni-forms-item>

        <uni-forms-item
          :required="false"
          name="startAddressWlId"
          label="接单电子围栏"
          v-if="form.startAddressId"
          class="border-bottom"
        >
          <pickers
            close
            v-model="form.startAddressWlId"
            :range="startAddressIdOption"
            placeholder="请选择接单电子围栏"
          ></pickers>
        </uni-forms-item>

        <!--  -->
        <uni-forms-item required name="aliasName" label="运输起点别名">
          <uni-easyinput
            :maxlength="30"
            type="text"
            :inputBorder="false"
            :clearable="false"
            v-model="form.aliasName"
            placeholder="请输入运输起点别名"
          />
        </uni-forms-item>
      </view>
      <view class="ly-form-card">
        <!-- 运输终点 -->
        <uni-forms-item required name="endAddressId" label="运输终点">
          <!-- <uni-easyinput type="text" :inputBorder="false" :clearable="false" v-model="form.endplace"
						placeholder="请输入运输终点别名" /> -->
          <pickers
            :disabled="!!cbData"
            v-model="form.endAddressId"
            :range="shfuewnsdnsddssOption"
            placeholder="请输入运输终点"
            @change="handlerendAddressId"
          ></pickers>
        </uni-forms-item>

        <template v-if="form.endAddressId">
          <!-- <u-alert v-if='form.type == 0' type="error" :description="description" fontSize='1'></u-alert> -->

          <uni-forms-item
            :required="false"
            name="endAddressWlId"
            label="卸货电子围栏"
          >
            <pickers
              close
              v-model="form.endAddressWlId"
              :range="endAddressIdOption"
              placeholder="请选择卸货电子围栏"
            ></pickers>
          </uni-forms-item>
        </template>

        <uni-forms-item required name="unAliasName" label="运输终点别名">
          <uni-easyinput
            :maxlength="30"
            type="text"
            :inputBorder="false"
            :clearable="false"
            v-model="form.unAliasName"
            placeholder="请输入运输终点别名"
          />
        </uni-forms-item>
      </view>
      <view class="ly-form-card">
        <uni-forms-item
          required
          name="orderPolicyId"
          label="运输定价策略"
          class="border-bottom"
        >
          <pickers
            v-model="form.orderPolicyId"
            :range="orderPolicyInfoOption"
            placeholder="请选择运输定价策略"
          ></pickers>
        </uni-forms-item>
        <uni-forms-item
          required
          name="goodsPolicyId"
          label="货品定价策略"
          class="border-bottom"
        >
          <pickers
            v-model="form.goodsPolicyId"
            :range="goodsPolicyIdOption"
            placeholder="请选择货品定价策略"
          ></pickers>
        </uni-forms-item>
        <uni-forms-item required name="planFreightId" label="实重计算公式">
          <pickers
            v-model="form.planFreightId"
            :range="planFreightIdOption"
            placeholder="请选择实重计算公式"
          ></pickers>
        </uni-forms-item>
      </view>
      <view class="ly-form-card form-whetherFixed-card">
        <uni-forms-item name="whetherFixed" label="" class="border-bottom">
          <u-checkbox-group
            v-model="whetherFixed"
            @change="onChangeWhetherFixed"
          >
            <u-checkbox
              size="14"
              label="固定皮重"
              name=""
              labelSize="24upx"
            ></u-checkbox>
          </u-checkbox-group>
        </uni-forms-item>
      </view>
    </uni-forms>
    <view
      class="ly-form-button ly-flex ly-flex-pack-justify ly-flex-align-center"
    >
      <view class="reset" @click="handleCancle('form')">{{
        id ? "取消" : "重置"
      }}</view>
      <view class="submit" @click="handleSubmit('form')">{{
        id ? "确认修改" : "确认创建"
      }}</view>
    </view>

    <TeamList
      ref="teamListRef"
      :show="teamListShow"
      :teamCodes="teamCodes"
      :isFilter="true"
      @close="teamListShow = false"
      @changeTeamCodes="changeTeamCodes"
    />
  </view>
</template>

<script>
import HeaderBar from "@/components/Building/HeaderBar2.vue";
import {
  listInfo,
  orderInfoList,
  tenantCompanyInfoList,
  getDispatcherTeam,
  tenantCompanyAddressInfoList,
  tenantGoodsPolicyInfo,
  getEffectiveGoodsList as goodspriceList,
  orderPlanFreightList,
  orderPlanInfoAdd,
  orderPlanInfoUpdate,
  orderPlanInfoDetatil,
} from "@/config/service/transportPlan/transportationPlan.js";

import NumberBox from "@/components/number-box/number-box";
import TeamList from "@/pages/capacity/components/teamList.vue";

import jsfunPicker from "@/components/jsfun-picker/jsfun-picker.vue";
import pickers from "./components/picker.vue";
import { mapState } from "vuex";

import { removePropertyOfNull } from "@/utils/ddc";

export default {
  components: {
    pickers,
    jsfunPicker,
    TeamList,
    HeaderBar,
    NumberBox,
  },
  data() {
    return {
      teamList: [],
      teamListShow: false,
      teamCodes: [],
      description: "收货企业为本集运站，自动采用地磅称重数据作为卸货凭证",

      whetherFixed: [],
      form: {
        name: undefined,
        effectiveDate: [], // 转成 开始时间 和 结束时间
        isForever: [], // 转成 数字值 有长度为true
        transId: undefined,
        orderInfoId: undefined,
        unit: "1",
        weight: undefined,
        weightType: [], // 有长度为true
        startAddressId: undefined,
        aliasName: undefined,
        endAddressId: undefined,
        sedCompnayInfoId: undefined,
        recCompnayInfoId: undefined,
        startAddressWlId: undefined,
        endAddressWlId: undefined,
        unAliasName: undefined,
        orderPlanTeanRelList: [],
        teamCodes: undefined, // 测试单选 调度者
        orderPolicyId: undefined,
        goodsPolicyId: undefined,
        planFreightId: undefined,
        receiveType: this.sOr,
        status: "0",
        type: 0,
        whetherFixed: 0,
        intervalStarTime: "",
        intervalEndTime: "",
        // teamsfiwjfwsfdsOption:[], // 指定调度者
      },
      currentItem: {},

      rules: {
        name: {
          rules: [{ required: true, errorMessage: "请输入计划名称" }],
        },
        effectiveDate: {
          rules: [
            { type: "array", required: true, errorMessage: "请输入计划有效期" },
          ],
        },
        transId: {
          rules: [{ required: true, errorMessage: "请选择运输公司" }],
        },
        intervalStarTime: {
          rules: [
            {
              required: false,
              errorMessage: "请输入装货预估最小时间",
            },
          ],
        },
        intervalEndTime: {
          rules: [
            {
              required: false,
              errorMessage: "请输入装货预估最大时间",
            },
          ],
        },
        orderPlanTeanRelList: {
          rules: [
            { type: "array", required: true, errorMessage: "请输入指定调度者" },
          ],
        },

        orderInfoId: {
          rules: [{ required: true, errorMessage: "请选择货源" }],
        },
        weight: {
          rules: [{ required: true, errorMessage: "请输入货品总量" }],
        },

        sedCompnayInfoId: {
          rules: [{ required: true, errorMessage: "请选择发货企业" }],
        },

        recCompnayInfoId: {
          rules: [{ required: true, errorMessage: "请选择收货企业" }],
        },

        startAddressId: {
          rules: [{ required: true, errorMessage: "请选择运输起点" }],
        },
        startAddressWlId: {
          rules: [{ required: false, errorMessage: "请选择接单电子围栏" }],
        },

        aliasName: {
          rules: [
            { required: true, errorMessage: "请输入运输起点别名" },
            {
              minLength: 1,
              maxLength: 30,
              errorMessage:
                "请输入运输起点别名 {minLength} 到 {maxLength} 个字符",
            },
          ],
        },

        endAddressId: {
          rules: [{ required: true, errorMessage: "请选择运输终点" }],
        },

        endAddressWlId: {
          rules: [{ required: false, errorMessage: "请选择卸货电子围栏" }],
        },

        unAliasName: {
          rules: [
            { required: true, errorMessage: "请输入运输终点别名" },
            {
              minLength: 1,
              maxLength: 30,
              errorMessage:
                "请输入运输终点别名 {minLength} 到 {maxLength} 个字符",
            },
          ],
        },

        orderPolicyId: {
          rules: [{ required: true, errorMessage: "请选择运输定价策略" }],
        },
        goodsPolicyId: {
          rules: [{ required: true, errorMessage: "请选择货品定价策略" }],
        },
        planFreightId: {
          rules: [{ required: true, errorMessage: "请选择实重计算公式" }],
        }
      },
      // s= 其他数据
      oldDatePicker: [],
      formsUpdate: Date.now(),
      oldDatePicker1: Date.now(), // 改变key值重新渲染
      olDweightType: undefined,
      // e=
      cbData: null,
      transceiverAddress: "",
      // 字典值
      transIdOption: [],
      orderInfoIdOption: [],
      recCompnayInfoIdOption: [],
      sedCompnayInfoIdOption: [],

      recCompnayList: [],
      sedCompnayList: [],

      shfuewnsdnsddssOption: [],
      startAddressIdOption: [],
      endAddressIdOption: [],

      orderPolicyInfoOption: [], // 运价策略
      goodsPolicyIdOption: [], // 货价策略
      planFreightIdOption: [], // 计算公式

      id: "",
    };
  },

  watch: {
    "form.isForever": {
      handler(val, oval) {
        if (val === oval) return;
        if (!(val && Array.isArray(val))) return;
        if (val.length > 0) {
          this.$refs.datepick.clear();
          this.$set(this.rules.effectiveDate.rules[0], "required", false);
          // 要去掉验证
        } else {
          this.$set(this.form, "effectiveDate", this.oldDatePicker);
          this.$set(this.rules.effectiveDate.rules[0], "required", true);
          this.oldDatePicker1 = Date.now();
        }
      },
      deep: true,
    },
    "form.weightType": {
      handler(val) {
        if (!(val && Array.isArray(val))) return;

        if (val.length > 0) {
          this.$set(this.form, "weight", undefined);
          this.$set(this.rules.weight, "rules", [
            { required: false, errorMessage: "请输入货品总量" },
          ]);
        } else {
          this.$set(this.form, "weight", this.olDweightType);
          this.$set(this.rules.weight, "rules", [
            { required: true, errorMessage: "请输入货品总量" },
          ]);
        }
      },
      deep: true,
    },
  },

  computed: {
    ...mapState({
      headerInfo: (state) => state.header.headerInfo,
    }),
    title() {
      let text = "";
      if (this.id) {
        text = this.form.type == 0 ? "编辑收货计划" : "编辑发货计划";
      } else {
        text = this.form.type == 0 ? "创建收货计划" : "创建发货计划";
      }
      return text;
    },
  },
  async onLoad(options) {
    this.id = options.id;
    uni.showLoading({
      title: "加载中",
      mask: true,
    });
    this.form.type = options.type - 0;
    await this.gettransId();
    await this.getorderInfoIdOption();

    await this.getOrderPlanTeanRelList();
    await this.getshfuewnsdnsddssOption();
    await this.getorderPolicyInfoOption();
    await this.getgoodsPolicyIdOption();
    await this.getplanFreightIdOption();

    this.$set(this.rules.recCompnayInfoId, "rules", [
      { required: this.form.type == 0, errorMessage: "请选择发货企业" },
    ]);
    this.$set(this.rules.sedCompnayInfoId, "rules", [
      { required: this.form.type == 1, errorMessage: "请选择收货企业" },
    ]);
    // this.$set(this.rules.endAddressWlId,'rules', [
    // 	{ required: this.form.type == 1, errorMessage: '请选择卸货电子围栏' }
    // ])

    if (options.id) {
      const { data } = await orderPlanInfoDetatil(options.id, this.headerInfo);
      this.cbData = data;

      this.handlerstartAddressId(this.cbData.startAddressId);
      this.handlerendAddressId(this.cbData.endAddressId);

      if (this.cbData.isForever == 0) {
        this.oldDatePicker = [
          this.cbData.effectiveDateStart,
          this.cbData.effectiveDateEnd,
        ];
      }
      this.olDweightType = this.cbData.weight;

      this.teamCodes = this.cbData.teamCodeList?.map((e) => e.objCode) || [];
      this.changeTeamCodes(this.teamCodes);
      this.whetherFixed = this.cbData.whetherFixed === 1 ? [""] : [];
      this.form = {
        ...this.form,
        ...this.cbData,
        status: this.cbData.status + "",
        effectiveDate: this.oldDatePicker,
        isForever: this.cbData.isForever === 1 ? [""] : [],
        weightType: this.cbData.weightType === 1 ? [""] : [],
        unit: this.cbData.unit === 1 ? "1" : "2", // todo
      };
      if (this.form.transId) {
        this.currentItem = this.transIdOption.find((item) => {
          return item.dictValue === this.form.transId;
        });
        if (this.currentItem.type === "chy") {
          this.$set(this.rules.intervalStarTime.rules[0], "required", true);
          this.$set(this.rules.intervalEndTime.rules[0], "required", true);
        } else {
          delete this.form.intervalStarTime;
          delete this.form.intervalEndTime;
          this.$set(this.rules.intervalStarTime.rules[0], "required", false);
          this.$set(this.rules.intervalEndTime.rules[0], "required", false);
        }
      }
      this.formsUpdate = Date.now();
    }

    await this.getTransceiverAddress();

    uni.hideLoading();
  },

  methods: {
    // 获取运输公司
    async gettransId() {
      const que = {
        delFlag: 0,
      };
      if (this.cbData) {
        delete que.delFlag;
      }

      const _data = (await listInfo(que, this.headerInfo)).list;
      this.transIdOption =
        _data?.map((e) => {
          return {
            dictLabel: e.transName,
            dictValue: e.id,
            disable: e.delFlag !== "0",
            type: e.type,
          };
        }) || [];
      // console.log('获取运输公司: ',JSON.stringify(this.transIdOption));
    },
    // 获取货源列表
    async getorderInfoIdOption(queData) {
      const que = {
        pageNum: queData?.page || 1,
        pageSize: 1000,
        status: 0,
      };
      if (this.id) {
        delete que.status;
      }

      const _data = (await orderInfoList(que, this.headerInfo)).data.list;
      this.orderInfoIdOption =
        _data?.map((e) => {
          return {
            dictLabel: e.orderName,
            dictValue: e.id,
            disable: e.status !== 0,
          };
        }) || [];
    },
    // 获取收发企业
    async getTransceiverAddress() {
      if (this.form.type == 1) {
        return this.getrecCompnayInfoIdOption();
      } else {
        return this.getsedCompnayInfoIdOption();
      }
    },
    // 获取收货企业
    async getrecCompnayInfoIdOption(queData) {
      const que = {
        pageNum: queData?.page || 1,
        pageSize: 1000,
        status: 0,
      };
      if (this.id) {
        delete que.status;
      }

      const _data = (await tenantCompanyInfoList(que, this.headerInfo)).data
        .list;

      this.recCompnayList = _data;

      this.recCompnayInfoIdOption =
        _data?.map((e) => {
          if (e.isCurrent === 1) {
            this.form.sedCompnayInfoId = e.id;
            this.transceiverAddress = e.companyName;

            if (!this.id) {
              this.$set(this.form, "aliasName", e.companyAbbreviation);
            }
          }
          return {
            dictLabel: e.companyAbbreviation || e.companyName,
            dictValue: e.id,
            disable: e.status !== 0,
          };
        }) || [];
    },

    // 获取发货企业
    async getsedCompnayInfoIdOption(queData) {
      const que = {
        pageNum: queData?.page || 1,
        pageSize: 1000,
        status: 0,
      };
      if (this.id) {
        delete que.status;
      }

      const _data = (await tenantCompanyInfoList(que, this.headerInfo)).data
        .list;

      this.sedCompnayList = _data;

      this.sedCompnayInfoIdOption =
        _data?.map((e) => {
          if (e.isCurrent === 1) {
            this.form.recCompnayInfoId = e.id;
            this.transceiverAddress = e.companyName;

            if (!this.id) {
              this.$set(this.form, "unAliasName", e.companyAbbreviation);
            }
          }

          return {
            dictLabel: e.companyAbbreviation || e.companyName,
            dictValue: e.id,
            disable: e.status !== 0,
          };
        }) || [];
    },

    // 调度者
    async getOrderPlanTeanRelList(queData) {
      const que = {
        pageNum: 1,
        pageSize: 1000,
      };
      const _data = (await getDispatcherTeam(que, this.headerInfo)).list;

      this.teamList =
        _data?.map((e) => {
          return {
            ...e,
            dictLabel: e.name,
            dictValue: e.id,
          };
        }) || [];
      // console.log('调度者:',this.teamList );
    },

    // 获取运输起点
    async getshfuewnsdnsddssOption(queData) {
      const que = {
        pageNum: queData?.page || 1,
        pageSize: 1000,
        status: 0,
      };
      if (this.id) {
        delete que.status;
      }

      const _data = (await tenantCompanyAddressInfoList(que, this.headerInfo))
        .data.list;

      this.shfuewnsdnsddssOption =
        _data?.map((e) => {
          return {
            ...e,
            dictLabel: e.companyAddrName,
            dictValue: e.id,
            disable: e.status !== 0,
          };
        }) || [];
    },

    // 处理地址下面的电子围栏数据
    handlerstartAddressId(m_id) {
      this.form.startAddressWlId = undefined;
      const m_findData = this.shfuewnsdnsddssOption.find((e) => e.id === m_id);

      if (m_findData) {
        this.startAddressIdOption =
          m_findData.zjFenceList?.map((e) => {
            return {
              dictLabel: e.name,
              dictValue: e.id,
              disable: e.status !== 0,
            };
          }) || [];
      }
    },
    // 处理地址下面的电子围栏数据
    handlerendAddressId(m_id) {
      this.form.endAddressWlId = undefined;
      const m_findData = this.shfuewnsdnsddssOption.find((e) => e.id === m_id);
      if (m_findData) {
        this.endAddressIdOption =
          m_findData.zjFenceList?.map((e) => {
            return {
              dictLabel: e.name,
              dictValue: e.id,
              disable: e.status !== 0,
            };
          }) || [];
      }
    },

    // 获取运价策略
    async getorderPolicyInfoOption(queData) {
      const que = {
        pageNum: queData?.page || 1,
        pageSize: 1000,
        policyType: this.form.unit === "1" ? 1 : 2,
      };

      const _data = (await tenantGoodsPolicyInfo(que, this.headerInfo)).data;

      this.orderPolicyInfoOption =
        _data?.map((e) => {
          return {
            dictLabel: e.name,
            dictValue: e.id,
          };
        }) || [];
    },

    // 获取运价策略
    async getgoodsPolicyIdOption(queData) {
      const que = {
        pageNum: queData?.page || 1,
        pageSize: 1000,
      };

      const _data = (await goodspriceList(que, this.headerInfo)).data;

      this.goodsPolicyIdOption =
        _data?.map((e) => {
          return {
            dictLabel: e.name,
            dictValue: e.id,
          };
        }) || [];
    },

    // 获取计算公式
    async getplanFreightIdOption(queData) {
      const que = {
        pageNum: queData?.page || 1,
        pageSize: 1000,
      };

      const _data = (await orderPlanFreightList(que, this.headerInfo)).data
        .list;
      this.planFreightIdOption =
        _data?.map((e) => {
          return {
            dictLabel: e.name,
            dictValue: e.id,
          };
        }) || [];
    },

    // e= 初始数据结束

    // 选择单位
    handlerunit(_uit) {
      this.getorderPolicyInfoOption();
    },

    // s=其他

    // 更改选中的调度者
    changeTeamCodes(data) {
      const cb = this.cbData ? this.cbData.teamCodeList : null;
      this.form.orderPlanTeanRelList = [];
      this.teamCodes = data;

      // 编辑要添加调度者id
      if (cb) {
        const newArr =
          this.teamCodes?.map((e) => {
            for (let i = 0; i < cb.length; i++) {
              const ee = cb[i];
              if (ee.objCode === e) {
                return ee;
              }
            }
            return {
              objCode: e,
            };
          }) || [];

        this.teamList.forEach((e) => {
          for (let i = 0; i < newArr.length; i++) {
            const ee = newArr[i];
            if (ee.objCode === e.code) {
              this.form.orderPlanTeanRelList.push({
                ...ee,
                id: ee.id,
                objCode: ee.objCode,
                isDel: 0,
                type: 1,
                name: e.name,
                isTeamFreeze: e.isTeamFreeze,
              });
              return;
            }
          }
        });
      } else {
        this.teamList.forEach((e) => {
          for (let i = 0; i < this.teamCodes.length; i++) {
            const ee = this.teamCodes[i];
            if (ee === e.code) {
              this.form.orderPlanTeanRelList.push({
                objCode: ee,
                isDel: 0,
                type: 1,
                name: e.name,
              });
              return;
            }
          }
        });
      }
      // console.log('更改选中的调度者', this.form.orderPlanTeanRelList);
    },

    // 时间控件
    handlerPick(arr) {
      if (arr[0] && arr[1]) {
        if (arr[0] === arr[1]) {
          // 日期加一天
          const time1 = new Date(arr[1]).getTime() + 1000 * 60 * 60 * 24;

          setTimeout(() => {
            this.$set(this.form, "effectiveDate", [
              arr[0],
              this.parseTime(time1, "{y}-{m}-{d}"),
            ]);
            this.oldDatePicker1 = Date.now();
          }, 100);

          return;
        } else {
          this.oldDatePicker = arr;
        }
      }
    },

    navigateBack() {
      // 跳回当前h5页面
      uni.navigateBack();
    },

    // 取消 (重置)
    handleCancle(formName) {
      if (this.cbData) {
        uni.navigateBack();
        return;
      }

      this.oldDatePicker = [];
      this.olDweightType = undefined;
      (this.form = {
        ...this.form,
        name: undefined,
        effectiveDate: [], // 转成 开始时间 和 结束时间
        isForever: [], // 转成 数字值 有长度为true
        // transId: undefined,
        // orderInfoId: undefined,
        weight: undefined,
        weightType: [], // 有长度为true
        // startAddressId: undefined,
        // aliasName: undefined,
        // endAddressId: undefined,
        // sedCompnayInfoId: undefined,
        // recCompnayInfoId: undefined,
        startAddressWlId: undefined,
        endAddressWlId: undefined,
        // unAliasName: undefined,
        // orderPlanTeanRelList: [],
        teamCodes: undefined, // 测试单选 调度者
        // orderPolicyId: undefined,
        // goodsPolicyId: undefined,
        // planFreightId: undefined,
      }),
        (this.formsUpdate = Date.now());
      this.oldDatePicker1 = Date.now();
    },
    // 确认创建
    handleSubmit(formName) {
      console.log(this.form);

      // 手动验证空值
      if (!this.noValidate()) return;

      // s= 判断一下电子围栏是否重复
      if (
        this.form.startAddressId === this.form.endAddressId &&
        this.form.startAddressWlId === this.form.endAddressWlId
      ) {
        uni.showToast({
          title: "接单电子围栏 和 卸货电子围栏 不能相同",
          icon: "none",
        });
        return;
      }
      // e=

      this.$refs[formName]
        .validate()
        .then((res) => {
          if (
            parseFloat(this.form.intervalEndTime) <=
            parseFloat(this.form.intervalStarTime)
          ) {
            uni.showToast({
              title: "装货预估时间间隔最小时间要小于最大时间",
              icon: "none",
            });
            return;
          }
          const que = {
            ...this.form,
            effectiveDateStart: this.form.effectiveDate
              ? this.form.effectiveDate[0]
              : undefined,
            effectiveDateEnd: this.form.effectiveDate
              ? this.form.effectiveDate[1]
              : undefined,
            effectiveDate: undefined,

            isForever: this.form.isForever.length > 0 ? 1 : 0,
            weightType: this.form.weightType.length > 0 ? 1 : 2,
            orderPlanTeanRelList:
              this.form.orderPlanTeanRelList?.map((e) => {
                delete e.name;
                return e;
              }) || [],
            // [
            // 	{objCode: "517a12b2f4db4270866d2132bd878cef", isDel: 0, type: 1}
            // ], // 调度者
            teamCodes: undefined,
            teamCodeList: undefined,
            unit: this.form.unit === "1" ? 1 : 2, // 单位不用
            status: this.form.status - 0, // 默认: 0
            receiveType: this.form.type - 0 + 1, // 1发 2收
            type: undefined,
          };

          this.onSubmit(removePropertyOfNull(que));
        })
        .catch((err) => {
          return false;
        });
    },

    // s= 新增/编辑
    async onSubmit(data) {
      const isEdit = !!data.id; // true 为编辑
      uni.showLoading({
        mask: true,
      });
      const que = {
        ...data,
      };

      if (isEdit) {
        await orderPlanInfoUpdate(que, this.headerInfo);
      } else {
        await orderPlanInfoAdd(que, this.headerInfo);
      }

      uni.hideLoading();
      uni.showToast({
        title: `${isEdit ? "修改" : "新增"}成功`,
        icon: "none",
      });

      setTimeout(() => {
        uni.redirectTo({
          url: "/pages/transportPlan/index?id=ejwfw",
        });
        this.cbData = null;
      }, 700);
    },

    // 手动验证空
    noValidate(formName = "form", rulesName = "rules") {
      for (const key in this[rulesName]) {
        if (Object.hasOwnProperty.call(this[rulesName], key)) {
          const rule = this[rulesName][key];
          for (let index = 0; index < rule.rules.length; index++) {
            const r = rule.rules[index];

            console.log(r);
            if (r.required) {
              if (r.type === "array" && this[formName][key].length <= 0) {
                uni.showToast({
                  title: r.errorMessage,
                  icon: "none",
                });
                return false;
              }

              // 去掉空格
              if (
                !this[formName][key] &&
                typeof this[formName][key] !== "boolean" &&
                this[formName][key] !== 0
              ) {
                // console.log(r, '验证不通过 返回false');
                uni.showToast({
                  title: r.errorMessage,
                  icon: "none",
                });
                return false;
              }
            }
          }
        }
      }

      return true;
    },

    // s=
    // 选中企业后, 填自动填到起点别名上
    handlerChange(_data, name) {
      const res = this[name].find((e) => e.id === _data) || {};

      if (name === "recCompnayList") {
        this.$set(this.form, "unAliasName", res.companyAbbreviation);
      } else {
        this.$set(this.form, "aliasName", res.companyAbbreviation);
      }
    },

    //
    onChangeWhetherFixed(data) {
      this.$set(this.form, "whetherFixed", data.length === 1 ? 1 : 0);
    },
    onChangeTransId(data) {
      console.log(data);
      const currentItem = this.transIdOption.find((item) => {
        return item.dictValue === data;
      });
      this.currentItem = currentItem;
      if (currentItem.type === "chy") {
        this.$set(this.rules.intervalStarTime.rules[0], "required", true);
        this.$set(this.rules.intervalEndTime.rules[0], "required", true);
        this.$set(this.form, "intervalStarTime", "");
        this.$set(this.form, "intervalEndTime", "");
      } else {
        delete this.form.intervalStarTime;
        delete this.form.intervalEndTime;
        this.$set(this.rules.intervalStarTime.rules[0], "required", false);
        this.$set(this.rules.intervalEndTime.rules[0], "required", false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.u-page {
  padding-bottom: 128upx;
}
.uni-forms-item {
  overflow: hidden;
}
.ml10 {
  margin-left: 10px;
}

.g-color-gray {
  color: #999999;
}
.yangiwiss {
  margin-left: 13upx;
}
.form-whetherFixed-card {
  /deep/ .uni-forms-item__inner {
    padding: 0 !important;
  }
  /deep/ .uni-forms-item__content {
    display: flex;
    align-items: center;
  }
  /deep/ .u-checkbox__icon-wrap {
    font-weight: 700;
  }
}
/deep/ .uni-date__x-input {
  .uni-input-input {
    text-align: left;
  }
}
/deep/ .uni-date-editor--x {
  .uni-date__icon-clear {
    right: -20upx;
    top: 4upx;
  }
}
.input-time {
  display: flex;
  justify-content: space-between;
}
.forms-item-interval-time {
  .input-time {
    align-items: center;
    font-size: 28upx;
  }
  /deep/ .uni-forms-item__content {
    display: flex;
    align-items: center;
  }
}
</style>
