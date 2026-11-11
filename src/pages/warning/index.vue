<template>
    <div>
        <div class="tableBg bg-com" ref="dragElement" v-if="tableShow">
            <div ref="header" class="header-bg">
                <div class="header-tip">
                <span>重要提示</span>
                <span
                    @click="closePage()"
                    class="danger-close-wrap"
                >
                    <i class="el-icon-close danger-close"></i>
                </span>
                </div>
            </div>
            <el-form style="margin-top: 20px;" :inline="true" :model="formData" label-width="75px" >
                <el-form-item>
                <el-input v-model="formData.stnm" clearable  placeholder="请输入名称" />
                </el-form-item>
                <el-form-item>
                <el-input v-model="formData.stcd" clearable  placeholder="请输入测站编码" />
                </el-form-item>
                <el-form-item>
                <el-select v-model="formData.warnScope" @change="getList" clearable  placeholder="请选择涨幅范围">
                  <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
                </el-select>
                </el-form-item>
            </el-form>
            <el-table
                :border="true"
                :row-class-name="tableRowClassName"
                :data="getFilterData(formData.stnm,formData.stcd)"
                height="580"
                @row-click="changeTr">
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="stcd" label="测站编码"></el-table-column>
                <el-table-column prop="stnm" label="测站名称"></el-table-column>
                <el-table-column prop="tm" label="时间">
                    <template slot-scope="{row}">
                        {{ dayjs(row.tm).format('YYYY-MM-DD HH:mm') }}
                    </template>
                </el-table-column>
                <el-table-column prop="z" label="水位"></el-table-column>
                <el-table-column prop="q" label="流量"></el-table-column>
                <el-table-column prop="changes" label="最新涨幅"></el-table-column>
                <el-table-column prop="maxZ" label="24h最大水位"></el-table-column>
                <el-table-column prop="maxQ" label="24h最大流量"></el-table-column>
                <el-table-column prop="minZ" label="24h最小水位"></el-table-column>
                <el-table-column prop="minQ" label="24h最小流量"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import dayjs from 'dayjs'
  import Api from '../../api'
  export default {
    data() {
      return {
        dayjs,
        tableShow: true,
        tableData: [],
        options: [
          {label:'大于0.3',value:'0.3'},
          {label:'大于0.5',value:'0.5'},
          {label:'大于1',value:'1'},
          {label:'大于3',value:'3'},
          {label:'大于5',value:'5'},
        ],
        formData: {
            stnm: '',
            stcd: '',
            warnScope:''
        },
      }
    },
    created() {
        console.log(this.$store.state.dangerTableData,'00')
      if (this.$route.query.show === 'false') {
        this.openLayer()
      }
      this.tableData = this.$store.state.dangerTableData || []
    },
    watch:{
        formData:{
            handler(val){
              this.tableData && this.tableData.length && this.getFilterData(val.stnm,val.stcd)
            },
            deep:true
        }
    },
    methods: {
      changeTr(row) {
        if (row) {
          window.mpPlugin.dangerOutPoint().showPointPopup(row)
          this.$emit('close', true)
        }
      },
      getFilterData(a, b) {
        const filterData = this.tableData.filter(data => {
          const condition1 = !a || data.stnm.toLowerCase().includes(a.toLowerCase())
          const condition2 = !b || data.stcd.includes(b)
          return condition1 && condition2
        })
        return filterData

      },
      changeHandle() {

      },
      getList() {
        Api.getWarnListNew({warnScope:this.formData.warnScope})
          .then(res => {

            this.tableData = (res && res.result) || []
          })
          .catch(() => { this.tableData = [] })
      },
      openLayer() {
        this.tableShow = true
      },
      tableRowClassName({ row, rowIndex }) {
        if (rowIndex % 2 === 1) {
          return 'odd'
        } else if (rowIndex % 2 === 0) {
          return 'even'
        }
        return ''
      },
      closePage() {
        this.$emit('close', true)
      }
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .header-bg {
    position: relative;
    width: 100%;
    height: 4.375rem;
    background: transparent;
  }

  .header-tip {
    position: relative;
    width: calc(100% - 2.5rem);
    height: 3.125rem;
    margin: 0.625rem 1.25rem;
    background: linear-gradient(90deg, rgba(0, 255, 246, 0.35) 0%, rgba(0, 255, 246, 0) 100%);
    border-radius: 4px;
    text-align: center;
    line-height: 3.125rem;
    font-size: 1.375rem;
    font-family: YouSheBiaoTiHei-Regular, YouSheBiaoTiHei, sans-serif;
    font-weight: 400;
    color: #ffffff;
  }

  .danger-close-wrap {
    font-size: 1.5rem;
    cursor: pointer;
    float: right;
    margin-right: 0.75rem;
  }

  .el-select {
    width: 12.5rem;
  }

  .tableBg {
    z-index: 2000;
    position: fixed;
    top: var(--panel-top, 6.25rem);
    left: 50%;
    transform: translateX(-50%);
    height: min(48.75rem, calc(100vh - var(--panel-top, 6.25rem) - var(--panel-gap, 1.25rem)));
    width: min(75rem, 90vw);
    padding: 0 0.75rem 0.75rem;
    box-sizing: border-box;
  }

  .el-table {
    position: relative;
    color: #00fff6;
    font-size: 0.9375rem;
    background: transparent;
  }

  ::v-deep .el-table thead {
    color: #fff;
    background: rgba(0, 0, 0, 0.3);
  }

  ::v-deep .el-table--border {
    border: none;
  }

  ::v-deep .el-table--border::after,
  ::v-deep .el-table--group::after {
    height: 0;
  }

  ::v-deep .el-table .cell {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    text-align: center;
  }

  ::v-deep .el-table .odd {
    background: rgba(113, 198, 255, 0.1);
  }

  ::v-deep .el-table .even {
    background: transparent;
  }

  .danger-close {
    margin-top: 0.5rem;
    color: #00fff6;
  }
</style>
