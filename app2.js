import { render, createElement, Component } from './src/code2/react'

const React = {}
React.createElement = createElement
React.Component = Component

class AppWithNoVDOM extends Component {
  constructor(props) {
    super(props)
  }

  testApp3() {
    let result = []
    for(let i = 0; i < 10000 ; i++) {
      result.push(<div style={{
        width: '30px',
        color: 'red',
        fontSize: '12px',
        fontWeight: 600,
        height: '20px',
        textAlign: 'center',
        margin:'5px',
        padding: '5px',
        border:'1px solid red',
        position: 'relative',
        left: '10px',
        top: '10px',
      }} title={i} >{i}</div>)
    }
    return result
  }

  render() {
    return (
      <div
        width={100}>
        <a  onClick={e => {
          this.setState({})
        }}>click me</a>
        {this.testApp3()}
      </div>
    )
  }
}
const startTime = new Date().getTime()
render(<AppWithNoVDOM />, document.getElementById('app'))
console.log("duration:", new Date().getTime() - startTime)