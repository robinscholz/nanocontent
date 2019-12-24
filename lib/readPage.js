const slash = require('normalize-path')
const assert = require('assert')
const parser = require('gray-matter')
const path = require('path')
const pify = require('pify')

const utilFile = require('../utils/file')
const defaults = require('./defaults')

module.exports = readPage

async function readPage(pathPage, opts) {
  assert.strictEqual(typeof pathPage, 'string', 'pathPage must be type string')
  assert.strictEqual(typeof opts, 'object', 'opts must be type object')
  assert.strictEqual(typeof opts.fs, 'object', 'opts.fs must be type object')

  const fs = opts.fs.url ? opts.fs : pify(opts.fs) // web api or node
  const parse = typeof opts.parse === 'function' ? opts.parse : parser
  const fileIndex = opts.file || defaults.file
  const pathRoot = opts.pathRoot || ''
  const filetypes = opts.filetypes || defaults.filetypes
  const pathUrl = utilFile.formatUrl(pathPage, pathRoot, opts.remove)
  const encoding = opts.encoding || defaults.encoding
  const content = await getContent()
  const childrenInput = await getChildren()
  const children = childrenInput
    .filter(file => utilFile.filterFile(file, fileIndex))
    .reduce(utilFile.sortChildren, { files: [], pages: [] })
  const files = await getFiles(children.files)
  const pages = getPages(children.pages)

  return Object.assign(content, {
    name: path.basename(pathPage),
    path: utilFile.formatUrl(pathPage, pathRoot),
    url: pathUrl,
    files: files,
    pages: pages,
  })

  async function getContent() {
    try {
      const content = await fs.readFile(
        slash(path.join(pathPage, fileIndex)),
        encoding
      )
      return parse(content)
    } catch (err) {
      return ''
    }
  }

  async function getChildren() {
    try {
      return await fs.readdir(pathPage)
    } catch (err) {
      return []
    }
  }

  async function getFiles(files) {
    const result = {}
    await files.map(read)
    return result

    async function read(pathFile) {
      var fileParsed = utilFile.getFileMeta({
        pathFile: pathFile,
        pathRoot: pathRoot,
        filetypes: filetypes,
        pathParent: pathPage,
        pathSource: opts.source,
        remove: opts.remove,
        prefix: opts.prefix,
      })

      if (!utilFile.filterFile(pathFile, fileIndex)) return false
      else result[fileParsed.filename] = fileParsed.url
    }
  }

  function getPages(pages) {
    return pages.reduce(function(result, pathSubpage) {
      const fileParsed = utilFile.getFileMeta({
        pathRoot: pathRoot,
        pathFile: pathSubpage,
        filetypes: filetypes,
        pathParent: pathPage,
        remove: opts.remove,
        prefix: opts.prefix,
      })

      if (fileParsed.name) result[fileParsed.name] = fileParsed.url
      return result
    }, {})
  }
}
