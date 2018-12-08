import React, { Component } from 'react';
import { List, message, Avatar, Spin, Icon } from 'antd';
import Axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';
import { getNewErr } from '../../API/api';
import '../css/newErr.css';

class NewErr extends React.Component {
    state = {
        data: [],
        loading: false,
        hasMore: true,
    }

    componentDidMount() {
        Axios.get(getNewErr)
            .then((res) => {
                console.log(res)
                this.setState({
                    data: res.data
                })
            })
    }

    handleInfiniteOnLoad = () => {
        let data = this.state.data;
        this.setState({
            loading: true,
        });
        Axios.get(getNewErr)
            .then((res) => {
                data = data.concat(res.data);
                this.setState({
                    data,
                    loading: false,
                });
            })
    }

    render() {
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
                            <List.Item key={item.id}>
                                <div>
                                    <p>{item.type}</p>
                                </div>
                                <div>
                                    <p><Icon type="code" /><span> 信息：{item.msg.substring(0, 350)}{item.msg.length >= 350 ? ' ......' : ''}</span></p>
                                    <p><Icon type="paper-clip" /><span> 来源：{item.errUrl.substring(0, 120)}{item.errUrl.length >= 120 ? ' ......' : ''}</span></p>
                                    <p className="subInfo">
                                        <span className="inline"><Icon type="slack" /> 设备：
                                        {
                                            if (item.ua.indexOf('Android') > -1 || item.ua.indexOf('Adr') > -1){
                                                (<Icon type="android" />安卓)
                                            }else if(!!item.ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
                                                (<Icon type="apple" />苹果)
                                            }else{
                                                (<Icon type="chrome" />浏览器)
                                        }
                                    }
                                        </span>
                                        <span><Icon type="user-add" /> 登录：{JSON.parse(item.loginInfo).status === 'login' ? '已登录' : '未登录'}</span>
                                        <span><Icon type="compass" /> 位置：</span>
                                        <span><Icon type="clock-circle" /> 时间戳：{(new Date(item.errTime)).toString()}</span>
                                    </p>
                                </div>
                            </List.Item>
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