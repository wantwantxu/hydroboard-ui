import * as L from 'leaflet'

class Popup {
  constructor(map) {
    this.popup = null
    this.map = map
    this.layerGroup = L.featureGroup().addTo(map)
  }

  showCharts(data, queryParam) {
    let popBox = window.popBox
    popBox.isPopShow = true
    data.queryParam = queryParam
    popBox.set(data)

  }

  showTabs(data, queryParam) {
    let popBox = window.popBox
    popBox.isPopShow = true
    data.queryParam = queryParam
    popBox.set(data)

  }
  close() {
    try {
      if (this.popup && typeof this.popup.close === 'function') {
        this.popup.close()
      }
    } catch (e) {  }

    try {
      if (window.popBox && typeof window.popBox.close === 'function') {
        window.popBox.close()
      }
    } catch (e) {  }
  }
}

export default Popup
