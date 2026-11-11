

let graticule = null
const clearPopup = () => {
  if (window.popup != null) {

  }
}

const createGraticule = () => {
  
}
const removeGraticule = () => {
  if (graticule !== null) {
    window.map.removeLayer(graticule)
  }
}
export default {
  clearPopup,
  createGraticule,
 removeGraticule
}
