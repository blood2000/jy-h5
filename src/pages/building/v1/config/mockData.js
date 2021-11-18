const mockData = {
  buildingList: [{
      name: "磅房",
      num: 3,
      id: 0,
      list: [{
          name: '磅房1'
        },
        {
          name: '磅房2'
        },
        {
          name: '磅房3'
        },
      ],
    },
    {
      name: "仓库A区",
      num: 2,
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