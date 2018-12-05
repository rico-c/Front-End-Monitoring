import React, { Component } from 'react';
import { List, message, Avatar, Spin, BackTop } from 'antd';
import Axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';
import { getNewErr } from '../../API/api';
import './newErr.css'

class newErr extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <BackTop>
                    <div
                        className="ant-back-top-inner"
                        style={{ backgroundColor: 'black', color: 'white', padding: '5px', width: '80px', borderRadius: '3px' }}
                    >回到顶部↑</div>
                </BackTop>
            </div>
        )
    }
}

export default newErr