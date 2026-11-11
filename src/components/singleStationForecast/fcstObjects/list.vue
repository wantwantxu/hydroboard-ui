<template>
  <div class="modelIndex">
    <div class="hd">
      <h3>
        <div class="name">预报站管理</div>
        <el-button
          class="close"
          type="text"
          icon="el-icon-close"
          @click="$emit('close')"
        />
      </h3>
    </div>
    <div class="search-container">
      
      <el-button type="primary" @click="handleAddClick" class="add-btn">
        <i class="el-icon-plus"></i>新增预报站
      </el-button>
    </div>

    <div class="table-container">
      <el-table class="no-table-border" :data="tableData"  height="100%" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id"  label="预报站码"></el-table-column>
        <el-table-column prop="name" label="预报站名">
          <template slot-scope="{row}">
                <span v-if="row.is">{{ row.name }}</span>
                <el-input v-else v-model="row.name" style="width: 200px;" size="mini" ></el-input>
            </template>
        </el-table-column>
        <el-table-column label="操作"  width="180" >
          <template slot-scope="{row}">
              <el-button  size="mini" @click="row.is = false" v-if="row.is" >编辑</el-button>
              <el-button  size="mini" @click="edit(row);row.is = true" v-else type="success" >保存</el-button>
              <el-button  size="mini" type="danger" @click="del(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增对话框 -->
    <add-modal :visible.sync="dialogVisible" v-if="dialogVisible" @refresh="refresh" ></add-modal>
  </div>
</template>

<script>
import Api from "@/api";
import AddModal from "./addModal";
export default {
  components: {AddModal},
  data() {
    return {
      queryForm: {
        name: ''
      },
      tableData: [],
      loading: false,

      dialogVisible: false
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    
    fetchData() {
      this.loading = true;


      Api.fcstObjectsList(this.queryForm).then(response => {
        response.result.forEach(item => {
            item.is = true
        });
        this.tableData = response.result;
      }).finally(() => {
        this.loading = false;
      });
    },
    
    handleSearch() {

      this.fetchData();
    },
    
    resetForm() {
      this.$refs.queryForm.resetFields();
      this.handleSearch();
    },
    
    handleAddClick() {
      this.dialogVisible = true
    },
     
     refresh(){
        this.dialogVisible = false
        this.fetchData();
        this.$emit('change')
    },
    
    edit(row) {
      let obj = JSON.stringify(row)
      let _obj = JSON.parse(obj)
      delete _obj.is
      Api.fcstObjectsSave([_obj]).then(res => {
        if(res.code === 200){
          this.$message.success('编辑成功');
          this.fetchData();
        }
      });
    },
    
    del(row) {
        this.$confirm('确定要删除该预报站吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            Api.fcstObjectsDelete(row.id).then((res) => {
              if(res.code === 200){
                this.$message.success('删除成功');
                this.fetchData();
              }

            });
        });
    }
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
  display: flex;
  flex-direction: column;
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
        margin-left: 35px;
        font-size: 20px;
      }

      .tag {
        float: left;
        color: #00FFF6;
        width: 62px;
        height: 26px;
        line-height: 26px;
        font-size: 14px;
        font-weight: normal;
        text-align: center;
        margin-left: 20px;
        background: rgba(0, 255, 246, 0.1);
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #00FFF6;
      }

      .close {
        float: right;
        cursor: pointer;
      }
    }

  }

  .search-container {
    margin-top: 20px;
  }

  .table-container {
    flex: 1;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    min-height: 0; 

    .el-table {
      flex: 1;
      height: 100%;
    }
  }
}
</style>
