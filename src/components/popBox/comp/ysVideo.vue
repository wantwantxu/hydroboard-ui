<template>
  <div class="app">
    <div class="title">
      <img class="img" src="@/assets/images/phone.png" >
      <div class="font"><p>视频监控</p></div>
    </div>
    <div class="content">
      <div v-if="!show" class="empty-state">
        <img class="nosign" src="@/assets/images/nosignal.png" alt="无视频信号">
        <p class="empty-text">{{ msg || '暂无关联视频站点' }}</p>
      </div>
      <div v-for="(v,index) in list" :key="index">
        <EasyPlayer
          v-if="show"
          autoplay
          :alt = "alts"
          v-model="v.url"
          :muted="muted"
          style="width: 100%;height: 100%;margin-top: 8px"
          ref="easyPlayer"
          live :reconnection="true">
        </EasyPlayer>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '../../../api'

const loadEasyPlayer = () =>
  new Promise((resolve, reject) => {
    if (window.EasyPlayer) {
      resolve(window.EasyPlayer)
      return
    }
    const scriptId = 'easyplayer-component-script'
    const existing = document.getElementById(scriptId)
    if (existing) {
      existing.addEventListener('load', () => resolve(window.EasyPlayer))
      return
    }
    const script = document.createElement('script')
    script.id = scriptId
    script.src = '/static/js/EasyPlayer-component.min.js'
    script.async = true
    script.onload = () => resolve(window.EasyPlayer)
    script.onerror = () => reject(new Error('EasyPlayer script load failed'))
    document.head.appendChild(script)
  })

export default {
  name: 'ysVideo',
  props: {
    options: {
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      videoUrl: '',
      startVideotape: false,
      muted: true,
      alts: '暂无关联视频站点',
      msg: '',
      show: false,
      list: []
    }
  },
  components: {
    EasyPlayer: () => loadEasyPlayer()
  },
  methods: {
  isArray(value) {
  return Array.isArray(value);
},
  isJson(value) {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    try {
      JSON.stringify(value);
      return true;
    } catch (e) {

      return false;
    }
  },
    getVideoUrl(options) {
      this.options = options
       this.list =[]
        let url=window.dict.videoUrl[0].value
      Api.getUrl(url,{stcd: this.options.stcd}).then(res => {
        if (res.code === 200) {
          const result = res.result
          if (result === null||result.length==0) {
            this.show = false
            this.alts = '不存在该站信息'
            this.msg = '暂无关联视频站点'
            return
          }else {

            if(this.isArray(result)){
              this.list = result
              this.$nextTick(() => {
                this.show = true
              })
              return
            }

           if(this.isJson(result)){
             result.url=result.videoUrl
             this.list.push(result)
             this.$nextTick(() => {
               this.show = true
             })
             return
           }

          }

        }
      })
    }

  },
  watch: {
    options: {
      handler(v) {
        this.getVideoUrl(v)
      },
      immediate: true
   }
  }
}
</script>

<style lang="scss" scoped>
  .app{
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .title{
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 12px;
      box-sizing: border-box;
      flex: 0 0 auto;

      .img{
        width: 20px;
        height: 19px;
        margin: 0;
        flex: 0 0 auto;
      }
      .font{
        margin: 0;
        display: flex;
        align-items: center;
        min-height: 100%;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei,sans-serif;;
        font-size: 18px;
        color: #00FFF6;
        font-weight: bold;

        p {
          margin: 0;
          line-height: 1;
          white-space: nowrap;
        }
      }
      width: 100%;
      height: 38px;
      background: linear-gradient(90deg, rgba(0,255,246,0.5) 0%, rgba(0,255,246,0) 100%);
      border-radius: 4px 4px 4px 4px;
      opacity: 1;

    }
    .content{
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;

      .empty-state {
        width: 100%;
        min-height: 12rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
      }

      .nosign{
        margin: 0;
        width: 220px;
        max-width: 75%;
        height: auto;
        max-height: 210px;
        object-fit: contain;
        border-radius: 0px 0px 0px 0px;
      }

      .empty-text {
        margin: 14px 0 0;
        font-size: 16px;
        line-height: 24px;
        color: rgba(255, 255, 255, 0.88);
      }
    }
  }
</style>
