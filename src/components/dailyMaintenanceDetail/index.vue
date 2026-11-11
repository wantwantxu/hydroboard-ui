<template>
  <div class="model" v-if="isShow" v-drag>
    <div class="modelIndex" >
      <div class="hd">
        <h3>
          <lottie class="mainfirst" :options="mainfirst" :width="20" style="float:left;"/>
          <div class="name">{{ '维修详情' }}</div>
          <span class="close" @click="close">
                 <i class="el-icon-close"></i>
                 </span>
        </h3>
        <lottie class="mainfirst2" :options="mainfirst2" :width="1300" style="height: 20px;opacity: 1;"/>
      </div>
      <el-table
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
        <el-table-column label="附件"  align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              v-if="scope.row.ssDailyMaintenanceAttaches[0].attachUrl"
              :src="scope.row.ssDailyMaintenanceAttaches[0].attachUrl"
              :preview-src-list="scope.row.ssDailyMaintenanceAttaches.map(item => item.attachUrl)">
            </el-image>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import mainfirst from '../../assets/json/green.json'
import mainfirst2 from '../../assets/json/green2.json'
import Api from '@/api'

export default {
name: "index",
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
    tableData: [],
    isShow: false
  }
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
  width: 70%;

   height: 955px;
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
  font-size: 20px;
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
</style>
