<template>
  <div class="tab-con">
    <iframe :src="iframeSrc" ref="iframeRef" id="iframeId" width="99%" height="340px"/>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    options: {
      type: Object,
      default() {
        return {
          st: {}
        }
      }
    }
  },
  data() {
    return {
      iframeSrc: 'http://127.0.0.1:11008/#/'
    }
  }
}
</script>
