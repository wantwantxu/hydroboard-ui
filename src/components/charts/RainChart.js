class RainChart {
  init (xconf, yconf, seriesconf) {
    const xData = this.getXAxis(xconf)
    console.log(xData)
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: '15px',
        left: '30px',
        right: '10px',
        containLabel: true,
        bottom: '30px'
      },
      color: ['rgba(0, 210, 255, .9)'],
      xAxis: {
        type: 'category',
        data: xData.data,
        axisLabel: {

          textStyle: {
            color: '#00fff6'
          }
        }
      },
      yAxis: {
        type: 'value',
        max: yconf.max,
        axisLabel: {
          textStyle: {
            color: '#00fff6',
            fontSize: '10px'
          }
        },
        splitLine: {
          show: false
        }
      },
      series: this.getSeries(seriesconf)
    }
  }

  getXAxis (xconf) {
    const data = xconf.data
    return {

      data: data
    }
  }

  getYAxis (yconf) {
  }

  getSeries (seriesconf) {
    const series = []
    for (let i = 0; i < seriesconf.length; i++) {
      const conf = seriesconf[i]
      const name = conf.name
      const type = conf.type
      const data = conf.data
      series.push({
        name: name,
        type: type,
        barMaxWidth: '20px',
        data: data,
        areaStyle: {},
        markLine: conf.markLine
      })
    }
    return series
  }
}

export default RainChart
