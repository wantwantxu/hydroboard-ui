<template>
  <div class="time-area" v-if="timeShow">
    <span class="name">降雨分布</span>
    <el-date-picker v-model="date" :picker-options="options" type="datetimerange" range-separator="至"
                    suffix-icon="el-icon-date"
                    popper-class="time-area-picker"
                    format="yyyy年MM月dd日HH时" value-format="yyyy-MM-dd HH:mm:ss" ref="dateTime" :clearable="false" @change="changeSet"/>
    <span class="arrow"><i class="el-icon-caret-bottom"></i></span>
  </div>
</template>

<script type="text/ecmascript-6">
  import {formatDate} from '@/assets/js/common'
  import dayjs from 'dayjs'

  let et = new Date()
  let shortList = [
    {
      text: '昨天8时到现在',
      onClick(picker) {
        let y = new Date(new Date().setDate(new Date().getDate() - 1))
        picker.$emit('pick', [new Date(formatDate(y, 'yyyy-MM-dd 08:00:00')), et])
      }
    }
  ]
  if (new Date().getHours() > 8) {
    shortList.push({
      text: '今天8时到现在',
      onClick(picker) {
        picker.$emit('pick', [new Date(formatDate(new Date(), 'yyyy-MM-dd 08:00:00')), et])
      }
    })
  }
  let arr = [3, 6, 12, 24, 48, 72]
  for (let i = 0; i < arr.length; i++) {
    shortList.push({
      text: '最近' + arr[i] + '小时',
      onClick(picker) {
        picker.$emit('pick', [new Date(et.getTime() - 60 * 60 * 1000 * arr[i]), et])
      }
    })
  }
  export default {
    props: {
      timeShow: {
        type: Boolean,
        default() {
          return false
        }
      }
    },
    data() {
      return {
        type: 1006,
        options: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [...shortList],
          onPick: (time) => {
            if (time.maxDate) {
              const end = new Date()
              const end1 = new Date(time.maxDate)
              if (dayjs(end).format('YYYY-MM-DD') === dayjs(end1).format('YYYY-MM-DD')) {
                setTimeout(() => {
                  this.$refs.dateTime.picker.maxDate = new Date()
                }, 15)
              }else{
                setTimeout(() => {
                  this.$refs.dateTime.picker.maxDate = new Date(dayjs(end1).format('YYYY-MM-DD 23:59:59'))
                }, 15)
              }
            }
        }
        },
        
        date: []
      }
    },
    methods: {
      init() {

        let e = new Date()
        if (new Date().getHours() > 8) {
          this['date'] = [formatDate(e, 'yyyy-MM-dd 08:00:00'), formatDate(e, 'yyyy-MM-dd hh:mm:ss')]
        } else {
          let y = new Date(new Date().setDate(new Date().getDate() - 1))
          this['date'] = [formatDate(y, 'yyyy-MM-dd 08:00:00'), formatDate(e, 'yyyy-MM-dd hh:mm:ss')]
        }
        this.changeSet()
      },
      changeSet() {
        window.mpPlugin.isosurface().show(this['date'][0], this['date'][1])
      }
    },
    watch: {
      timeShow(v) {
        if (v) {
          this.init()
        }
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .time-area {
    display: flex;
    align-items: center;
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 502;
    height: 42px;
    padding: 0 36px 0 16px;
    border: 1px solid rgba(0, 255, 246, 0.45);
    border-radius: 4px;
    background: rgba(0, 16, 30, 0.78);
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.28);

    .name {
      flex-shrink: 0;
      margin-right: 8px;
      line-height: 42px;
      color: #00fff6;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.5px;
      white-space: nowrap;

      &::after {
        content: '：';
      }
    }

    .arrow {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      line-height: 14px;
      text-align: center;
      color: #00fff6;
      border-radius: 3px;
      border: 1px solid rgba(0, 255, 246, 0.55);
      pointer-events: none;
    }

    ::v-deep .el-range-editor.el-input__inner {
      background: transparent;
      border-color: transparent;
      padding-right: 0;

      .el-range-input {
        color: #00fff6 !important;
        -webkit-text-fill-color: #00fff6;
        font-weight: 600;
        font-size: 14px;
      }

      .el-range-separator {
        color: rgba(0, 255, 246, 0.85);
      }

      .el-range__icon,
      .el-icon-date,
      .el-icon-time,
      .el-range__close-icon {
        color: rgba(0, 255, 246, 0.85);
      }
    }
  }
</style>
