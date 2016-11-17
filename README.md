# head-tags [![NPM version](https://img.shields.io/npm/v/head-tags.svg?style=flat-square)](https://npmjs.com/package/head-tags) [![NPM downloads](https://img.shields.io/npm/dm/head-tags.svg?style=flat-square)](https://npmjs.com/package/head-tags) [![Build Status](https://img.shields.io/circleci/project/egoist/head-tags/master.svg?style=flat-square)](https://circleci.com/gh/egoist/head-tags)

manage document head like a pro

## Install

```bash
$ npm install --save head-tags
```

## Usage

```js
import headTags from 'head-tags'

const options = {
  // we use this to get existing tags
  identifyAttribute: 'head-manager'
}

const head = headTags({
  title: 'foo',
  titleTemplate(title) {
    return `${title} - My Website`
  },
  style: [
    {cssText: 'body {color: #666;}'}
  ],
  link: [
    {href: './main.css', rel: 'stylesheet'}
  ],
  meta: [
    {charset: 'utf-8'}
  ]
}, options) 

// get the html string
head.title.toString() // <title>foo - My Website</title>
// reflect it in dom
head.title.mount() // document.title changed!

// reflect all tags in dom
head.mount()

// get string of all tags
head.toString()
// <title>...</title>
// <style head-manager>...</style>
// ...
```

## API

Supported tags:

- title
- style
- link
- meta
- script
- noscript

### title

`title` is special, its value should be a string.

And we accept an optional `titleTemplate` property to customize the output.

### Tag Content 

use `cssText` property to set content of `style` tag.

For other tags use `innerHTML` to set content.

### Attributes

All properties other than `cssText` and `innerHTML` will be attributes of the tag.

Set the value of property to `undefined` to omit attribute value.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

[MIT](https://egoist.mit-license.org/) © [EGOIST](https://github.com/egoist)
