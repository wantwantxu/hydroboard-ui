<template>
  <vue-office-docx :src="docxUrl" v-if="docxUrl"></vue-office-docx>
</template>

<script>
import VueOfficeDocx from '@/shims/vue-office-docx'
import Api from '@/api'
export default {
  components: {
    VueOfficeDocx
  },
  name: "wordPreview",
  data(){
    return {
      docxUrl: null
    }
  },
  mounted() {

  },
  methods: {
  }
}
</script>

<style type="text/scss" lang="scss" scoped>

</style>
