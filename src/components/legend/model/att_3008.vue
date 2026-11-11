<template>
  <div class="legend-item">
    <div class="li-title">医疗</div>
    <div class="li-bd">
      <ul class="att-box">
        <li>
          <img src="/static/icon/30081.png" alt="">
          医院
        </li>
        <li>
          <img src="/static/icon/30082.png" alt="">
          诊所
        </li>
        <li>
          <img src="/static/icon/30083.png" alt="">
          药店
        </li>
        <li>
          <img src="/static/icon/30084.png" alt="">
          医疗卫生机构
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style type="text/scss" lang="scss" scoped>
  .att-box {
    color: #00fff6;
    font-size: 14px;

    li {
      line-height: 24px;

      img {
        width: 16px;
        vertical-align: middle;
        margin-right: 4px;
      }
    }
  }
</style>
