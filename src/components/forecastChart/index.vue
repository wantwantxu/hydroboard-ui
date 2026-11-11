<template>
  <div class="pop-base" :class="'pop-base'+visible">
    <div class="pop-hd">
      <span @click="toClose">
        <i class="el-icon-d-arrow-left" v-if="visible" ></i>
        <i class="el-icon-d-arrow-right" v-else ></i>
      </span>
      <h3>
        <i class="el-icon-location-information"></i>
        {{address || '未知'}}
      </h3>
    </div>
   <div class="pop-base-nav" >
     <ul class="pop-tab" >

      <li :class="{active:tabCur===1}" @click="toRefresh(1)">逐时预报</li>
      <li :class="{active:tabCur===2}" @click="toRefresh(2)">逐日预报</li>
       <li :class="{active:tabCur===0}" @click="toRefresh(0)">分钟级预报</li>
    </ul>
    <div class="pop-tips">雨量(mm)</div>

    <div class="tab-chart">
      <div class="chart" ref="rtRainChatRef"/>
    </div>
   </div>
  </div>
</template>

<script type="text/ecmascript-6">

  import dayjs from 'dayjs'
  import {tdtToken} from '../map/leaflet/config/configMap'
  import RainChart from '../charts/RainChart'
  import Api from '../../api'

  export default {
    data() {
      return {
        data: [],
        chart: null,
        tabCur: 1,
        visible: true,
        address: '',
        lng:'',
        lat:''
      }
    },
    props: {
      ptimes:{
        type: String,
        default: ()=> []
      }
    },
    watch:{
      ptimes:{
        handler(val){
            console.log(val,'外部时间监听')
        },
        deep:true
      }
    },
    mounted() {

    },
    methods: {
      toClose() {
        this.visible = !this.visible
      },

      getGeocoder(lat, lng) {
        let postStr = JSON.stringify({ lon: lng,lat: lat,ver: 1 })
        Api.geocoder({ postStr: postStr, type: 'geocode',tk: tdtToken }).then((res) => {
          this.address = res.result.formatted_address
        })
      },

       getToggle(lat, lng){
        let myChart = this.$eCharts.init(this.$refs.rtRainChatRef)
        const rainChart = new RainChart()

        const chartOptions = rainChart.init({data: '' },{ max: ''}, [{ name: '雨量', type: 'bar', data: '' }])
        myChart.setOption(chartOptions)
        if (this.tabCur === 0) {
          this.drawMinute(lat, lng)
          return
        }
        if (this.tabCur === 1) {
          this.drawHour(lat, lng)
          return
        }
        if (this.tabCur === 2) {
          this.drawDay(this.lat,this.lng)
        }
      },

      toRefresh(type) {
        this.tabCur = type
        let myChart = this.$eCharts.init(this.$refs.rtRainChatRef)
        const rainChart = new RainChart()

        const chartOptions = rainChart.init(
          {
            data: ''
          },
          {
            max: ''
          },
          [
            {
              name: '雨量',
              type: 'bar',
              data: ''
            }
          ]
        )
        myChart.setOption(chartOptions)
        console.log('更新画布')
        const lng = this.lng ? this.lng : 105.592898
        const lat = this.lat ? this.lat : 30.532847
        if(type===0){
          this.drawMinute(lat, lng)
          return
        }
        if (type === 1) {
          this.drawHour(lat, lng)
          return
        }
        if (type === 2) {
          this.drawDay(lat, lng)
        }
      },

      getToggle(lat, lng){
        let myChart = this.$eCharts.init(this.$refs.rtRainChatRef)
        const rainChart = new RainChart()

        const chartOptions = rainChart.init(
          {
            data: ''
          },
          {
            max: ''
          },
          [
            {
              name: '雨量',
              type: 'bar',
              data: ''
            }
          ]
        )
        myChart.setOption(chartOptions)
        if(this.tabCur === 0){
          this.drawMinute(lat, lng)
          return
        }
        if (this.tabCur === 1) {
          this.drawHour(lat, lng)
          return
        }
        if (this.tabCur === 2) {
          this.drawDay(lat, lng)
        }
      },
      drawMinute(lat, lng) {
        this.lat = lat;
        this.lng = lng;

        Api.listXyRainMinute({y: this.lat, x: this.lng,hour:3}).then(response => {
          if (response.code === 200) {
            const result = response.result
            let maxYaxis = 0
            let datas = []
            let labels = []
            for (let i = 0; i < result.length; i++) {
              const item = result[i]
              datas.push(item.rain.toFixed(1))
              labels.push(dayjs(item.date).format('HH:mm')+'时')
            }
            for (let i = 0; i < result.length; i++) {
              const item = result[i]
              if (item.rain > 5) {
                console.log(item.rain)
                maxYaxis = null
                break
              } else {
                maxYaxis = 5
              }
            }
            let myChart = this.$eCharts.init(this.$refs.rtRainChatRef)
            const rainChart = new RainChart()
            const chartOptions = rainChart.init(
              {
                data: labels
              },
              {
                max: maxYaxis
              },
              [
                {
                  name: '雨量',
                  type: 'bar',
                  data: datas
                }
              ]
            )
            myChart.setOption(chartOptions)
          }
        })
      },
      drawHour(lat, lng) {
        this.lat = lat;
        this.lng = lng;

        Api.listXyRain({y: this.lat, x: this.lng,hour:72}).then(response => {
          if (response.code === 200) {
            const result = response.result
            let maxYaxis = 0
            let datas = []
            let labels = []
            for (let i = 0; i < result.length; i++) {
              const item = result[i]
              datas.push(item.rain.toFixed(1))
              labels.push(dayjs(item.date).format('MM-DD HH')+'时')
            }
            for (let i = 0; i < result.length; i++) {
              const item = result[i]
              if (item.rain > 5) {
                console.log(item.rain)
                maxYaxis = null
                break
              } else {
                maxYaxis = 5
              }
            }
            let myChart = this.$eCharts.init(this.$refs.rtRainChatRef)
            const rainChart = new RainChart()
            const chartOptions = rainChart.init(
              {
                data: labels
              },
              {
                max: maxYaxis
              },
              [
                {
                  name: '雨量',
                  type: 'bar',
                  data: datas
                }
              ]
            )
            myChart.setOption(chartOptions)
          }
        })
      },

      async drawDay(lat, lng) {
        this.lat = lat;
        this.lng = lng;
        let result

        let type = 7;
        if(type==1||type==3) {
          result = [{
            'date': '24h',
            'rain': 0
          },
            {
              'date': '48h',
              'rain': 0
            },
            {
              'date': '72h',
              'rain': 0
            },

          ]
        }else {
          result = [{
            'date': '24h',
            'rain': 0
          },
            {
              'date': '48h',
              'rain': 0
            },
            {
              'date': '72h',
              'rain': 0
            },
            {
              'date': '96h',
              'rain': 0
            },
            {
              'date': '120h',
              'rain': 0
            },
            {
              'date': '144h',
              'rain': 0
            },
            {
              'date': '168h',
              'rain': 0
            }
          ]
        }
        await Api.listXyRain({y: this.lat, x: this.lng,hour:168}).then(res=>{
          for (let i = 0; i < res.result.length; i++) {
            let a1 = dayjs(dayjs(res.result[i].date).format('YYYY-MM-DD HH:mm:ss')).valueOf();
            switch (true){
              case a1 < dayjs(dayjs().format('YYYY-MM-DD HH')+':00:00').add(1,'day').valueOf():
                result[0]['rain'] += res.result[i].rain;
                break;
              case a1 < dayjs(dayjs().format('YYYY-MM-DD HH')+':00:00').add(2,'day').valueOf():
                result[1]['rain'] += res.result[i].rain;
                break;
              case a1 < dayjs(dayjs().format('YYYY-MM-DD HH')+':00:00').add(3,'day').valueOf():
                result[2]['rain'] += res.result[i].rain;
                break;
              case a1 < dayjs(dayjs().format('YYYY-MM-DD HH')+':00:00').add(4,'day').valueOf():
                result[3]['rain'] += res.result[i].rain;
                break;
              case a1 < dayjs(dayjs().format('YYYY-MM-DD HH')+':00:00').add(5,'day').valueOf():
                result[4]['rain'] += res.result[i].rain;
                break;
              case a1 < dayjs(dayjs().format('YYYY-MM-DD HH')+':00:00').add(6,'day').valueOf():
                result[5]['rain'] += res.result[i].rain;
                break;
              case a1 < dayjs(dayjs().format('YYYY-MM-DD HH')+':00:00').add(7,'day').valueOf():
                result[6]['rain'] += res.result[i].rain;
                break;
            }
          }
          console.log(result)
        })
        let maxYaxis = 0
        let datas = []
        let labels = []
        for (let i = 0; i < result.length; i++) {
          const item = result[i]
          datas.push(item.rain.toFixed(1))
          labels.push(item.date)
        }
        for (let i = 0; i < result.length; i++) {
          const item = result[i]
          if (item.rain > 5) {
            console.log(item.rain)
            maxYaxis = null
            break
          } else {
            maxYaxis = 5
          }
        }
        let myChart = this.$eCharts.init(this.$refs.rtRainChatRef)
        const rainChart = new RainChart()
        const chartOptions = rainChart.init(
          {
            data: labels
          },
          {
            max: maxYaxis
          },
          [
            {
              name: '雨量',
              type: 'bar',
              data: datas
            }
          ]
        )
        myChart.setOption(chartOptions)
      }

    }
  }
