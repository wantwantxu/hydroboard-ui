import Api from '@/api'
import {formatDate} from '@/assets/js/common'
class SimpleChart {
  constructor(y, x, chartInst,a=99.5,b=100.5) {
    this.y = y
    this.x = x
    this.a = a
    this.b = b
    this.chartInst = chartInst
  }

  render(options) {
    this.chartInst.setOption(options)

  }

  init (xName, yName, legendconf) {
    this.seriesConf = [{
      name: yName,
      type: 'line',
      data: this.y
    }]
    const options = {
      legend: {
        data: legendconf.legend.data || [],
        textStyle: {
          fontWeight: 'normal',
          color: '#16FFC9'
        }
        
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: this.getXAxis(xName),
      yAxis: [
        {
          name: yName || '水位',
          color: '#16FFC9',
          ...(() => {
            const minVal = Number(this.calcMin(this.y, null))
            const maxVal = Number(this.calcMax(this.y, null))
            const digits = yName == '流量' ? 3 : 2
            if (!Number.isFinite(minVal) || !Number.isFinite(maxVal)) {
              return {}
            }
            const span = Math.max(maxVal - minVal, yName == '流量' ? 0.01 : 0.2)
            const pad = span * 0.08
            return {
              min: (minVal - pad).toFixed(digits),
              max: (maxVal + pad).toFixed(digits)
            }
          })(),

          axisLabel: {
            textStyle: {

              margin: 15
            }
          },
          nameTextStyle: {
            color: '#16FFC9'
          },
          type: 'value',
          position: 'left',
          splitNumber: 5,
          splitLine: {
  

            show: false,
            lineStyle: {
              type: 'dashed'

            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#16FFC9'
            }
          }
        },

  

      ],
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
      series: this.getSeries()
    }
    this.render(options)
  }

  getXAxis (xName) {
    const name = xName || '时间'
    const data = this.x
    return {
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        textStyle: {
          color: '#16D6FF'
        },
        rotate: 0,
        color: '#fff'
      },
      data: data,
      name: name,
      nameTextStyle: {
        color: '#1f9bcb'
      },
      axisLine: {
        lineStyle: {
          color: '#16D6FF'
        }
      }
    }
  }
  calcMax(y, limit) {
    let maxVal = Number(Math.max(...y.filter(item=> item))).toFixed(2)
    if (!limit) {
      return maxVal
    }
    if (maxVal < limit) {
      return Number(limit).toFixed(2)
    } else {
      return maxVal
    }
  }
  calcMin(y, limit) {
    let minVal = y
    if(y instanceof Array){
      minVal = Number(Math.min(...y.filter(item=> item)))
    }
    console.log(minVal)
    if (!limit) {
      return minVal.toFixed(2)
    }
    if (minVal > limit) {
      return Number(limit).toFixed(2)
    } else {
      return minVal.toFixed(2)
    }
  }
  calcInterval(y, y1, limit) {
    const max = this.calcMax(y, limit)
    const min = this.calcMin(y1, limit)
    console.log(max)
    console.log(min)
    console.log(max - min)
    let interval
    if (max !== min) {
      interval = Number(((max - min) / 4).toFixed(2))
      if (interval < 0.1) {
        interval = 0.1
      }
    } else {
      interval = 50
    }


    return interval
  }
  getYAxis (yconf) {
  }


