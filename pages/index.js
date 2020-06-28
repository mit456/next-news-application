import React, {Component} from "react";
import {connect} from "react-redux";
import {wrapper} from '../components/store'


class Page extends Component {
  constructor(props, tick, custom) {
    super(props);

    this.state = {
      tick: tick,
      custom: custom
    }
  }

  static getInitialProps({store, isServer, pathname, query}) {
    // Example TICK redux
    store.dispatch({type: 'TICK', payload: 'This is redux tick'});
    return {custom: 'custom'};
  }

  render() {
    return (
      <div>
        <div>Prop from Redux {this.props.tick}</div>
        <div>Prop from getInitialProps {this.props.custom}</div>
      </div>
    )
  }
}

export default connect(state => state)(Page);
