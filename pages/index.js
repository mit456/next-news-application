import React, {Component} from "react";
import {connect} from "react-redux";
import {wrapper} from '../components/store';

import Link from 'next/link';

import {
  Layout,
} from 'antd';

const {
  Header, Content,
} = Layout;

import AppHeader from './atoms/Header';


class Home extends Component {
  constructor(props, tick, custom) {
    super(props);

    this.state = {
      tick: tick,
      custom: custom
    }
  }

  static getInitialProps({store, isServer, pathname, query}) {
    // Example TICK redux
    // store.dispatch({type: 'TICK', payload: 'This is redux tick'});
    return {custom: 'custom'};
  }

  render() {
    return (
      <Layout style={{
        padding: 50
        }}>
        <AppHeader />
      </Layout>
    )
  }
}

export default connect(state => state)(Home);
