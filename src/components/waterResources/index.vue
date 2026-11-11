<template>
    <div class="bg-com pt15" >
        <div class="hd">
            <h3>
            <lottie class="mainfirst" :options="mainfirst" :width="20" style="float:left;"/>
            <div class="name">{{ 'xxx-合理性计算' }}</div>
            
            </h3>
        </div>
      <div class="card">
        <el-form style="padding: 0 20px;" label-width="72px">
          <el-form-item label="径流深:">
            <el-input v-model="value" placeholder="请输入径流深" style="width: 200px;"/>
          </el-form-item>
          <el-form-item label="径流量:">
            <el-input v-model="value" placeholder="请输入径流量" style="width: 200px;"/>
          </el-form-item>
          <el-form-item label="径流系数:">
            <el-input v-model="value" placeholder="请输入径流系数" style="width: 200px;"/>
          </el-form-item>
          <el-form-item label="合理性:">
            <span style="border-radius: 4px;padding: 5px 10px;border: 1px solid #CCFF00;color: #CCFF00;">待计算</span>
          </el-form-item>
          <div class="ybfajs" @click="$emit('resultShow')">
            <span>计 算</span>
            <span></span>
          </div>
        </el-form>
        <el-divider class="divider">与此相邻地区</el-divider>
      </div>
      <div class="card" v-for="item in 2" :key=item>
        <el-form style="padding: 10px 20px;background-color: rgba(0, 16, 30, 1);border-radius: 8px;" label-width="72px">
          <h6><span>邻县 - xxx</span></h6>
          <el-form-item label="径流深:">
            <el-input v-model="value" placeholder="请输入径流深" style="width: 200px;"/>
          </el-form-item>
          <el-form-item label="径流量:">
            <el-input v-model="value" placeholder="请输入径流量" style="width: 200px;"/>
          </el-form-item>
          <el-form-item label="径流系数:">
            <el-input v-model="value" placeholder="请输入径流系数" style="width: 200px;"/>
          </el-form-item>
          <el-form-item label="合理性:">
            <span style="border-radius: 4px;padding: 5px 10px;border: 1px solid #00FFF6;color: #00FFF6;">正常</span>
          </el-form-item>
          <div class="ybfajs" @click="$emit('resultShow')">
            <span>计 算</span>
            <span></span>
          </div>
        </el-form>
      </div>
    </div>
</template>

<script>
import mainfirst from '../../assets/json/green.json'
export default {
  data(){
      return{
        mainfirst: {
            animationData: mainfirst,
            renderer: 'svg',
            loop: true,
            autoplay: true
        },
      }
  },
  methods:{
    rowClick(){

    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.hd{
    padding: 10px;
    color: #fff;
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
.card {
  padding: 0 10px;
  h6{
    font-size: 14px;
    padding: 0 20px;
    line-height: 40px;
    font-weight: normal;
    background: url(../../assets/images/item-header.png) 0 center no-repeat;
    span:last-child{
        color: #00FFF6;
        margin-left: 10px;
    }
    }
  .ybfajs{
    line-height: 40px;
    text-align: center;
    color: #00FFF6;
    background: url(../../assets
    background-size: 100% 100%;
    cursor: pointer;
    span{
      display: inline-block;
      margin: 0 5px;
    }
    span:last-child{
      width: 12px;
      height: 12px;
      background: url(../../assets/images/js1.png)  0 0 no-repeat;
      background-size: cover;
    }
  }
  .ybfajs:hover{
    color: #CCFF00;
    background: url(../../assets
    background-size: 100% 100%;
    span:last-child{
      background: url(../../assets/images/js2.png)  0 0 no-repeat;
      background-size: cover;
    }
  }
  .divider{
        background-color: #00FFF6;
        .el-divider__text{
            background-color: rgba(0, 16, 30, 1);
            color: #00FFF6;
        }
  }
}
</style>