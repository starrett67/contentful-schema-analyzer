#!/usr/bin/env node

const { Command } = require('commander')
const { linksCommand } = require('../lib')

const program = new Command()

program
  .description('Display infomation about the number of links that a content types entries has.')
  .requiredOption('-s,--space <value>', 'Contentful Space Id')
  .requiredOption('-t,--managementToken <value>', 'Contentful management token')
  .option('-e,--environment <value>', 'Contentful environment name', 'master')
  .requiredOption('-c,--contentType <value>', 'Content type used to search for entry links')
  .parse()

const options = program.parse().opts()
linksCommand(options).then('done').catch(console.log)
