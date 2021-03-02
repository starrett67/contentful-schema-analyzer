const treeify = require('treeify')

module.exports = class Tree {
  constructor (dependencies) {
    this.dependencies = dependencies
  }

  _nextLevel (root, leaf) {
    const links = this.dependencies.contentTypeLinks
    links?.[leaf]?.forEach(dep => {
      root[leaf][dep] = {}
      this._nextLevel(root[leaf], dep)
    })
  }

  makeTree (rootType) {
    const tree = {}
    tree[rootType] = {}
    this._nextLevel(tree, rootType)

    console.log(treeify.asTree(tree))
  }
}
