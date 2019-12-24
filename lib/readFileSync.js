const assert = require('assert')
const parser = require('gray-matter')
const path = require('path')

const readPageSync = require('./readPageSync')
const utilFile = require('../utils/file')
const utilPage = require('../utils/page')
const defaults = require('./defaults')

module.exports = readFileSync

function readFileSync(pathFile, opts) {
  assert.strictEqual(typeof pathFile, 'string', 'pathFile must be type string')
  assert.strictEqual(typeof opts, 'object', 'opts must be type object')
  assert.strictEqual(typeof opts.fs, 'object', 'opts.fs must be type object')

  // page
  if (utilPage.isPage(pathFile)) return readPageSync(pathFile, opts)

  const fs = opts.fs
  const parse = typeof opts.parse === 'function' ? opts.parse : parser
  const fileIndex = opts.file || defaults.file
  const fileExtname = path.extname(fileIndex).toLowerCase()
  const filetypes = opts.filetypes || defaults.filetypes
  const pathRoot = opts.pathRoot || ''
  const encoding = opts.encoding || defaults.encoding
  const fileParsed = utilFile.getFileMeta({
    pathFile: pathFile,
    pathRoot: pathRoot,
    filetypes: filetypes,
    remove: opts.remove,
    prefix: opts.prefix,
  })

  // skip text files
  if (fileExtname === fileParsed.extension) return false

  try {
    const pathMeta = pathFile + fileExtname
    const text = fs.readFileSync(pathMeta, encoding)
    return Object.assign(parse(text), fileParsed)
  } catch (err) {
    if (fileParsed.filename) return fileParsed
    else return false
  }
}
