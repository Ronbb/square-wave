import React, { Component } from 'react'
import { fft, ifft } from 'fft-js'

class SquareWave extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reference: 1, // 参考频率
      sample: 64, // 采样频率
      filter: 8, // 低通滤波截止频率
      cycle: 3, // 最小周期
      phase: 0, // 相位
    }
  }

  componentDidMount() {
    console.log('result', this.jump(this.filt(), 100))
  }

  getStepTime = () => this.state.reference / this.state.sample
  getStepNumber = () => {
    const ordinaryStepNumber = Math.floor(this.state.cycle / this.getStepTime()) + 1
    return this.getFilledNumber(ordinaryStepNumber)
  }
  getResampleFreq = () => {
    const { filter } = this.state
    return this.getFilledNumber(filter * 10) // 10倍冗余
  }
  getFilledNumber = (number) => {
    let tmp = number
    let pow = 0
    for (; tmp > 1; tmp /= 2) {
      pow++
    }
    return Math.pow(2, pow)
  }

  jump = (array, number) => {
    if (!Array.isArray(array)) {
      throw Error('first argument is not an array ')
    }
    const result = []
    for (let index = 0; index < array.length; index += number) {
      result.push(array[index])
    }
    return result
  }

  /** 一次采样 生成重建方波 **/
  generateSW = () => {
    const { phase } = this.state
    // 采样步长
    const stepTime = this.getStepTime()
    console.info('采样步长', stepTime)
    // 采样点数 直接补齐2^n
    const stepNumber = this.getStepNumber()
    console.info('采样点数', stepNumber)
    // 采样结果
    const samplingResult = []
    // 采样时间
    const timePoints = Array.from(new Array(stepNumber), (_, index) => index * stepTime)
    console.info('time', timePoints)
    // 采样过程，转换到一个周期内通过半周期判定，左闭右开
    timePoints.forEach((timePoint) => {
      const transformedTimePoint = timePoint - phase - Math.floor(timePoint - phase)
      samplingResult.push({
        value: transformedTimePoint < 0.5 ? 1 : 0,
        timePoint,
      })
    })
    console.info('samplingResult', samplingResult)

    return samplingResult
  }

  /** 二次采样 使用FFT滤波 **/
  filt = () => {
    // 一次生成的方波，时间点为改值的起始时间
    const sw = this.generateSW()
    // 二次相对采样频率
    const resample = this.getResampleFreq()
    if (sw.length < 2) {
      throw Error('too little data')
    }
    const stepTime = (sw[1].timePoint - sw[0].timePoint) / resample
    const resampleResult = []
    sw.forEach((point) => {
      for (let index = 0; index < resample; index++) {
        resampleResult.push({
          timePoint: point.timePoint + index * stepTime,
          value: point.value,
        })
      }
    })
    console.info('resampleResult', resampleResult)
    // 二次实际采样频率
    const realSampleFreq = 1 / stepTime
    console.info('realSampleFreq', realSampleFreq)
    // 二次采样总点数
    const resampleNumber = resampleResult.length
    // fft
    let phasors = fft(resampleResult.map((point) => point.value))
    console.info('phasors', phasors)
    // 低通
    const cutOffIndex = (this.state.filter * resampleResult.length) / realSampleFreq
    console.info('cutOffIndex', cutOffIndex)
    phasors = phasors.slice(0, cutOffIndex)
    phasors = phasors.concat(Array(resampleNumber-cutOffIndex).fill([0,0]))
    console.info('filter-phasors', phasors)
    // ifft
    const signal = ifft(phasors)
    console.info('signal', signal)
    const magnitudes = signal.map(c =>Math.sqrt(c[0]*c[0] + c[1]*c[1]))
    console.info('magnitudes', magnitudes)

    return resampleResult.map((point, index) => {
      return {
        timePoint: point.timePoint,
        value: magnitudes[index]
      }
    })
  }

  render() {
    return <div>2333</div>
  }
}

export default SquareWave
