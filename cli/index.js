const { program } = require('commander')
const { main } = require('../lib')
const { version } = require('../package.json')
program.version(version)

program
  .description('A tool to display a dependencies tree of content types.')
  .requiredOption('-s,--space <value>', 'Contentful Space Id')
  .option('-e,--environment <value>', 'Contentful environment name', 'master')
  .option('-r,--rootContentType <value>', 'Root Content Type ID for the tree', 'page')
  .requiredOption('-t,--managementToken <value>', 'Contentful management token')
  .parse()

const options = program.parse().opts()
main(options).then('done').catch(console.log)
