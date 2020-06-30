import React, {Component} from "react";
import {connect} from "react-redux";
import {wrapper} from '../../components/store';
import { useRouter } from 'next/router';

import {
  Layout,
} from 'antd';

const {
  Header, Content,
} = Layout;

import AppHeader from '../atoms/Header';


class NewsIndexComponent extends Component {
  constructor(props) {
    super(props);

    this.router = (props && props.router)
      ? props.router : {}

    this.state = {
      page: {
        isLoading: false
      }
    }
  }

  static getInitialProps({store, isServer, pathname, query}) {
    // Example TICK redux
    // store.dispatch({type: 'TICK', payload: 'This is redux tick'});
    return {};
  }

  componentDidMount() {
    console.log("Component did mount called")
    let href = "/news/thenextweb/";

    this.router.push(href);
  }

  render() {
    return (
      <Layout style={{
        background: '#ffffff'
        }}>
        <AppHeader current={'thenextweb'}/>
      </Layout>
    )
  }
}

const NewsIndex = (props) => {
  const router = useRouter()
  return <NewsIndexComponent {...props} router={router} />
}

export default NewsIndex;
