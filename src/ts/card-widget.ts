/**
 * --------------------------------------------
 * AdminLTE card-widget.js
 * License MIT
 * --------------------------------------------
 */

import {
  domReady,
  slideUp,
  slideDown
} from './util/index'

/**
 * Constants
 * ====================================================
 */

const CLASS_NAME_CARD = 'card'
const CLASS_NAME_COLLAPSED = 'collapsed-card'
const CLASS_NAME_COLLAPSING = 'collapsing-card'
const CLASS_NAME_EXPANDING = 'expanding-card'
const CLASS_NAME_WAS_COLLAPSED = 'was-collapsed'
const CLASS_NAME_MAXIMIZED = 'maximized-card'

const SELECTOR_DATA_REMOVE = '[data-card-widget="remove"]'
const SELECTOR_DATA_COLLAPSE = '[data-card-widget="collapse"]'
const SELECTOR_DATA_MAXIMIZE = '[data-card-widget="maximize"]'
const SELECTOR_CARD = `.${CLASS_NAME_CARD}`
const SELECTOR_CARD_HEADER = '.card-header'
const SELECTOR_CARD_BODY = '.card-body'
const SELECTOR_CARD_FOOTER = '.card-footer'

const Default = {
  animationSpeed: 500,
  collapseTrigger: SELECTOR_DATA_COLLAPSE,
  removeTrigger: SELECTOR_DATA_REMOVE,
  maximizeTrigger: SELECTOR_DATA_MAXIMIZE,
  collapseIcon: 'fa-minus',
  expandIcon: 'fa-plus',
  maximizeIcon: 'fa-expand',
  minimizeIcon: 'fa-compress'
}

interface Settings {
  animationSpeed: number;
  collapseTrigger: string;
  removeTrigger: string;
  maximizeTrigger: string;
  collapseIcon: string;
  expandIcon: string;
  maximizeIcon: string;
  minimizeIcon: string;
}

class CardWidget {
  _element: HTMLElement
  _parent: HTMLElement | null
  _settings: Settings
  constructor(element: HTMLElement, settings: Settings) {
    this._element = element
    this._parent = element.closest(SELECTOR_CARD)

    if (element.classList.contains(CLASS_NAME_CARD)) {
      this._parent = element
    }

    this._settings = Object.assign({}, Default, settings)
  }

  collapse() {
    this._parent?.classList.add(CLASS_NAME_COLLAPSING)

    const elm = this._parent?.querySelectorAll(`${SELECTOR_CARD_BODY}, ${SELECTOR_CARD_FOOTER}`)

    if (elm !== undefined) {
      for (const el of elm) {
        if (el instanceof HTMLElement) {
          slideUp(el, this._settings.animationSpeed)
        }
      }
    }

    setTimeout(() => {
      this._parent?.classList.add(CLASS_NAME_COLLAPSED)
      this._parent?.classList.remove(CLASS_NAME_COLLAPSING)
    }, this._settings.animationSpeed)

    const icon = this._parent?.querySelector(`${SELECTOR_CARD_HEADER} ${this._settings.collapseTrigger} .${this._settings.collapseIcon}`)

    icon?.classList.add(this._settings.expandIcon)
    icon?.classList.remove(this._settings.collapseIcon)
  }

  expand() {
    this._parent?.classList.add(CLASS_NAME_EXPANDING)

    const elm = this._parent?.querySelectorAll(`${SELECTOR_CARD_BODY}, ${SELECTOR_CARD_FOOTER}`)

    if (elm !== undefined) {
      for (const el of elm) {
        if (el instanceof HTMLElement) {
          slideDown(el, this._settings.animationSpeed)
        }
      }
    }

    setTimeout(() => {
      this._parent?.classList.remove(CLASS_NAME_COLLAPSED)
      this._parent?.classList.remove(CLASS_NAME_EXPANDING)
    }, this._settings.animationSpeed)

    const icon = this._parent?.querySelector(`${SELECTOR_CARD_HEADER} ${this._settings.collapseTrigger} .${this._settings.expandIcon}`)

    icon?.classList.add(this._settings.collapseIcon)
    icon?.classList.remove(this._settings.expandIcon)
  }

  remove() {
    if (this._parent) {
      slideUp(this._parent, this._settings.animationSpeed)
    }
  }

  toggle() {
    if (this._parent?.classList.contains(CLASS_NAME_COLLAPSED)) {
      this.expand()
      return
    }

    this.collapse()
  }

  maximize() {
    if (this._parent) {
      const maxElm = this._parent.querySelector(`${this._settings.maximizeTrigger} .${this._settings.maximizeIcon}`)
      maxElm?.classList.add(this._settings.minimizeIcon)
      maxElm?.classList.remove(this._settings.maximizeIcon)

      this._parent.style.height = `${this._parent.scrollHeight}px`
      this._parent.style.width = `${this._parent.scrollWidth}px`
      this._parent.style.transition = 'all .15s'

      setTimeout(() => {
        document.querySelector('html')?.classList.add(CLASS_NAME_MAXIMIZED)
        this._parent?.classList.add(CLASS_NAME_MAXIMIZED)
        if (this._parent?.classList.contains(CLASS_NAME_COLLAPSED)) {
          this._parent.classList.add(CLASS_NAME_WAS_COLLAPSED)
        }
      }, 150)
    }
  }

  minimize() {
    if (this._parent) {
      const minElm = this._parent.querySelector(`${this._settings.maximizeTrigger} .${this._settings.minimizeIcon}`)

      minElm?.classList.add(this._settings.maximizeIcon)
      minElm?.classList.remove(this._settings.minimizeIcon)

      this._parent.style.cssText = `height: ${this._parent.style.height} !important; width: ${this._parent.style.width} !important; transition: all .15s;`
      // console.log('🚀 ~ file: card-widget.ts ~ line 164 ~ CardWidget ~ minimize ~ this._parent.style.height', this._parent.style.height)

      setTimeout(() => {
        document.querySelector('html')?.classList.remove(CLASS_NAME_MAXIMIZED)
        if (this._parent) {
          this._parent.classList.remove(CLASS_NAME_MAXIMIZED)

          if (this._parent?.classList.contains(CLASS_NAME_WAS_COLLAPSED)) {
            this._parent.classList.remove(CLASS_NAME_WAS_COLLAPSED)
          }
        }
      }, 10)
    }
  }

  toggleMaximize() {
    if (this._parent?.classList.contains(CLASS_NAME_MAXIMIZED)) {
      this.minimize()
      return
    }

    this.maximize()
  }
}

/**
 *
 * Data Api implementation
 * ====================================================
 */

domReady(() => {
  const collapseBtn = document.querySelectorAll(SELECTOR_DATA_COLLAPSE)

  for (const btn of collapseBtn) {
    btn.addEventListener('click', event => {
      event.preventDefault()
      const target = event.target as HTMLElement
      const data = new CardWidget(target, Default)
      data.toggle()
    })
  }

  const removeBtn = document.querySelectorAll(SELECTOR_DATA_REMOVE)

  for (const btn of removeBtn) {
    btn.addEventListener('click', event => {
      event.preventDefault()
      const target = event.target as HTMLElement
      const data = new CardWidget(target, Default)
      data.remove()
    })
  }

  const maxBtn = document.querySelectorAll(SELECTOR_DATA_MAXIMIZE)

  for (const btn of maxBtn) {
    btn.addEventListener('click', event => {
      event.preventDefault()
      const target = event.target as HTMLElement
      const data = new CardWidget(target, Default)
      data.toggleMaximize()
    })
  }
})

export default CardWidget
