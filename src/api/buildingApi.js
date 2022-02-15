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

  // 管理端相关接口
  getStatistics: '/zjz1-jyz-service/rcyy/homePage/statistics',   //获取首页信息
  getDriverRecord: '/zjz1-jyz-service/rcyy//driverReservationRecord/getDriverReservationRecord',   //获取首页司机入场记录
  changeStatus: '/zjz1-jyz-service/rcyy/driverReservationRecord/reservationStatus',   //标记出入场
  disableDriverRecord: (id) => {
    return `/zjz1-jyz-service/rcyy/driverReservationRecord/disable/${id}`
  }, //废止出入场记录
  getScanDetail: '/rcyy/driverReservationRecord/getDriverReservationRecordDetails',   //微信扫码获取详情



  getThreshold: '/zjz1-jyz-service/rcyy/fieldThreshold/getCapacityVehicleThreshold',   //获取场区阈值
  setThreshold: '/zjz1-jyz-service/rcyy/fieldThreshold/insertOrUpdate',   //场区阈值设置
  getRules: '/zjz1-jyz-service/rcyy/subscribeRule/getSubscribeRules',   //获取预约规则
  getRuleDetail: '/zjz1-jyz-service/rcyy/subscribeRule/getSubscribeRulesDetails',   //获取预约规则详情
  setRules: '/zjz1-jyz-service/rcyy/subscribeRule/insert',   //创建预约规则
  putDisable: '/zjz1-jyz-service/rcyy/subscribeRule/disable',   //禁用\启用预约规则
  updateRules: '/zjz1-jyz-service/rcyy/subscribeRule/update',   //修改预约规则
  deleteRule: (id) => {
    return `/zjz1-jyz-service/rcyy/subscribeRule/del/${id}`
  },   //删除预约规则
  getDispatch: '/zjz1-jyz-service/rcyy/subscribeRuleVoucher/getReservationVoucher',   //获取派号信息
  setDispatch: '/zjz1-jyz-service/rcyy/subscribeRuleVoucher/reservationVoucherInsert',   //添加派号
  
  getCertifyRecord: '/zjz1-jyz-service/rcyy/subscribeRuleVoucher/getSubscribeRuleVouchers',   //获取预约凭证记录
  getTenantInfo: '/zjz1-jyz-service/rcyy/subscribeRuleVoucher/getTenantInfo',   //获取租户列表
  getBuildingInfo: '/zjz1-jyz-service/rcyy/subscribeRuleVoucher/getBuildingInfo',   //获取场区列表
  getGoodsInfo: '/zjz1-jyz-service/rcyy/subscribeRuleVoucher/getGoodsRelInfo',   //获取场区列表
  addCertify: '/zjz1-jyz-service/rcyy/subscribeRuleVoucher/insert',   //添加凭证
  disableCertify: (id) => {
    return `/zjz1-jyz-service/rcyy/subscribeRuleVoucher/disable/${id}`
  },   //禁用预约凭证
  deleteCertify: (id) => {
    return `/zjz1-jyz-service/rcyy/subscribeRuleVoucher/del/${id}`
  },   //删除预约凭证
  getCertifyDetail: '/zjz1-jyz-service/rcyy/subscribeRuleVoucher/getSubscribeRulesVoucherDetails',  //获取预约凭证详情
  adjust: '/zjz1-jyz-service/rcyy/subscribeRuleVoucher/adjustmentVoucher',  //调整车次(加号)
  share: '/zjz1-jyz-service/rcyy/subscribeRuleVoucher/buildQrCode',  //分享

  getTodayRecord: '/zjz1-jyz-service/rcyy/todaySubscribeRuleRecord/getTodaySubscribeRuleRecord',   //获取今日预约调号
  setTodayRecord: '/zjz1-jyz-service/rcyy/todaySubscribeRuleRecord/reservationNumberAdjustment',   //设置今日预约调号
  
  // 统计相关接口
  getStatisticsInfo: '/zjz1-jyz-service/rcyy/appointmentStatistics/getAppointmentStatistics',   //统计首页信息获取
}

export default apiUrl