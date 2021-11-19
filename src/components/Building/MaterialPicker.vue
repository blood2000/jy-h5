<!-- 物料选择 -->
<template>
  <div class="building-input-box">
    <div class="building-modal" v-show="showModal" @click="close">
      <div class="building-modal-box">
        <div class="building-modal-box-title">选择物料</div>
        <div class="building-modal-box-content">
          <div class="modal-list-item" v-for="(item, index) in renderList" :key="index" @click.stop="chooseItem(item)">
            <div class="modal-list-item-left"> {{item.name}} </div>
            <div class="modal-list-item-right">
              <div class="as-checkbox">
                <uni-icons v-show="item.checked" type="checkmarkempty" size="16" color="#3A65FF"></uni-icons>
              </div>
            </div>
          </div>
          <div class="modal-btn-box">
            <div class="as-btn cancel" @click.stop="cancel">取消</div>
            <div class="as-btn" @click.stop="confirm">确定</div>
          </div>
        </div>

      </div>
    </div>
    <div class="building-input-item">
      <div class="building-title1">请选择存储的物料</div>
      <div class="placeholder" @click="chooseMaterial">
        请选择
        <uni-icons type="forward" size="14"></uni-icons>
      </div>
    </div>
    <!-- 显示框 -->
    <div class="building-input-content">
      <div class="building-input-content-item" v-for="(item, index) in choosedList" :key="index"> 
        {{item.name}} 
        <span class="building-input-delete" @click="deleteItem(index)">
          <uni-icons type="clear" color="red" size="14"></uni-icons>
        </span>
      </div>
      
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      renderList: [],  //渲染多选列表数据
      choosedList: [],  //已选中的数据
    };
  },

  props: {
    materialList: {
      type: Array,
      required: true,
    },
  },

  mounted() {
    this.initList();
    console.log(this.materialList);
  },
  

  methods: {
    initList() {
      this.renderList = JSON.parse(JSON.stringify(this.materialList));
      this.getChoosedList();
    
    },
    chooseMaterial() {
      this.showModal = true;
    },
    close() {
      this.showModal = false;
    },

    chooseItem(item) {
      if (item.checked) {
        this.$set(item,'checked',false)
      } else {
        this.$set(item,'checked',true)
      }
      
    },
    //获取已选物料列表
    getChoosedList() {
      let choosedList = [];
      this.renderList.map(item => {
        if (item.checked) {
          choosedList.push(item)
        }
      })
      this.choosedList = choosedList;
    },

    cancel() {
      this.initList();
      this.close();
    },

    confirm() {
      this.getChoosedList();
      this.$emit('changeMaterialList', JSON.stringify(this.renderList));
      this.close();
    },

    // 删除已选物料
    deleteItem(index) {
      this.renderList.map(item => {
        if (this.choosedList[index].type === item.type) {
          this.$set(item, 'checked', false);
        }
      })
      this.$emit('changeMaterialList', JSON.stringify(this.renderList));
      this.choosedList.splice(index, 1);
    },
  },
};
</script>
<style lang='scss' scoped>
.modal-list-item {
  position: relative;
  height: 60rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-left {
    font-size: 28rpx;
    color: #333;
  }
}

.modal-list-item::after {
  position: absolute;
  content: '';
  width: 100%;
  height: 1px;
  left: 0;
  bottom: 0;
  background-image: linear-gradient(to bottom, #999, transparent);
  transform: scaleY(.5);
}

// .modal-list-item:last-child::after {
//   height: 0;
// }

.as-checkbox {
  width: 30rpx;
  height: 30rpx;
  text-align: center;
  line-height: 30rpx;
  border: 1rpx solid #ddd;
}

.modal-btn-box {
  box-sizing: border-box;
  margin-top: 20rpx;
  height: 80rpx;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20rpx;
  .as-btn {
    width: 45%;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    background: #3A65FF;
    color: #fff;
    border-radius: 10rpx;
  }
  .cancel {
    border: 1rpx solid #ddd;
    background: #f5f5f5;
    color: #333;
  }
}
</style>