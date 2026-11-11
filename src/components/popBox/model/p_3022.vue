<template>
  <div class="pop-base">
    <span class="close" @click="toClose"><i class="el-icon-close"></i></span>
    <dl>
      <dt>{{data.name}}</dt>
      <dd>采砂船编号：{{data.no}}</dd>
      <dd>行政区：{{data.addvnm}}</dd>
      <dd>所属企业：{{data.companyName}}</dd>
      <dd>联系人：{{data.companyUser}}</dd>
      <dd>联系电话：{{data.companyTel}}</dd>
      <dd>时间：{{data.tm}}</dd>
      <dd>经度：{{data.lat}}</dd>
      <dd>维度：{{data.lng}}</dd>
      <dd>水深：{{data.waterDepth}}米</dd>
    </dl>
    <div class="btn-track" @click="toTrackShow">
      查看行驶轨迹
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import eventBus from '@/eventBus'
import Api from '@/api'
  export default {
    props: {
      options: {
        type: Object,
        default() {
          return null
        }
      }
    },
    data() {
      return {
        data: {}
      }
    },
    methods: {
      get(data) {
        Api.getShip({no: this.options.shipNo}).then(response => {
          if (response.code === 0) {
            const res = response.result[0]
            this.data = Object.assign(data, res)
          }
        })
      },
      toClose() {
        this.$emit('close')
      },
      toTrackShow() {
        console.log('显示行驶轨迹')
        this.toClose()
        eventBus.$emit('trackShow', this.options.shipNo)
      }
    },
    watch: {
      options: {
        handler(newValue, oldValue) {
          this.get(newValue)
        },
        immediate: true
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .pop-base {
    padding: 15px;
    box-shadow: 0 0 10px 0 #00fff6;
    background: rgba(0, 16, 30, .9);
    border-radius: 8px;
    color: #fff;
    position: relative;

    dt {
      font-size: 16px;
      line-height: 30px;
      margin-bottom: 5px;
    }

    dd {
      line-height: 24px;
      font-size: 14px;
    }

    .close {
      position: absolute;
      right: 4px;
      top: 4px;
      color: rgba(0, 252, 255, .7);
      font-size: 16px;
      cursor: pointer;
    }

    .btn-track {
      position: absolute;
      padding: 0 10px;
      background: rgba(0, 255, 246, .5);
      color: #fff;
      right: 10px;
      bottom: 10px;
      line-height: 32px;
      border-radius: 6px;
      cursor: pointer;
      transition: all .5s;

      &:hover {
        background: rgba(0, 255, 246, .7);
      }
    }
  }
</style>
