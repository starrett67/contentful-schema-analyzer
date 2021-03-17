
const ContentfulService = require('./contentful')
const Dependencies = require('./dependencies')
const Tree = require('./tree')
const ProgressBar = require('progress')
const PromisePool = require('@supercharge/promise-pool')
const { table } = require('table')

module.exports.treeCommand = async (args) => {
  const contentful = new ContentfulService(args)
  const contentTypes = await contentful.loadContentTypes()

  const dependencies = new Dependencies(contentTypes, contentful)
  const tree = new Tree(dependencies)
  tree.makeTree(args.rootContentType)
}

module.exports.linksCommand = async (args) => {
  const contentful = new ContentfulService(args)
  await contentful.initEnv()
  const entries = await contentful.getContentTypeEntries(args)
  const linksTable = [['Links Count', 'Number of Entries']]
  const bar = new ProgressBar('Getting content links [:bar] :rate/entries per sec :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: entries.length
  })
  const { results } = await PromisePool
    .withConcurrency(2)
    .for(entries)
    .process(async entry => {
      const numOfLinks = await contentful.numberOfLinks(entry.sys.id)
      bar.tick()
      return { entry, numOfLinks }
    })
  for (const { numOfLinks } of results) {
    const row = linksTable.find(r => r[0] === numOfLinks)
    if (row) {
      row[1]++
    } else {
      const newRow = [numOfLinks, 1]
      linksTable.push(newRow)
    }
  }
  linksTable.sort((a, b) => a[0] - b[0])
  console.log(table(linksTable))
}
