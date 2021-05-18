module.exports = class Fields {
  constructor (fieldKeys, entries) {
    this.entries = entries
    this.fields = {}
    fieldKeys.forEach(field => {
      this.fields[field] = 0
    })
    this._getFieldCounts()
  }

  _getFieldCounts () {
    for (const { fields } of this.entries) {
      for (const key in this.fields) {
        if (fields[key]) {
          this.fields[key]++
        }
      }
    }
  }
}
