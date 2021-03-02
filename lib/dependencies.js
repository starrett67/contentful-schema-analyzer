module.exports = class Dependencies {
  constructor (contentTypes, contentful) {
    this.contentTypes = contentTypes
    this.contentTypeLinks = {}
    this.contentful = contentful
    this.parseDependencies()
  }

  getLinkedContentTypes (obj) {
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
          this.getLinkedContentTypes({ ...items, id })
        }
        if (type === 'Link' && linkType === 'Entry') {
          this.getLinkedContentTypes({ ...field, id })
        }
      }
    }
  }

  nextLevel (root, leaf) {
    this.contentTypeLinks?.[leaf]?.forEach(dep => {
      root[leaf][dep] = {}
      this.nextLevel(root[leaf], dep)
    })
  }

  makeTree (rootType) {
    const tree = {}
    tree[rootType] = {}
    this.nextLevel(tree, rootType)
    return tree
  }
}
