<template>
  <div class="modelIndex">
    <div class="hd">
      <h3>
        <lottie class="mainfirst" :options="mainfirst" :width="20" style="float:left;"/>
        <div class="name">{{ options.fcstObjects.name }} - {{ options.modelName }}</div>
        <el-button
          class="close"
          type="text"
          icon="el-icon-close"
          @click="$emit('close')"
        />
      </h3>
      <lottie class="mainfirst2" :options="mainfirst2" :width="1300" style="height: 20px;opacity: 1;"/>
    </div>
    <div class="search">
      <el-form inline>
        <el-form-item label="预报方案">
          <el-select v-model="formSearch.planId" @change="handlePlanChange" placeholder="请选择预报方案">
            <el-option
              v-for="item in planList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="action">
          <div @click="showPlan()">
            <span></span>
            <span>方案管理</span>
          </div>
          <div @click="saveData()">
            <span></span>
            <span>保存</span>
          </div>
          <div @click="runForecast()" :style="{ opacity: running ? 0.6 : 1 }">
            <span></span>
            <span>{{ running ? '预报中...' : '运行预报' }}</span>
          </div>
        </div>
      </el-form>
    </div>
    <el-row :gutter="20" style="height: calc(100% - 106px);">
      <el-col :span="12">
        <div class="card-item">
          <h6>
            <span>参数设置 &nbsp;&nbsp;&nbsp;&nbsp;
            数值=代码  //  备注</span>
            <div>
            <span class="btn" @click="getInitModelParams()">初始化</span>
            <span class="btn" @click="showXajParamCalibration()">参数率定</span>
            </div>
          </h6>
          <div class="card-item-content">
            <div v-loading="paramsLoading" element-loading-text="正在加载..." style="position: relative;">
            <el-input
              type="textarea"
              :rows="16"
              placeholder="请输入内容"
              v-model="parsedPlanParamsList" style="height: 200px;overflow-y: auto"
            ></el-input>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card-item">
          <h6>
            <span>雨量站点 &nbsp;&nbsp;&nbsp;&nbsp;
            站码,站名,权重</span>
            <span class="btn" @click="getAutoRel()">自动关联</span>
          </h6>
          <div class="card-item-content">
            <div v-loading="stationLoading" element-loading-text="正在加载..." style="position: relative;">
              <el-input
                type="textarea"
                :rows="9"
                placeholder="请输入内容"
                v-model="parsedPlanRelStationList" style="height: 200px;overflow-y: auto"
              ></el-input>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <xaj-param-calibration :options="{ objectsId: objectsId, modelId: modelId, visible: paramCalibrationVisible }" @close="hideParamCalibration"></xaj-param-calibration>
    <plan :options="{ objectsId: objectsId, modelId: modelId }" v-show="planVisible" @close="hidePlan" @refresh="getFcstPlan"></plan>
  </div>
</template>

<script>
import mainfirst from '@/assets/json/green.json'
import mainfirst2 from '@/assets/json/green2.json'
import Api from "@/api";
import xajParamCalibration from '@/components/singleStationForecast/paramCalibration/xajIndex.vue'
import plan from '@/components/singleStationForecast/plan/index.vue'

