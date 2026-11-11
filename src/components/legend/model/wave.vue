<template>
  <div class="legend-item">
    <div class="li-title">浪场</div>
    <div class="li-bd">
      <ul class="num-list">
        <li>8</li>
        <li>6</li>
        <li>4</li>
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
      background: linear-gradient(0deg, rgb(8, 29, 88), rgb(16, 35, 105), rgb(25, 42, 124), rgb(34, 49, 142), rgb(36, 60, 152), rgb(35, 73, 158), rgb(34, 85, 163), rgb(33, 90, 170), rgb(32, 113, 177), rgb(30, 130, 185), rgb(29, 145, 192), rgb(39, 156, 193), rgb(50, 167, 194), rgb(62, 179, 195), rgb(77, 186, 194), rgb(95, 193, 191), rgb(114, 200, 188), rgb(134, 207, 186), rgb(156, 216, 184), rgb(177, 224, 182), rgb(198, 232, 180), rgb(210, 237, 179), rgb(239, 241, 164), rgb(247, 221, 126), rgb(253, 166, 72), rgb(252, 137, 58), rgb(245, 93, 43), rgb(237, 55, 12), rgb(212, 26, 35), rgb(186, 0, 38), rgb(164, 0, 40));
    }

    li {
      left: 26px;
      position: absolute;
      &:nth-child(1){
        bottom: 80%;
      }
      &:nth-child(2){
        bottom: 60%;
      }
      &:nth-child(3){
        bottom: 40%;
      }
      &:nth-child(4){
        bottom: 20%;
      }
    }
  }
</style>
