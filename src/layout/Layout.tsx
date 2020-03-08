import React, { useContext, useState } from 'react';

import { Layout, Menu, Icon, Breadcrumb, Button } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import './Layout.scss';
import logo from '../logo.svg';
import { NavLink, Link, Redirect } from 'react-router-dom';
import AppContext from '../context/context-app';
const { Header, Footer, Sider, Content } = Layout;

const MainLayout: React.FC = (props: any) => {
  const { appState } = useContext(AppContext);

  const [state, setState] = useState({ collapsed: true });

  const toggle = () => {
    setState({
      ...state,
      collapsed: !state.collapsed
    });
  };

  return (
    <Layout className="h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={state.collapsed}
        theme="light"
      >
        <div className="logo">
          {/* <img style={{ alignSelf: 'center', height: 70 }} src={logo} /> */}
          <Icon
            type="slack"
            className="my-2 text-5xl"
            style={{ color: '#0d62b0' }}
          />
        </div>

        <Menu mode="inline" defaultSelectedKeys={['2']}>
          <Menu.Item key="1">
            <Icon type="home" />
            <span>Home</span>
            <Link to="/" />
          </Menu.Item>

          <Menu.Item key="2">
            <Icon type="build" />
            <span>Generic Master</span>
            <Link to="/generic_master" />
          </Menu.Item>

          <Menu.Item key="3">
            <Icon type="edit" />
            <span>Notes Master</span>
            <Link to="/one" />
          </Menu.Item>
          <Menu.Item key="4">
            <Icon type="setting" />
            <span>Settings</span>
          </Menu.Item>
          <Menu.Item key="80">
            <Icon type="down" />
            <span>Import</span>
            <Link to="/import" />
          </Menu.Item>

          <Menu.Item
            key="5"
            onClick={() => {
              sessionStorage.removeItem('token');
              window.location.href = 'signin';
            }}
          >
            <Icon type="logout" />
            <span>Logout</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{ background: 'rgb(13, 98, 176)', padding: 0 }}
          className="flex flex-row text-white justify-between items-center"
        >
          <h1 className="font-bold mt-5 text-white  text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            <Icon
              className="trigger"
              type={state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={toggle}
            />
            Simple<span className="text-red-500">&</span>Fine
          </h1>
          <h1 className="font-bold mt-5 text-white  text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mr-5">{appState.moduleName}</h1>
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
          {props.children}
        </Content>
        <Footer style={{ padding: '2px 10px' }}>
          @Developing by Laksh Enterprises @2019
        </Footer>
      </Layout>
    </Layout>
  );
};

export { MainLayout as default };
