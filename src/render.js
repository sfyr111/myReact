
export function render(vnode, parent) {
  let dom
  if (typeof vnode === 'string') { // 文本节点直接渲染
    dom = document.createTextNode(vnode)
    parent.appendChild(dom)
  }

  if (typeof vnode.type === 'string') { // dom 节点
    dom = document.createElement(vnode.type)
    setAttrs(dom, vnode.props) // props 已经被createElement 解析成对象
    parent.appendChild(dom)

    for(let i = 0; i < vnode.children.length; i++) {
      render(vnode.children[i], dom) // 递归 render children
    }
  }

  if (typeof vnode.type === 'function') { // class 组件
    let func = vnode.type
    let inst = new func(vnode.props) // props 已经被createElement 解析成对象
    let innerVNode = inst.render()
    render(innerVNode, parent)
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