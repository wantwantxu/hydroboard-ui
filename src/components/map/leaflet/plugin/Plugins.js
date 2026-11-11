import WaterPoint from '../layers/WaterPoint'
import RainPoint from '../layers/RainPoint'
import Isosurface from '../layers/Isosurface'
import ReservoirPoint from '../layers/ReservoirPoint'
import HydrologyPoint from '../layers/HydrologyPoint'
import Popup from '../layers/Popup'
import HexinzhouislandPoint from '../layers/HexinzhouislandPoint'
import DangerAreaPoint from '../layers/DangerAreaPoint'
import ForecastLayer from '../layers/ForecastLayer'
import Sandmining from '../layers/Sandmining'
import HydroelectricStationPoint from '../layers/HydroelectricStationPoint'
import SedimentPoint from '../layers/SedimentPoint'
import Meteorology from '../layers/Meteorology'
import WaterWarningPoint from '../layers/WaterWarningPoint'
import DangerOutPoint from '../layers/DangerOutPoint'
import FloodInundationImage from '../layers/floodInundationImage'
import SzyAnalysis from "../layers/SzyAnalysis";
class Plugins {
  constructor(map) {
    this.map = map
  }

  clearAll() {
    try {
      this._popup && this._popup.close()
      this._hydrologyPoint && this._hydrologyPoint.clearLayer()
      this._rainPoint && this._rainPoint.clearLayer()
      this._waterPoint && this._waterPoint.clearLayer()
      this._isosurface && this._isosurface.clearLayer()
      this._reservoirPoint && this._reservoirPoint.clearLayer()
      this._hexinzhouislandPoint && this._hexinzhouislandPoint.clearLayer()
      this._forecastLayer && this._forecastLayer.clearLayer()
      this._sandmining && this._sandmining.clearLayer()
      this._dangerAreaPoint && this._dangerAreaPoint.clearLayer()
      this._hydroelectricStation && this._hydroelectricStation.clearLayer()
      this._sedimentPoint && this._sedimentPoint.clearLayer()
      this._meteorology && this._meteorology.clearLayer()
      this._waterWarningPoint && this._waterWarningPoint.clearLayer()
      this._dangerOutPoint && this._dangerOutPoint.clearLayer()
      this._floodInundationImage && this._floodInundationImage.clearLayer()
      this._szyAnalysis && this._szyAnalysis.clearLayer()
    } catch (e) {
    }
  }

  popup() {
    if (!this._popup) {
      this._popup = new Popup(this.map)
    }
    return this._popup
  }

  rainPoint() {
    if (!this._rainPoint) {
      this._rainPoint = new RainPoint(this.map)
    }
    return this._rainPoint
  }

  waterPoint() {
    if (!this._waterPoint) {
      this._waterPoint = new WaterPoint(this.map)
    }
    return this._waterPoint
  }

  waterWarningPoint() {
    if (!this._waterWarningPoint) {
      this._waterWarningPoint = new WaterWarningPoint(this.map)
    }
    return this._waterWarningPoint
  }

  isosurface() {
    if (!this._isosurface) {
      this._isosurface = new Isosurface(this.map)
    }
    return this._isosurface
  }

  reservoirPoint() {
    if (!this._reservoirPoint) {
      this._reservoirPoint = new ReservoirPoint(this.map)
    }
    return this._reservoirPoint
  }

  hydrologyPoint() {
    if (!this._hydrologyPoint) {
      this._hydrologyPoint = new HydrologyPoint(this.map)
    }
    return this._hydrologyPoint
  }

  hexinzhouislandPoint() {
    if (!this._hexinzhouislandPoint) {
      this._hexinzhouislandPoint = new HexinzhouislandPoint(this.map)
    }
    return this._hexinzhouislandPoint
  }

  dangerOutPoint() {
    if (!this._dangerOutPoint) {
      this._dangerOutPoint = new DangerOutPoint(this.map)
    }
    return this._dangerOutPoint
  }

  dangerAreaPoint() {
    if (!this._dangerAreaPoint) {
      this._dangerAreaPoint = new DangerAreaPoint(this.map)
    }
    return this._dangerAreaPoint
  }

  forecastLayer() {
    if (!this._forecastLayer) {
      this._forecastLayer = new ForecastLayer(this.map)
    }
    return this._forecastLayer
  }

  sandmining() {
    if (!this._sandmining) {
    this._sandmining = new Sandmining(this.map)
  }
    return this._sandmining
  }
  hydroelectricStationPoint() {
    if (!this._hydroelectricStation) {
      this._hydroelectricStation = new HydroelectricStationPoint(this.map)
    }
    return this._hydroelectricStation
  }

  sedimentPoint() {
    if (!this._sedimentPoint) {
      this._sedimentPoint = new SedimentPoint(this.map)
    }
    return this._sedimentPoint
  }

  meteorology() {
    if (!this._meteorology) {
      this._meteorology = new Meteorology(this.map)
    }
    return this._meteorology
  }
  floodInundationImage() {
    if (!this._floodInundationImage) {
      this._floodInundationImage = new FloodInundationImage(this.map)
    }
    return this._floodInundationImage
  }
  szyAnalysis() {
    if (!this._szyAnalysis) {
      this._szyAnalysis = new SzyAnalysis(this.map)
    }
    return this._szyAnalysis
  }
}

export default Plugins
