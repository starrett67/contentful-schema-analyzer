const axios = require('axios')
const { get } = require('lodash')

module.exports = class Duplicates {
  constructor (contentTypes, contentExportUrl, space) {
    this.contentTypes = contentTypes
    this.displayFields = {} // key = content type id,  value = display field name
    this.contentExportUrl = contentExportUrl
    this.existingEntries = new Map()
    this.duplicateEntries = new Map()
    this.space = space
  }

  _getEntryTitles () {
    for (const contentType of this.contentTypes) {
      const { displayField, sys } = contentType
      this.displayFields[sys.id] = displayField
    }
  }

  _getContentfulUrl ({ contentType, entryTitle, entryTitleField }) {
    return `https://app.contentful.com/spaces/${this.space}/entries?contentTypeId=${contentType}&filters.0.key=fields.${entryTitleField}&filters.0.val=${encodeURIComponent(entryTitle)}`
  }

  async _loadContent () {
    const response = await axios.get(this.contentExportUrl)
    const content = response.data
    return content.entries
  }

  _addDuplicate ({ contentType, entryTitle = 'Untitled', entryTitleField, identifier, entryId, existingId }) {
    const newDuplicate = {
      entryTitle,
      contentType,
      url: this._getContentfulUrl({ contentType, entryTitle, entryTitleField }),
      entryIds: [existingId]
    }
    const duplicateEntry = this.duplicateEntries.get(identifier) ?? newDuplicate
    duplicateEntry.entryIds.push(entryId)
    this.duplicateEntries.set(identifier, duplicateEntry)
  }

  _parseEntries (contentEntries) {
    for (const entry of contentEntries) {
      const contentType = get(entry, 'sys.contentType.sys.id')
      const entryId = get(entry, 'sys.id')
      const entryTitleField = this.displayFields[contentType]
      const entryTitle = get(entry, `fields.${entryTitleField}.en-US`)
      const identifier = `${contentType}-${entryTitle}`
      const existingEntry = this.existingEntries.get(identifier)
      if (existingEntry) {
        this._addDuplicate({ contentType, entryTitle, entryTitleField, identifier, entryId, existingId: existingEntry })
      }
      this.existingEntries.set(identifier, entryId)
    }
  }

  async findDuplicates () {
    this._getEntryTitles()
    const contentEntries = await this._loadContent()
    this._parseEntries(contentEntries)
    return this.duplicateEntries
  }

  getJSON () {
    return Array.from(this.duplicateEntries).reduce((arr, [key, value]) => {
      const ids = { entryIds: value.entryIds.join(', ') }
      arr.push({ ...value, ...ids })
      return arr
    }, [])
  }
}
