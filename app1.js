import { render, createElement, Component } from './src/code1/react'

const React = {}
React.createElement = createElement
React.Component = Component


class Color extends React.Component {
  render() {
    return (
      <div style={{ color: this.props.color }}>color is: {this.props.color}</div>
    )
  }
}

const colorArr = ['red', 'blue', 'black', 'green', 'gray']
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      color: 'black'
    }
  }
  handleClick() {
    console.log("handleClick")
    this.setState({
      color: colorArr[Math.random() * 5 | 0]
    })
  }
  render() {
    return (
      <div onClick={this.handleClick.bind(this)}>
        <Color color={this.state.color} />
      </div>
    )
  }
}

render(<App />, document.getElementById('app'))
