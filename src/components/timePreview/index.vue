<template>
  <div class="time-preview">
    <div class="tp-play" @click="toAuto">
      <img src="/static/svg/play.svg" alt="" v-if="!isAuto">
      <img src="/static/svg/pause.svg" alt="" v-else>
    </div>
    <div class="tp-prev" @click="toPrev">
      <img src="/static/svg/next.svg" alt="">
    </div>
    <div class="tp-progress">
      <template v-if="showType == 1">
        <ul v-if="forecastType === 2 || this.forecastType === 4" class="day-list">
          <li v-for="(item,index) in dayList" :key="index"
              :class="{active:pCur===index,isTotal:index<pCur&&(forecastType==4||forecastType == 2)}" @click="pClick(index)">
            <div class="tp-tips">{{ dayTips(item.date) }}</div>
            <div class="day-text">{{ item.name }}</div>
          </li>
        </ul>

          <ul v-else-if="forecastType === 1 || this.forecastType === 3" class="hour-list" v-drag="dragParam">
            <li v-for="(item,index) in hoursList" :key="index"
                :class="{active:pCur===index,isTotal:index<pCur&&(forecastType==3||forecastType == 1)}">
              <div class="tp-tips" :style="_bf(index)">{{ tipsString(item) }}</div>
              <div class="hour-text" @click="pClick(index)">{{ item.hour }}</div>
              <div class="hour-day" v-if="item.hour===0">{{ item.date | day }}</div>
            </li>
          </ul>

      </template>
      <template v-else-if="this.showType === 2">
        <ul  class="day-list">
          <li v-for="(item,index) in dayList" :key="index"
              :class="{active:pCur===index,isTotal:index<pCur}" @click="pClicks(index)">
            <div class="tp-tips">{{ dayTips(item.date) }}</div>
            <div class="day-text">{{ item.name }}</div>
          </li>
        </ul>
      </template>
      <template v-if="showType === 3">
        <ul  class="day-list">
          <li v-for="(item,index) in dayList" :key="index"
              :class="{active:pCur===index,isTotal:index<pCur}" @click="pClick(index,'hefeng')">
            <div class="tp-tips">{{ dayTips(item.date) }}</div>
            <div class="day-text">{{ item.name }}</div>
          </li>
        </ul>
      </template>
<!--      <template v-else>-->

<!--      </template>-->
    </div>
    <div class="tp-next" @click="toNext(false)">
      <img src="/static/svg/back.svg" alt="">
    </div>
    <div class="tp-select">
      <div class="tps-label">时间轴</div>
      <div class="tps-value">
        <el-select v-model="timeType" class="select-bk" @change="getTimeType">
          <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </div>
    </div>
<!--    <div class="time-show">
      预报时间：<b>{{timeSelected}}</b> <div v-if="releaseTime">{{ releaseTime | time3 }}发布</div><div v-else>暂未发布</div>
    </div>-->
  </div>
</template>
<script type="text/ecmascript-6">

import { formatDate } from '@/assets/js/common'

import Api from '../../api'
import eventBus from '@/eventBus'
import dayjs from "dayjs";

