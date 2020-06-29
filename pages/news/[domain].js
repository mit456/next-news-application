/*
 *
 */

import React, {Component} from "react";
import {connect} from "react-redux";
import {wrapper} from '../../components/store';
import { useRouter } from 'next/router';

import InfiniteScroll from 'react-infinite-scroller';

import axios from 'axios';

import {
  Layout,
  List,
  Spin,
  message
} from 'antd';

const {
  Content,
} = Layout;

import config from '../../config';
import AppHeader from '../atoms/Header';

class NewsComponent extends Component {
  constructor(props) {
    super(props)

    this.router = (props && props.router)
      ? props.router : {}

    this.state = {
      page: {
        isLoading: false,
        hasMore: true,
        // data: []
      },

      news: {
        page: 1,
        articles: [],
        totalCount: 0,
        pageSize: 10,
      }
    }
  }

  /*
   * Method which returns all props including
   * those stored in store
  */
  static async getInitialProps({store, isServer, pathname, query}) {
  }

  async componentDidMount() {
    console.log("Router query here", this.router)
    let tempNews = {...this.state.news}

    let page = 1; // This is helpful in infinite scroll rendering

    let newsapiResp = await this.fetchNews(tempNews.page)
    console.log("News api response", newsapiResp)


    tempNews.articles = newsapiResp.articles
    tempNews.totalCount = newsapiResp.totalCount
    tempNews.page = tempNews.page + 1

    this.setState({
      news: tempNews
    })
  }

  async fetchNews(page) {
    try {
      let extapiUrl = 'https://newsapi.org/v2/everything?domains=' +
      this.router.query.domain +
      '&pageSize=10' +
      '&page=' + page +
      '&apiKey=' + config.apiKey;

      const resp = await axios.get(extapiUrl)
      return resp.data
    } catch (error) {
      console.log("Try catch error in fetching news", error.stack)
    }
  }

  async handleInfiniteOnLoad() {
    let tempNews = {...this.state.news}
    let tempStatePage = {...this.state.page}

    tempStatePage.isLoading = true
    this.setState({
      page: tempStatePage,
    });

    // Infinite scroll limit
    if (tempNews.articles >= tempNews.totalCount) {
      message.warning('Infinite List loaded all');

      tempStatePage.hasMore = false
      tempStatePage.isLoading = false
      this.setState({
        page: tempStatePage
      });
      return ;
    }

    let newsapiResp = await this.fetchNews(tempNews.page)

    tempNews.articles = tempNews.articles.concat(newsapiResp.articles)
    tempNews.page = tempNews.page + 1
    this.setState({
      news: tempNews
    })

    tempStatePage.isLoading = false
    this.setState({
      page: tempStatePage
    })
  };


  render() {
    return (
      <Layout style={{
        padding: 50,
        background: '#ffffff'
        }}>
        <AppHeader />

        <Content>
          <div className="demo-infinite-container">
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={this.handleInfiniteOnLoad.bind(this)}
              hasMore={!this.state.page.isLoading && this.state.page.hasMore}
              useWindow={true}>

              <List
                dataSource={this.state.news.articles}
                renderItem={item => (
                  <List.Item key={item.id}>
                    <List.Item.Meta
                      title={<a href="">{item.title}</a>}
                      description={item.author}
                    />
                  </List.Item>
                )}>
                {this.state.page.isLoading && this.state.page.hasMore && (
                  <div className="demo-loading-container">
                    <Spin />
                  </div>
                )}
              </List>
            </InfiniteScroll>
          </div>
        </Content>
        <style jsx>{`
          .demo-infinite-container {
            border: 1px solid #e8e8e8;
            border-radius: 4px;
            overflow: auto;
            padding: 8px 24px;
          }
          .demo-loading-container {
            position: absolute;
            bottom: 40px;
            width: 100%;
            text-align: center;
          }
        `}</style>
      </Layout>
    )
  }
}

const DomainNews = (props) => {
  // Passing router as props to
  // class component
  const router = useRouter()
  return <NewsComponent {...props} router={router} />
}

export default DomainNews;
