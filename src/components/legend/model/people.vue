<template>
  <div class="legend-item">
    <div class="li-title">人口数量</div>
    <div class="li-bd">
      <ul class="people-list">
        <li>&lt;478,964</li>
        <li>478,964 - 553,225</li>
        <li>553,225 - 627,486</li>
        <li>627,486 - 701,747</li>
        <li>701,747 - 776,008</li>
        <li>776,008 - 850,269</li>
        <li>&gt;=924,531</li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style type="text/scss" lang="scss" scoped>
  .people-list {
    color: #00fff6;
    font-size: 14px;

    li {
      line-height: 24px;
      padding-left: 18px;
      position: relative;

      &:before{
        content: '';
        position: absolute;
      }

      &:before {
        top: 6px;
        left: 0;
        width: 12px;
        height: 12px;
      }

      &:nth-child(1) {
        &:before {
          background: rgba(255, 228, 130, .9);
        }
      }

      &:nth-child(2) {
        &:before {
          background: rgba(255, 203, 121, .9);
        }
      }

      &:nth-child(3) {
        &:before {
          background: rgba(255, 178, 112, .9);
        }
      }

      &:nth-child(4) {
        &:before {
          background: rgba(255, 152, 103, .9);
        }
      }

      &:nth-child(5) {
        &:before {
          background: rgba(255, 127, 94, .9);
        }
      }

      &:nth-child(6) {
        &:before {
          background: rgba(255, 102, 85, .9);
        }
      }

      &:nth-child(7) {
        &:before {
          background: rgba(255, 76, 76, .9);
        }
      }
    }
  }
</style>
