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
  buildingTypes: [{
      name: '磅房',
      type: 0
    },
    {
      name: '仓储',
      type: 1
    },
    {
      name: '入口',
      type: 2
    },
    {
      name: '出口',
      type: 3
    },
  ],
  // 物料
  materialList: [{
      type: 0,
      name: '煤炭及其制品',
      num: 3,
      list: [{
          name: '精煤',
          type: '00',
          checked: true
        },
        {
          name: '原煤',
          type: '01',
          checked: true
        },
        {
          name: '无烟煤',
          type: '02',
          checked: false
        },
      ]
    },
    {
      type: 1,
      name: '石油天然气及制品',
      num: 3,
      list: [{
          name: '石油',
          type: '10',
          checked: true
        },
        {
          name: '天然气',
          type: '11',
          checked: false
        },
        {
          name: '水泥',
          type: '12',
          checked: false
        },
      ]
    },
    {
      type: 2,
      name: '冷藏冷冻货物',
      num: 1,
      list: [{
          name: '冻带鱼',
          type: '20',
          checked: true
        },
      
        
      ]
    },
    {
      type: 3,
      name: '鲜活农产品',
      num: 2,
      list: [{
          name: '大豆',
          type: '30',
          checked: true
        },
        {
          name: '玉米',
          type: '31',
          checked: true
        },
        
      ]
    }



  ],
}

export default mockData;