export default {
  components: {
    plan,
    xajParamCalibration
  },
  props: {
    options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      paramsLoading: false,
      stationLoading: false,
      objectsId: this.options.fcstObjects.id,
      modelId: this.options.modelId,
      planList: [],
      planParamsList: '',
      parsedPlanParamsList: '',
      parsedPlanRelStationList: '',
      planVisible: false,
      paramCalibrationVisible: false,
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
      formSearch: {
        objectsId: '',
        modelId: '',
        planId: '',
        name: ''
      },
      textarea: '',
      running: false
    }
  },
  methods: {
    getAutoRel() {
      this.stationLoading = true;
      const objectsId = this.$props.options.fcstObjects.id;
      Api.getAutoRelStation({ objectsId })
        .then(res => {
          if (res.code === 200) {
            const formattedList = res.result.map(item => {
              const stnm = item.stnm ? item.stnm.trim() : '';
              return `${item.stcd},${stnm},${item.weight}`;
            });
            this.parsedPlanRelStationList = formattedList.join('\n');
          } else {
            this.$message.error(res.message || '获取数据失败');
          }
        })
        .catch(err => {
          console.error('请求失败', err);
          this.$message.error('接口调用异常');
        })
        .finally(() => {
          this.stationLoading = false;
        });
    },
    showXajParamCalibration(){
      this.paramCalibrationVisible = true
    },
    getInitModelParams(){
      Api.getInitModelParams({ modelId: this.formSearch.modelId }).then(response => {
        if (response.code === 200) {
          let list = response.result;

          const formattedList = [];
          list.forEach(item => {
            item.comments = item.comments ? item.comments : '';
            formattedList.push(`${item.paramsName}=${item.initValue} // ${item.comments}`);
          });
          this.parsedPlanParamsList = formattedList.join('\n');
        }
      })
    },
    
    handlePlanChange(value) {
      this.formSearch.planId = value
      this.planList.forEach(item=>{
        if(item.id === value){
          this.getFcstPlanParams(item.modelId,item.id)
          this.getFcstPlanRelStation(item.objectsId, item.id, item.modelId)
        }
      })

    },
    showPlan() {
      this.planVisible = true
    },
    hidePlan(){
      this.planVisible = false
    },
    hideParamCalibration(){
      this.paramCalibrationVisible = false
    },
    
    getFcstPlanParams(modelId, planId) {
      Api.getPlanParamsList({planId: planId, modelId: modelId}).then(response => {
        if (response.code === 200) {
          let list = response.result;

          const formattedList = [];
          list.forEach(item => {
            item.comments = item.comments ? item.comments : '';
            formattedList.push(`${item.paramsName}=${item.paramsValue} // ${item.comments}`);
          });
          console.log(formattedList)
          this.parsedPlanParamsList = formattedList.join('\n');
        }
      });
    },
     
     getFcstPlan() {
       const objectsId = this.formSearch.objectsId
      Api.getFcstPlanList(this.formSearch).then(response => {
        if (response.code === 200) {
          this.planList = response.result
          if(this.planList && this.planList.length > 0){
            const planId = this.planList[0].id
            const modelId = this.formSearch.modelId
            this.formSearch.planId = planId
            this.getFcstPlanParams(modelId, planId)
            this.getFcstPlanRelStation(objectsId, planId, modelId)
          }
        }
      })
    },
    
    getFcstPlanRelStation(objectsId, planId, modelId) {
      Api.getPlanRelStationList({objectsId, planId, modelId}).then(response => {
        if (response.code === 200) {
          let list = response.result;

          const formattedList = [];
          list.forEach(item => {
            formattedList.push(`${item.stcd},${item.stnm},${item.weight}`);
          });
          this.parsedPlanRelStationList = formattedList.join('\n');
        }
      })
    },
    saveData() {
      const {objectsId, planId, modelId} = this.formSearch
      if(!objectsId){
        this.$message.error('请选择站点')
        return
      }
      if(!modelId){
        this.$message.error('请选择模型')
        return
      }
      if(!planId){
        this.$message.error('请选择预报方案')
        return
      }
      this.paramsLoading = true
      this.stationLoading = true
      const planParamsList = [];
      this.parsedPlanParamsList.split('\n').forEach(item => {

        if (!item.trim()) return;
        const cleanItem = item.split('//')[0].trim();
        const [keyPart, valuePart] = cleanItem.split('=');
        if (keyPart !== undefined && valuePart !== undefined) {

          const paramsName = keyPart.trim();
          const paramsValue = valuePart.trim();
          planParamsList.push({
            paramsName: paramsName,

            paramsValue: Number(paramsValue)
          });
        }
      });

      const planRelStationList = [];

      const lines = this.parsedPlanRelStationList.split(/[\r\n]+/).filter(line => line.trim() !== '');
      const keys = ['stcd', 'stnm', 'weight'];
      lines.forEach((line, lineIndex) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        const parts = trimmedLine.split(',');

        if (parts.length < 3) {
          return;
        }
        const stationObj = {};
        parts.forEach((part, index) => {
          const key = keys[index];
          if (key) {
            let value = part.trim();

            if (value.toLowerCase() === 'null') {
              value = null;
            }

            if (key === 'weight' && value !== null) {
              value = Number(value);
            }
            stationObj[key] = value;
          }
        });
        planRelStationList.push(stationObj);
      });
      Api.updateRelModelAndStation({objectsId, planId, modelId, planRelStationList, planParamsList}).then(response => {
        if(response.code === 200){
          this.$message.success('保存成功')
        }
        console.log(response)
      }).catch(err => {
        console.error('请求失败', err);
        this.$message.error('接口调用异常');
      }).finally(() => {
        this.paramsLoading = false
        this.stationLoading = false
      })
    },
    runForecast() {
      const { objectsId, planId, modelId } = this.formSearch
      if (!planId) {
        this.$message.warning('请先选择预报方案')
        return
      }
      this.running = true
      Api.xajRun({ planId, objectsId, modelId, persist: true }).then(res => {
        if (res.code === 200) {
          const saved = res.result && res.result.saved
          this.$message.success(`新安江预报完成，已保存 ${saved || 0} 条结果`)
        } else {
          this.$message.error(res.message || '预报失败')
        }
      }).finally(() => { this.running = false })
    }
  },
  mounted() {
    const {fcstObjects, modelId} = this.$props.options
    const objectsId = fcstObjects.id
    this.formSearch.modelId = modelId
    this.formSearch.objectsId = objectsId
    this.getFcstPlan()
  }
}
</script>

