
const ContentfulService = require('./contentful')
const Dependencies = require('./dependencies')
const Tree = require('./tree')

const main = async (args) => {
  const contentful = new ContentfulService(args)
  const contentTypes = await contentful.loadContentTypes()

  const dependencies = new Dependencies(contentTypes, contentful)
  const tree = new Tree(dependencies)
  tree.makeTree(args.rootContentType)
}

module.exports.main = main
