import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Menu, Dropdown, Button, Icon, message, Select, Radio } from 'antd';
import Axios from 'axios';
import { realtime } from '../API/api'

class RealTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUnit: '5min',
      Xdata1: [],
      Xdata2: [],
      Xdata3: []
    }
    this.onChange = this.onChange.bind(this)
  }
  componentWillMount() {
    Axios.get(realtime, {
      params: {
        unit: '4h'
      }
    })
      .then((res) => {
        if (res.status !== 200) return alert('网络错误');
        this.setState({
          Xdata1: res.data
        })
      })
  }
  getOption() {
    return {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['JS异常']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'JS异常',
          type: 'line',
          stack: '总量',
          areaStyle: { normal: {} },
          data: this.state.Xdata1
        },
        {
          name: '静态资源异常',
          type: 'line',
          stack: '总量',
          areaStyle: { normal: {} },
          data: this.state.Xdata1
        },
        {
          name: 'API异常',
          type: 'line',
          stack: '总量',
          areaStyle: { normal: {} },
          data: this.state.Xdata1
        }
      ]
    }
  }
  onChange(e) {
    console.log(e.target.value)
    this.setState({ currentUnit: e.target.value });
  }
  render() {
    return (
      <div>
        <span style={{ fontSize: '20px' }}>实时异常数据</span>

        <Radio.Group defaultValue="5min" onChange={this.onChange} buttonStyle="solid" style={{ fontSize: '14px', float: 'right' }}>
          <Radio.Button value="5min">每5分钟</Radio.Button>
          <Radio.Button value="1h">每1小时</Radio.Button>
          <Radio.Button value="4h">每4小时</Radio.Button>
          <Radio.Button value="24h">每24小时</Radio.Button>
        </Radio.Group>

        <ReactEcharts
          option={this.getOption()}
          style={{ height: '70vh', width: '100%', marginTop: '15px' }} />

        <p style={{ width: '80%', left: '10%', position: 'relative' }}>采样率：
          <span>100%</span>
        </p>
        <p style={{ width: '80%', left: '10%', position: 'relative' }}>限制重复上报次数：
          <span>3</span>
        </p>
      </div>
    );
  }
}

export default RealTime;