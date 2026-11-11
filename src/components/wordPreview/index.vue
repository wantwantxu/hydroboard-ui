<template>

  <div class="waringPopup bg-com wrap" v-if="dialogTableVisible" v-drag>
    <div class="title-box second">
      <h2>预警信息预览</h2>
      <span class="pop-hd" @click="close">
        <i class="el-icon-close"></i>
      </span>
    </div>
    <div class="wordPreview">
      <div v-if="loading">加载中...</div>
      <WordPreview ref="wordPreview" v-if="!loading"></WordPreview>
    </div>

    <div class="ybfajs" @click="download">
      <span>下载</span>
      <span></span>
    </div>
  </div>
</template>

<script>

import WordPreview from './wordPreview'
import Api from '@/api'
import dayjs from 'dayjs'

export default {
  name: "index",
  components: { WordPreview },
  data(){
    return {
      fileBlob: null,
      dialogTableVisible: false,
      docxUrl: null,
      data: null,
      loading: true
    }
  },
  methods: {
    handleWordPreview(data){
      let that = this
      that.data = data
      this.dialogTableVisible = true
      let params = {
        phase: 35,
        dateTime: dayjs().format('YYYY年MM月DD日HH时'),
        warnType: data.level,
        warnContent: data.content,
      }
      Api.getWarnPreviewWord(params).then(res => {
        console.log(res)
        that.loading = false
        that.$refs.wordPreview.docxUrl = res
        that.$refs.wordPreview.loading = false
      })
    },
    handleFileChange(e) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        this.$refs.wordPreview.docxUrl = reader.result
      }
      reader.readAsArrayBuffer(file)
    },
    close(){
      console.log("关闭dialog")
      this.dialogTableVisible = false
      this.$refs.wordPreview.docxUrl = null
    },
    download(){
      try{
        let that = this
        let params = {
          phase: 35,
          dateTime: dayjs().format('YYYY年MM月DD日HH时'),
          warnType: this.data.level,
          warnContent: this.data.content,
        }
        Api.getWarnDownloadWord(params).then(res => {
          let fileName = '洪水'+that.data.level+'预警.docx'
          let blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})
          let eLink = document.createElement('a')
          eLink.href = URL.createObjectURL(blob)
          eLink.download = fileName
          document.body.appendChild(eLink)
          eLink.click()
          document.body.removeChild(eLink)
        })
      }catch (e){
        console.error('下载失败！', e)
        this.$message.error("下载失败！")
      }

    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.waringPopup{
  position: absolute;
  top: 100px;
  left: 30%;
  margin: 0;
  width: 900px;
  z-index: 999999;
  .title-box {
    text-align: center;
    position: relative;

    .title-arrow {
      position: absolute;
      right: 10px;
      top: 7px;
      width: 30px;
      height: 30px;
      text-align: center;
      border: 1px solid rgba(255, 247, 0, 0.5);
      border-radius: 6px;
      line-height: 30px;
      background: rgba(0, 16, 30, .8);
      cursor: pointer;

      img {
        padding-top: 5px;
        width: 20px;
        transition: all .5s;
      }
    }
    .pop-hd{
      float: right;
      color: rgba(0, 252, 255, .7);
      font-size: 24px;
      cursor: pointer;
      margin-right: 10px;
    }
    &.open {
      width: 180px;
      background: rgba(0, 16, 30, .8);
      float: right;
      h2 {
        padding: 10px 25px 10px 5px;
        display: block;
        &:before, &:after {
          display: none;
        }
      }
      .title-arrow {
        transform: rotate(180deg);
      }
    }

    &.second {
      h2 {
        color: #00fff6;
      }
    }

    h2 {
      padding: 10px 25px;
      line-height: 25px;
      font-size: 22px;
      color: #fff;
      display: inline-block;
      vertical-align: top;
      border: 1px solid rgba(0, 255, 255, .15);
      border-radius: 6px;
      position: relative;

      &:before, &:after {
        content: '';
        position: absolute;
        width: 6px;
        height: 6px;
        background: #0ff;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        box-shadow: 0 0 5px #00fcff;
      }

      &:before {
        animation: around1 4s linear infinite
      }

      &:after {
        animation: around2 4s linear infinite
      }
    }
  }
  .wordPreview{
    margin-top: 15px;
    max-height: 700px;
    overflow-y: scroll;
  }
}
.ybfajs{
  width: 200px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 40%;
  border-radius: 5px;
  line-height: 40px;
  text-align: center;
  color: #00FFF6;
  background: url(../../assets/images/ybfajs1.png) 0 0 no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
  span{
    display: inline-block;
    margin: 0 0 0 15px;
  }
  span:last-child{

  }
}
.ybfajs:hover{
  color: #CCFF00;
  background: url(../../assets/images/ybfajs2.png) 0 0 no-repeat;
  background-size: 100% 100%;
  
}

@keyframes around1 {
  0%, to {
    left: 100%;
    top: 0
  }
  25% {
    left: 0;
    top: 0
  }
  50% {
    left: 0;
    top: 100%
  }
  75% {
    left: 100%;
    top: 100%
  }
}

@keyframes around2 {
  0%, to {
    left: 0;
    top: 100%
  }
  25% {
    left: 0;
    top: 0
  }
  50% {
    left: 100%;
    top: 0
  }
  75% {
    left: 100%;
    top: 100%
  }
}
</style>
