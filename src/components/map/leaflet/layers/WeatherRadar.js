

let type = 1005
let isChecked = false
let layerGroup = null

const createLayer = (map) => {
  if (layerGroup === null) {
    layerGroup = window.L.layerGroup().addTo(map)
  }
}

const clearLayer = () => {
   isChecked = false
  if (layerGroup) {
    layerGroup.clearLayers()
  }
  try {
    window.rainviewer.unload()
  } catch (e) {

  }
  window.rainviewer && window.rainviewer.remove()
}

const loadData = async (option) => {
  isChecked = true


  window.rainviewer = window.L.control.rainviewer({
    position: 'bottomleft',
    nextButtonText: '>>',
    playStopButtonText: '播放/停止',
    prevButtonText: '<<',
    positionSliderLabelText: '时间:',
    opacitySliderLabelText: '透明度:',
    animationInterval: 500,
    opacity: 0.5
  })
  window.rainviewer.addTo(window.map)

}


const setQueryTime = (data) => {

}

export default {
  type,
  isChecked,
  createLayer,
  clearLayer,
  loadData,
  setQueryTime
}
