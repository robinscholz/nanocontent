const fs = require('fs-extra')
const lib = require('./lib')

module.exports = {
  readFile: readFile,
  readFileSync: readFileSync,
  readFiles: readFiles,
  readFilesSync: readFilesSync,
  readPage: readPage,
  readPageSync: readPageSync,
  readSite: readSite,
  readSiteSync: readSiteSync
}

function readFile (pathFile, opts, callback) {
  opts = Object.assign({ fs: fs }, opts || {})
  return lib.readFile(pathFile, opts, callback)
}

function readFileSync (pathFile, opts) {
  opts = Object.assign({ fs: fs }, opts || {})
  return lib.readFileSync(pathFile, opts)
}

function readFiles (files, pathSite, opts, callback) {
  opts = Object.assign({ fs: fs }, opts || {})
  return lib.readFiles(files, pathSite, opts, callback)
}

function readFilesSync (pathFile, opts) {
  opts = Object.assign({ fs: fs }, opts || {})
  return lib.readFilesSync(pathFile, opts)
}

function readPage (pathPage, opts, callback) {
  opts = Object.assign({ fs: fs }, opts || {})
  return lib.readPage(pathPage, opts, callback)
}

function readPageSync (pathPage, opts) {
  opts = Object.assign({ fs: fs }, opts || {})
  return lib.readPageSync(pathPage, opts)
}

function readSite (pathSite, opts, callback) {
  opts = Object.assign({ fs: fs }, opts || {})
  return lib.readSite(pathSite, opts, callback)
}

function readSiteSync (pathSite, opts) {
  opts = Object.assign({ fs: fs }, opts || {})
  return lib.readSiteSync(pathSite, opts)
}
