<template>
  <div class="waringPopup bg-com wrap" v-if="isShow" v-drag>

    <div class="title-box second">
      <h2>预警发布</h2>
      <span class="pop-hd" @click="close">
        <i class="el-icon-close"></i>
      </span>
    </div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="预警标题">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="预警级别">
        <el-select v-model="form.level" placeholder="请选级别" @change="changeWarnLevel">
          <el-option label="红色" value="红色"></el-option>
          <el-option label="橙色" value="橙色"></el-option>
          <el-option label="黄色" value="黄色"></el-option>
          <el-option label="蓝色" value="蓝色"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预警内容">
        <editor @input="changeContent" v-model="form.content" ref="editor"></editor>
      </el-form-item>
    </el-form>
    <div class="footer">

      <div class="ybfajs" @click="openWordPreview">
        <span>预览</span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script>
import Editor from '../../tinyEditor'
import TitleBox from '@/components/titleBox'
import dayjs from "dayjs";
export default {
name: "issueWarning",
  components: {Editor, TitleBox},
  data(){
  return{
    isShow: false,
    form: {
      title: '',
      level: '蓝色',
      content: ''
    },
    warnInfo: [],
    isDepartmentWarn: false
  }
  },
  mounted() {
    window.eventBus.$on('editorInitFinish', () => {
      console.log("editor初始化好了")

      this.initEditContent()
    })
  },
  methods: {
    close(){
      this.isShow = !this.isShow
    },
    openWordPreview(){
      this.$emit('openWordPreview',this.form)
    },
    initEditContent(){

      let warnTypeMap = new Map()
      let warnTypeResMap = new Map()
      warnTypeMap.set('红色', 4)
      warnTypeMap.set('橙色', 3)
      warnTypeMap.set('黄色', 2)
      warnTypeMap.set('蓝色', 1)
      warnTypeResMap.set(1,'蓝色')
      warnTypeResMap.set(2,'黄色')
      warnTypeResMap.set(3,'橙色')
      warnTypeResMap.set(4,'红色')
      let maxLevel = 1;
      if(this.isDepartmentWarn){
        this.warnInfo.forEach(item => {
          if(warnTypeMap.get(item.wrLevel)>maxLevel){
            maxLevel = warnTypeMap.get(item.wrLevel)
          }
          this.form.content += '<p style="line-height: 1.5"> &nbsp; &nbsp; &nbsp;'+ item.wrDetail + '</p>'
        })
        this.form.level = warnTypeResMap.get(maxLevel)
        this.$refs.editor.value = this.form.content
        return
      }
      this.warnInfo.forEach(item => {
          if(warnTypeMap.get(item.warnType)>maxLevel){
            maxLevel = warnTypeMap.get(item.warnType)
          }
        })
      this.form.level = warnTypeResMap.get(maxLevel)
      this.getWarnContent(this.warnInfo, this.form.level)
      this.$refs.editor.value = this.form.content
    },
    getWarnContent(data, warnType){
      let that = this
      that.form.content = '<p style="line-height: 1.5"> &nbsp; &nbsp; &nbsp;受强降雨影响，'
      data.forEach(item => {
        that.form.content += item.addvnm ? item.addvnm : '' + item.rvnm + item.stnm + dayjs(item.tm).format('HH时mm分')
          + '水位' + item.rtValue + 'm,' + item.type +'水位,目前水位仍呈上涨趋势，'
      })
      that.form.content += '示范市水文局发布洪水' + warnType
      + '预警，提请沿岸相关单位及社会公众加强防范，及时避险。</p>'
    },
    changeContent(value){
      console.log(value)
    },
    changeWarnLevel(val){
      this.getWarnContent(this.warnInfo, val)
      this.$refs.editor.value = this.form.content
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
}
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

.footer{
  float: right;
  margin-top: 10px;
  margin-right: 10px;
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
.ybfajs{
  line-height: 40px;
  text-align: center;
  border-radius: 5px;
  margin-bottom: 5px;
  color: #00FFF6;
  background: url(../../../assets/images/ybfajs1.png) 0 0 no-repeat;
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
  background: url(../../../assets/images/ybfajs2.png) 0 0 no-repeat;
  background-size: 100% 100%;
  
}
</style>
