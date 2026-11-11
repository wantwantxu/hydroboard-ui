import * as echarts from 'echarts'

export const charts = () => {
  function getX(options) {
    const xAxis = []
    const x = options.x
    for (let i = 0; i < x.length; i++) {
      const obj = x[i]
      xAxis.push({
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },

        data: obj.data
      })
    }
    return xAxis
  }

  function getY(options) {
    const yAxis = []
    const y = options.y
    for (let i = 0; i < y.length; i++) {
      const obj = y[i]
      yAxis.push({
        type: 'value',
        name: obj.name,
        position: obj.position,
        min: obj.min,
        max: obj.max,
        splitLine: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: obj.color
          }
        },
        inverse: obj.inverse,
        axisLabel: {
          formatter: obj.formatter
        }
      })
    }
    return yAxis
  }

  function getSeries(options) {
    const series = []
    const y = options.y
    for (let i = 0; i < y.length; i++) {
      const obj = y[i]
      series.push({
        name: obj.name,
        type: obj.type,
        yAxisIndex: i,
        data: obj.data
      })
    }
    return series
  }
  
  function draw(dom, options) {
    const x = getX(options)
    const y = getY(options)
    const series = getSeries(options)
    const colors = options.colors || ['#5470C6', '#91CC75', '#EE6666']

    const myChart = echarts.init(dom)


    myChart.setOption(
      {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          top: '60px',
          left: '50px',
          right: '30px',
          bottom: '45px'
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: x,
        yAxis: y,
        series: series
      },
      true
    )
  }

  return {
    draw
  }
}
