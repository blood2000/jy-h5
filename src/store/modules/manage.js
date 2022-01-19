const store = {
  state: {
    // materialList: [],    //可选的物料列表
    choosedBuilding: [],   //当前已选场区
  },
  mutations: {
    getMaterialList: (state, list) => {
      state.materialList = list;
    },
    getChoosedBuilding: (state, list) => {
      state.choosedBuilding = list;
    },
    deleteBuilding: (state, index) => {
      state.choosedBuilding.splice(index, 1);
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