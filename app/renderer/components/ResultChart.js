import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape, Facet, Util, } from 'bizcharts'

export class ResultChart extends Component {
  static propTypes = {
    result: PropTypes.array.isRequired,
  }

  render() {
    return       <div>
    <Chart height={400} data={this.props.result} forceFit>
      <Axis name="timePoint" />
      <Axis name="value" />
      <Tooltip
        crosshairs={{
          type: "y"
        }}
      />
      <Geom type="line" position="timePoint*value" size={2} />
      <Geom
        type="point"
        position="timePoint*value"
        size={4}
        shape={"circle"}
        style={{
          stroke: "#fff",
          lineWidth: 1
        }}
      />
    </Chart>
  </div>
  }
}

export default ResultChart
