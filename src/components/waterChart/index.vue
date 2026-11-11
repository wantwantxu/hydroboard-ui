<template>
  <div class="water-chart bg-com">
    <el-carousel class="chartSwipe" indicator-position="none" v-if="chartList.length > 0">
      <el-carousel-item v-for="(group,gi) in chartList" :key="gi">
        <div class="chart-item" v-for="(item,index) in group" :key="index">
          <div class="ci-hd">
            <span class="tag c_org" v-if="item.sttp !== 'RR'&& item.isWrz === undefined">超警戒</span>
            <span class="tag c_red" v-if="item.isWrz === true">超保证</span>
            <span class="tag c_red" v-if="item.sttp === 'RR'&& item.isDsflz === undefined">超校核</span>
            <span class="tag c_org" v-if="item.sttp === 'RR'&& item.isDsflz === false">超设计</span>
            <i class="el-icon-location-information"></i>
            {{item.stnm}}
          </div>
          
          <chart-item :isWrz="item.isWrz" :isDsflz="item.isDsflz" :chartData="item" :stcd="item.stcd" :date="date"/>
        </div>
      </el-carousel-item>

    </el-carousel>
    <div v-if="chartList.length === 0"
         style="color: white;height: 100px;text-align: center;
         font-size: 20px">
      当前无超警戒站点
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import chartItem from './chart'
  import Api from '@/api'

  export default {
    components: {
      chartItem
    },
    data() {
      return {
        chartList: [],
        date: []
      }
    },
    methods: {
      loadData(data) {
        this.date = data.date
        console.log(data)
        this.chartList = []
        if (data.activeName === 'reservoir') {
          this.getReservoirList(data)
        } else {
          this.getWaterList(data)
        }
      },

      getReservoirList(data) {

        let listOutReservoir = Api.listOutReservoir({startDate: data.date[0], endDate: data.date[1]})

        let listOutReservoirDsflz = Api.listOutReservoirDsflz({startDate: data.date[0], endDate: data.date[1]})
        Promise.all([listOutReservoir, listOutReservoirDsflz])
          .then(res => {
            let dsflzArr = []
            if (res[0].result.length === 0 && res[1].result.length === 0) {
              return
            }
            console.log(res[0])
            console.log(res[1])
            res[0].result.forEach(item => {
              let ckflzRes = {
                stcd: item.stcd,
                stnm: item.stnm,
                sttp: item.sttp,
                isDsflz: false
              }
              dsflzArr.push(ckflzRes)
            })
            res[1].result.forEach(item => {
              for (let i = 0; i < dsflzArr.length; i++) {
                if (item.stcd === dsflzArr[i].stcd) {
                  dsflzArr[i].isDsflz = undefined
                }
              }
              if (item.sttp === 'RR') {
                dsflzArr.push(item)
              }
            })
            let Arr = []
            if (dsflzArr.length > 1) {
              Arr = dsflzArr.filter((x, index, self) => {
                var arr = []
                dsflzArr.forEach((item, i) => {
                  arr.push(item.stcd)
                })
                return arr.indexOf(x.stcd) === index
              })
            } else {
              Arr = dsflzArr
            }
            console.log(Arr)
            let arr = []
            this.getChart(Arr, arr)
          })
      },

      async getWaterList(data) {
        let listOutOfGrz = Api.listOutOfGrz({startDate: data.date[0], endDate: data.date[1]})
        let listOut = Api.listOut({startDate: data.date[0], endDate: data.date[1]})
        Promise.all([listOutOfGrz, listOut])
          .then(res => {
            let grzArr = []
            if (res[0].result.length === 0 && res[1].result.length === 0) {
              return
            }
            res[0].result.forEach(item => {
              let grzRes = {
                  stcd: item.stcd,
                  data: item.data,
                  grq: item.grq,
                  grz: item.grz,
                  rvnm: item.rvnm,
                  stnm: item.stnm,
                  sttp: item.sttp,
                  wrq: item.wrq,
                  wrz: item.wrz,
                  isWrz: true
              }
              grzArr.push(grzRes)
            })
            res[1].result.forEach(item => {
              grzArr.push(item)
            })
            let Arr = []
            if (grzArr.length > 1) {
             Arr = grzArr.filter((x, index, self) => {
                var arr = []
                grzArr.forEach((item, i) => {
                  arr.push(item.stcd)
                })
                return arr.indexOf(x.stcd) === index
              })
            } else {
              Arr = grzArr
            }
            console.log(Arr)
            let arr = []
            this.getChart(Arr, arr)
          })
      },
      getChart(list, arr) {
        if (list.length > 2) {
          for (var i = 0; i < list.length; i++) {
            let data = list[i]
            arr.push(data)
            if (((i + 1) % 3) === 0) {
              this.chartList.push(arr)
              arr = []
            }
          }
        } else if (list.length === 2) {
          for (var j = 0; j < list.length; j++) {
            let data = list[j]
            arr.push(data)
            if (((j + 1) % 2) === 0) {
              this.chartList.push(arr)
              arr = []
            }
          }
        } else {
          let data = list[0]
          arr.push(data)
          this.chartList.push(arr)
        }
        console.log(this.chartList)
      }
    },
    mounted() {

    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .water-chart {
    background: rgba(0, 16, 30, .9);
  }

  .chart-item {
    padding: 10px;
    height: 230px;
    border-bottom: 1px solid rgba(0, 255, 246, .5);

    &:last-child {
      border-bottom: none;
    }

    .ci-hd {
      color: #fff;
      font-size: 18px;
      height: 25px;

      .el-icon-location-information {
        margin-right: 5px;
      }

      .tag {
        float: right;
        padding: 0 8px;
        height: 25px;
        line-height: 25px;
        color: #fff;
        border-radius: 4px;
        font-size: 16px;

        &.c_red {
          background: #f00;
        }

        &.c_org {
          background: #ff9900;
        }
      }
    }

    .ci-tips {
      font-size: 12px;
      color: #fff;
      padding-left: 28px;
      line-height: 18px;
      margin-bottom: 7px;
    }
  }
</style>
