const store = {
  state: {
    buildingList: [],    //场区列表
    choosedBuilding: [],   //当前已选场区
    isFresh: false,
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
    setFresh: (state, val) => {
      state.isFresh = val;
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