<style lang="scss" scoped>
.modelIndex {
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  background: var(--panel-bg, rgba(0, 16, 30, 0.52));
  backdrop-filter: blur(8px);
  border-radius: 4px;
  color: #fff;
  border: 1px solid rgba(0, 255, 246, 0.2);
  position: relative;

  &:before,
  &:after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border: 1px solid;
    z-index: 99;
  }

  &:before {
    left: 0;
    top: 0;
    border-color: #00fff6 transparent transparent #00fff6;
  }

  &:after {
    right: 0;
    top: 0;
    border-color: #00fff6 #00fff6 transparent transparent;
  }

  .hd {
    > h3 {
      overflow: hidden;

      .name {
        float: left;
        font-size: 20px;
        font-family: YouSheBiaoTiHei-Regular, YouSheBiaoTiHei, sans-serif;
        font-weight: 400;
        font-size: 20px;
      }

      .close {
        float: right;
        cursor: pointer;
      }
    }
  }

  .search {
    .action {
      float: right;
      display: flex;
      gap: 15px;

      div {
        height: 34px;
        color: #00fff6;
        font-size: 13px;
        background: rgba(0, 255, 246, 0.14);
        border: 1px solid rgba(0, 255, 246, 0.55);
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 80px;
        padding: 0 12px;

        span:first-child {
          display: inline-block;
          width: 14px;
          height: 14px;
        }
      }

      div:hover {
        color: #CCFF00;
        background: rgba(0, 255, 246, 0.24);
        border-color: #00fff6;
      }
    }
  }

  .card-item {
    padding: 10px;
    background: #00000033;
    border-radius: 8px 8px 8px 8px;

    h6 {
      display: flex;
      font-size: 14px;
      padding: 0 20px;
      line-height: 40px;
      font-weight: normal;
      justify-content: space-between;
      background: url(../../../assets/images/item-header.png) 0 center no-repeat;

      span.btn {
        cursor: pointer;
        color: #00fff6;
        margin-left: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 72px;
        height: 28px;
        padding: 0 10px;
        background: rgba(0, 255, 246, 0.14);
        border: 1px solid rgba(0, 255, 246, 0.55);
        border-radius: 4px;

        &:hover {
          color: #CCFF00;
          background: rgba(0, 255, 246, 0.24);
          border-color: #00fff6;
        }
      }

      .param-calibration {
        color: #00fff6;
        cursor: pointer;
        &:hover {
          color: #CCFF00;
        }
      }
    }

    .card-item-content {
      padding: 5px;
      background: rgba(0, 255, 246, 0.05);
      border-radius: 4px 4px 4px 4px;
      border: 1px solid rgba(0, 255, 246, 0.2);
    }
  }
}

.card-item-content {
  .el-textarea, .el-textarea__inner {
    background-color: transparent;
    border: none;
    color: #fff;
  }
}
</style>
