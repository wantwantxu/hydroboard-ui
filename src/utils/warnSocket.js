const warnSocket = {
  socket: null,
  connect() {
    this.socket = new WebSocket('ws:125.64.90.219:13006/websocket/warn?token=Whss-datachange@Warn')
    this.socket.onopen = () => {
      console.log('WebSocket连接成功')
    }
    this.socket.onclose = () => {
      console.log('WebSocket disconnected')
    }
  },
  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data))
    }
  }
}

export default warnSocket
