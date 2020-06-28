/*
 * This is header, created as an atom
 * to make it reusable
*/

import React, {Component} from "react";
import {connect} from "react-redux";
import {wrapper} from '../../components/store';

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

class AppHeader extends Component {
  constructor(props) {
    super(props)

    this.state = {
      current: 'mail'
    }
  }

  handleClick = e => {
    this.setState({
      current: e.key
    })
  }


  render() {
    const { current } = this.state;
    return (
      <Header>
        <Menu onClick={this.handleClick}
          selectedKeys={[current]}
          mode="horizontal">

          <Menu.Item key="mail" icon={<MailOutlined />}>
            Technology News
          </Menu.Item>
          <Menu.Item key="app" disabled icon={<AppstoreOutlined />}>
            Blockchain News
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

export default AppHeader;
