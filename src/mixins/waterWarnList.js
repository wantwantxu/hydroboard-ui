
export default {
  methods: {
    setWarnedList(list = []) {
      const rows = (Array.isArray(list) ? list : []).map((row) => {
        const item = { ...row }
        const z = Number(item.z != null ? item.z : item.rz)
        const wrz = Number(item.wrz)
        const grz = Number(item.grz)
        const fsltdz = Number(item.fsltdz)
        if (!Number.isNaN(z)) {
          if (!Number.isNaN(grz) && z >= grz) {
            item.warnColor = 'red'
            item.warnType = '超保证'
            item.warnThreshold = grz
            item.warnThresholdLabel = '保证水位'
          } else if (!Number.isNaN(wrz) && z >= wrz) {
            item.warnColor = 'orange'
            item.warnType = '超警戒'
            item.warnThreshold = wrz
            item.warnThresholdLabel = '警戒水位'
          } else if (!Number.isNaN(fsltdz) && z >= fsltdz) {
            item.warnColor = 'yellow'
            item.warnType = '超汛限'
            item.warnThreshold = fsltdz
            item.warnThresholdLabel = '汛限水位'
          }
        }
        return item
      })
      this.list = rows
      return rows
    }
  }
}
