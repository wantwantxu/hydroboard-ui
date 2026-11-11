<template>
  <div class="modelIndex" v-if="visible">
    <div class="hd">
      <h3>
        <lottie class="mainfirst" :options="mainfirst" :width="20" style="float:left;"/>
        <div class="name">{{ '计算结果' }}</div>
        <span class="close" @click="visible=false">
          <i class="el-icon-close"></i>
        </span>
      </h3>
      <lottie class="mainfirst2" :options="mainfirst2" :width="1300" style="height: 20px;opacity: 1;"/>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleTabChange">
      <el-tab-pane label="降雨量" name="rain">
        <el-row :gutter="20" style="height: 270px;margin-bottom: 20px;">
          <el-col :span="24">
            <div class="card-item">
              <h6>
                <span>查询条件</span>
              </h6>
              <div class="card-item-content">
                <el-form :model="formSearch">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="时间段:">
                        <el-date-picker
                          style="width: 150px;"
                          v-model="formSearch.stm"
                          type="date"
                          placeholder="选择日期"
                          @change="handleQuery">
                        </el-date-picker>
                        至
                        <el-date-picker
                          style="width: 150px;"
                          v-model="formSearch.etm"
                          type="date"
                          placeholder="选择日期"
                          @change="handleQuery">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="行政区:">
                        <el-select v-model="formSearch.addvcd" placeholder="所有区县" @change="handleQuery">
                          <el-option label="旌阳区" value="510603"></el-option>
                          <el-option label="罗江区" value="510604"></el-option>
                          <el-option label="广汉市" value="510681"></el-option>
                          <el-option label="什邡市" value="510682"></el-option>
                          <el-option label="绵竹市" value="510683"></el-option>
                          <el-option label="中江县" value="510623"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="流域:">
                        <el-select v-model="formSearch.basinId" placeholder="所有流域" @change="handleQuery">
                          <el-option v-for="(item, index) in basinList" :key="index" :label="item"
                                     :value="item"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="降雨量计算:">
                        <el-select v-model="rainfallCalculationMethod" placeholder="请选择计算方法">
                          <el-option label="泰森多边形法" value="rainfallCalculation1"></el-option>
                          <el-option label="栅格统计法" value="rainfallCalculation2"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-button @click="handleQuery">查询</el-button>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="径流量" name="runoff">
        <el-row :gutter="20" style="height: 270px;margin-bottom: 20px;">
          <el-col :span="24">
            <div class="card-item">
              <h6>
                <span>查询条件</span>
              </h6>
              <div class="card-item-content">
                <el-form :model="formSearch">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="时间段:">
                        <el-date-picker
                          style="width: 150px;"
                          v-model="formSearch.stm"
                          type="date"
                          placeholder="选择日期"
                          @change="handleQuery">
                        </el-date-picker>
                        至
                        <el-date-picker
                          style="width: 150px;"
                          v-model="formSearch.etm"
                          type="date"
                          placeholder="选择日期"
                          @change="handleQuery">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="行政区:">
                        <el-select v-model="formSearch.addvcd" placeholder="所有区县">
                          <el-option label="旌阳区" value="510603"></el-option>
                          <el-option label="罗江区" value="510604"></el-option>
                          <el-option label="广汉市" value="510681"></el-option>
                          <el-option label="什邡市" value="510682"></el-option>
                          <el-option label="绵竹市" value="510683"></el-option>
                          <el-option label="中江县" value="510623"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="流域:">
                        <el-select v-model="formSearch.basinId" placeholder="所有流域" @change="handleQuery">
                          <el-option v-for="(item, index) in basinList" :key="index" :label="item"
                                     :value="item"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="径流量计算:">
                        <el-select v-model="runoffCalculationMethod" placeholder="请选择径流计算方法">
                          <el-option label="径流系数法" value="runoffCalculation1"></el-option>
                          <el-option label="读取实测数据" value="runoffCalculation2"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-button @click="handleQuery">查询</el-button>
                    </el-col>
                    <el-col :span="4">
                      
                      <el-button @click="triggerFileInput" type="text" icon="el-icon-upload2">导入</el-button>
                      <input
                        ref="fileInput"
                        type="file"
                        accept=".xls,.xlsx"
                        style="display: none"
                        @change="handleImport"
                      />
                      
                      <el-button @click="handleExport" type="text" icon="el-icon-download">导出</el-button>

                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <div class="card-item">
      <el-table
        :data="tableData" v-loading="loading"
        height="500px" stripe highlight-current-row v-if="activeName === 'rain'">
        <el-table-column label="序号" width="50">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="行政区" prop="addvnm"/>
        <el-table-column label="流域" prop="basinName"/>
        <el-table-column label="计算方式" prop="calculationMethod"/>
        <el-table-column label="计算面积(km³)" prop="geomArea" :formatter="formatRainfall"/>
        <el-table-column label="降雨量(mm)" prop="rainfall"/>
        <el-table-column label="降雨总量(万m³)" prop="rainfallTotal"/>
        <el-table-column label="同比">
          <el-table-column label="上期值(mm)" prop="yoyRainfall"/>
          <el-table-column label="%" prop="rainfallChangeRateYoY"/>
        </el-table-column>
        <el-table-column label="环比">
          <el-table-column label="上期值(mm)" prop="momRainfall"/>
          <el-table-column label="%" prop="rainfallChangeRateMoM"/>
        </el-table-column>
      </el-table>
      <el-table
        :data="tableData" v-loading="loading"
        height="500px" stripe highlight-current-row v-if="activeName === 'runoff'">
        <el-table-column label="序号" width="50">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="行政区" prop="1"/>
        <el-table-column label="流域" prop="2"/>
        <el-table-column label="计算方式" prop="3"/>
        <el-table-column label="径流深(mm)" prop="4"/>
        <el-table-column label="径流量(万m³)" prop="5"/>
        <el-table-column label="径流系数" prop="6"/>
        <el-table-column label="同比">
          <el-table-column label="上期值(mm)" prop="yoyRainfall"/>
          <el-table-column label="%" prop="8"/>
        </el-table-column>
        <el-table-column label="环比">
          <el-table-column label="上期值(mm)" prop="momRainfall"/>
          <el-table-column label="%" prop="10"/>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import mainfirst from '../../assets/json/green.json'
