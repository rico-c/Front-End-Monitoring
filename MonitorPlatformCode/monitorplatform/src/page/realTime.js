import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Menu, Dropdown, Button, Icon, message, Select, Radio } from 'antd';
import Axios from 'axios';
import { realtime } from '../API/api';

class RealTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUnit: '5min',
      Xdata1: [],
      Xdata2: [],
      Xdata3: [],
      XUnit: []
    }
    this.onChange = this.onChange.bind(this)
  }
  componentWillMount() {
    let XUnit = [];
    let times = 29;
    let now = new Date().getTime();
    while (times >= 0) {
      XUnit.push(`${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(now - 300000 * times).getDay()]} ${new Date(now - 300000 * times).getHours()}:${new Date(now - 300000 * times).getMinutes().toString().padStart(2, '0')}`);
      times--;
    }
    this.setState({
      XUnit: XUnit
    }, this.getData)
  }

  getOption() {
    return {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['JS异常', '静态资源异常', 'API异常']
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
          data: this.state.XUnit
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
          data: this.state.Xdata2
        },
        {
          name: 'API异常',
          type: 'line',
          stack: '总量',
          areaStyle: { normal: {} },
          data: this.state.Xdata3
        }
      ]
    }
  }
  onChange(e) {
    this.setState({ currentUnit: e.target.value }, () => {
      let XUnit = [];
      let times = 29;
      let now = new Date().getTime();
      let unit;
      switch (this.state.currentUnit) {
        case '5min':
          unit = 300000;
          break;
        case '30min':
          unit = 1800000;
          break;
        case '1h':
          unit = 3600000;
          break;
        case '4h':
          unit = 14400000;
          break;
        default:
          unit = 300000;
      }
      while (times >= 0) {
        XUnit.push(`${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(now - unit * times).getDay()]} ${new Date(now - unit * times).getHours()}:${new Date(now - unit * times).getMinutes().toString().padStart(2, '0')}`);
        times--;
      }

      this.setState({
        XUnit: XUnit
      }, this.getData)
    })
  }
  getData() {
    Axios.get(realtime, {
      params: {
        unit: this.state.currentUnit
      }
    })
      .then((res) => {
        if (res.status !== 200) return alert('网络错误');
        this.setState({
          Xdata1: res.data.jsRuntime,
          Xdata2: res.data.sourceLoad,
          Xdata3: res.data.apiRequest
        })
      })
  }
  render() {
    return (
      <div>
        <span style={{ fontSize: '20px' }}>实时异常数据</span>

        <Radio.Group defaultValue="5min" onChange={this.onChange} buttonStyle="solid" style={{ fontSize: '14px', float: 'right' }}>
          <Radio.Button value="5min">每5分钟</Radio.Button>
          <Radio.Button value="30min">每30分钟</Radio.Button>
          <Radio.Button value="1h">每1小时</Radio.Button>
          <Radio.Button value="4h">每4小时</Radio.Button>
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
    )
  }
}

export default RealTime