</script>

<style type="text/scss" lang="scss" scoped>

  .tab-chart {
    height: 300px;

    .chart {
      height: 100%;
    }
  }
  .pop-base {
    padding: 0.625rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    background: var(--panel-bg, rgba(0, 16, 30, 0.52));
    border: 1px solid rgba(0, 255, 246, 0.35);
    backdrop-filter: blur(8px);
    border-radius: 4px;
    color: #fff;
    position: absolute;
    left: var(--panel-gap, 1.25rem);
    top: var(--panel-top, 6.25rem);
    z-index: 501;

    .pop-hd {
      position: relative;
      height: 30px;
      line-height: 30px;

      span {
        float: right;
        color: rgba(0, 252, 255, .7);
        font-size: 24px;
        cursor: pointer;
      }

      h3 {
        color: #fff;
        font-size: 22px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        i {
          color: rgba(0, 252, 255, .7);
        }
      }
    }

    .pop-tips {
      color: #00fff6;
      font-size: 15px;
      padding-left: 25px;
    }

    .pop-chart {
      height: 180px;

      & > .chart {
        height: 100%;
      }
    }
  }
  .pop-basetrue{
     width: 420px;
     .pop-base-nav{
        display: block;
     }
  }
  .pop-basefalse{
     .pop-base-nav{
        display: none;
     }
  }

  .pop-tab {
    display: flex;
    flex-direction: row;
    margin: 10px 0 15px;
    padding-left: 25px;

    li {
      margin-right: 10px;
      height: 30px;
      border: 1px solid rgba(0, 255, 246, .1);
      background: rgba(0, 255, 246, .15);
      color: #00fff6;
      line-height: 30px;
      padding: 0 15px;
      border-radius: 3px;
      transition: all .5s;

      &.active {
        background: #fd0;
        border-color: #fd0;
        color: #333;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
</style>
