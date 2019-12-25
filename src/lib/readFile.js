import { getFileMeta } from '../utils/file'
import { isPage } from '../utils/page'
import defaults from './defaults'
import readPage from './readPage'

const promisify = require('promisify-node')
const assert = require('assert')
const parser = require('gray-matter')
const path = require('path')

export default readFile

async function readFile(pathFile, opts) {
  assert.strictEqual(typeof pathFile, 'string', 'pathFile must be type string')
  assert.strictEqual(typeof opts, 'object', 'opts must be type object')
  assert.strictEqual(typeof opts.fs, 'object', 'opts.fs must be type object')

  // pages
  if (isPage(pathFile)) return readPage(pathFile, opts)

  const fs = opts.fs
  const parse = typeof opts.parse === 'function' ? opts.parse : parser
  const fileIndex = opts.file || defaults.file
  const fileExtname = path.extname(fileIndex).toLowerCase()
  const filetypes = opts.filetypes || defaults.filetypes
  const pathRoot = opts.pathRoot || ''
  const encoding = opts.encoding || defaults.encoding
  const fileParsed = getFileMeta({
    pathFile: pathFile,
    pathRoot: pathRoot,
    filetypes: filetypes,
    pathSource: opts.source,
    remove: opts.remove,
    prefix: opts.prefix,
  })

  // skip text files
  if (fileExtname === fileParsed.extension) return false

  try {
    const pathMeta = pathFile + fileExtname
    const text = isAsync(fs.readFile)
      ? await fs.readFile(pathMeta, encoding)
      : await promisify(fs.readFile)(pathMeta, encoding)
    return Object.assign(parse(text), fileParsed)
  } catch (err) {
    // console.log(fileParsed.filename, err.message)
    if (fileParsed.filename) return await fileParsed
    else return false
  }
}

function isAsync(fn) {
  return fn.constructor.name === 'AsyncFunction'
}
