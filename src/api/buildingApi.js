const apiUrl = {
  getBuilding: '/zjz1-jyz-service/jyz-building/getBuilding',//获取集运站父类
  getSubBuilding: '/zjz1-jyz-service/jyz-building/sonBuilding',//获取集运站子类，地址栏传id
  addBuilding: '/zjz1-jyz-service/jyz-building/add',//添加场区分类
  insertSubBuilding: '/zjz1-jyz-service/jyz-building/insert',//添加场区
  getAddedGoods: '/zjz1-jyz-service/jyz-building/jyzGoods',//获取已添加到可选项的物料列表
  getMaterial: '/zjz1-jyz-service/jyz-building/bigGoods',//获取所有物料
  updateAddedGoods: '/zjz1-jyz-service/jyz-building/addJyzGoods',//更新可选项物料
  delAddedGoods: (id) => {
    return `/zjz1-jyz-service/jyz-building/delJyzGoods/${id}`
  },//删除可选项物料
  getBuildingInfo: (id) => {
    return `/zjz1-jyz-service/jyz-building/getById/${id}`
  }, //获取场区信息
  editBuilding: '/zjz1-jyz-service/jyz-building/updateStorage',//编辑场区分类
}

export default apiUrl