/*
 *
 */

import React, {Component} from "react";
import {connect} from "react-redux";
import {wrapper} from '../../components/store';
import {useRouter} from 'next/router';
import InfiniteScroll from 'react-infinite-scroller';

import axios from 'axios';

import {
  Layout,
  List,
  Spin,
  message,
  Row,
  Col
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
      },

      news: {
        page: 1,
        articles: [],
        totalCount: 0,
        pageSize: 10,
        language: 'en',
        isLoading: false,
        hasMore: true
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
    // console.log("Router query here", this.router)
    let tempNews = {...this.state.news}
    let page = 1; // This is helpful in infinite scroll rendering

    let newsapiResp = await this.fetchNews(tempNews.page, tempNews.language)
    // console.log("News api response", newsapiResp)

    tempNews.articles = newsapiResp.articles
    tempNews.totalCount = newsapiResp.totalCount
    tempNews.page = tempNews.page + 1

    this.setState({
      news: tempNews
    })
  }

  async fetchNews(page, language) {
    try {
      let queryDomain = this.router.query.domain;
      let domainEndpoint = null;

      for(let i = 0; i < config.domains.length; i++) {
        let domainObj = config.domains[i];
        if (domainObj.key === queryDomain) {
          domainEndpoint = domainObj.point
        } else {
          continue;
        }
      }

      // Get endpoint from the query domain
      let extapiUrl = 'https://newsapi.org/v2/everything?domains=' +
      domainEndpoint +
      '&pageSize=10' +
      '&page=' + page +
      '&language=' + language +
      '&apiKey=' + config.apiKey;

      const resp = await axios.get(extapiUrl)
      return resp.data
    } catch (error) {
      console.log("Try catch error in fetching news", error.stack)
    }
  }

  async handleInfiniteOnLoad() {
    let tempNews = {...this.state.news}

    tempNews.isLoading = true
    this.setState({
      news: tempNews,
    });

    // Infinite scroll limit
    if (tempNews.articles >= tempNews.totalCount) {
      message.warning('Infinite List loaded all');

      tempNews.hasMore = false
      tempNews.isLoading = false
      this.setState({
        news: tempNews
      });
      return ;
    }

    let newsapiResp = await this.fetchNews(tempNews.page, tempNews.language)
    tempNews.articles = tempNews.articles.concat(newsapiResp.articles)
    tempNews.page = tempNews.page + 1
    tempNews.isLoading = false
    this.setState({
      news: tempNews
    })
  };


  render() {
    return (
      <Layout style={{
        padding: 50,
        background: '#ffffff'
        }}>
        <AppHeader current={this.router.query.domain}/>

        <Content style={{
          paddingTop: 10,
          }}>
          <Row style={{
            justifyContent: 'space-between'
            }}>

            <Col span={15}>
              <div className="demo-infinite-container">
                <InfiniteScroll
                  initialLoad={false}
                  pageStart={0}
                  loadMore={this.handleInfiniteOnLoad.bind(this)}
                  hasMore={!this.state.news.isLoading && this.state.news.hasMore}
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
                    {this.state.news.isLoading && this.state.news.hasMore && (
                      <div className="demo-loading-container">
                        <Spin />
                      </div>
                    )}
                  </List>
                </InfiniteScroll>
              </div>
            </Col>
            <Col
              span={8}
              style={{
                position: 'fixed',
                background: '#000',
                zIndex: 1,
                left: '65%',
                top: '16%',
                right: 0,
                height: 300
              }}>
            </Col>
          </Row>
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
