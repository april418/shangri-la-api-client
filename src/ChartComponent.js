import React, { Component } from 'react'
import Chart from 'chart.js'

class ChartComponent extends Component {
  get canvas_context() {
    return this.canvas && this.canvas.getContext('2d')
  }

  renderChart() {
    this.chart && this.chart.destroy()
    this.chart = new Chart(this.canvas_context, {
      type: this.props.type,
      data: this.props.data,
      options: this.props.options
    })
  }

  componentDidMount() {
    this.renderChart()
  }

  componentDidUpdate() {
    this.renderChart()
  }

  render() {
    return <canvas ref={(c) => { this.canvas = c }}></canvas>
  }
}

export default ChartComponent

