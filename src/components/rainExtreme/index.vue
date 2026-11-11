<template>
  <div class="wrap bg-com rain-extreme-panel">
    <el-carousel class="hideDot rain-extreme-carousel" height="100%" :autoplay="false">
      <el-carousel-item >
        <h2><img src="/static/icon/icon_rain_jz.png" alt="">10分钟累计雨量Top10</h2>
        <ul class="content">
          <li v-for="(item,index) in list10" :key="index">
            <div class="r-text">
              <span class="name">{{index+1}}.{{item.name}}</span>
              <span class="val">{{item.value}}mm</span>
            </div>
            <div class="r-p"><span :class="`_r-${typeValue(item.value)}`" :style="_width(item.value)"></span></div>
          </li>
        </ul>
      </el-carousel-item>
      <el-carousel-item >
        <h2><img src="/static/icon/icon_rain_jz.png" alt="">20分钟累计雨量Top10</h2>
        <ul class="content">
          <li v-for="(item,index) in list20" :key="index">
            <div class="r-text">
              <span class="name">{{index+1}}.{{item.name}}</span>
              <span class="val">{{item.value}}mm</span>
            </div>
            <div class="r-p"><span :class="`_r-${typeValue(item.value)}`" :style="_width(item.value)"></span></div>
          </li>
        </ul>
      </el-carousel-item>
      <el-carousel-item >
        <h2><img src="/static/icon/icon_rain_jz.png" alt="">30分钟累计雨量Top10</h2>
        <ul class="content">
          <li v-for="(item,index) in list30" :key="index">
            <div class="r-text">
              <span class="name">{{index+1}}.{{item.name}}</span>
              <span class="val">{{item.value}}mm</span>
            </div>
            <div class="r-p"><span :class="`_r-${typeValue(item.value)}`" :style="_width(item.value)"></span></div>
          </li>
        </ul>
      </el-carousel-item>
      <el-carousel-item >
        <h2><img src="/static/icon/icon_rain_jz.png" alt="">1小时累计雨量Top10</h2>
        <ul class="content">
          <li v-for="(item,index) in list1" :key="index">
            <div class="r-text">
              <span class="name">{{index+1}}.{{item.name}}</span>
              <span class="val">{{item.value}}mm</span>
            </div>
            <div class="r-p"><span :class="`_r-${typeValue(item.value)}`" :style="_width(item.value)"></span></div>
          </li>
        </ul>
      </el-carousel-item>
      <el-carousel-item >
        <h2><img src="/static/icon/icon_rain_jz.png" alt="">3小时累计雨量Top10</h2>
        <ul class="content">
          <li v-for="(item,index) in list3" :key="index">
            <div class="r-text">
              <span class="name">{{index+1}}.{{item.name}}</span>
              <span class="val">{{item.value}}mm</span>
            </div>
            <div class="r-p"><span :class="`_r-${typeValue(item.value)}`" :style="_width(item.value)"></span></div>
          </li>
        </ul>
      </el-carousel-item>
      <el-carousel-item >
        <h2><img src="/static/icon/icon_rain_jz.png" alt="">6小时累计雨量Top10</h2>
        <ul class="content">
          <li v-for="(item,index) in list6" :key="index">
            <div class="r-text">
              <span class="name">{{index+1}}.{{item.name}}</span>
              <span class="val">{{item.value}}mm</span>
            </div>
            <div class="r-p"><span :class="`_r-${typeValue(item.value)}`" :style="_width(item.value)"></span></div>
          </li>
        </ul>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script type="text/ecmascript-6">
  import {rainType, formatDate} from '@/assets/js/common'
  import Api from '@/api'
  import dayjs from 'dayjs'

  export default {
    data() {
      return {

        list10: [],
        list20: [],
        list30: [],

        list1: [],
        list3: [],
        list6: []
      }
    },
    methods: {
      _width(w) {
        return 'width:' + w * 100 / 65 + '%'
      },
      typeValue(v) {
        return rainType(v, true)['value']
      },
      loadData(data) {
        this.list10 = []
        this.list20 = []
        this.list30 = []
        this.list1 = []
        this.list3 = []
        this.list6 = []
        this.lessNewDate(10, data)
        this.lessNewDate(20, data)
        this.lessNewDate(30, data)
        this.getRainTop5List(1, data)
        this.getRainTop5List(3, data)
        this.getRainTop5List(6, data)
      },

      lessNewDate(lessMin, option) {

        let nowTime = new Date(formatDate(new Date(option.endDate), 'yyyy-MM-dd hh:mm:ss'))

        let min = nowTime.setMinutes(nowTime.getMinutes() - lessMin)

        let lessTime = dayjs(min).format('YYYY-MM-DD HH:mm:ss')
        let startDate = option.startDate
        startDate = lessTime
        Api.getRainTopList({
          row: 10,
          startDate: startDate,
          endDate: option.endDate,
          addvcdList: option.addvcd.join(),
          sttpList: option.sttpList.join()
        }).then(response => {
          if (response.code === 200) {
            response.result.forEach(item => {
              this['list' + lessMin].push({name: item.stnm, value: item.rain})
            })
          }
        })
        console.log(lessTime)
      },

      getRainTop5List(h, option) {
        if (option.addvcd === undefined || option.addvcd === '') {
          option.addvcd = []
        }
        console.log(option)
        Api.getRainTopList({
          row: 10,
          startDate: option.startDate,
          endDate: option.endDate,
          hour: h,
          addvcdList: option.addvcd.join(),
          sttpList: option.sttpList.join()
        }).then(response => {
          if (response.code === 200) {
            response.result.forEach(item => {
              this['list' + h].push({name: item.stnm, value: item.rain})
            })
          }
        })
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .wrap {
    margin-bottom: 0;
    padding: 0.75rem 0.9375rem;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;

    h2 {
      font-size: 1.125rem;
      color: #fff;
      font-weight: normal;
      line-height: 1.5rem;
      margin-bottom: 0.625rem;
      flex-shrink: 0;
      white-space: nowrap;

      img {
        width: 1.25rem;
        vertical-align: middle;
        margin: -2px 4px 0 0;
      }
    }
  }

  ::v-deep .rain-extreme-carousel {
    flex: 1 1 auto;
    min-height: 0;
    height: 100% !important;

    .el-carousel__container {
      height: 100% !important;
    }

    .el-carousel__item {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding-right: 0.25rem;
    }
  }

  .content {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 0.25rem;

    li {
      margin-bottom: 0.75rem;
      &:last-child{
        margin-bottom: 0;
      }
    }
  }

  .r-text {
    line-height: 1.125rem;
    font-size: 0.875rem;
    color: #00fff6;
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.375rem;

    .name {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .val {
      flex-shrink: 0;
      white-space: nowrap;
    }
  }

  .r-p {
    height: 3px;
    background: rgba(0, 255, 246, .14);
    border-radius: 3px;

    span {
      height: 3px;
      position: relative;
      float: left;

      &:before, &:after {
        content: '';
        position: absolute;
        border-radius: 50%;
      }

      &:before {
        width: 7px;
        height: 7px;
        right: -2px;
        top: -2px;
      }

      &:after {
        width: 15px;
        height: 15px;
        right: -6px;
        top: -6px;
      }
    }
  }

  ._r-1 {
    background: linear-gradient(45deg, rgba(0, 210, 255, 0), #00d2ff);
    color: #00d2ff
  }

  ._r-1:before {
    background: #00d2ff
  }

  ._r-1:after {
    background: rgba(0, 210, 255, .45)
  }

  ._r-2 {
    background: linear-gradient(45deg, rgba(0, 255, 141, 0), #00ff8d);
    color: #00ff8d
  }

  ._r-2:before {
    background: #00ff8d
  }

  ._r-2:after {
    background: rgba(0, 255, 141, .45)
  }

  ._r-3 {
    background: linear-gradient(45deg, rgba(255, 238, 77, 0), #ffee4d);
    color: #ffee4d
  }

  ._r-3:before {
    background: #ffee4d
  }

  ._r-3:after {
    background: rgba(255, 238, 77, .45)
  }

  ._r-4 {
    background: linear-gradient(45deg, rgba(255, 153, 74, 0), #ff994a);
    color: #ff994a
  }

  ._r-4:before {
    background: #ff994a
  }

  ._r-4:after {
    background: rgba(255, 153, 74, .45)
  }

  ._r-5 {
    background: linear-gradient(45deg, rgba(255, 83, 47, 0), #ff532f);
    color: #ff532f
  }

  ._r-5:before {
    background: #ff532f
  }

  ._r-5:after {
    background: rgba(255, 83, 47, .45)
  }

  ._r-6 {
    background: linear-gradient(45deg, rgba(255, 1, 32, 0), #ff0120);
    color: #ff0120
  }

  ._r-6:before {
    background: #ff0120
  }

  ._r-6:after {
    background: rgba(255, 1, 32, .45)
  }
</style>
