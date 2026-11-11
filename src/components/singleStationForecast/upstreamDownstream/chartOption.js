
export default function setChartOption(apiResult) {
  console.log(apiResult)
  const forecast = apiResult.forecast || [];
  const peak = apiResult.peak || {};

  const xData = forecast.map(item => item.time_series);
  const fqData = forecast.map(item => parseFloat(item.q_fcst));


  const peakIndex = xData.findIndex(tm => tm === peak.peak_tm.replace('T', ' '));
  const peakValue = parseFloat(peak.peak_q);

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
          if (param.seriesName === '预报流量') {
            unit = ' m³/s';
          }
          tooltipStr += `<div style="font-size: 12px;">${param.seriesName}: ${value}${unit}</div>`;
        });
        return tooltipStr;
      }
    },
    legend: {
      data: ['预报流量'],
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
      }
    ],
    series: [
      {
        name: '预报流量',
        type: 'line',
        data: fqData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 2
        },
        emphasis: {
          focus: 'series'
        },
        yAxisIndex: 0,
        markPoint: peakIndex !== -1 ? {
          data: [
            {
              name: '峰值',
              coord: [xData[peakIndex], peakValue],
              value: peakValue,
              itemStyle: {
                color: 'red'
              },
              label: {
                formatter: '峰值: {c} m³/s',
                color: '#fff'
              },
              symbolSize: 60
            }
          ]
        } : {}
      }
    ]
  };
}
