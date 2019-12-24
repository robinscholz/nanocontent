const assert = require('assert')

const readFileSync = require('./readFileSync')
const defaults = require('./defaults')

module.exports = readFilesSync

function readFilesSync(files, pathSite, opts) {
  assert.strictEqual(typeof files, 'object', 'files must be type object')
  assert.strictEqual(typeof opts, 'object', 'opts must be type object')
  assert.strictEqual(typeof opts.fs, 'object', 'opts.fs must be type object')

  let output = {}

  // read the index
  if (files.indexOf(pathSite) < 0) {
    files.push(pathSite)
  }

  files.forEach(pathFile => {
    if (typeof opts.onFile === 'function') opts.onFile(pathFile)
    let content = readFileSync(pathFile, opts)
    if (content && !content.name.match(defaults.ignore)) {
      const key = content.url

      // temp cleanup
      content.url = content.extension ? content.path : content.url
      delete content.path

      output[key] = content
    }
  })

  return output
}
