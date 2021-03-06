import { getDOM } from './util'
import { render } from './render'

export default class Component {
  constructor(props) {
    this.props = props
  }

  setState(state) {
    setTimeout(() => {
      this.state = state
      const vnode = this.render()
      let olddom = getDOM(this) // 获取渲染此实例的 olddom
      const myIndex = getDOMIndex(olddom)
      const startTime = new Date().getTime()
      render(vnode, olddom.parentNode, this.__rendered, myIndex)
      console.log("duration for setState:", new Date().getTime() - startTime)
    }, 0)
  }
}

function getDOMIndex(dom) {
  const nodes = dom.parentNode.childNodes
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i] === dom) return i
  }
}