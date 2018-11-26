import React, { Component } from 'react';
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';


class App extends Component {
  componentDidMount() {
    var myChart = echarts.init(document.getElementById('main'));
    myChart.setOption({
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
      },
      yAxis: {
      },
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    });
  }
  render() {
    return (
      <div>
        <div></div>
        <div id="main" style={{ width: 400, height: 400 }}></div>
      </div>
    );
  }
}

export default App;
