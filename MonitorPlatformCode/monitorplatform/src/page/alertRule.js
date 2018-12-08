import React, { Component } from 'react';
import { List, message, Avatar, Spin, Icon, TreeSelect } from 'antd';
import Axios from 'axios';
import { Route, Switch, HashRouter, Link } from 'react-router-dom';
import { getCurrentAlertMethod } from '../API/api';

class AlertRule extends Component {
    componentDidMount() {
        Axios.get(getCurrentAlertMethod)
            .then((res) => {

            })
    }
    render() {
        return (
            <div>
                asdaasd
            </div>
        );
    }
}

export default AlertRule;