export function renderVDOM(vnode) {
  if (typeof vnode === 'string') {
    return vnode
  }

  if (typeof vnode.type === 'string') {
    let ret = {
      type: vnode.type,
      props: vnode.props,
      children: []
    }
    for (let i = 0; i < vnode.children.length; i++) {
      ret.children.push(renderVDOM(vnode.children[i]))
    }

    return ret
  }

  if (typeof vnode.type === 'function') {
    let func = vnode.type
    let inst = new func(vnode.props)
    let innerVNode = inst.render()
    return renderVDOM(innerVNode)
  }
}