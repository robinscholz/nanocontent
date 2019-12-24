const slash = require('normalize-path')
const assert = require('assert')
const path = require('path')
const glob = require('glob')

const readFilesSync = require('./readFilesSync')

module.exports = readSiteSync

function readSiteSync(pathSite, opts) {
  assert.strictEqual(typeof pathSite, 'string', 'pathSite must be type string')
  assert.strictEqual(typeof opts, 'object', 'opts must be type object')
  assert.strictEqual(typeof opts.fs, 'object', 'opts.fs must be type object')

  // loop through the files
  const files = glob.sync(slash(path.join(pathSite, '/**/*')))
  return readFilesSync(files, pathSite, opts)
}
