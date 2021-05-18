#!/usr/bin/env node

const { program } = require('commander')
const { version } = require('../package.json')
program.version(version)

program
  .command('tree', 'display dependency tree of content type', { executableFile: 'tree' })
  .command('links', 'display the most links a content type\'s entries has', { executableFile: 'links' })
  .command('duplicates', 'displays entries that have duplicate entry titles and content types', { executableFile: 'duplicates' })
  .command('fields', 'display information about how ofter fields are used in a schema', { executableFile: 'fields' })
  .parse()
