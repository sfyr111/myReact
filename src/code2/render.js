/**
 *
 * @param vnode {object} 虚拟dom
 * @param parent {HTMLElement}
 * @param comp {Component} 组件
 * @param olddom {HTMLElemnet}
 */
import { diffObject } from './util'

export function render(vnode, parent, comp, olddom) {
  let dom
  if (typeof vnode === 'string' || typeof vnode === 'number') { // 文本节点直接渲染
    if (olddom && olddom.nodeType === 3) { // 是一个文本节点
      if (olddom.nodeValue !== vnode) olddom.nodeValue = vnode
    } else {
      dom = document.createTextNode(vnode)

      if (olddom) parent.replaceChild(dom, olddom)
      else parent.appendChild(dom)
    }
  }

  if (typeof vnode.type === 'string') { // dom 节点
    if (!olddom || olddom.nodeName !== vnode.type.toUpperCase()) {
      createNewDom(vnode, parent, comp, olddom)
    } else {
      diffDOM(vnode, olddom)
    }
  }

  if (typeof vnode.type === 'function') { // class 组件
    let func = vnode.type
    let inst = new func(vnode.props) // props 已经被createElement 解析成对象

    comp && (comp.__rendered = inst)

    let innerVNode = inst.render()
    render(innerVNode, parent, inst, olddom)
  }
}

function createNewDom(vnode, parent, comp) {
  let dom = document.createElement(vnode.type)

  dom.__vnode = vnode
  comp && (comp.__rendered = dom)
  setAttrs(dom, vnode.props)

  parent.appendChild(dom)

  for (let i = 0; i < vnode.children.length; i++) {
    render(vnode.children[i], dom, null, null)
  }
}

function setAttrs(dom, props) {
  Object.keys(props).forEach(k => {
    const v = props[k]

    if (k === 'className') {
      dom.setAttribute('class', v)
      return
    }

    if (k === 'style') {
      if (typeof v === 'string') dom.style.cssText = v
      if (typeof v === 'object') {
        for (let i in v) {
          dom.style[i] = v[i]
        }
      }
      return
    }

    if (k[0] === 'o' && k[1] === 'n') { // onClick of onClickCapture
      const capture = k.indexOf('Capture') !== -1
      dom.addEventListener(k.replace('Capture', '').substring(2).toLowerCase(), v, capture)
      return
    }

    dom.setAttribute(k, v)
  })
}

function removeAttrs(dom, props) {
  Object.keys(props).forEach(k => {
    const v = props[k]

    if (k === 'className') {
      dom.removeAttribute('class', v)
      return
    }

    if (k === 'style') {
      dom.style.cssText = ''
      return
    }

    if (k[0] === 'o' && k[1] === 'n') { // onClick of onClickCapture
      const capture = k.indexOf('Capture') !== -1
      dom.removeEventListener(k.replace('Capture', '').substring(2).toLowerCase(), v, capture)
      return
    }

    dom.removeAttribute(k)
  })
}

function diffAttrs(dom, { left: newProps, right: oldProps }) {
  Object.keys(newProps).forEach(k => {
    let nv = newProps[k] // newValue
    let ov = oldProps[k] // oldValue
    if (nv === ov) return

    if (k === 'className') {
      dom.setAttribute('class', nv)
      return
    }

    if (k === 'style') {
      if (typeof nv === 'string') {
        dom.style.cssText = nv
      } else if (typeof nv === 'object' && typeof ov === 'object') {
        Object.keys(nv).forEach(nk => {
          if (nv[nk] !== ov[nk]) dom.style[nk] = nv[nk]
        })
        Object.keys(ov).forEach(ok => {
          if (!nv[ok]) dom.style[ok] = ''
        })
      } else if (typeof nv === 'object' && typeof ov === 'string') {
        dom.style = {}
        Object.keys(nv).forEach(nk => dom.style[nk] = nv[nk])
      }
      return
    }

    if (k[0] === 'o' && k[1] === 'n') {
      const capture = k.indexOf('Capture') !== -1
      const eventKey = k.replace('Capture', '').substring(2).toLowerCase()
      dom.removeEventListener(eventKey, ov, capture)
      dom.addEventListener(eventKey, nv, capture)
      return
    }

    dom.setAttribute(k, nv)
  })
}

/**
 *
 * @param vnode {object} 即将更新的vnode
 * @param olddom {HTMLElement}
 *          __vnode (object) 渲染olddom 的vnode 标记
 */
function diffDOM(vnode, olddom) {
  const { onlyInLeft, onlyInRight, bothIn } = diffObject(vnode.props, olddom.__vnode.props)
  setAttrs(olddom, onlyInLeft) // 添加新属性
  removeAttrs(olddom, onlyInRight) // 删除旧属性
  diffAttrs(olddom, bothIn) // 比较且更新新旧属性的不同

  let olddomChild = olddom.firstChild
  for (let i = 0; i < vnode.children.length; i++) {
    // 顺序固定，有缺点，原来是replaceChild，现在对dom 或 text 节点进行重新render
    render(vnode.children[i], olddom, null, olddomChild)
    olddomChild = olddomChild && olddomChild.nextSibling
  }

  while (olddomChild) { // 递归后删除所有 olddom
    let next = olddomChild.nextSibling
    olddom.removeChild(olddomChild)
    olddomChild = next
  }

  olddom.__vnode = vnode // 不忘重新标记
}
