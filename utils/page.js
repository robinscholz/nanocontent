var assert = require('assert')
var path = require('path')

module.exports = {
  isPage: isPage,
}

function isPage(pathPage) {
  assert.strictEqual(typeof pathPage, 'string', 'pathPage must be type string')
  return path.extname(pathPage) === ''
}
