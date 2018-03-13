import { render, createElement, Component } from './src/code2/react'

const React = {}
React.createElement = createElement
React.Component = Component

const listStyle = {
  fontSize: '12px',
  height: '20px',
  textAlign: 'center',
  margin:'5px',
  padding: '5px',
  border:'1px solid',
  width: '100px',
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      number: 10000
    }
  }

  render() {
    const list = new Array(this.state.number).fill('item')
    return (
      <div
        width={100}>
        <button onClick={e => {
          this.setState({
            number: this.state.number
          })
        }}>click me</button>
        {list.map((item, index) => <div key={item + index} style={listStyle}>{`${item}:${index}`}</div>)}
      </div>
    )
  }
}
const startTime = new Date().getTime()
render(<App />, document.getElementById('app'))
console.log("duration for render:", new Date().getTime() - startTime)