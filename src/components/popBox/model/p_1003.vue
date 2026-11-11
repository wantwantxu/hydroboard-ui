<template>
  <div class="pop-base">
    <div class="pop-hd">
      <span @click="toClose">
        <i class="el-icon-close"></i>
      </span>
      <h3>
        <i class="el-icon-location-information"></i>
        {{options.title}}
      </h3>
    </div>
    <div class="pop-tips">温度：<span>{{data.wd}} ℃</span></div>
    <div class="pop-tips">气压：<span>{{data.qy}}hpa</span></div>
    <div class="pop-tips">降水：<span>{{data.js}}mm</span></div>

    <div class="pop-tips">风力：<span>{{data.fl}}</span></div>

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
data() {
  return {
    data: {
      wd: '',
      qy: '',
      js: '',
      fx: '',
      fl: '',
      xdsd: ''
    }
  }
},
    props: {
      options: {
        type: Object,
        default() {
          return null
        }
      }
    },
    methods: {

      getData(data) {
        console.log('获取图表数据:', data)


        this.data = {
          wd: data[19],
          qy: data[8],
          js: data[12],

          fl: data[7] === '9999' ? '--' : data[7] + '级',
          xdwd: ''
        }

      },
      toClose() {
        this.$emit('close')
      },

      formatFX(degrees) {
        let directArr = [ '北风', '东北风', '东风', '东南风',
          '南风', '西南风', '西风', '西北风']
        let index = 0

        if ((degrees > 337.5 && degrees <= 360) || degrees <= 22.5) {
          index = 0
        } else if (degrees > 22.5 && degrees <= 67.5) {
          index = 1
        } else if (degrees > 67.5 && degrees <= 112.5) {
          index = 2
        } else if (degrees > 112.5 && degrees <= 157.5) {
          index = 3
        } else if (degrees > 157.5 && degrees <= 202.5) {
          index = 4
        } else if (degrees > 202.5 && degrees <= 247.5) {
          index = 5
        } else if (degrees > 247.5 && degrees <= 292.5) {
          index = 6
        } else if (degrees > 282.5 && degrees <= 337.5) {
          index = 7
        } else {
          console.error('degrees 大于 360.0了', degrees)
        }
        return directArr[index]
      }
    },
    watch: {
      options: {
        handler(v) {
          this.$nextTick(() => {
            this.getData(v)
          })
        },
        immediate: true
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .pop-base {
    padding: 15px 15px 5px;
    box-shadow: 0 0 10px 0 #00fff6;
    background: rgba(0, 16, 30, .9);
    border-radius: 8px;
    color: #fff;
    width: 300px;
height: 160px;
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

        i {
          color: rgba(0, 252, 255, .7);
        }
      }
    }

    .pop-tips {
      margin-top: 8px;
      color: white;
      font-size: 15px;
      padding-left: 25px;

      line-height: 20px;
      span {
        color: #00fff6;
        font-size: 16px;
      }
    }

    .pop-chart {
      height: 180px;

      & > .chart {
        height: 100%;
      }
    }
  }
</style>
