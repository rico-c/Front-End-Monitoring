import React, { Component } from 'react';
import { Route, Switch, HashRouter, Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import RealTime from './page/realTime.js';
import Setting from './page/setting.js';
import ErrDetail from './page/errDetail.js';
import newErr from './page/errInfo/newErr.js';
import AlertRule from './page/alertRule.js';
import './App.css';

class App extends Component {
  render() {
    const { SubMenu } = Menu;
    const { Header, Content, Sider } = Layout;
    let Main = (
      <div id="layout">
        <HashRouter>
          <Switch>
            <Route exact path="/" component={RealTime} />
            <Route path="/Setting" component={Setting} />
            <Route path="/ErrDetail/:id" component={ErrDetail} />
            <Route path="/newErr" component={newErr} />
            <Route path="/AlertRule" component={AlertRule} />
          </Switch>
        </HashRouter>
      </div>
    )

    return (
      <Layout style={{ height: '100%' }}>
        <Header className="header">
          <div style={{ lineHeight: '64px', height: '64px', backgroundColor: '#000000' }}>
            <img
              src={require('./img/logo.png')}
              alt="小猪短租"
              style={{ width: '70px' }} />
            <span
              style={{ fontSize: 18, marginLeft: 40, color: '#ffffff', fontWeight: 500 }}>
              前端监控平台
            </span>
            <span style={{ float: 'right', color: '#ffffff' }}>V1.00</span>
          </div>
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <HashRouter>
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%' }}
              >
                <Menu.Item key="1"><Link to="/"><span><Icon type="rocket" />实时监控</span></Link></Menu.Item>
                <SubMenu key="sub1" title={<span><Icon type="frown" />异常信息</span>}>
                  <Menu.Item key="2"><Link to="/newErr">最新异常</Link></Menu.Item>
                  <Menu.Item key="3"><Link to="/historyErr">历史记录</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title={<span><Icon type="dot-chart" />统计数据</span>}>
                  <Menu.Item key="4">历史故障率</Menu.Item>
                  <Menu.Item key="5">高故障率页面</Menu.Item>
                  <Menu.Item key="6">高故障率JS</Menu.Item>
                  <Menu.Item key="7">终端设备</Menu.Item>
                </SubMenu>
                <Menu.Item key="8"><span><Icon type="environment" />地域</span></Menu.Item>
                <Menu.Item key="9"><Link to="/AlertRule"><span><Icon type="notification" />报警管理</span></Link></Menu.Item>
                <Menu.Item key="10"><Link to="/Setting"><span><Icon type="setting" />设置</span></Link></Menu.Item>
              </Menu>
            </HashRouter>
          </Sider>
          <Layout style={{ padding: '14px' }}>
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
              {Main}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default App;