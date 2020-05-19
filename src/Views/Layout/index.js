import React, { Component } from 'react'

import { Layout, Menu, Breadcrumb, Avatar, PageHeader, Button, Descriptions } from 'antd';
import '../../Assets/css/Layout.scss'
import { Link } from 'react-router-dom';
import MenuItens from './Menu'
import {
  LogoutOutlined,
} from '@ant-design/icons';
import Auth from '../../Utils/Auth';


const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default class extends Component {
  state = {
    collapsed: false,
    current: '0',
    currentTitle: '/'
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  handleClick = e => {
    this.setState({
      current: e.key,
    });
  };

  logout = () => {
    Auth.signOut()
    window.Location.href = '/login'
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            theme="dark"
            defaultSelectedKeys={['0']}
            mode="inline">
            <Menu.Item key="001" className="brand-menu">
              {/* brand */}
              {/* <div style={{ backgroundColor: "#1c1c1c", borderRadius: '150px', display: 'flex', justifyContent: 'start', alignItems: 'center', alignContent: 'center' }}> */}
              <Avatar size="large" src="https://avatars3.githubusercontent.com/u/7293460?s=460&u=21129945ae938a79315447fe67ef8aeff2d4294e&v=4" />
              <Link to="/">
                <span className="brand-menu-name">Joerverson santos</span>
              </Link>
              {/* </div> */}
            </Menu.Item>
            {/* side menu */}
            {
              MenuItens.map((item, i) =>
                item.children.length ?
                  <SubMenu key={i} icon={<item.icon />} title={item.title}>
                    {
                      item.children.map((child, ii) =>
                        <Menu.Item key={ii}>
                          <Link to={child.link}>{child.title}</Link>
                        </Menu.Item>)
                    }
                  </SubMenu>
                  : <Menu.Item key={i} icon={<item.icon />}>
                    <Link to={item.link}>{item.title}</Link>
                  </Menu.Item>
              )
            }
            <Menu.Item key={'logout'} icon={<LogoutOutlined />}>
              <Link onClick={this.logout}>Sair</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <div className="site-page-header-ghost-wrapper">
            <PageHeader
              ghost={false}
              onBack={this.props.path !== '/' ? () => window.history.back() : null}
              title={this.props.title}
            >
            </PageHeader>
          </div>
          {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}
          <Content style={{ margin: '25px 16px' }}>
            {/* content pages */}
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              <this.props.content />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    )
  }
}

