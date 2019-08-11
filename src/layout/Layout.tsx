import React from 'react';

import { Layout, Menu, Icon, Breadcrumb, Button } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import './Layout.scss';
import logo from '../logo.svg';
import { NavLink, Link, Redirect } from 'react-router-dom';
const { Header, Footer, Sider, Content } = Layout;

class MainLayout extends React.Component<any> {
  state = {
    collapsed: false
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    return (
      <Layout className="h-screen">
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          theme="light"
        >
          <div className="logo">
            <img style={{ alignSelf: 'center', height: 70 }} src={logo} />
          </div>

          <Menu mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="home" />
              <span>Home</span>
              <Link to="/" />
            </Menu.Item>

            <Menu.Item key="2">
              <Icon type="user" />
              <span>Generic Master</span>
              <Link to="/generic_master" />
            </Menu.Item>

            <Menu.Item key="3">
              <Icon type="video-camera" />
              <span>One</span>
              <Link to="/one" />
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="upload" />
              <span>nav 3</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header
            style={{ background: 'rgb(13, 98, 176)', padding: 0 }}
            className="flex flex-row text-white justify-between items-center"
          >
            <h1 className="font-bold text-white text-2xl">
              <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
              Simple<span className="text-red-500">&</span>Fine Solutions
            </h1>

            <Button
              onClick={() => {
                sessionStorage.removeItem('token');
                window.location.href='signin';
              }}
            >
              Logout
            </Button>
          </Header>
          <Content
            style={{
              // margin: '24px 16px',
              // padding: 5,
              background: '#fff',
              minHeight: 280,
              overflow: 'auto'
            }}
          >
            {this.props.children}
          </Content>
          <Footer style={{ padding: '2px 10px' }}>
            @Developing by Laksh Enterprises @2019
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export { MainLayout as default };