  setMaxMin(obj) {

    const minZ = Number(obj.minZ)
    const maxZ = Number(obj.maxZ)
    if (!Number.isFinite(minZ) || !Number.isFinite(maxZ)) {
      return
    }
    const span = Math.max(maxZ - minZ, 0.2)
    const pad = span * 0.08
    this.chartInst.setOption({
      yAxis: {
        min: (minZ - pad).toFixed(2),
        max: (maxZ + pad).toFixed(2),
        splitNumber: 5
      }
    })
    return;
    console.log(zmin)
    let minData
    if (zmin) {
       minData = this.calcMin(zmin, limit)
      const maxData = this.calcMax(this.y, limit)

      let max = (maxData).toFixed(2)
      let min = minData

      let interval
      if (max !== min) {
        interval = Number(((max - min) / 4).toFixed(2))
        if (interval < 0.1) {
          interval = 0.1
        }
      } else {
        interval = 50
      }
      this.chartInst.setOption({
        yAxis: {
          min: (min*1-interval).toFixed(2),
          max: (max*1+interval).toFixed(2)

        }
      })
    } else {
      let endDate = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      let startDate = formatDate(new Date(new Date().setDate(new Date().getDate() - 7)), 'yyyy-MM-dd hh:mm:ss')
      if (sttp === 'RR') {
        Api.listRsvr({stcd: stcd, startDate: startDate, endDate: endDate}).then((res) => {
          if (res.code === 200) {
            const minZ = res.result.reduce((min, obj) => obj.rz < min ? obj.rz : min, res.result[0].rz)
            minData = this.calcMin(minZ, limit)
            const maxData = this.calcMax(this.y, limit)

            let max = (maxData).toFixed(2)
            let min = minData
            let interval
            if (max !== min) {
              interval = Number(((max - min) / 4).toFixed(2))
              if (interval < 0.1) {
                interval = 0.1
              }
            } else {
              interval = 50
            }
            if (min) {
              this.chartInst.setOption({
                yAxis: {
                  min: (min*1-interval).toFixed(2),
                  max: (max*1+interval).toFixed(2)

                }
              })
            }
          }
        })
      } else {
        Api.listRiver({stcd: stcd, startDate: startDate, endDate: endDate}).then((res) => {
          if (res.code === 200) {
            console.log(res.result)
            const minZ = res.result.reduce((min, obj) => obj.z < min ? obj.z : min, res.result[0].z)
            console.log(minZ,limit)
            minData = this.calcMin(minZ, limit)

            const maxData = this.calcMax(this.y, limit)

            let max = (maxData).toFixed(2)
            let min = minData
            console.log(max)
            console.log(min)
            let interval
            if (max !== min) {
              interval = Number(((max - min) / 4).toFixed(2))
              if (interval < 0.1) {
                interval = 0.1
              }
            } else {
              interval = 50
            }
            if (min) {
              this.chartInst.setOption({
                yAxis: {
                  min: (min*1-interval).toFixed(2),
                  max: (max*1+interval).toFixed(2)

                }
              })
            }
          }
        })
      }


    }




  }
  getSeries () {
    const series = []
    const seriesConf = this.seriesConf
    for (let i = 0; i < seriesConf.length; i++) {
      const conf = seriesConf[i]
      const name = conf.name
      const type = conf.type
      const data = conf.data

      const itemStyle = conf.itemStyle
      series.push({
        name: name,
        type: type,
        data: data.map(item=>{
          if(!item){
            item = null
          }
          return item;
        }),
        color: '#1f9bcb',
        lineStyle: {
          color: '#1f9bcb'
        },
        showSymbol: false,
        markLine: conf.markLine,
        itemStyle: itemStyle
      })
    }
    return series
  }
  addWrz (wrz) {
    this.chartInst.setOption({series: this.getWrzOption(wrz)})
  }
  addDsflz (dsflz) {
    if (dsflz === null) {
      return
    }
    this.chartInst.setOption({series: this.getDsflzOption(dsflz)})
  }
  addGrz (grz) {
    this.chartInst.setOption({series: this.getGrzOption(grz)})
  }
  addCkflz (ckflz) {
    if (ckflz === null) {
      return
    }
    this.chartInst.setOption({series: this.getCkflzOption(ckflz)})
  }
  addFsltdz (fsltdz) {
    if (fsltdz === null) {
      return
    }
    this.chartInst.setOption({series: this.getFsltdzOption(fsltdz)})
  }
  getWrzOption(wrz) {
    const x = this.x
    return {
      yAxisIndex: 0,
      id: 'wrz',
      name: '警戒水位',
      type: 'line',
      data: [

        [x[0], wrz ],
        [x[x.length - 1], wrz]
      ],
      color: '#CCFF00',
      lineStyle: {
        color: '#CCFF00',
        type: 'solid',
        normal: {
          width: 2
        }
      },
      markLine: {
        symbol: 'none',
        silent: true,
        data: [{
          yAxis: wrz
        }],
        lineStyle: {
          type: 'solid'
        },
        label: {
          normal: {
            formatter: '警戒水位 '+wrz,
            position: 'middle',
            color: '#fff'
          }
        }
      }
    }
  }
  getGrzOption(grz) {
    const x = this.x
    return {
      yAxisIndex: 0,
      id: 'grz',
      name: '保证水位',
      type: 'line',
      data: [

        [x[0], grz ],
        [x[x.length - 1], grz]
      ],
      color: '#FF8787',
      lineStyle: {
        type: 'solid',
        width: 2,
        color: '#FF8787'
      },
      markLine: {
        symbol: 'none',
        silent: true,
        lineStyle: {
          type: 'solid'
        },
        data: [{
          yAxis: grz
        }],
        label: {
          normal: {
            formatter: '保证水位 '+grz,
            position: 'insideStartTop',
            color: '#fff'
          }
        }
      }
    }
  }
  getDsflzOption(dsflz) {
    const x = this.x
    return {
      yAxisIndex: 0,
      id: 'dsflz',
      name: '设计水位',
      type: 'line',
      data: [

        [x[0], dsflz ],
        [x[x.length - 1], dsflz]
      ],
      color: '#CCFF00',
      lineStyle: {
        color: '#CCFF00',
        normal: {
          width: 2
        }
      },
      markLine: {
        symbol: 'none',
        silent: true,
        data: [{
          yAxis: dsflz
        }],
        lineStyle: {
          type: 'solid'
        },
        label: {
          normal: {
            formatter: '设计水位 '+dsflz,
            position: 'insideStartTop',
            color: '#CCFF00'
          }
        }
      }
    }
  }
  getCkflzOption(ckflz) {
    const x = this.x
    return {
      yAxisIndex: 0,
      id: 'ckfrz',
      name: '校核水位',
      type: 'line',
      data: [

        [x[0], ckflz ],
        [x[x.length - 1], ckflz]
      ],
      color: '#FF8787',
      lineStyle: {
        color: '#FF8787'
      },
      markLine: {
        symbol: 'none',
        silent: true,
        data: [{
          yAxis: ckflz
        }],
        lineStyle: {
          type: 'solid'
        },
        label: {
          normal: {
            formatter: '校核水位 '+ckflz,
            position: 'middle',
            color: '#FF8787'
          }
        }
      }
    }
  }
  getFsltdzOption(fsltdz) {
    const x = this.x
    return {
      yAxisIndex: 0,
      id: 'fsltdz',
      name: '汛限水位',
      type: 'line',
      data: [

        [x[0], fsltdz ],
        [x[x.length - 1], fsltdz]
      ],
      color: '#2706e5',
      lineStyle: {
        color: '#2706e5'
      },
      markLine: {
        symbol: 'none',
        silent: true,
        data: [{
          yAxis: fsltdz
        }],
        lineStyle: {
          type: 'solid'
        },
        label: {
          normal: {
            formatter: '汛限水位 '+fsltdz,
            position: 'insideEndTop',
            color: '#2706e5'
          }
        }
      }
    }
  }
}

export default SimpleChart