import mainfirst2 from '../../assets/json/green2.json'
import Api from "../../api";

export default {
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
      visible: false,
      loading: false,
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
        stm: this.getLastWeekStart(),
        etm: this.getToday(),
        addvcd: '',
        basinId: ''
      },
      rainfallCalculationMethod: 'rainfallCalculation1',
      runoffCalculationMethod: 'runoffCalculation1',
      basinList: ['沱江', '沱江支流', '青白江', '绵远河', '湔江', '石亭江', '凯江'],
      radio: 3,
      activeName: 'rain',
      tableData: []
    }
  },
  methods: {
    handleTabChange() {
      this.tableData = []
    },
    formatRainfall(row, column, cellValue) {
      return (cellValue / 1000000).toFixed(3);
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    getToday() {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    getLastWeekStart() {
      const date = new Date();
      date.setDate(date.getDate() - 6);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    handleImport(event) {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      Api.importRunoffData({ file: file }).then(res => {
        this.$message.success('导入成功');
        this.handleQuery();
      }).catch(err => {
        this.$message.error('导入失败');
        console.error(err);
      });
    },

    handleExport() {
      Api.exportRunoffData({}).then(res => {
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'runoff_data.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch(err => {
        this.$message.error('导出失败');
        console.error(err);
      });
    },
    handleQuery() {
      this.loading = true

      if (this.rainfallCalculationMethod === 'rainfallCalculation1') {
        Api.listRainfallStatis(this.formSearch).then(res => {
          this.tableData = res.result
          this.loading = false
        })
      }

      if (this.rainfallCalculationMethod === 'rainfallCalculation2') {
        Api.listRasterRainfallStatis(this.formSearch).then(res => {
          this.tableData = res.result
          this.loading = false
        })
      }
      setTimeout(()=> this.loading = false, 10000)
    }
  }
}
</script>

<style lang="scss" scoped>
.modelIndex {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  padding: 15px;
  background: rgba(0, 16, 30, .8);
  border-radius: 4px;
  color: #fff;
  border: 1px solid #00fff6;
  z-index: 999;

  .hd {
    > h3 {
      overflow: hidden;

      .name {
        float: left;
        font-size: 20px;
        font-family: YouSheBiaoTiHei-Regular, YouSheBiaoTiHei, sans-serif;
        font-weight: 400;
        margin-left: 35px;
        font-size: 20px;
      }

      .close {
        float: right;
        cursor: pointer;
      }
    }
  }

  .card-item {
    padding: 10px;
    background: #00000033;
    border-radius: 8px 8px 8px 8px;

    h6 {
      font-size: 14px;
      padding: 0 20px;
      line-height: 40px;
      font-weight: normal;
      background: url(../../assets/images/item-header.png) 0 center no-repeat;
    }

    .card-item-content {
      padding: 20px;
    }
  }

  
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background-color: #2c3e50;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #3498db;
    border-radius: 4px;
  }
}



.el-table,
.el-table__expanded-cell {
  border: none;
}

.el-table::before {
  display: none;
}

.el-table__header th,
.el-table__body td {
  border: none;
}
</style>
