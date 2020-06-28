import React from 'react';
import { Provider } from "react-redux";
import {wrapper} from '../components/store';

class NewsApp extends React.Component {
  static getInitialProps = async ({Component, ctx}) => {
    return {
      pageProps: {
        // Call page-level getInitialProps
        ...(Component.getInitialProps
          ? await Component.getInitialProps(ctx) : {}),
        // Some custom thing for all pages
        pathname: ctx.pathname,
      },
    };
  };

  render() {
    const {Component, pageProps} = this.props;
    return (
      <Component {...pageProps} />
    );
  }
}
export default wrapper.withRedux(NewsApp);
