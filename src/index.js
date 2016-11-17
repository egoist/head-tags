const SCRIPT = 'SCRIPT'
const STYLE = 'STYLE'
const LINK = 'LINK'
const META = 'META'
const NOSCRIPT = 'NOSCRIPT'

export default function headTags({
  style,
  script,
  link,
  meta,
  noscript,
  title,
  titleTemplate
} = {}, {
  identifyAttribute
} = {}) {

  if (!identifyAttribute) {
    throw new Error('identifyAttribute is required to make head tags query-able')
  }

  return {
    title: getMethodsForTitle(title, titleTemplate),
    style: getMethodsForTags(STYLE, style),
    script: getMethodsForTags(SCRIPT, script),
    link: getMethodsForTags(LINK, link),
    meta: getMethodsForTags(META, meta),
    noscript: getMethodsForTags(NOSCRIPT, noscript),
    getHeadTags() {
      return Object
        .keys(this)
        .filter(key => {
          return typeof this[key] === 'object'
        })
    },
    mount() {
      this.getHeadTags()
        .forEach(key => {
          this[key].mount()
        })
    },
    toString() {
      return this.getHeadTags()
        .map(key => {
          return this[key].toString()
        })
        .join('')
    }
  }

  function getMethodsForTitle(title, titleTemplate) {
    return {
      toString() {
        return `<title>${this.value()}</title>`
      },
      value() {
        return typeof titleTemplate === 'function' ?
          titleTemplate(title) :
          title
      },
      mount() {
        document.title = this.value()
      }
    }
  }

  function getMethodsForTags(type, tags) {
    const isSelfClosing = [STYLE, SCRIPT, NOSCRIPT].indexOf(type) === -1
    const generateString = (type, tag) => {
      const tagContent = tag.innerHTML || tag.cssText || ''
      const attrs = Object.keys(tag)
        .filter(key => {
          return ['innerHTML', 'cssText'].indexOf(key) === -1
        })
        .map(key => {
          const value = tag[key]
          if (value === undefined) return key
          return `${key}=${JSON.stringify(value)}`
        })
        .join(' ')
        .trim()
      const identity = identifyAttribute ? ` ${identifyAttribute}` : ''
      return `<${type}${identity}${attrs ? ` ${attrs}` : ''}${isSelfClosing ? ' />' : `>${tagContent}</${type}>`}`
    }
    return {
      toString() {
        return tags
          .map(tag => generateString(type, tag))
          .join('')
      },
      mount() {
        mountTags(type, tags)
      }
    }
  }

  function mountTags(type, tags) {
    const headElement = document.querySelector('head')
    const oldTags = nodesToArray(document.querySelectorAll(`${type}[${identifyAttribute}]`))
    const newTags = []

    let indexToRemove

    if (tags && tags.length > 0) {
      for (const tag of tags) {
        const newElement = document.createElement(type)

        for (const attr in tag) {
          if (attr === 'cssText') {
            if (newElement.styleSheet) {
              newElement.styleSheet.cssText = tag.cssText
            } else {
              newElement.appendChild(document.createTextNode(tag.cssText))
            }
          } else if (attr === 'innerHTML') {
            newElement.innerHTML = tag.innerHTML
          } else {
            newElement.setAttribute(attr, tag[attr])
          }
        }

        newElement.setAttribute(identifyAttribute, '')
        if (oldTags.some((existingTag, index) => {
          indexToRemove = index
          return existingTag.isEqualNode(newElement)
        })) {
          oldTags.splice(indexToRemove, 1)
        } else {
          newTags.push(newElement)
        }
      }
    }

    oldTags.forEach(tag => tag.parentNode.removeChild(tag))
    newTags.forEach(tag => headElement.appendChild(tag))
  }
}

function nodesToArray(nodes) {
  return [...nodes]
}
