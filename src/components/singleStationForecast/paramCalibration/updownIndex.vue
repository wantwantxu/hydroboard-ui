<template>
  <el-dialog
    title="参数率定"
    width="1000px"
    :visible.sync="options.visible"
    :modal="true"
    append-to-body
    modal-class="home-dialog-mask"
    custom-class="home-dialog"
    @close="handleClose"
    class="param-dialog">

    <div class="dialog-content">

      <div class="form-section">
        <el-form :model="form" label-width="200px" size="small" ref="form">

          <el-form-item label="上游测站">
            <el-select
              v-model="form.upStcd"
              filterable
              remote
              placeholder="输入测站名或编码搜索"
              :remote-method="fetchUpstreamStations"
            >
              <el-option
                v-for="item in upstreamStationOptions"
                :key="item.stcd"
                :value="item.stcd"
              >
                {{ item.stcd }} - {{ item.stnm }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="下游测站">
            {{ form.downStcd }} - {{ form.downStnm }}
          </el-form-item>
          <el-form-item label="要素选择">
            <el-select v-model="form.elementType" placeholder="请选择要素类型">
              <el-option label="流量(Q)" value="Q"></el-option>
              <el-option label="水位(Z)" value="Z"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模型类型">
            <el-select v-model="form.modelType" placeholder="请选择模型类型">
              <el-option label="线性(LINEAR)" value="LINEAR"></el-option>
              <el-option label="二次(QUAD)" value="QUAD"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="滞时范围">
            <el-input-number v-model="form.lagMin" :min="1" label="最小滞时"></el-input-number>
            <span style="margin: 0 5px;">~</span>
            <el-input-number v-model="form.lagMax" :min="1" label="最大滞时"></el-input-number>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-form>
      
      <el-form-item>
        <el-button type="primary" @click="saveConfig">保存</el-button>
        <el-button type="warning" :loading="calibrating" @click="calibrate">执行率定</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
      </div>
  </div>
  </el-dialog>
</template>

<script>
import mainfirst from '@/assets/json/green.json'
import mainfirst2 from '@/assets/json/green2.json'
import Api from "@/api";

export default {
  props: {
    options: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      calibrating: false,
      form: {
        id: null,
        upStcd: '',
        downStcd: '',
        downStnm: '',
        elementType: 'Q',
        modelType: 'LINEAR',
        lagMin: 30,
        lagMax: 300,
        lagMinutes: 30,
        a: null,
        b: null,
        c: null,
        r2: null,
        corr: null,
        dataFrom: null,
        dataTo: null,
        remark: ''
      },
      mainfirst: { animationData: mainfirst, renderer: 'svg', loop: true, autoplay: true },
      mainfirst2: { animationData: mainfirst2, renderer: 'svg', loop: true, autoplay: false },
      upstreamStationOptions: []
    };
  },
  mounted() {
    const { objectsId } = this.$props.options;
    this.form.downStcd = objectsId;
    this.form.downStnm = objectsId;
    Api.getByDownStcd({ downStcd: objectsId }).then(res => {
      if (res.code === 200 && res.result) {
        Object.assign(this.form, res.result);
      }
    });
  },
  methods: {
    handleClose() { this.$emit('close'); },
    fetchUpstreamStations(query) {
      if (!query) return;
      Api.getStation({ keyword: query }).then(res => {
        if (res.code === 200) {
          this.upstreamStationOptions = res.result;
        }
      });
    },
    saveConfig() {
      Api.fcstUpDownRelationSave(this.form).then(res => {
        if (res.code === 200) {
          this.$message.success('保存成功！');
          this.$emit('saved');
        }
      });
    },
    calibrate() {
      this.calibrating = true;
      Api.updownCalibrate(this.form).then(res => {
        if (res.code === 200) {
          this.$message.success('率定完成');
          if (res.result) Object.assign(this.form, res.result);
          this.$emit('saved');
        } else {
          this.$message.error(res.message || '率定失败');
        }
      }).finally(() => { this.calibrating = false; });
    },
    resetForm() {
      this.$refs.form && this.$refs.form.resetFields();
    }
  }
};
</script>


<style lang="scss" scoped>
.composite-model-config {
  padding: 20px;
  background: #01101e;
  color: #fff;
  border-radius: 6px;
  border: 1px solid #00fff6;

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
}
</style>
