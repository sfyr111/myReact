import { getDOM } from './util'
import { render } from './render'

export default class Component {
  constructor(props) {
    this.props = props
  }

  setState(state) {
    setTimeout(() => {
      let shoudUpdate
      if (this.shouldComponentUpdate) { // state 改变触发 shouldComponentUpdate
        shoudUpdate = this.shouldComponentUpdate(this.props, state)
      } else shoudUpdate = true

      shoudUpdate && this.componentWillUpdate && this.componentWillUpdate(this.props, state)

      this.state = state
      if (!shoudUpdate) return

      const vnode = this.render()
      let olddom = getDOM(this) // 获取渲染此实例的 olddom
      const myIndex = getDOMIndex(olddom) // 找到olddom 的index

      const startTime = new Date().getTime()
      render(vnode, olddom.parentNode, this, this.__rendered, myIndex)
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