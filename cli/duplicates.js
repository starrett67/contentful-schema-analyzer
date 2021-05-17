#!/usr/bin/env node

const { Command } = require('commander')
const { duplicateCommand } = require('../lib')

const program = new Command()

program
  .description('Finds a list of entries with the same content type and entry titles.')
  .requiredOption('-s,--space <value>', 'Contentful Space Id')
  .requiredOption('-t,--managementToken <value>', 'Contentful management token')
  .requiredOption('-u --contentExportUrl <value>', 'Content Export Url')
  .option('-e,--environment <value>', 'Contentful environment name', 'master')
  .parse()

const options = program.parse().opts()
duplicateCommand(options).then('done').catch(console.log)
