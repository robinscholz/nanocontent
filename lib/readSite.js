const slash = require('normalize-path')
const assert = require('assert')
const path = require('path')
const pify = require('pify')
const glob = pify(require('glob'))

const readFiles = require('./readFiles')

module.exports = readSite

async function readSite (pathSite, opts) {
  assert.strictEqual(typeof pathSite, 'string', 'pathSite must be type string')
  assert.strictEqual(typeof opts, 'object', 'opts must be type object')
  assert.strictEqual(typeof opts.fs, 'object', 'opts.fs must be type object')

  // loop through the files
  const files = await glob(slash(path.join(pathSite, '/**/*')))
  return readFiles(files, pathSite, opts)
}
