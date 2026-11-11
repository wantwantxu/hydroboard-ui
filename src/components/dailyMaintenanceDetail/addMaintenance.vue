<template>

    <div class="modelIndex model"  v-if="isShow" v-drag>
      <div class="hd">
        <h3>
          <lottie class="mainfirst" :options="mainfirst" :width="20" style="float:left;"/>
          <div class="name">{{ '新增维护记录' }}</div>
          <span class="close" @click="close">
                 <i class="el-icon-close"></i>
                 </span>
        </h3>
        <lottie class="mainfirst2" :options="mainfirst2" :width="1000" style="height: 20px;opacity: 1;"/>
      </div>
<!--      <el-table
        :data="tableData"
        max-height="390px" stripe highlight-current-row>
        <el-table-column label="序号" width="50">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="站名" prop="stnm"/>
        <el-table-column label="站码" prop="stcd"/>
        <el-table-column label="维护类型" prop="maintenanceType"/>
        <el-table-column label="维护负责人" prop="responsiblePerson"/>
        <el-table-column label="维护内容" prop="maintenanceContent"/>
        <el-table-column label="维护结果" prop="maintenanceResult"/>
        <el-table-column label="维修时间" prop="maintenanceDate"/>
        <el-table-column label="备注" prop="remark"/>
      </el-table>-->
      <el-form :model="form" :inline="true" label-position="right" class="addMaintenance" label-width="100px" ref="maintenanceForm">
        <el-form-item label="站名" prop="stcd">
          <el-select v-model="form.stcd" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.stcd"
              :label="item.stnm"
              :value="item.stcd">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维护类型" prop="maintenanceType">
          <el-select v-model="form.maintenanceType" placeholder="请选择">
            <el-option
              v-for="item in maintenanceTypes"
              :key="item.value"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维护负责人" prop="name">
          <el-input v-model="form.responsiblePerson" clearable></el-input>
        </el-form-item>
        <el-form-item label="维护结果" prop="maintenanceResult">
          <el-select v-model="form.maintenanceResult" placeholder="请选择">
            <el-option
              v-for="item in maintenanceResults"
              :key="item.value"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维护内容" prop="maintenanceContent">
          <el-input type="textarea" v-model="form.maintenanceContent" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" clearable></el-input>
        </el-form-item>
        <el-form-item label="维护时间" prop="maintenanceDate">
          <el-date-picker
            v-model="form.maintenanceDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上传附件" prop="attachment" style="width: 100%">
           <el-upload
            class="upload-demo"
            drag
            :action="uploadUrl"
            :file-list="fileList"
            :on-success = "success"
            :before-upload = "beforeUpload"
            name="files"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="ybfajs" @click="saveData">
        <span>保存</span>
      </div>
    </div>
<!--  </div>-->

</template>

<script>
import mainfirst from '../../assets/json/green.json'
import mainfirst2 from '../../assets/json/green2.json'
import Api from '@/api'

export default {
name: "addMaintenance",
  data(){
  return{
    mainfirst: {
      animationData: mainfirst,
      renderer: 'svg',
      loop: true,
      autoplay: true
    },
    mainfirst2: {
      animationData: mainfirst2,
      renderer: 'svg',
      loop: true,
      autoplay: false
    },
    isShow: false,
    form:{
      stcd: '',
      maintenanceType: '',
      responsiblePerson: '',
      maintenanceContent: '',
      maintenanceResult: '',
      maintenanceDate: '',
      remark: ''
    },
    options: [],
    maintenanceType: [],
    maintenanceTypes: [
     {
        value: '日常检查'
    },{
        value: '设备维修'
    },{
        value: '清洁保养'
    },{
        value: '应急处理'
    }],
    maintenanceResults: [
      {
        value: '合格'
      },
      {
        value: '待整改'
      },
      {
        value: '需复查'
      }
    ],
    fileList: [],
    attachList: []
   }
  },
  computed: {
    uploadUrl: ()=>{
      return  process.env.API_HOST + '/ss/dailyMaintenance/uploadFiles'
    }
  },
  mounted() {
  this.$nextTick(() => {

    this.getStationOptions()
  })
  },
  methods: {
     getDetailInfo(stcd){
       let param = {
         stcd: stcd
       }
       Api.getDailyMaintenanceDetailsList(param).then(res => {
         console.log(res)
         this.tableData = res.result
       })
     },
    close(){
       this.isShow = false
    },
    success(response, file, fileList){
       console.log(response)
       console.log(file)
       console.log(fileList)
       this.attachList.push(response.result[0])
    },
    getStationOptions(){
      Api.getStationList().then(res => {
        if (res.code === 200) {
          this.options = res.result
        }
      })
    },
    saveData(){
       let that = this
       let attanchments = []
       this.attachList.forEach(item => {
         let p = {
           stcd: that.form.stcd,
           attachName: item.newFileName,
           attachUrl: item.url
         }
         attanchments.push(p)
       })
       let params = Object.assign({},this.form,{
         attanchments: attanchments
       })
      console.log(JSON.stringify(params))
      Api.addDailyMaintenance(JSON.stringify(params)).then(res => {
         if (res.code === 200) {
           this.isShow = false
           this.$message.success("保存成功！")
           this.$refs.maintenanceForm.resetFields()
           this.attachList = []
           window.eventBus.$emit('refreshMaintenanceList')
         }else {
           this.$message.error("新增失败")
         }
      })
    },
    beforeUpload(file){

      const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJPGOrPNG) {
        this.$message.error('上传文件只能是 JPG 或 PNG 格式!');
        return false;
      }
      return true;
    }
  }
}
</script>

<style lang="scss" scoped>
.model{
  position: absolute;
  z-index: 503;
  top: 100px;
  left: 50%;

  width: 950px;

  transform: translateX(-50%);
}
.modelIndex {
  padding: 15px;
  background: rgba(0, 16, 30, .8);
  border-radius: 4px;
  color: #fff;
  border: 1px solid #00fff6;
.hd{
>h3{
  overflow: hidden;
.name{
  float: left;
  font-size: 20px;
  font-family: YouSheBiaoTiHei-Regular, YouSheBiaoTiHei, sans-serif;
  font-weight: 400;
  margin-left: 35px;
}
.close{
  float: right;
  cursor: pointer;
}
}

}
.card-item{
  padding: 10px;
  background: #00000033;
  border-radius: 8px 8px 8px 8px;
h6{
  font-size: 14px;
  padding: 0 20px;
  line-height: 40px;
  font-weight: normal;
  background: url(../../assets/images/item-header.png) 0 center no-repeat;
}
.card-item-content{
  padding: 20px;
}
}

}
.ybfajs{
  width: 20%;
  position: relative;
  left: 43%;
  line-height: 40px;
  text-align: center;
  color: #00FFF6;
  background: url(../../assets/images/ybfajs1.png) 0 0 no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
  span{
    display: inline-block;
    margin: 0 0 0 0px;
  }
  span:last-child{

  }
}
.ybfajs:hover{
  color: #CCFF00;
  background: url(../../assets/images/ybfajs2.png) 0 0 no-repeat;
  background-size: 100% 100%;
  
}

</style>
