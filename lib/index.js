
const ContentfulService = require('./contentful')
const Dependencies = require('./dependencies')
const treeify = require('treeify')

const main = async (args) => {
  const contentful = new ContentfulService(args)
  const contentTypes = await contentful.loadContentTypes()

  const dependencies = new Dependencies(contentTypes, contentful)
  const tree = dependencies.makeTree(args.rootContentType)
  console.log(treeify.asTree(tree))
}

module.exports.main = main
