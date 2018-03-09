import { createElement } from './src/react'
import { render } from './src/react'

const React = {}
React.createElement = createElement
React.Component = class Component {}

class ChildrenChild extends React.Component {
  render() {
    return (
      <div>
        children-child
      </div>
    )
  }
}

class Children extends React.Component {
  render() {
    return (
      <div>
        children
        <ChildrenChild />
      </div>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <span>App</span>
        <span>component</span>
        <Children />
      </div>
    )
  }
}

render(<App />, document.getElementById('app'))
