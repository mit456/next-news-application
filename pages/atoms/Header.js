/*
 * AppHeader,
 * created as an atom
 * to make it reusable
*/

import React, {Component} from "react";
import {connect} from "react-redux";
import {wrapper} from '../../components/store';
import { useRouter } from 'next/router';

import config from '../../config'


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
      current: this.props.current,
    }

    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
  }

  handleClick = e => {
    let href = "/news/" + e.key;
    this.router.push(href)
  }

  render() {
    const { current } = this.state;
    return (
      <Header style={{
        padding: 0,
        background: "#ffffff"
        }}>
        <Menu
          selectedKeys={[current]}
          mode="horizontal">
          {
            config.domains.map(({name, key, point}) => {
              return (
                <Menu.Item
                  key={key}
                  icon={<AppstoreOutlined />}
                  onClick={this.handleClick}>
                  {name}
                </Menu.Item>
              )
            })
          }
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
