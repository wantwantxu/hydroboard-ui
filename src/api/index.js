import grid from './grid'
import base from './base'
import sandMining from './sand-mining'
import defense from './defense'
import waterResource from './water-resource'
import forecast from './forecast'

export default {
  ...grid,
  ...base,
  ...sandMining,
  ...defense,
  ...waterResource,
  ...forecast
}
