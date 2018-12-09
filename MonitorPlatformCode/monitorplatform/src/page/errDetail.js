import React, { Component } from 'react';
import { List, message, Avatar, Spin, Icon, TreeSelect } from 'antd';
import Axios from 'axios';
import { Route, Switch, HashRouter, Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { getNewErrById } from '../API/api';
import './css/ErrDetail.css';

class errDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            items: []
        }
    }
    componentDidMount = () => {
        Axios.get(getNewErrById, {
            params: {
                id: this.props.match.params.id
            }
        })
            .then((res) => {
                console.log(res.data)
                this.setState({ items: res.data })
            })
    }
    render() {
        function type(item) {
            if (!item) return;
            if (item.type === 'jsRuntime') {
                return (<div><div className="typeIcon typeIcon1 inlineIcon">JS</div><p className="inlineIcon">JavaScript运行时错误</p></div>)
            } else if (item.type === 'sourceLoad') {
                return (<div><div className="typeIcon typeIcon2">Load</div> <p className="inlineIcon">静态资源加载失败</p></div >)
            } else if (item.type === 'apiRequest') {
                return (<div><div className="typeIcon typeIcon3">API</div> <p className="inlineIcon">API请求失败</p></div >)
            } else {
                return (<div><div className="typeIcon typeIcon4">{item.type ? item.type : '其他'}</div> <p className="inlineIcon">其他</p></div >)
            }
        }
        return (
            <div className="err_detail_wrapper">
                <div onClick={() => { this.props.history.goBack() }} >
                    <Icon type="close-circle" theme="filled" style={{ fontSize: '30px', float: 'right', margin: '10px', cursor: 'pointer' }} />
                </div>
                {
                    this.state.items.map((item) => (
                        <div>
                            <div>
                                {type(item)}
                            </div>
                            <div className="detailInfo">
                                <p><Icon type="code" className="icon" /><span className='black'> 异常：</span></p>
                                <div className="stackInfo">
                                    {item.msg.split("@").map((item, index) => (
                                        <p>{index > 0 && ('@')}{item}</p>
                                    ))}
                                </div>
                                <p><Icon type="calculator" className="icon" /><span className='black'> Vue状态:</span>{item.vueData ? item.vueData : '无Vue状态'}</p>
                                <p><Icon type="api" className="icon" /><span className='black'> API参数:</span>{item.apiParams ? item.apiParams : '无异常API请求'}</p>
                                <p><Icon type="paper-clip" className="icon" /><span className='black'> 来源：</span>{item.errUrl}</p>
                                <p><Icon type="slack" className="icon" /> <span className='black'>完整UserAgent：</span>{item.ua}</p>
                                <p><Icon type="user-add" className="icon" /> <span className='black'>登录信息：</span>{JSON.parse(item.loginInfo).status === 'login' ? '已登录' : '未登录'}{JSON.parse(item.loginInfo).status === 'login' ? `userId:${JSON.parse(item.loginInfo).userId}` : ''}</p>
                                <p><Icon type="compass" className="icon" /> <span className='black'>位置：</span></p>
                                <p><Icon type="clock-circle" className="icon" /> <span className='black'>时间戳：</span>{(new Date(item.errTime)).toString()}</p>
                            </div>
                        </div>
                    ))
                }
            </div >
        );
    }
}

export default errDetail;