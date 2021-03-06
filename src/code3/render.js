/**
 *
 * @param vnode {object} 虚拟dom
 * @param parent {HTMLElement}
 * @param comp {Component} 组件
 * @param olddom {HTMLElemnet}
 */
import { diffObject, getDOM } from './util'

/**
 *
 * @param vnode {Object}
 * @param parent {HTMLElement}
 * @param comp {Component | null} 为null 为dom 渲染 非组件渲染
 * @param olddomOrComp {HTMLElement | Component}
 * @param myIndex {number}
 */
export function render(vnode, parent, comp, olddomOrComp, myIndex) {
  let dom
  if (typeof vnode === 'string' || typeof vnode === 'number') { // 文本节点直接渲染
    if (olddomOrComp && olddomOrComp.nodeType === 3) { // 是一个文本节点
      if (olddomOrComp.nodeValue !== vnode) olddomOrComp.nodeValue = vnode
    } else {
      dom = document.createTextNode(vnode)
      parent.__rendered[myIndex] = dom // comp 为 null 组件实例不会渲染文本节点

      setNewDom(parent, dom, myIndex)
    }
  }

  if (typeof vnode.type === 'string') { // dom 节点
    if (!olddomOrComp || olddomOrComp.nodeName !== vnode.type.toUpperCase()) {
      createNewDom(vnode, parent, comp, olddomOrComp, myIndex)
    } else {
      diffDOM(vnode, parent, comp, olddomOrComp)
    }
  }

  if (typeof vnode.type === 'function') {
    let func = vnode.type
    let inst
    if (olddomOrComp && olddomOrComp instanceof func) {
      inst = olddomOrComp
      inst.props = vnode.props
    } else {
      inst = new func(vnode.props)

      if (comp) comp.__rendered = inst
      else parent.__rendered[myIndex] = inst // dom 渲染
    }

    let innerVNode = inst.render()
    render(innerVNode, parent, inst, inst.__rendered, myIndex)
  }
}

function setNewDom(parent, newDom, myIndex) {
  const old = parent.childNodes[myIndex]
  if (old) parent.replaceChild(newDom, old)
  else parent.appendChild(newDom)
}

function createNewDom(vnode, parent, comp, olddomOrComp, myIndex) {
  let dom = document.createElement(vnode.type)

  dom.__rendered = [] // 创建dom 时 初始的 __rendered 未数组
  dom.__vnode = vnode

  if (comp) comp.__rendered = dom
  else parent.__rendered[myIndex] = dom

  setAttrs(dom, vnode.props)

  setNewDom(parent, dom, myIndex)

  for (let i = 0; i < vnode.children.length; i++) {
    render(vnode.children[i], dom, null, null, i) // 标记位置
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
function diffDOM(vnode, parent, comp, olddom) {
  const { onlyInLeft, onlyInRight, bothIn } = diffObject(vnode.props, olddom.__vnode.props)
  setAttrs(olddom, onlyInLeft) // 添加新属性
  removeAttrs(olddom, onlyInRight) // 删除旧属性
  diffAttrs(olddom, bothIn) // 比较且更新新旧属性的不同

  const willRemoveArr = olddom.__rendered.slice(vnode.children.length) // 将要删除的 dom
  const renderedArr = olddom.__rendered.slice(0, vnode.children.length)

  olddom.__rendered = renderedArr
  for (let i = 0; i < vnode.children.length; i++) {
    // 顺序固定，有缺点，原来是replaceChild，现在对dom 或 text 节点进行重新render
    _render(vnode.children[i], olddom, null, renderedArr[i], i)
  }

  willRemoveArr.forEach(el => olddom.removeChild(getDOM(el)))

  olddom.__vnode = vnode // 不忘重新标记
}
