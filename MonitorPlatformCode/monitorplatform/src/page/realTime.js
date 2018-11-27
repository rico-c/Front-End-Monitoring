import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Menu, Dropdown, Button, Icon, message } from 'antd';

class RealTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            units: ['每5分钟', '每1小时', '每4小时', '每24小时'],
            currentUnit: '每5分钟'
        }
    }
    changeCurrentUnit(item) {
        this.setState({
            currentUnit: item
        })
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
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日', '周一', '周二', '周三', '周四', '周五', '周六', '周日', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
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
                    data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: '静态资源异常',
                    type: 'line',
                    stack: '总量',
                    areaStyle: { normal: {} },
                    data: [220, 182, 191, 234, 290, 330, 310, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: 'API异常',
                    type: 'line',
                    stack: '总量',
                    areaStyle: { normal: {} },
                    data: [150, 232, 201, 154, 190, 330, 410, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210]
                }
            ]
        };
    };
    render() {
        const menu = (
            <Menu>
                {this.state.units.map((item) => (
                    <Menu.Item key={item} >
                        <span onClick={() => { this.changeCurrentUnit(item) }}>{item}</span>
                    </Menu.Item>))
                }
            </Menu>
        );
        return (
            <div>
                <span style={{ fontSize: '20px' }}>实时异常数据</span>
                <Dropdown overlay={menu} trigger={['click']} >
                    <a className="ant-dropdown-link" href="#" style={{ fontSize: '16px', marginLeft: '15px' }}>
                        <span>异常数 /</span><span>{this.state.currentUnit}</span> <Icon type="down" />
                    </a>
                </Dropdown>
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