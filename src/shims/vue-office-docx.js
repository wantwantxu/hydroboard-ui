export default {
  name: 'VueOfficeDocxFallback',
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  render(h) {
    return h(
      'div',
      {
        style: {
          padding: '12px',
          color: '#999',
          border: '1px dashed #d9d9d9',
          borderRadius: '4px'
        }
      },
      this.src
        ? `当前环境未启用 DOCX 预览组件，可下载后查看：${this.src}`
        : 'DOCX 预览地址为空'
    )
  }
}
