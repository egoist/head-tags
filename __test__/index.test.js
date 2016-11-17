import headTags from '../src'

test('main', () => {
  const head = headTags({
    title: 'foo',
    titleTemplate(title) {
      return `${title} - App`
    },
    script: [
      {innerHTML: 'document.body.style.color = "black";'}
    ],
    style: [
      {cssText: 'body {background-color: #ccc;}'}
    ],
    meta: [
      {name: 'foo', content: 'bar'}
    ],
    link: [
      {href: './foo.css', rel: 'stylesheet'}
    ]
  }, {identifyAttribute: 'is-head'})

  expect(head.title.toString()).toBe('<title>foo - App</title>')
  head.title.mount()
  expect(document.title).toBe('foo - App')

  expect(head.script.toString()).toBe('<SCRIPT is-head>document.body.style.color = "black";</SCRIPT>')
  head.script.mount()
  expect(document.body.style.color).toBe('black')

  expect(head.style.toString()).toBe('<STYLE is-head>body {background-color: #ccc;}</STYLE>')

  expect(head.meta.toString()).toBe('<META is-head name="foo" content="bar" />')
  expect(head.link.toString()).toBe('<LINK is-head href="./foo.css" rel="stylesheet" />')
})
