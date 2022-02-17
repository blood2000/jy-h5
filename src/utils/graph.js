let baseOption = {
  color: ['#ffc585','#86d99a', '#6779ec'],
  tooltip: {
    trigger: 'axis',
    axisPointer: { // 坐 标轴指示器，坐标轴触发有效
      type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      shadowStyle: {
        color: "rgba(231,243,252,0)"
      },
    },
    textStyle: {
      align: 'left'
    }
  },
  legend: {
    data: [],
    icon: "rect",
    formatter: null,
    right: 5,
    top: 10
  },
  grid: {
    top: "50px",
    left: "40px",
    right: "8%",
    bottom: "30px",
  },
  xAxis: {
    type: "category",
    // name: '日期',
    // nameLocation: 'start',
    data: [],
    axisLabel: {
      formatter: '{value} ',
      interval: 2,
      rotate: -30,
      fontSize: 9,
      color: '#999'
    },
    axisLine: {
      lineStyle: {
        color: '#ddd'
      },
    },
    axisTick: {
      inside: true
    }
  },
  yAxis: {
    type: "value",
    name: "",
    nameTextStyle: {
      fontSize: 10
    },
    splitLine: {
      show: false,
    },
    axisLine: {
      lineStyle: {
        color: '#ddd'
      }
    },
    axisLabel: {
      
      color: '#999'
    },
    axisTick: {
      show: false
    },
    minInterval: 1   //分割刻度显示成整数
  },
  series: [{
      name: "已预约",
      data: [],
      type: "line",
      smooth: true,
      symbol: 'none',
      lineStyle: {
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowBlur: 5
      }
    },
    {
      data: [],
      name: "已入场",
      type: "line",
      smooth: true,
      symbol: 'none',
      lineStyle: {
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowBlur: 5
      }
    },
    {
      data: [],
      name: "已出场",
      type: "line",
      smooth: true,
      symbol: 'none',
      lineStyle: {
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowBlur: 5
      }
    },
  ],
};
export default class Graph {
  constructor() {
    this.option = JSON.parse(JSON.stringify(baseOption));
    this.option.tooltip.position = function (pos, params, dom, rect, size) {
      // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
      var obj = {
        top: 5,
        left: 5,
      };
    
      let left = (pos[0] < size.viewSize[0] / 2) ? pos[0] : (pos[0] - 100)
      let top = (pos[1] < size.viewSize[1] / 2) ? pos[1] : (pos[1] - 60)
      // obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 5;
      obj.left = left;
      obj.top = top;
      return obj;
    };
  }
  //提示框位置
  tooltipPosition(posFun) {
    
    this.option.tooltip.position = posFun;
  }

  // 更新图例
  updateLegend(legendData, formatter) {
    this.option.legend.data = legendData;
    this.option.legend.formatter = formatter;
  }
  //更新X坐标轴数据
  xAxisData(data) {
    this.option.xAxis.data = data;
  }

  //更新X坐标轴刻度标签
  xAxisLabel(interval, rotate) {
    this.option.xAxis.axisLabel.interval = interval;
    this.option.xAxis.axisLabel.rotate = rotate;
  }
  //更新y轴单位
  yAxisName(name) {
    this.option.yAxis.name = name;
  }

  //更新series类型数据
  updateSeriesType(type) {
    for (let i = 0, len = this.option.series.length; i < len; i++) {
      this.option.series[i].type = type;
    }
  }

  // 更新series数据
  updateSeriesData(index, data) {
    this.option.series[index].data = data;
  }
  //更新series名称
  updateSeriesName(index, name) {
    this.option.series[index].name = name;
  }

}