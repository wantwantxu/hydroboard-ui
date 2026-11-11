<template>
  <el-dialog
    title="新增流域"
    :visible.sync="visible"
    width="800px"
    :modal="true"
    append-to-body
    modal-class="home-dialog-mask"
    custom-class="home-dialog"
    @close="cancel">
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="流域代码" prop="id">
        <el-input v-model="formData.id" :disabled="isEdit" placeholder="请输入流域代码"></el-input>
      </el-form-item>
      <el-form-item label="流域名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入流域名称"></el-input>
      </el-form-item>
      <el-form-item label="流域面积" prop="area">
        <el-input-number v-model="formData.area" placeholder="请输入流域面积"></el-input-number>
      </el-form-item>

      <div class="file-upload-container">
        <div v-for="(item,index) in fileOptions" :key="index" class="upload-item">
          <p>{{ item.name }}文件：</p>
          <el-upload
            ref="uploads"
            :limit="1"
            action="#"
            :accept="'.'+item.accept"
            :http-request="(params)=> fileUpload(params,item.accept)"
            :on-exceed="onExceed"
            :before-upload="(file)=> beforeUpload(file,item.accept)"
            :before-remove="()=> beforeRemove(item.accept)"
            drag
            multiple>
            <i class="el-icon-upload" style="font-size: 50px; color: #7EB6FF;"></i>
            <div class="el-upload__text">
              <em>将文件拖到此处</em>
              <br/><br/>
              <span>或</span>
              <br/><br/>
              <el-button>点击上传</el-button>
            </div>
          </el-upload>
        </div>
      </div>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from "@/api";
import * as shapefile from "shapefile";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formData: {
        id: '',
        name: '',
        area: null,
        avgFlowVelocity: null,
        coordinates: ''
      },
      isEdit: false,
      fileOptions: [
        {
          name: 'SHP',
          accept: 'shp',
          readr: null
        },
        {
          name: 'DBF',
          accept: 'dbf',
          readr: null
        }
      ],
      rules: {
        id: [{required: true, message: '请输入流域代码', trigger: 'blur'}],
        name: [{required: true, message: '请输入流域名称', trigger: 'blur'}],
        avgFlowVelocity: [{required: true, message: '请输入平均流速', trigger: 'blur'}],
        area: [{required: true, message: '请输入流域面积', trigger: 'blur'}],
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        if (val.id) {
          this.isEdit = true;
          Object.keys(this.formData).forEach(key => {
            this.formData[key] = val[key];
          });
        } else {
          this.isEdit = false;
        }
      }
    }
  },
  methods: {
    fileUpload(param, type) {
      const fileData = param.file;
      this.fileOptions.find(item => item.accept == type).readr = fileData;
    },

    readFileAsArrayBuffer(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('文件读取失败'));
        reader.readAsArrayBuffer(file);
      });
    },
    fileAnalyze(shpData, dbfData) {

      if (!dbfData || !shpData) return;

      let geojsonArr = [];
      shapefile.open(shpData, dbfData, { encoding: 'utf-8' })
        .then((source) => {
          const readNext = () => {
            return source.read().then((result) => {
              if (result.done) {
                this.formData.coordinates = JSON.stringify(geojsonArr);

                return Api.fcstObjectsSave([this.formData]).then(() => {
                  this.$message.success(this.isEdit ? '编辑成功！' : '新增成功！');
                  this.$emit('refresh');
                  this.cancel();
                });
              }
              geojsonArr.push(result.value);
              return readNext();
            });
          };
          return readNext();
        })
        .catch((error) => {
          console.error('SHP 解析失败：', error.stack);
          this.$message.error('SHP 文件解析失败，请检查文件完整性！');
        });
    },
    onExceed() {
      this.$message.warning('只允许上传单个文件！请删除已有的文件后再试。');
    },
    beforeUpload(file, fileType) {

      if (file.size === 0) {
        this.$message.warning('文件内容不能为空，请重新选择！');
        return false;
      }

      const fileExt = file.name.split('.').pop().toLowerCase();
      if (fileExt !== fileType) {
        this.$message.warning(`请上传 ${fileType.toUpperCase()} 格式的文件，当前文件格式为 ${fileExt.toUpperCase()}！`);
        return false;
      }
      return true;
    },
    beforeRemove(type) {
      this.fileOptions.find(item => item.accept == type).readr = null;
    },
    async confirm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const shpFile = this.fileOptions.find(item => item.accept === 'shp').readr;
          const dbfFile = this.fileOptions.find(item => item.accept === 'dbf').readr;


          if (!shpFile || !dbfFile) {
            this.$message.warning('请同时上传 SHP 和 DBF 文件，缺一不可！');
            return;
          }

          try {

            const [shpData, dbfData] = await Promise.all([
              this.readFileAsArrayBuffer(shpFile),
              this.readFileAsArrayBuffer(dbfFile)
            ]);

            this.fileAnalyze(shpData, dbfData);
          } catch (error) {
            console.error('文件读取失败：', error);
            this.$message.error('文件读取失败，请重新选择文件！');
          }


        }
      });
    },
    cancel() {
      this.$refs.form.resetFields();

      if (this.$refs.uploads) {

        (Array.isArray(this.$refs.uploads) ? this.$refs.uploads : [this.$refs.uploads])
          .forEach(item => item.clearFiles());
      }

      this.formData = {
        id: '',
        stcd: '',
        stnm: '',
        area: null,
        avgFlowVelocity: null,
        coordinates: ''
      };
      this.fileOptions.forEach(item => {
        item.readr = null;
      });
      this.$emit('update:visible', false);
    }
  }
}
</script>

<style scoped>
.file-upload-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.upload-item {
  flex: 1;
  padding: 0 10px;
}

.upload-item p {
  margin-bottom: 10px;
  font-size: 14px;
  color: #606266;
}

.el-icon-upload {
  margin: 20px 0;
}
</style>
