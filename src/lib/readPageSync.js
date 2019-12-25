import { formatUrl, filterFile, sortChildren, getFileMeta } from '../utils/file'
import defaults from './defaults'

const slash = require('normalize-path')
const assert = require('assert')
const parser = require('gray-matter')
const path = require('path')

export default readPageSync

function readPageSync(pathPage, opts) {
  assert.strictEqual(typeof pathPage, 'string', 'pathPage must be type string')
  assert.strictEqual(typeof opts, 'object', 'opts must be type object')
  assert.strictEqual(typeof opts.fs, 'object', 'opts.fs must be type object')

  const fs = opts.fs
  const parse = typeof opts.parse === 'function' ? opts.parse : parser
  const fileIndex = opts.file || defaults.file
  const filetypes = opts.filetypes || defaults.filetypes
  const pathRoot = opts.pathRoot || ''
  const pathUrl = formatUrl(pathPage, pathRoot, opts.remove)
  const encoding = opts.encoding || defaults.encoding
  const content = getContent()
  const children = getChildren()
    .filter(file => filterFile(file, fileIndex))
    .reduce(sortChildren, { files: [], pages: [] })
  const files = getFiles(children.files)
  const pages = getPages(children.pages)

  return Object.assign(content, {
    name: path.basename(pathPage),
    path: formatUrl(pathPage, pathRoot),
    url: pathUrl,
    files: files,
    pages: pages,
  })

  function getChildren() {
    try {
      return fs.readdirSync(pathPage)
    } catch (err) {
      return []
    }
  }

  function getContent() {
    try {
      var content = fs.readFileSync(
        slash(path.join(pathPage, fileIndex)),
        encoding
      )
      return parse(content)
    } catch (err) {
      return ''
    }
  }

  function getFiles(files) {
    return files.reduce(function(result, pathFile) {
      var fileParsed = getFileMeta({
        pathFile: pathFile,
        pathRoot: pathRoot,
        filetypes: filetypes,
        pathParent: pathPage,
        remove: opts.remove,
        prefix: opts.prefix,
      })

      if (!filterFile(pathFile, fileIndex)) return false
      else result[fileParsed.filename] = fileParsed.url
      return result
    }, {})
  }

  function getPages(pages) {
    return pages.reduce(function(result, pathSubpage) {
      var fileParsed = getFileMeta({
        pathRoot: pathRoot,
        pathFile: pathSubpage,
        filetypes: filetypes,
        pathParent: pathPage,
        pathSource: opts.source,
        remove: opts.remove,
        prefix: opts.prefix,
      })

      if (fileParsed.name) result[fileParsed.name] = fileParsed.url
      return result
    }, {})
  }
}