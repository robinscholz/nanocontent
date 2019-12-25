const test = require('ava')
const nanocontent = require('./dist')

test('readPageSync works', function(t) {
  const page = nanocontent.readPageSync('example/content/about')
  t.is(page.data.title, 'About')
  t.is(page.data.view, 'custom')
})

test('readPage works', async function(t) {
  const page = await nanocontent.readPage('example/content/about')
  t.is(page.data.title, 'About')
  t.is(page.data.view, 'custom')
})

test('readPageSync and readPage outputs are the same', async function(t) {
  const syncPage = nanocontent.readPageSync('example/content/about')
  const asyncPage = await nanocontent.readPage('example/content/about')
  t.deepEqual(syncPage, asyncPage)
})

test('readSiteSync works', function(t) {
  const site = nanocontent.readSiteSync('example/content')
  t.is(site['/example/content'].data.title, 'Example')
  t.is(site['/example/content/about'].data.title, 'About')
})

test('readFileSync works', function(t) {
  const file = nanocontent.readFileSync('/example/content/about/example.png')
  t.is(file.name, 'example')
  t.is(file.type, 'image')
})

test('readFile works', async function(t) {
  const file = await nanocontent.readFile('/example/content/about/example.png')
  t.is(file.name, 'example')
  t.is(file.type, 'image')
})

test('readSite works', async function(t) {
  const site = await nanocontent.readSite('example/content')
  t.is(site['/example/content'].data.title, 'Example')
  t.is(site['/example/content/about'].data.title, 'About')
})

test('readSiteSync and readSite outputs are the same', async function(t) {
  const syncSite = nanocontent.readSiteSync('example/content')
  const asyncSite = await nanocontent.readSite('example/content')
  t.deepEqual(syncSite, asyncSite)
})

test('readSiteSync and readSite outputs are the same with remove option', async function(t) {
  const syncSite = nanocontent.readSiteSync('example/content', { remove: true })
  const asyncSite = await nanocontent.readSite('example/content', {
    remove: true,
  })
  t.deepEqual(syncSite, asyncSite)
})
