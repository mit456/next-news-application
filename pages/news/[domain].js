/*
 * This gets invoked for following URLs:
 * '/news/thenextweb', '/news/techcrunch'
 */

import React, {Component} from "react";
import {connect} from "react-redux";
import {wrapper} from '../../components/store';
import {useRouter} from 'next/router';
import InfiniteScroll from 'react-infinite-scroller';

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
        firstLoading: false,
        hasMore: true
      },

      topnews: {
        page: 1,
        articles: [],
        totalCount: 5,
        pageSize: 5,
        language: 'en',
        isLoading: false
      }
    }

    this.handleClick = this.handleClick.bind(this)
  }

  /*
   * Method which returns all props including
   * those stored in store
  */
  static async getInitialProps({store, isServer, pathname, query}) {
  }

  async componentDidMount() {
    let tempNews = {...this.state.news}
    let temptopNews = {...this.state.topnews}

    tempNews.firstLoading = true
    this.setState({
      news: tempNews
    })

    temptopNews.isLoading = true
    this.setState({
      topnews: temptopNews
    })

    // Get news for infinite scroll
    let newsapiResp = await this.fetchNews(tempNews.page, tempNews.language)
    // console.log("News api response", newsapiResp)

    tempNews.articles = newsapiResp.articles
    tempNews.totalCount = newsapiResp.totalCount
    tempNews.page = tempNews.page + 1
    tempNews.firstLoading = false

    this.setState({
      news: tempNews
    })

    // Get top news articles from the same provider
    // and update topNews state
    //
    let topNewsapiResp = await this.fetchTopNews(temptopNews.page, temptopNews.language)
    temptopNews.articles = topNewsapiResp.articles
    temptopNews.isLoading = false

    this.setState({
      topnews: temptopNews
    })
  }

  async getSource() {
    let queryDomain = this.router.query.domain;
    let dSource = null;

    for(let i = 0; i < config.domains.length; i++) {
      let domainObj = config.domains[i];
      if (domainObj.key === queryDomain) {
        dSource = domainObj.source
      } else {
        continue;
      }
    }

    return dSource;
  }

  /*
   * Fetch all news of a particular
   * domain
   */
  async fetchNews(page, language) {
    try {
      let dSource = await this.getSource()

      // Build external API url for newsapi
      let extapiUrl = 'https://newsapi.org/v2/everything?sources=' +
        dSource +
        '&pageSize=10' +
        '&page=' + page +
        '&language=' + language +
        '&apiKey=' + config.apiKey;

      const resp = await fetch(extapiUrl)
      const data = await resp.json()
      return data
    } catch (error) {
      console.log("Try catch error in fetching news", error.stack)
    }
  }

  /*
   * Fetch top news associated to a particular
   * domain
   */
  async fetchTopNews(page, language) {
    try {
      let dSource = await this.getSource()

      // Build external API url for newsapi
      let extapiUrl = 'https://newsapi.org/v2/everything?sources=' +
        dSource +
        '&pageSize=5' +
        '&page=' + page +
        '&sortBy=popularity' +
        '&language=' + language +
        '&apiKey=' + config.apiKey;

      const resp = await fetch(extapiUrl)
      const data = await resp.json()
      return data
    } catch(error) {
      console.log("Try catch error in fetching news", error.stack)
    }
  }

  handleClick(item) {
    let titleArr = item.title.split(" ")
    let titleStr = titleArr.join("-")

    let href = "/news/"
      + this.router.query.domain + "/"
      + titleStr
    this.router.push(href)
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

            <Col span={14}>
              <div className="infinite-container">
                {this.state.news.firstLoading && (
                  <div className="loading-container">
                    <Spin />
                  </div>
                )}
                <InfiniteScroll
                  initialLoad={false}
                  pageStart={0}
                  loadMore={this.handleInfiniteOnLoad.bind(this)}
                  hasMore={!this.state.news.isLoading && this.state.news.hasMore}
                  useWindow={true}>

                  <List
                    dataSource={this.state.news.articles}
                    renderItem={item => (
                      <List.Item
                        key={item.id}
                        onClick={() => this.handleClick(item)}
                      >
                        <List.Item.Meta
                          title={<a>{item.title}</a>}
                          description={item.author}
                        />
                      </List.Item>
                    )}>
                    {this.state.news.isLoading && this.state.news.hasMore && (
                      <div className="loading-container">
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
                background: '#fff',
                zIndex: 1,
                left: '63.3%',
                top: '16%',
                right: 0,
              }}>
              <div className="top-domain-news">
                {this.state.topnews.isLoading&& (
                  <div className="loading-container">
                    <Spin />
                  </div>
                )}
                <p>Top News from {this.router.query.domain}</p>
                <hr />
                <List
                  dataSource={this.state.topnews.articles}
                  renderItem={item => (
                    <List.Item
                      key={item.id}
                      onClick={() => this.handleClick(item)}>
                      <List.Item.Meta
                        title={<a>{item.title}</a>}
                        description={item.author}
                      />
                    </List.Item>
                  )}>
                </List>
              </div>
            </Col>
          </Row>
        </Content>
        <style jsx>{`
          .top-domain-news {
            border: 1px solid #e8e8e8;
            border-radius: 4px;
            overflow: auto;
            padding: 8px 24px;
          }
          .infinite-container {
            border: 1px solid #e8e8e8;
            border-radius: 4px;
            overflow: auto;
            padding: 8px 24px;
          }
          .loading-container {
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
