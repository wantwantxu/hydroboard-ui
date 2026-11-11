
export default function setChartOption(tableData) {
  const xData = tableData.map(item => item.tm);
  const qData = tableData.map(item => parseFloat(item.q));
  const fqData = tableData.map(item => parseFloat(item.fq));
  const rainfallData = tableData.map(item => parseFloat(item.rainfall));

  let lastDisplayedDate = null;
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      },
      formatter: function (params) {
        let tooltipStr = `<div style="font-size: 14px;">${params[0].name}</div>`;
        params.forEach((param) => {
          let unit = '';
          let value = param.value;
          if (isNaN(value)) {
            value = '空';
          }
          if (param.seriesName === '查线流量' || param.seriesName === '预报流量') {
            unit = ' m³/s';
          } else if (param.seriesName === '降雨') {
            unit = ' mm';
          }
          tooltipStr += `<div style="font-size: 12px;">${param.seriesName}: ${value}${unit}</div>`;
        });
        return tooltipStr;
      }
    },
    legend: {
      data: ['查线流量', '预报流量', '降雨'],
      textStyle: {
        color: '#fff'
      }
    },
    xAxis: {
      type: 'category',
      data: xData,
      axisLabel: {
        rotate: 45,

        interval: Math.ceil(xData.length / 6),
        color: '#fff',

        formatter: function (value) {
          return value.split(' ')[0];
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '流量 (m³/s)',
        min: 0,
        axisLabel: {
          formatter: '{value}',
          color: '#fff'
        }
      },
      {
        type: 'value',
        name: '降雨 (mm)',
        min: 0,
        inverse: true,
        axisLabel: {
          formatter: '{value}',
          color: '#fff'
        }
      }
    ],
    series: [
      {
        name: '查线流量',
        type: 'line',
        data: qData,
        yAxisIndex: 0
      },
      {
        name: '预报流量',
        type: 'line',
        data: fqData,
        yAxisIndex: 0
      },
      {
        name: '降雨',
        type: 'bar',
        data: rainfallData,
        yAxisIndex: 1,
        itemStyle: {
          color: 'lightblue'
        }
      }
    ]
  };
}
