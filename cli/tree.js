#!/usr/bin/env node

const { Command } = require('commander')
const { treeCommand } = require('../lib')

const program = new Command()

program
  .description('A tool to display a dependencies tree of content types.')
  .requiredOption('-t,--managementToken <value>', 'Contentful management token')
  .requiredOption('-s,--space <value>', 'Contentful Space Id')
  .option('-e,--environment <value>', 'Contentful environment name', 'master')
  .option('-r,--rootContentType <value>', 'Root Content Type ID for the tree', 'page')
  .parse()

const options = program.parse().opts()
treeCommand(options).then('done').catch(console.log)
