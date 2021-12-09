const store = {
  state: {
    materialList: [],    //可选的物料列表
    choosedMaterial: [],   //当前场区已选物料
  },
  mutations: {
    getMaterialList: (state, list) => {
      state.materialList = list;
    },
    getChoosedMaterial: (state, list) => {
      state.choosedMaterial = list;
    },
    deleteMaterial: (state, index) => {
      state.choosedMaterial.splice(index, 1);
    },
  },
  actions: {
    getMaterialListAction: ({
      commit
    }, val) => {
      commit('getMaterialList', val)
    },

  }
}

export default store