export default {

  directives: {
    drag(el, binding) {

      el.onmousedown = (e) => {

        let ox = e.pageX - binding.value.left

        document.onmousemove = (em) => {
          binding.value.ani = 'inherit'
          binding.value.left = em.pageX - ox
        }

        document.onmouseup = (eu) => {
          let d = eu.pageX - ox
          setTimeout(() => {

            if (d > 0) {
              binding.value.left = 0
            }
            let max = 1200 - 168 * 24
            if (d < max) {
              binding.value.left = max
            }
            binding.value.ani = 'transform .5s'
          }, 100)
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    }
  },
  props: {
    ptimes:{
      type: String,
      default: ()=> []
    }
  },

  data() {
    return {
      dayList: [],
      hoursList: [],
      timeList: [],
      forecastType: 2,
      pCur: 0,
      dragParam: {
        ani: 'inherit',
        left: 0
      },
      isAuto: false,
      timer: null,
      selectList: [
        {
          label: '预报降雨',
          value: 'level'
        },
        {
          label: '分钟级降雨',
          value: 'minuteLevel'
        }
      ],
      timeType: 'level',
      showType: 1,
      levelStatus: false,
      trendStatus: false,
      timeSelected: '',

      option:'',

    }
  },
  mounted() {
    this.$nextTick(() => {

    })
  },

  computed: {

    isDay() {
      return this.forecastType === 2 || this.forecastType === 4 || this.showType === 2
    },

    moveLeft() {
      return 'transform:translateX(' + this.dragParam.left + 'px);transition:' + this.dragParam.ani
    }
  },

  methods: {

    setDayList(str) {

      const startTime = str
        ? new Date(str)
        : new Date(new Date().getTime() - 30 * 60 * 1000);

      const arr = [];
      for (let i = 0; i <= 180; i += 6) {
        const timePoint = new Date(startTime.getTime() + i * 60 * 1000);

        const hour = timePoint.getHours();
        const minute = Math.floor(timePoint.getMinutes() / 6) * 6;
        const alignedTimePoint = new Date(timePoint);
        alignedTimePoint.setMinutes(minute, 0, 0);

        arr.push({
          name: hour + ':' + (minute < 10 ? '0' + minute : minute),
          date: alignedTimePoint,
          time: this.formatDate(alignedTimePoint, 'yyyy-MM-dd hh:mm:00'),
          label: this.formatDate(alignedTimePoint, 'MM月dd日hh点mm分')
        });
      }

      this.dayList = arr;
      console.log('生成的时间列表:', this.dayList);
    },

    sing(option) {

      this.timeType= 'level'
      this.isAuto = false
      this.pCur = 0
      clearTimeout(this.timer)
      this.forecastType = option.forecastType

      this.option=option

      this.selectList= [
        {
          label: '预报降雨',
          value: 'level'
        }
      ]

      if (option.model === 3) {
        this.showType = 3
        if (this.forecastType === 2 || this.forecastType === 4) {
          this._getDay(2)
          this.pClick(0, 'hefeng')
        } else if (this.forecastType === 1 || this.forecastType === 3) {
          this._getHours()
        }
      }
      if (option.model === 2) {
        this.showType = 2
        this._getDay(2)
        this.pClicks(0)
      }
      if (option.model === 1) {
        this.showType = 1
        if (this.forecastType === 2 || this.forecastType === 4) {
          this.selectList==[]
          this.selectList= [
            {
              label: '预报降雨',
              value: 'level'
            },
            {
              label: '分钟级降雨',
              value: 'minuteLevel'
            }
          ]
          if(this.forecastType === 2 ){

            this._getDay(2)
            this.pClick(0)
            return
          }
          if(this.forecastType === 4){
            this._getDay(4)
            this.pClick(0)
            return
          }
          debugger

        } else if (this.forecastType === 1 || this.forecastType === 3) {

          this.selectList= [
            {
              label: '预报降雨',
              value: 'level'
            }
          ]
          this._getDay(5)
          this._getHours24()
          this.pClick(0)
        }
      }

    },

    getTimeType(e){
      let _this=this
      _this.timeType=e

      if(_this.timeType=='level') {
        window.eventBus.$emit('isTime','level')
        _this.sing(_this.option)

      }else if(_this.timeType=='minuteLevel'){
        window.eventBus.$emit('isTime','minuteLevel')
        _this.getMinuteLevel()
      }
    },

    getMinuteLevel(){
      this._getDay(3)
      this.pClick(0)
    },

    _getMinutes() {
      const now = new Date();

      const startTime = new Date(now.getTime() - 6 * 60 * 1000);

      const arr = [];
      for (let i = 0; i <= 180; i += 6) {
        const timePoint = new Date(startTime.getTime() + i * 60 * 1000);

        const hour = timePoint.getHours();
        const minute = Math.floor(timePoint.getMinutes() / 6) * 6;
        const alignedTimePoint = new Date(timePoint);
        alignedTimePoint.setMinutes(minute, 0, 0);

        arr.push({
          name: hour + ':' + (minute < 10 ? '0' + minute : minute),
          date: alignedTimePoint,
          time: formatDate(alignedTimePoint, 'yyyy-MM-dd hh:mm:00'),
          label: formatDate(alignedTimePoint, 'MM月dd日hh点mm分')
        });
      }

      return arr;
    },
    _getSumDay() {
      let arr = [];
      let b = new Date();
      b.setDate(b.getDate() - 1);

      let currentHour = b.getHours();

      console.log(currentHour, 'currentHour')
      if (currentHour >= 8){
        b.setHours(8, 0, 0, 0);
      }else {
        b.setDate(b.getDate() - 1);
        b.setHours(8, 0, 0, 0);
      }

      for (let day = 1; day < 11; day++) {
        let d = new Date(b);
        d.setDate(b.getDate() + day);

        arr.push({
          name:   24 * day + 'h',
          time: formatDate(d, 'yyyy-MM-dd hh:00:00'),
          date: new Date(formatDate(d, 'yyyy-MM-dd hh:00:00')),

          label: formatDate(b, 'yyyy-MM-dd')
        });
      }

      return arr;
    },

    init() {
      this.toClearTime()
      this.timeType = 'level'

      this.showType = parseInt(new Function('return ' + window.dict.timePeriod[0].value)().showType)

      let type = parseInt(new Function('return ' + window.dict.timePeriod[0].value)().forecastType)
      this.forecastType = type
      this._getDay(type)

      this.pClick(0)
    },
 formatDate(date, fmt) {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + ''
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : (('00' + str).substr(('' + str).length)))
        }
      }
      return fmt
    },

    _getDay(type) {
      console.log(type, 'vvvvvvvvvvv')
      let list = []

      let f = (day) => {
        let b = new Date()
        b.setDate(b.getDate() + day - 1)
        let now = new Date();
        let currentHour = now.getHours();

        console.log(currentHour, 'currentHour')
        if (currentHour >= 8){
          b.setHours(8, 0, 0, 0);
        }else {
          b.setDate(b.getDate() - 1);
            b.setHours(8, 0, 0, 0);
        }
        list.push({
          date: b,
          name: 24 * day + 'h'
        })
      }

      if (type === 1) {
        for (let i = 1; i < 8; i++) {
          f(i)
        }
      } else if (type === 2) {
        for (let i = 1; i < 11; i++) {
          f(i)
        }
      }else if(type === 3){
        this.dayList = this._getMinutes()
        return
      }else if(type === 4){

        this.dayList = this._getSumDay()
        return
      }else if(type === 5){
        this.dayList = this.generate2DaysHourlyData()
        return
      }
      this.dayList = list
      console.log('dayList', this.dayList)
    },

    generate2DaysHourlyData() {
      const result = [];
      const now = new Date();

      const startHour = now.getHours() + 1;
      const startDate = new Date(now);
      startDate.setHours(startHour, 0, 0, 0);

      const totalHours = 48;

      for (let i = 0; i < totalHours; i++) {
        const currentTime = new Date(startDate);
        currentTime.setHours(startDate.getHours() + i);

        const hour = currentTime.getHours();
        const minute = currentTime.getMinutes();
        const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const formattedDate = this.formatDate(currentTime, 'yyyy-MM-dd hh:mm:00');
        const label = this.formatDate(currentTime, 'MM月dd日hh点mm分');

        result.push({
          name: formattedTime,
          date: currentTime,
          time: formattedDate,
          label: label
        });
      }

     return  result;
      console.log('生成的2天每小时数据:', result);
    },

    _getHours() {
      let arr = []

      let fun = (day) => {
        let d = new Date()
        d.setDate(d.getDate() + day)
        for (let i = 0; i < 24; i++) {
          arr.push({
            hour: i,
            date: d
          })
        }
      }

      let d = new Date()
      let h = d.getHours()
      for (let i = h + 1; i < 24; i++) {
        arr.push({
          hour: i,
          date: new Date()
        })
      }

      for (let i = 1; i < 7; i++) {
        fun(i)
      }

      d.setDate(d.getDate() + 7)
      for (let i = 0; i <= h; i++) {
        arr.push({
          hour: i,
          date: d
        })
      }
      this.hoursList = arr
    },

    _getHours24() {
      let arr = [];
      let now = new Date();
      let currentHour = now.getHours();

      for (let i = 0; i < 24; i++) {

        let targetHour = currentHour + i;

        let date = new Date(now);

        if (targetHour >= 24) {
          date.setDate(date.getDate() + 1);
          targetHour -= 24;
        }

        arr.push({
          hour: targetHour,
          date: date
        });
      }

      this.hoursList = arr;
    },

    _getHours48(){
      let arr = []

      let fun = (day) => {
        let d = new Date()
        d.setDate(d.getDate() + day)
        for (let i = 0; i < 24; i++) {
          arr.push({
            hour: i,
            date: d
          })
        }
      }

      let d = new Date()
      let h = d.getHours()
      for (let i = h + 1; i < 24; i++) {
        arr.push({
          hour: i,
          date: new Date()
        })
      }

      for (let i = 1; i <3; i++) {
        fun(i)
      }

      this.hoursList = arr
    },

    getLastModified() {
      Api.getLastModifiedDate({ hour: 24 }).then((res) => {
        this.releaseTime = res.result
      })
    },

    tipsString(obj) {
      debugger
      let b = ''
      let a = ''
      if (this.type === 3) {
        let fd = this.hoursList[0]
        b = formatDate(fd['date'], 'MM月dd日') + fd['hour'] + '时'
        a = formatDate(obj.date, 'MM月dd日') + obj.hour + '时'
      } else {
        b = formatDate(obj.date, 'MM月dd日') + obj.hour + '时'

        if (obj.hour === 23) {
          let nd = new Date(obj.date)
          nd.setDate(nd.getDate() + 1)
          a = formatDate(nd, 'MM月dd日') + '0时'
        } else {
          console.log('eeeee',this.forecastType)

          if(this.forecastType === 1 || this.forecastType === 3){
            b = formatDate(obj.date, 'MM月dd日') +(obj.hour - 1) + '时'
            a = formatDate(obj.date, 'MM月dd日') + (obj.hour ) + '时'
          }else {
            a = formatDate(obj.date, 'MM月dd日') + (obj.hour + 1) + '时'
          }
        }
      }
      return b + ' - ' + a
    },

    dayTips(d) {
      let nd = new Date(d)

      nd.setDate(nd.getDate() + 1)
      if (this.forecastType === 4) {

        return formatDate(this.dayList[0]['date'], 'MM月dd日h时') + ' - ' + formatDate(nd, 'MM月dd日h时')
      } else {
        if(this.timeType=='minuteLevel'){
          let date = new Date(d)
          return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        }else {
          return formatDate(d, 'MM月dd日h时') + ' - ' + formatDate(nd, 'MM月dd日h时')
        }
      }
    },

    _bf(idx) {
      let l = Math.abs(this.dragParam.left)
      let n = Math.floor(l / 24)
      let m = l % 24
      let c = idx - n

      let isBefore = (idx >= n && idx <= (m === 0 ? (n + 3) : (n + 4)))

      let isAfter = (idx <= (m === 0 ? (n + 50) : (n + 51))) && idx > (n + 45)

      if (isBefore) {
        return 'left:0;transform:translateX(' + (m - 24 * c) + 'px)'
      }
      if (isAfter) {
        return 'left:' + (m + (n + 50 - idx) * 24) + 'px;transform:translateX(-100%)'
      }
    },

    pClick(idx) {
      this.pCur = idx
      let n = -this.dragParam.left / 24
      this.timeSelected =  this.dayTips(this.dayList[this.pCur]['date'])

      if (!this.isDay) {
        if (idx < n) {
          this.dragParam.left = -(24 * idx)
          this.dragParam.ani = 'transform .5s'
        }
        if (idx >= (n + 50)) {
          this.dragParam.left = (49 - idx) * 24
          this.dragParam.ani = 'transform .5s'
        }
      }

      this.timeSelected = this.isDay
        ? this.dayTips(this.dayList[this.pCur]['date'])
        : this.tipsString(this.hoursList[this.pCur])

      if (this.forecastType === 2 || this.forecastType === 4) {
        if(this.forecastType === 4 ){
          const date = new Date(this.dayList[this.pCur]['time'])
          date.setDate(date.getDate() + 1);
          const dateStr = formatDate(date, 'yyyy-MM-dd ')
          window.mpPlugin.forecastLayer().showSumDayForecastContour(dateStr);
          return
        }

        if(this.timeType ==='minuteLevel'){

          window.mpPlugin.forecastLayer().showMinuteForecastContour( this.timeSelected)
          return
        }

          console.log('idx', idx)
          window.mpPlugin.forecastLayer().showForecastContour(idx)
      }else if(this.forecastType === 1){

       let tm = dayjs(this.dayList[this.pCur]['time']).format('YYYY-MM-DD HH:mm:ss')
        window.mpPlugin.forecastLayer().showHourForecastContour(tm)
      }else if(this.forecastType === 3){
        console.log(this.dayList[this.pCur])
        let tm = dayjs(this.dayList[this.pCur]['time']).format('YYYY-MM-DD HH:mm:ss')
        window.mpPlugin.forecastLayer().showAccumulatedHoursForecastContour(tm)
      }
    },

    pClicks(idx) {

      if (idx === 0) {
        window.mpPlugin.meteorology().rainFall24()
      } else if (idx === 1) {
        window.mpPlugin.meteorology().rainFall48()
      } else if (idx === 2) {
        window.mpPlugin.meteorology().rainFall72()
      }

      this.pCur = idx
      let n = -this.dragParam.left / 24

      if (!this.isDay) {
        if (idx < n) {
          this.dragParam.left = -(24 * idx)
          this.dragParam.ani = 'transform .5s'
        }
        if (idx >= (n + 50)) {
          this.dragParam.left = (49 - idx) * 24
          this.dragParam.ani = 'transform .5s'
        }
      }

      this.timeSelected = this.isDay
        ? this.dayTips(this.dayList[this.pCur]['date'])
        : this.tipsString(this.hoursList[this.pCur])

    },

    toAuto() {
      window.mpPlugin.forecastLayer().autoPlay = true

      let _auto = () => {
        if (!this.isAuto) return
        this.timer = setTimeout(() => {
          this.toNext(true)
          _auto()
        }, 2000)
      }

      if (this.isAuto) {
        this.isAuto = false
        clearTimeout(this.timer)
      } else {
        this.isAuto = true
        _auto()
      }
    },

    toNext(isAuto = false) {
      const autoPlay = window.mpPlugin.forecastLayer().autoPlay
      if (!autoPlay) {
        this.toClearTime()
      }
      if (!isAuto) {
        this.toClearTime()
      }

      let max = this.isDay ? this.dayList.length : this.hoursList.length
      let cur = this.pCur

      if (cur + 1 >= max) {
        cur = 0
      } else {
        cur += 1
      }

      if (this.showType === 1) {
        this.pClick(cur)
      } else if (this.showType === 2) {
        this.pClicks(cur)
      }

      this.pClick(cur)
    },

    toPrev() {
      this.toClearTime()

      let max = this.isDay ? this.dayList.length : this.hoursList.length
      let cur = this.pCur

      if (cur === 0) {
        cur = max - 1
      } else {
        cur -= 1
      }

      this.pClick(cur)
    },

    toClearTime() {
      this.isAuto = false
      clearTimeout(this.timer)
    }
  },

  filters: {

    day(d) {
      return formatDate(d, 'MM月dd日')
    },

    time1(t) {
      return formatDate(t, 'hh:mm')
    },

    time2(t) {
      return formatDate(t, 'MM月dd日hh时mm分')
    },

    time3(t) {
      return formatDate(t, 'MM月dd日hh时')
    }
  },
  watch: {
    ptimes: {
      handler: function(val) {
        console.log('val',val)
         this.setDayList(val);
      },
      deep: true
    }
  }

}
</script>

