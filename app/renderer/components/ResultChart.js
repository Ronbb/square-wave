import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Chart, Geom, Axis, Tooltip } from 'bizcharts'

export class ResultChart extends Component {
  static propTypes = {
    result: PropTypes.array.isRequired,
  }

  render() {
    return (
      <div>
        <Chart height={400} data={this.props.result} forceFit style={{marginBottom: '-50px'}}>
          <Axis name="timePoint" />
          <Axis name="value" />
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom type="line" position="timePoint*value" size={2} />
        </Chart>
      </div>
    )
  }
}

export default ResultChart
