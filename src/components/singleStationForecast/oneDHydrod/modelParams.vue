<template>
  <div class="hydro1dParamIndex">
    
    <div class="hd">
      <h3>
        <lottie class="mainfirst" :options="mainfirst" :width="20" style="float:left;" />
        <div class="name">一维水动力参数配置</div>
        <el-button
          class="close"
          type="text"
          icon="el-icon-close"
          @click="$emit('close')"
        />
      </h3>
      <lottie class="mainfirst2" :options="mainfirst2" :width="1300" style="height: 20px; opacity:1;" />
    </div>

    
    <div class="scroll-content">
      
      <div class="card-item">
        <h6>
          <span>输入参数</span>
          <div class="action">
            <span class="btn" @click="calcHydro">计算</span>
            <span class="btn" @click="saveAll">保存</span>
          </div>
        </h6>
        <div class="card-item-content">
          <el-form :inline="true" label-width="140px">
            <el-form-item label="断面名称：">
              <el-select v-model="param.sectionId" placeholder="请选择断面" style="width: 180px">
                <el-option v-for="s in sectionList" :key="s.id" :label="s.name" :value="s.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="河道长度 (km)：">
              <el-input v-model.number="param.length" />
            </el-form-item>
            <el-form-item label="断面宽度 (m)：">
              <el-input v-model.number="param.width" />
            </el-form-item>
            <el-form-item label="断面面积 (m²)：">
              <el-input v-model.number="param.area" />
            </el-form-item>
            <el-form-item label="平均比降 (‰)：">
              <el-input v-model.number="param.slope" />
            </el-form-item>
            <el-form-item label="糙率 (n)：">
              <el-input v-model.number="param.roughness" />
            </el-form-item>
            <el-form-item label="上边界流量 (m³/s)：">
              <el-input v-model.number="param.boundaryIn" />
            </el-form-item>
            <el-form-item label="下边界水位 (m)：">
              <el-input v-model.number="param.boundaryOut" />
            </el-form-item>
          </el-form>
        </div>
      </div>

      
      <div class="card-item">
        <h6><span>计算参数</span></h6>
        <div class="card-item-content">
          <el-form :inline="true" label-width="140px">
            <el-form-item label="水力半径 R (m)：">
              <el-input v-model="param.radius" disabled />
            </el-form-item>
            <el-form-item label="平均流速 V (m/s)：">
              <el-input v-model="param.velocity" disabled />
            </el-form-item>
            <el-form-item label="流量 Q (m³/s)：">
              <el-input v-model="param.flow" disabled />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mainfirst from '@/assets/json/green.json'
import mainfirst2 from '@/assets/json/green2.json'
import Api from '@/api'

export default {
  name: 'Hydro1DParamIndex',
  data() {
    return {
      sectionList: [],
      param: {
        sectionId: '',
        length: '',
        width: '',
        area: '',
        slope: '',
        roughness: '',
        boundaryIn: '',
        boundaryOut: '',
        radius: '',
        velocity: '',
        flow: ''
      },
      mainfirst: { animationData: mainfirst, renderer: 'svg', loop: true, autoplay: true },
      mainfirst2: { animationData: mainfirst2, renderer: 'svg', loop: true, autoplay: false }
    }
  },
  methods: {
    async getSectionList() {
      this.sectionList = await Api.listHygro({}) || []
      if (this.sectionList.length > 0) this.param.sectionId = this.sectionList[0].id
    },
    
    calcHydro() {
      const { width, area, slope, roughness } = this.param
      if (!width || !area || !slope || !roughness) {
        return this.$message.warning('请填写完整输入参数')
      }

      const R = area / width

      const I = slope / 1000
      const V = (1 / roughness) * Math.pow(R, 2 / 3) * Math.pow(I, 0.5)

      const Q = area * V

      this.param.radius = R.toFixed(3)
      this.param.velocity = V.toFixed(3)
      this.param.flow = Q.toFixed(3)
      this.$message.success('计算完成')
    },
    
    saveAll() {
      Api.saveHydro1DParam(this.param).then(() => {
        this.$message.success('参数已保存')
      })
    }
  },
  mounted() {
    this.getSectionList()
  }
}
</script>

<style lang="scss" scoped>
.hydro1dParamIndex {
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  background: var(--panel-bg, rgba(0, 16, 30, 0.52));
  backdrop-filter: blur(8px);
  border-radius: 4px;
  color: #fff;
  border: 1px solid rgba(0, 255, 246, 0.2);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

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
    flex-shrink: 0;
    position: sticky;
    top: 0;
    z-index: 10;
    background: rgba(0, 16, 30, 0.3);
    h3 {
      overflow: hidden;
      .name { float: left; font-size: 20px; }
      .close { float: right; cursor: pointer; }
    }
  }

  .scroll-content {
    flex: 1;
    overflow-y: auto;
    margin-top: 10px;
    padding-right: 8px;
  }

  .card-item {
    margin-top: 15px;
    background: #00000033;
    border-radius: 8px;
    h6 {
      display: flex; justify-content: space-between;
      font-size: 14px; padding: 0 10px; line-height: 36px;
      .action { display: flex; gap: 10px;
        .btn {
          cursor: pointer;
          color: #00fff6;
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
            color: #ccff00;
            background: rgba(0, 255, 246, 0.24);
            border-color: #00fff6;
          }

          &.danger {
            color: #00fff6;
          }
        }
      }
    }
    .card-item-content {
      padding: 10px;
      background: rgba(0, 255, 246, 0.05);
      border-radius: 4px;
      border: 1px solid rgba(0, 255, 246, 0.2);
    }
  }
}
</style>
