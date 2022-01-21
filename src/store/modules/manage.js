const store = {
  state: {
    buildingList: [],    //场区列表
    choosedBuilding: [],   //当前已选场区
  },
  mutations: {
    getBuildingList: (state, list) => {
      state.buildingList = list;
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