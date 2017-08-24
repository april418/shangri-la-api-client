import React, { Component } from 'react'
import Chart from 'chart.js'

class ChartComponent extends Component {
  constructor(props) {
    super(props)
    this.label = props.label
    this.data = props.data || []
    this.options = props.options || {}
  }

  get canvas_context() {
    return this.canvas && this.canvas.getContext('2d')
  }

  componentDidMount() {
    this.chart = new Chart(this.canvas_context, {
      type: 'line',
      data: {
        datasets: [{
          backgroundColor: 'rgba(0, 188, 212, 0.5)',
          borderColor: 'rgba(0, 188, 212, 1)',
          fill: false,
          label: this.label,
          data: this.data
        }]
      },
      options: this.options
    })
  }

  render() {
    return <canvas ref={(c) => { this.canvas = c }}></canvas>
  }
}

export default ChartComponent

