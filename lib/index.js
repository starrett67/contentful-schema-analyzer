
const ContentfulService = require('./contentful')
const Dependencies = require('./dependencies')
const Tree = require('./tree')
const Duplicates = require('./duplicates')
const Fields = require('./fields')

const ProgressBar = require('progress')
const PromisePool = require('@supercharge/promise-pool')
const { table } = require('table')
const fs = require('fs')

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
    .withConcurrency(1)
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

module.exports.duplicateCommand = async (args) => {
  const contentful = new ContentfulService(args)
  const contentTypes = await contentful.loadContentTypes()
  const duplicates = new Duplicates(contentTypes, args.contentExportUrl, args.space)
  await duplicates.findDuplicates()

  if (!fs.existsSync('./outputs')) {
    fs.mkdirSync('./outputs')
  }
  fs.writeFileSync('./outputs/duplicateEntries.json', JSON.stringify(duplicates.getJSON(), null, 2))

  const duplicateTable = [['Entry Title', 'Content Type', 'Duplicate Count', 'Url']]
  duplicates.duplicateEntries.forEach(({ entryTitle, contentType, url, entryIds }) => {
    const row = [
      entryTitle,
      contentType,
      entryIds.length,
      url
    ]
    duplicateTable.push(row)
  })

  duplicateTable.sort((a, b) => b[2] - a[2])
  const csv = duplicateTable.map(row => row.join('|')).join('\n')
  fs.writeFileSync('./outputs/duplicateEntries.csv', csv)
  console.log(table(duplicateTable))
}

module.exports.fieldCommand = async (args) => {
  const contentful = new ContentfulService(args)
  await contentful.initEnv()
  const schema = await contentful.getContentTypeSchema(args.contentType)
  const fieldIds = schema.map(({ id }) => id)
  const entries = await contentful.getContentTypeEntries(args)
  const fields = new Fields(fieldIds, entries)
  console.log(fields.fields)
}
