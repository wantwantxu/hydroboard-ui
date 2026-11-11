<template>
  <div ref="chart" class="chart"></div>
</template>

<script type="text/ecmascript-6">
  import Api from '@/api'
  import dayjs from 'dayjs'

  export default {
    props: {
      isWrz: {
        type: Boolean,
        default() {
          return null
        }
      },
      isDsflz: {
        type: Boolean,
        default() {
          return null
        }
      },
      stcd: {
        type: String,
        default() {
          return null
        }
      },
      chartData: {
        type: Object,
        default() {
          return null
        }
      },
      date: {
        type: Array,
        default() {
          return null
        }
      }
    },
    data() {
      return {
        chart: null,
        listStRvfcchB: [],
        listStRsvrfcchB: []
      }
    },
    methods: {

      loadData(v) {

        if (v.sttp !== 'RR') {
          this.getListStRvfcchB(v)

        } else if (v.sttp === 'RR') {
          this.getListStRsvrfcchB(v)
        }
      },

      

      getListStRsvrfcchB(v) {
        let stcd = v.stcd
        let resp = Api.listStRsvrfcchB({stcd})
        Promise.all([resp]).then(res => {
          console.log(res[0])
          if (res[0].result.length === 0) {
            this.listStRsvrfcchB = []
            this.listStRsvrfcchB.ckflz = 0
            this.listStRsvrfcchB.dsflz = 0
          }
          if (res[0].result.length > 0) {

            this.listStRsvrfcchB = res[0].result[0] || []

            if (!this.listStRsvrfcchB.ckflz) {
              this.listStRsvrfcchB.ckflz = 0
            }
            if (!this.listStRsvrfcchB.dsflz) {
              this.listStRsvrfcchB.dsflz = 0
            }
          }
          this.getListOfReservoir(v)
        })
      },
      getListStRvfcchB(v) {
        let stcd = v.stcd
        let resp = Api.listStRvfcchB({stcd})
        Promise.all([resp]).then(res => {
          console.log(res[0])
          if (res[0].result.length === 0) {
            this.listStRvfcchB = []
            this.listStRvfcchB.wrz = 0
            this.listStRvfcchB.grz = 0
          }
          if (res[0].result.length > 0) {

            this.listStRvfcchB = res[0].result[0] || []

            if (!this.listStRvfcchB.wrz) {
              this.listStRvfcchB.grz = 0
            }
            if (!this.listStRvfcchB.wrz) {
              this.listStRvfcchB.grz = 0
            }
          }
          this.getListOfWater(v)
        })
      },
      getListOfReservoir(item) {
        let stcd = item.stcd
        const startDate = this.date[0]
        const endDate = this.date[1]
        Api.listRsvr({stcd, startDate, endDate}).then((res) => {
          if (res.code === 200) {
            let data = res.result
            let rz = []
            let tm = []
            for (let i = 0; i < data.length; i++) {
              const d = data[i]
              rz.push(d.rz)
              tm.push(dayjs(d.tm).format('DD日HH时'))
            }
            console.log(this.isDsflz)
            console.log(this.listStRsvrfcchB.ckflz)
            console.log(this.listStRsvrfcchB.ckflz)
            if (this.isDsflz === null) {
              this.draw({water: rz, cordon: this.listStRsvrfcchB.ckflz, color: '#f10536', tm: tm, name: '校核'})
            }
            if (this.isDsflz === false) {
              this.draw({water: rz, cordon: this.listStRsvrfcchB.dsflz, color: '#ea981b', tm: tm, name: '设计'})
            }
          }
        })
      },
      getListOfWater(item) {
        let stcd = item.stcd
        const startDate = this.date[0]
        const endDate = this.date[1]
        Api.listRiver({stcdList: [stcd], startDate, endDate}).then((res) => {
          if (res.code === 200) {
            const data = res.result
            let z = []
            let tm = []
            for (let i = 0; i < data.length; i++) {
              const d = data[i]
              z.push(d.z)
              tm.push(dayjs(d.tm).format('DD日HH时'))
            }
            if (this.listStRvfcchB.wrz === null || this.listStRvfcchB.wrz === undefined) {
              this.listStRvfcchB.wrz = 0
            }
            if (this.listStRvfcchB.grz === null || this.listStRvfcchB.grz === undefined) {
              this.listStRvfcchB.grz = 0
            }
            if (this.isWrz === null) {
              this.draw({water: z, cordon: this.listStRvfcchB.wrz, color: '#ea981b', tm: tm, name: '警戒'})
            }
            if (this.isWrz === true) {
              this.drawGrz({water: z, cordon: this.listStRvfcchB.grz, tm: tm})
            }
          }
        })
      },
      draw({water, cordon, color, tm, name}) {
        let markLine = [
          {
            name: name,
            yAxis: cordon,
            lineStyle: {
              normal: {
                color: color
              }
            }
          }
        ]
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          grid: {
            top: '15px',
            left: '30px',
            right: '30px',
            bottom: '20px'
          },
          color: ['rgba(0, 210, 255, .9)', 'rgba(255, 153, 74, .9)', 'rgba(255, 1, 32, .8)'],
          xAxis: {
            type: 'category',
            data: tm,
            axisLabel: {
              textStyle: {
                color: '#00fff6'
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#00fff6',
                fontSize: '10px'
              }
            },
            min: function (value) {
              return value.min - 20
            },
            max: function (value) {
              return value.max + 10
            },
            splitLine: {
              show: false
            }
          },
          series: [
            {
              symbol: 'none',
              name: '水位',
              data: water,
              type: 'line',
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#3346a3'
                  }, {
                    offset: 1, color: 'rgba(121,55,255,0)'
                  }],
                  global: false
                }
              }
            },
            {
              name: name,
              type: 'line',
              data: [

                [tm[0], cordon],
                [tm[tm.length - 1], cordon]
              ],
              color: color,
              lineStyle: {
                color: color,
                normal: {
                  width: 2
                }
              },
              markLine: {
                silent: true,
                data: markLine,
                label: {
                  formatter: (p) => {
                    return p['name']
                  },
                  textStyle: {
                    fontSize: 10,
                    color: color
                  }
                }
              }
            }
          ]
        }
        this.chart = this.$eCharts.init(this.$refs.chart)
        this.chart.setOption(option)
      },
      drawGrz({water, cordon, type, tm}) {
        let markLine = [
          {
            name: '保证',
            yAxis: cordon,
            lineStyle: {
              normal: {
                color: '#f10536'
              }
            }
          }
        ]
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          grid: {
            top: '15px',
            left: '30px',
            right: '30px',
            bottom: '20px'
          },
          color: ['rgba(0, 210, 255, .9)', 'rgba(255, 153, 74, .9)', 'rgba(255, 1, 32, .8)'],
          xAxis: {
            type: 'category',
            data: tm,
            axisLabel: {
              textStyle: {
                color: '#00fff6'
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#00fff6',
                fontSize: '10px'
              }
            },
            min: function (value) {
              return value.min - 20
            },
            max: function (value) {
              return value.max + 10
            },
            splitLine: {
              show: false
            }
          },
          series: [
            {
              symbol: 'none',
              name: '水位',
              data: water,
              type: 'line',
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#3346a3'
                  }, {
                    offset: 1, color: 'rgba(121,55,255,0)'
                  }],
                  global: false
                }
              }
            },
            {
              name: '保证水位',
              type: 'line',
              data: [

                [tm[0], this.listStRvfcchB.grz],
                [tm[tm.length - 1], this.listStRvfcchB.grz]
              ],
              color: '#f10536',
              lineStyle: {
                color: '#f10536',
                normal: {
                  width: 2
                }
              },
              markLine: {
                silent: true,
                data: markLine,
                label: {
                  formatter: (p) => {
                    return p['name']
                  },
                  textStyle: {
                    fontSize: 10,
                    color: '#f10536'
                  }
                }
              }
            }
          ]
        }
        this.chart = this.$eCharts.init(this.$refs.chart)
        this.chart.setOption(option)
      }
    },
    watch: {
      stcd: {
        handler(v) {
          this.$nextTick(() => {

          })
        },
        immediate: true
      },
      chartData: {
        handler(v) {
          this.$nextTick(() => {

            this.loadData(v)
          })
        },
        immediate: true
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .chart {
    height: 180px;
  }
</style>