<style type="text/scss" lang="scss" scoped>
  .time-preview {
    position: absolute;
    left: var(--panel-gap, 1.25rem);
    bottom: var(--panel-gap, 1.25rem);
    z-index: 502;
    width: 70%;
    display: flex;
    flex-direction: row;
    align-items: flex-end;

    .tp-play, .tp-next, .tp-prev {
      width: 36px;
      height: 36px;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .tp-play {
      margin-right: 10px;
    }

    .tp-progress {
      margin: 0 10px;
      width: 1200px;
      overflow: hidden;
      height: 38px;
      padding-top: 45px;

      ul {
        display: flex;
        height: 34px;
      }

      .day-list {
        li {
          align-items: center;
          line-height: 34px;

          &:first-child {
            .tp-tips {
              left: 0;
              transform: translateX(0);
            }
          }

          &:last-child {
            .tp-tips {
              right: 0;
              left: auto;
              transform: translateX(0);
            }
          }

          &:hover {
            background: rgba(0, 0, 0, .5);

            .day-text {
              &:after {
                display: block;
              }
            }
          }

          &.active {
            background: rgba(0, 0, 0, .5);

            .day-text {
              &:after {
                display: block;
                border-top-color: #fd0;
              }
            }
          }

          .day-text {
            &:after {
              display: none;
              content: '';
              border: solid 5px;
              border-color: rgba(0, 0, 0, .5) transparent transparent;
              position: absolute;
              top: -11px;
              left: 50%;
              transform: translateX(-50%);
            }
          }
        }
      }

      .hour-list {
        display: flex;
        width: fit-content;

        .hour-text {
          height: 16px;
          line-height: 16px;
          cursor: pointer;

          &:after {
            display: none;
            content: '';
            border: solid 5px;
            border-color: rgba(0, 0, 0, .5) transparent transparent;
            position: absolute;
            top: -11px;
            left: 50%;
            transform: translateX(-50%);
          }
        }

        .hour-day {
          height: 18px;
          line-height: 18px;
          white-space: nowrap;
          position: relative;
          padding-left: 4px;
          border-left: 1px solid rgba(0, 0, 0, .5);
        }

        li {
          width: 24px;
          cursor: move;

          &:after {
            height: 16px;
          }

          &:hover {
            .hour-text {
              background: rgba(0, 0, 0, .3);

              &:after {
                display: block;
              }
            }
          }

          &.active {
            .hour-text {
              background: rgba(0, 0, 0, .3);

              &:after {
                display: block;
                border-top-color: #fd0;
              }
            }
          }
        }
      }

      .tp-tips {
        display: none;
        position: absolute;
        top: -45px;
        height: 34px;
        background: rgba(0, 0, 0, .5);
        border-radius: 5px;
        color: #00fff6;
        padding: 0 10px;
        white-space: nowrap;
        left: 50%;
        transform: translateX(-50%);
        line-height: 34px;
      }

      li {
        flex: 1;
        height: 34px;
        border-top: 4px solid;
        background: rgba(0, 0, 0, .2);
        border-color: rgba(0, 0, 0, 0.5);
        font-size: 14px;
        text-align: center;
        color: #00fff6;
        position: relative;
        transition: all .5s;

        &:after {
          content: '';
          position: absolute;
          right: -1px;
          top: 0;
          height: 34px;
          width: 1px;
          background: rgba(0, 0, 0, .5);
        }

        &:hover {
          .tp-tips {
            display: block;
          }
        }

        &.active {
          border-top-color: #fd0;
          color: #fd0;

          .tp-tips {
            background: #fd0;
            color: #222;
            display: block;
          }
        }

        &.isTotal {
          border-top-color: #fd0;
        }
      }
    }

    .tp-select {
      bottom: 85px;
      left: 0;
      height: 40px;
      width: 200px;
      position: absolute;
      display: flex;
      flex-direction: row;

      .tps-label {
        background: rgba(0, 255, 246, .8);
        color: #333;
        line-height: 38px;
        font-weight: bold;
        font-size: 16px;
        padding: 0 8px;
        white-space: nowrap;
        border: 1px solid #00fff6;
        border-right: none;
        border-radius: 3px 0 0 3px;
      }
    }
  }

  .time-show {
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 503;
    padding: 10px 15px;
    line-height: 20px;
    color: #222;
    font-size: 15px;
    border-radius: 5px;
    background: #fd0;
  }
</style>
