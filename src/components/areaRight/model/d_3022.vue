<template>
  <div class="wrap" :class="{'bg-com':!isMin}">
    <title-box title="采砂船" second isVariable @change="toggle"/>
    <el-form :model="formData" label-width="50px" class="screenForm">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" @change="toEmit"/>
      </el-form-item>
      <el-form-item label="区划" prop="type">
        <el-select v-model="formData.type" style="width: 100%" @change="toEmit">
          <el-option v-for="item in areaList" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
    </el-form>
    <el-table ref="table" :data="tableData" height="385px" stripe highlight-current-row @row-click="changeTr">
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="名称" prop="shipNo" align="center" show-overflow-tooltip/>
      <el-table-column label="时间" prop="tm" align="center" width="130" show-overflow-tooltip>
        <template slot-scope="scope">{{ format(scope.tm) }}</template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <!--      <el-pagination background layout="prev,pager,next" :pager-count="5" :total="65" small
                           @current-change="pageChange"/>-->
    </div>
    <div class="bg-border"/>
  </div>
</template>

<script type="text/ecmascript-6">
import titleBox from '@/components/titleBox'
import Api from '@/api'
import dayjs from 'dayjs'

export default {
  components: {
    titleBox
  },
  props: {
    isPopShow: {
      type: Boolean,
      default() {
        return false
      }
    },
    isMin: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      formData: {
        name: '',
        type: ''
      },
      tableData: [],
      areaList: [
        {
          label: '全市',
          value: ''
        },
        {
          label: '船山区',
          value: '1'
        },
        {
          label: '安居区',
          value: '2'
        },
        {
          label: '蓬溪县',
          value: '3'
        },
        {
          label: '大英县',
          value: '4'
        },
        {
          label: '射洪市',
          value: '5'
        }
      ]
    }
  },
  created() {
    this.toEmit()
  },
  methods: {
    format(tm) {
      return dayjs(tm).format('YYYY-MM-DD')
    },
    toggle(type) {
      if (type === 'max' && !this.isMin) return
      this.$emit('sizeChange', !this.isMin)
    },
    toEmit() {
      this.$emit('change', this.formData)
      this.getData()
    },
    getData() {

      console.log('获取采砂船数据')
      Api.listLocation({}).then(response => {
        if (response.code === 200) {
          this.tableData = response.result
        }
      })
    },
    changeTr(row) {

      if (row) {
        console.log('显示弹窗')
        this.$emit('pop', {data: row, type: 3022})
      }
    },
    pageChange(v) {
      console.log('拉取第' + v + '页数据')
    }
  },
  watch: {
    isPopShow(v) {
      if (!v && this.$refs.table) {
        this.$refs.table.setCurrentRow()
      }
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
</style>
