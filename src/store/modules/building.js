const store = {
  state: {
    materialList: [],
    choosedMaterial: [],
  },
  mutations: {
    getMaterialList: (state, list) => {
      state.materialList = list;
    },
    getChoosedMaterial: (state, list) => {
      state.choosedMaterial = list;
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