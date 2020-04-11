import React, { Component } from 'react'
import { fft, ifft, util } from 'fft-js'

class SquareWave extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reference: 1, // 参考频率
      sample: 64,   // 采样频率
      filter: 4,    // 低通滤波截止频率
      cycle: 3,     // 最小周期
      phase: 0.1,   // 相位
    }
    this.filt()
  }

  getStepTime = () => this.state.reference / this.state.sample
  getStepNumber = () => {
    const ordinaryStepNumber = Math.floor(this.state.cycle / this.getStepTime()) + 1
    return this.getFilledNumber(ordinaryStepNumber)
  }
  getResampleFreq = () => {
    const { filter } = this.state
    return this.getFilledNumber(filter * 100) // 100倍冗余
  }
  getFilledNumber = number => {
    let tmp = number
    let pow = 0
    for (;tmp> 1; tmp /= 2) {
      pow ++
    }
    return Math.pow(2, pow)
  }

  /** 一次采样 生成重建方波 **/
  generateSW = () => {
    const { phase } = this.state   
    // 采样步长
    const stepTime = this.getStepTime()
    console.log('采样步长', stepTime)
    // 采样点数 直接补齐2^n
    const stepNumber = this.getStepNumber()
    console.log('采样点数', stepNumber)
    // 采样结果
    const samplingResult = []
    // 采样时间
    const timePoints = Array.from(new Array(stepNumber), (_, index) => index * stepTime)
    console.log('time', timePoints)
    // 采样过程，转换到一个周期内通过半周期判定，左闭右开
    timePoints.forEach((timePoint) => {
      const transformedTimePoint = timePoint - phase - Math.floor(timePoint - phase)
      samplingResult.push({
        value: transformedTimePoint < 0.5 ? 1 : 0,
        timePoint
      })
    })
    console.log('samplingResult', samplingResult)

    return samplingResult
  }

  /** 二次采样 使用FFT滤波 **/
  filt = () => {
    // 一次生成的方波，时间点为改值的起始时间
    const sw = this.generateSW()
    // 二次采样频率
    const resample = this.getResampleFreq()
    if (sw.length < 2) {
      throw Error('too little data')
    }
    const stepTime = (sw[1].timePoint - sw[0].timePoint) / resample
    const resampleResult = []
    sw.forEach(point => {
      for (let index = 0; index < resample; index++) {
        resampleResult.push({
          timePoint: point.timePoint + index * stepTime,
          value: point.value
        })
      }
    })
    console.log('resampleResult', resampleResult)
  }


  render() {
    return <div>2333</div>
  }
}

export default SquareWave
