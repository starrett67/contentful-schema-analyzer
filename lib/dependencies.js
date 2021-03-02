module.exports = class Dependencies {
  constructor (contentTypes) {
    this.contentTypes = contentTypes
    this.contentTypeLinks = {}
    this.parseDependencies()
  }

  _getLinkedContentTypes (obj) {
    const { validations, id } = obj
    const linkContentType = validations?.find(({ linkContentType }) => !!linkContentType)?.linkContentType
    let contentTypeDep = this.contentTypeLinks[id]
    if (validations && linkContentType) {
      contentTypeDep = contentTypeDep ?? []
      for (const type of linkContentType) {
        if (!contentTypeDep.includes(type)) {
          contentTypeDep.push(type)
        }
      }
    }
  }

  parseDependencies () {
    for (const contentType of this.contentTypes) {
      const { fields, sys } = contentType
      const { id } = sys
      this.contentTypeLinks[id] = []
      for (const field of fields) {
        const { linkType, type, items } = field
        if (type === 'Array' && items.type === 'Link') {
          this._getLinkedContentTypes({ ...items, id })
        }
        if (type === 'Link' && linkType === 'Entry') {
          this._getLinkedContentTypes({ ...field, id })
        }
      }
    }
  }
}
