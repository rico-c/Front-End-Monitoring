import React, { Component } from 'react';
import { List, message, Avatar, Spin, Icon } from 'antd';
import Axios from 'axios';
import { Route, Switch, HashRouter, Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { getNewErr } from '../../API/api';
import '../css/newErr.css';

class NewErr extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
            hasMore: true,
            startId: ''
        }
    }

    componentDidMount = () => {
        Axios.get(getNewErr)
            .then((res) => {
                this.setNewStart(res.data[res.data.length - 1].id);
                this.setState({
                    data: res.data
                });
            })
    }

    handleInfiniteOnLoad = () => {
        let data = this.state.data;
        this.setState({
            loading: true,
        });
        Axios.get(getNewErr, {
            params: {
                startId: this.state.startId
            }
        })
            .then((res) => {
                data = data.concat(res.data);
                this.setNewStart(res.data[res.data.length - 1].id);
                this.setState({
                    data,
                    loading: false,
                });
            })
    }

    // 滚动加载
    setNewStart = (Id) => {
        this.setState({ startId: Number(Id) - 1 })
    }

    render() {
        function os(item) {
            if (item.ua.indexOf('Android') > -1 || item.ua.indexOf('Adr') > -1) {
                return <span> <Icon type="android" /> 安卓 </span>
            } else if (!!item.ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                return <span><Icon type="apple" />苹果</span>
            } else {
                return <span><Icon type="chrome" />浏览器 </span>
            }
        }
        function type(item) {
            if (item.type === 'jsRuntime') {
                return <div className="typeIcon typeIcon1">JS</div>
            } else if (item.type === 'sourceLoad') {
                return <div className="typeIcon typeIcon2">Load</div>
            } else if (item.type === 'apiRequest') {
                return <div className="typeIcon typeIcon3">API</div>
            } else {
                return <div className="typeIcon typeIcon4">{item.type ? item.type : '其他'}</div>
            }
        }
        return (
            <div className="infinite-container">
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={this.handleInfiniteOnLoad}
                    hasMore={!this.state.loading && this.state.hasMore}
                    useWindow={false}
                >
                    <List
                        dataSource={this.state.data}
                        renderItem={item => (
                            <Link to={`/ErrDetail/${item.id}`}>
                                <List.Item key={item.id} className="list_item">
                                    <div>
                                        {type(item)}
                                    </div>
                                    <div className="itemInfo">
                                        <p><Icon type="code" /><span className='black'> 异常：{item.msg.substring(0, 350)}{item.msg.length >= 350 ? ' ......' : ''}</span></p>
                                        <p><Icon type="paper-clip" /><span className='black'> 来源：{item.errUrl.substring(0, 120)}{item.errUrl.length >= 120 ? ' ......' : ''}</span></p>
                                        <p className="subInfo">
                                            <span className="inline"><Icon type="slack" /> <span className='black'>设备：
                                             {os(item)}
                                            </span>
                                            </span>
                                            <span><Icon type="user-add" /> <span className='black'>登录：{JSON.parse(item.loginInfo).status === 'login' ? '已登录' : '未登录'}</span></span>
                                            <span><Icon type="compass" /> <span className='black'>位置：</span></span>
                                            <span><Icon type="clock-circle" /> <span className='black'>时间戳：{(new Date(item.errTime)).toString()}</span></span>
                                        </p>
                                    </div>
                                </List.Item>
                            </Link>
                        )}
                    >
                        {this.state.loading && this.state.hasMore && (
                            <div className="loading-container">
                                <Spin />
                            </div>
                        )}
                    </List>
                </InfiniteScroll>
            </div>
        );
    }
}

export default NewErr