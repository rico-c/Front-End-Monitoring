import React, { Component } from 'react';
import { Input, Modal, Button } from 'antd';
import Axios from 'axios';
import { Route, Switch, HashRouter, Link } from 'react-router-dom';
import { getCurrentAlertMethod } from '../API/api';
import './css/AlertRule.css'

class AlertRule extends Component {
    state = { visible: false }
    componentDidMount = () => {
        Axios.get(getCurrentAlertMethod)
            .then((res) => {

            })
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    render() {
        return (
            <div className="alertRule_wraper">
                <p><span>当前钉钉机器人Hook地址：</span><span></span></p>
                <Button type="primary" onClick={this.showModal}>
                    更新钉钉机器人Hook
                </Button>
                <Modal
                    title="更新钉钉机器人配置"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Input placeholder="请输入新钉钉机器人Hook地址" />
                </Modal>
            </div>
        );
    }
}

export default AlertRule;