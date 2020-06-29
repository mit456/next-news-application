/*
 * AppHeader,
 * created as an atom
 * to make it reusable
*/

import React, {Component} from "react";
import {connect} from "react-redux";
import {wrapper} from '../../components/store';
import { useRouter } from 'next/router';

import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined
} from '@ant-design/icons';

import {
  Layout,
  Menu,
} from 'antd';

const {
  Header
} = Layout;

const {
  SubMenu
} = Menu;

class HeaderComponent extends Component {
  constructor(props) {
    super(props)

    this.router = (props && props.router)
      ? props.router : {}

    this.state = {
      current: 'tech',
    }

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick = e => {
    console.log("**** handle click", e.key)

    let href = "/news/" + e.key;
    this.router.push(href)

    this.setState({
      current: e.key
    })
  }

  render() {
    const { current } = this.state;
    return (
      <Header style={{
        background: "#ffffff"
        }}>
        <Menu
          selectedKeys={[current]}
          mode="horizontal">

          <Menu.Item
            key="techcrunch.com"
            icon={<MailOutlined />}
            onClick={this.handleClick}>
            TechCrunch
          </Menu.Item>

          <Menu.Item
            key="thenextweb.com"
            icon={<AppstoreOutlined />}
            onClick={this.handleClick}>
            The Next Web
          </Menu.Item>

          {/*
          <SubMenu icon={<SettingOutlined />} title="Navigation Three - Submenu">
            <Menu.ItemGroup title="Item 1">
              <Menu.Item key="setting:1">Option 1</Menu.Item>
              <Menu.Item key="setting:2">Option 2</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="Item 2">
              <Menu.Item key="setting:3">Option 3</Menu.Item>
              <Menu.Item key="setting:4">Option 4</Menu.Item>
            </Menu.ItemGroup>
          </SubMenu>
          <Menu.Item key="alipay">
            <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
              Navigation Four - Link
            </a>
          </Menu.Item>
          */}

        </Menu>
      </Header>
    );
  }
}

const AppHeader = (props) => {
  // Passing router as props to
  // the class component
  const router = useRouter()
  return <HeaderComponent {...props} router={router} />
}

export default AppHeader;
