<template>
  <div style="height:100%">
    <textarea id="tinymce"></textarea>
  </div>
</template>

<script type="text/ecmascript-6">
import tinymce from 'tinymce/tinymce';
import 'tinymce/skins/ui/oxide/skin.css';
import 'tinymce/themes/silver/theme';
import 'tinymce/icons/default/icons';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/code';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/image';
export default {
  name: "index",
  components: {},
  props: {
    value: String,
  },
  watch: {
    value: {
       handler(nValue){
         console.log(nValue)
         this.setValue(nValue)
       }
    }
  },
  data() {
    return {
      editor: null,
    };
  },
  mounted() {
    let that = this
    tinymce.init({
        selector: '#tinymce',
        ui_mode: 'split',
        content_css: '/static/tinymce/skins/ui/oxide/content.css',
        language_url: '/static/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        plugins:
          'lists link anchor code wordcount image table visualchars visualblocks searchreplace preview pagebreak nonbreaking media insertdatetime fullscreen directionality autosave autolink advlist',
        toolbar: [
          'undo redo removeformat | bold italic underline strikethrough superscript subscript backcolor forecolor | numlist bullist | blocks | searchreplace fullscreen',
          'fontfamily fontsize fontsizeselect fontsizeinput | alignleft aligncenter alignright alignjustify lineheight outdent indent | link unlink image media | preview code',
        ],
        font_size_formats:
          '9px 10px 11px 12px 14px 16px 18px 20px 22px 24px 26px 28px 36px 42px 48px 72px',
        font_size_input_default_unit: 'px',
        images_upload_handler: (blobInfo, progress) => {
          return this.uploadImage(blobInfo, progress);
        },
        height: 400,
        promotion: false,
      })
      .then(([editor]) => {
        this.editor = editor;

        window.eventBus.$emit('editorInitFinish')
        editor.on('change keyup undo redo', () => {
          if(editor && editor.getContent()){
            this.$emit('input', editor.getContent());
          }
        });
      });
  },
  beforeDestroy() {
    this.editor&&this.editor.destroy();
  },
  methods: {
    setValue(val) {
      if(this.editor){
        const oldValue = this.editor.getContent();
        if (typeof val === 'string' && val !== oldValue) {
          this.editor && this.editor.setContent(val);
        }
      }
    },
    uploadImage(blobInfo, progress) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', '/upload');

        xhr.upload.onprogress = (e) => {
          progress((e.loaded / e.total) * 100);
        };

        xhr.onload = () => {
          if (xhr.status === 403) {
            reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
            return;
          }

          if (xhr.status < 200 || xhr.status >= 300) {
            reject('HTTP Error: ' + xhr.status);
            return;
          }

          if (xhr.response.code !== 200) {
            reject('Error: ' + xhr.response.message);
            return;
          }

          resolve(xhr.response.data.list[0].file_url);
        };

        xhr.onerror = () => {
          reject(
            'Image upload failed due to a XHR Transport error. Code: ' +
            xhr.status,
          );
        };


        const formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        formData.append('module', 'static');
        formData.append('file_type', 'image');

        xhr.responseType = 'json';
        xhr.send(formData);
      });
    }
  }
}
</script>

<style  type="text/scss" lang="scss" scoped>
.tox-tinymce-aux {
  z-index: 10000 !important;
}
.tox .tox-number-input .tox-input-wrapper {
  display: none !important;
}
.tox-statusbar__branding {
  display: none !important;
}
 .tox .tox-mbtn{
  color: #00FFF6 !important;
}
 .tox .tox-tbtn svg{
  fill: #00FFF6 !important;
}
.tox .tox-menubar{
  background-color: rgba(0, 16, 30, .8) !important;
}
</style>
