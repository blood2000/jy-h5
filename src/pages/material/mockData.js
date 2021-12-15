const mockData = {
  buildingList: [{
      name: "煤炭及其制品",
      num: 3,
      id: 0,
      list: [{
          name: '原煤'
        },
        {
          name: '精煤'
        },
        {
          name: '无烟煤'
        },
      ],
    },
    {
      name: "试用天然气及制品",
      num: 12,
      id: 1,
      list: [{
          name: '仓库A区1'
        },
        {
          name: '仓库A区2'
        },
      ],
    },
    {
      name: "仓库B区",
      num: 1,
      id: 2,
      list: [{
        name: '仓库B区'
      }, ],
    },
    {
      name: "堆场A区",
      num: 1,
      id: 3
    },
    {
      name: "场区入口",
      num: 2,
      id: 4
    },
    {
      name: "场区出口",
      num: 2,
      id: 5
    },
  ],
  // 场区分类
  buildingTypes: [
    {name: '磅房', type: 0},
    {name: '仓储', type: 1},
    {name: '入口', type: 2},
    {name: '出口', type: 3},
  ],
  // 物料
  materialList: [
    {name: '精煤', type: 0, checked: true},
    {name: '原煤', type: 1, checked: true},
    {name: '石料', type: 2, checked: false},
    {name: '沥青', type: 3, checked: false},
  ],
}

export default mockData;