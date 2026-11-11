<template>
  <div class="legend-item">
    <div class="li-title">风场</div>
    <div class="li-bd">
      <ul class="num-list">
        <li>20</li>
        <li>10</li>
        <li>5</li>
        <li>2</li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style type="text/scss" lang="scss" scoped>
  .num-list {
    color: #fff;
    font-size: 14px;
    width: 40px;
    height: 160px;
    padding-left: 26px;
    position: relative;
    &:before{
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 20px;
      background: linear-gradient(0deg, rgb(82, 71, 141), rgb(83, 82, 180), rgb(68, 103, 195), rgb(59, 143, 193), rgb(73, 178, 158), rgb(76, 196, 92), rgb(92, 208, 74), rgb(153, 220, 69), rgb(235, 224, 53), rgb(234, 168, 61), rgb(227, 103, 87), rgb(181, 47, 95), rgb(131, 23, 67), rgb(68, 10, 25), rgb(43, 0, 1));
    }

    li {
      left: 26px;
      position: absolute;
      &:nth-child(1){
        bottom: 83%;
      }
      &:nth-child(2){
        bottom: 41.5%;
      }
      &:nth-child(3){
        bottom: 20.8%;
      }
      &:nth-child(4){
        bottom: 8.3%;
      }
    }
  }
</style>
