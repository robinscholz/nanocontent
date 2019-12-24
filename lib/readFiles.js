const assert = require('assert')

const defaults = require('./defaults')
const readFile = require('./readFile')

module.exports = readFiles

async function readFiles(files, pathSite, opts) {
  assert.strictEqual(typeof files, 'object', 'files must be type object')
  assert.strictEqual(typeof opts, 'object', 'opts must be type object')
  assert.strictEqual(typeof opts.fs, 'object', 'opts.fs must be type object')

  let output = {}

  // read the index
  if (files.indexOf(pathSite) < 0) {
    files.push(pathSite)
  }

  await files.map(read)
  return output

  async function read(pathFile) {
    let content = await readFile(pathFile, opts)
    if (content && !content.name.match(defaults.ignore)) {
      const key = content.url

      // temp cleanup
      content.url = content.extension ? content.path : content.url
      delete content.path

      output[key] = content
    }
    return content
  }
}
