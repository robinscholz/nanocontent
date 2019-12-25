var assert = require('assert')
var path = require('path')

export { isPage }

function isPage(pathPage) {
  assert.strictEqual(typeof pathPage, 'string', 'pathPage must be type string')
  return path.extname(pathPage) === ''
}
