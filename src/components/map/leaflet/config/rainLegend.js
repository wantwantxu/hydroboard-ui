
const color = [
  'rgba(200, 230, 235, 0.20)',
  'rgba(0, 210, 255, 0.42)',
  'rgba(0, 255, 180, 0.50)',
  'rgba(80, 220, 120, 0.55)',
  'rgba(255, 220, 70, 0.58)',
  'rgba(255, 150, 70, 0.62)',
  'rgba(255, 70, 70, 0.70)'
]

const unit = 'mm'
const label = ['无雨', '零星小雨', '小雨', '中雨', '大雨', '暴雨', '大暴雨', '特大暴雨']

export const getColor = (value, contourLevelOptions) => {
  for (var i = 0; i < contourLevelOptions.length; i++) {
    const contourLevel = contourLevelOptions[i]
    if (value === contourLevel.value) {
      return contourLevel.color
    }
  }
}

export const getColor2 = (value) => {
  if (value === 0 || value == null) return color[0]
  if (value === 0.1) return color[1]
  if (value > 0.1 && value < 10) return color[2]
  if (value >= 10 && value <= 25) return color[3]
  if (value > 25 && value <= 50) return color[4]
  if (value > 50 && value <= 100) return color[5]
  if (value > 100) return color[6]
  return color[0]
}

export const getContourLevelValue = (hour) => {
  if (hour <= 1) {
    return [0, 0.1, 1.6, 7.0, 15, 40, 50]
  } else if (hour > 1 && hour <= 3) {
    return [0, 0.1, 3, 10, 20, 50, 70]
  } else if (hour > 3 && hour <= 6) {
    return [0, 0.1, 4, 13, 25, 60, 120]
  } else if (hour > 6 && hour <= 12) {
    return [0, 0.1, 5, 15, 30, 70, 140]
  } else {
    return [0, 0.1, 10, 25, 50, 100, 250]
  }
}

export const getContourLevelOptions = (hour) => {
  let options = []
  const values = getContourLevelValue(hour)
  for (var i = 0; i < values.length; i++) {
    const value = values[i]
    options.push({ value: value, color: color[i], unit: unit + '(' + label[i] + ')' })
  }
  return options
}
