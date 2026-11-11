class WaterChart {
  init (xconf, yconf, seriesconf, legendconf) {
    return {
      legend: {
        data: [],
        selected: legendconf.selected
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: this.getXAxis(xconf),
      yAxis: {
        name: yconf.name || '',
        axisLabel: yconf.axisLabel,
        axisLine: yconf.axisLine,

        min: yconf.min,
        max: yconf.max,
        interval: yconf.interval,
        nameTextStyle: yconf.nameTextStyle,
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {

            color: '#4797ac'
          }
        }

      },
      toolbox: {
        right: 10,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      series: this.getSeries(seriesconf)
    }
  }

  getXAxis (xconf) {
    const data = xconf.data
    return {
      name: xconf.name,
      type: xconf.type,
      axisTick: xconf.axisTick,
      axisLabel: {
        textStyle: {
          color: '#16D6FF'
        },
        fontSize: 12,
        color: '#fff',
        rotate: 0
      },
      data: data,
      nameTextStyle: xconf.nameTextStyle,
      axisLine: {
        lineStyle: {
          color: '#16D6FF'
        }
      }
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
      const color = conf.color

      const itemStyle = conf.itemStyle
      series.push({
        name: name,
        type: type,
        data: data,
        color: color,
        connectNulls: true,
        lineStyle: {
          color: '#1f9bcb'
        },
        connecNulls: true,
        showSymbol: false,
        markLine: conf.markLine,
        itemStyle: itemStyle
      })
    }
    return series
  }
}

export default WaterChart
