/*
 * This gets invoked for following URLs:
 * '/news/thenextweb/[title]' which helps
 * in rendering details page corresponding
 * to the title of the news
 */

import React, {Component} from "react";
import {connect} from "react-redux";
import {wrapper} from '../../../components/store';
import {useRouter} from 'next/router';

import {
  Layout,
  Row,
  Col,
  Spin,
  List
} from 'antd';

const {
  Content,
} = Layout;

import config from '../../../config';
import AppHeader from '../../atoms/Header';

class NewsDetailComponent extends Component {
  constructor(props) {
    super(props)

    this.router = (props && props.router)
      ? props.router : {}

    this.state = {
      page: {
        isLoading: false
      },
      newsDetail: {
        author: '',
        content: '',
        publishedAt: null,
        title: '',
        urlToImage: ''
      },

      relatedNews: {
        page: 1,
        articles: [],
        totalCount: 5,
        pageSize: 5,
        language: 'en',
        isLoading: 'false'
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
    // console.log("** Router in details", this.router)
    let tempPage = {...this.state.page}
    let tempDetail = {...this.state.newsDetail}
    let tempRelatedNews = {...this.state.relatedNews}

    tempPage.isLoading = true
    this.setState({
      page: tempPage
    })

    // Set loading for related new section
    tempRelatedNews.isLoading = true
    this.setState({
      relatedNews: tempRelatedNews
    })

    let detailResp = await this.fetchNewsDetail();
    if (detailResp &&
      detailResp.articles &&
      detailResp.articles.length >= 1) {

      // update newsDetail state
      let details = detailResp.articles[0]
      tempDetail.author = details.author;
      tempDetail.content = details.content;
      tempDetail.publishedAt = details.publishedAt;
      tempDetail.title = this.router.query.title.split("-").join(" ");
      tempDetail.urlToImage = details.urlToImage;

      this.setState({
        newsDetail: tempDetail
      })
    }

    // Set pageLoading false
    tempPage.isLoading = false
    this.setState({
      page: tempPage
    })

    // Get popular news from the same
    // provider and update relatedNews state
    let page =  Math.floor(Math.random() * 10) + 1;
    let relatedNewsResp = await this.fetchRelatedNews(page, tempRelatedNews.language)

    tempRelatedNews.articles = relatedNewsResp.articles
    tempRelatedNews.isLoading = false
    this.setState({
      relatedNews: tempRelatedNews
    })
  }


  // Handle clicks on the items of newlist
  handleClick(item) {
    let titleArr = item.title.split(" ");
    let titleStr = titleArr.join("-");

    let href = "/news/"
      + this.router.query.domain + "/"
      + titleStr;

    this.router.push(href);
  }

  // Get source from config
  async getSource() {
    let qDomain = this.router.query.domain;
    let dSource = null;

    for(let i = 0; i < config.domains.length; i++) {
      let dObj = config.domains[i];
      if (dObj.key === qDomain) {
        dSource = dObj.source;
      } else {
        continue;
      }
    }

    return dSource;
  }

  // Fetch news detail using qInTitle
  // params of the newsapi
  async fetchNewsDetail() {
    try {
      let dSource = await this.getSource();

      // Build qInTitle for newsapi
      let qInTitle = this.router.query.title.split("-").join(" ");

      // Build external API url to fetch news details
      let extapiUrl = 'https://newsapi.org/v2/everything?sources=' +
        dSource +
        '&qInTitle=' + qInTitle +
        '&apiKey=' + config.apiKey;

      const resp = await fetch(extapiUrl);
      const data = await resp.json();

      return data;
    } catch (error) {
      console.log("try catch error in news fetching", error);
    }
  }

  // Fetch related news
  async fetchRelatedNews(page, language) {
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

      const resp = await fetch(extapiUrl);
      const data = await resp.json();
      return data;
    } catch(error) {
      console.log("Try catch error in fetching news", error.stack);
    }
  }


  render() {
    return (
      <Layout style={{
        padding: 50,
        background: '#ffffff'
        }}>
        <AppHeader current={this.router.query.domain} />

        <Content style={{
          paddingTop: 10
          }}>
          <Row style={{
            justifyContent: 'space-between'
            }}>

            <Col
              span={14}>
              <img
                src={this.state.newsDetail.urlToImage}
                alt={this.state.newsDetail.urlToImage}
                style={{
                  width: '100%',
                }}
              />
              <div className="news-content">
                <p className="news-title">
                  {this.state.newsDetail.title}
                </p>

                <p>
                  {this.state.newsDetail.content}
                </p>

                <p className="news-author">
                  Author: {this.state.newsDetail.author}
                </p>
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

              <div className="related-domain-news">
                <p>Related News from {this.router.query.domain}</p>
                {this.state.relatedNews.isLoading &&
                  <div className="loading-container">
                    <Spin />
                  </div>
                }
                <List
                  dataSource={this.state.relatedNews.articles}
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
          .related-domain-news {
            border: 1px solid #e8e8e8;
            border-radius: 4px;
            overflow: auto;
            padding: 8px 24px;
          }
          .loading-container {
            position: absolute;
            width: 100%;
            text-align: center;
          }
          .news-content {
            border: 1px solid #e8e8e8;
            border-radius: 4px;
            overflow: auto;
            padding: 8px 24px;
            justifyContent: 'space-between'
          }
          .news-title {
            font-size: 20px;
            font-weight: bold;
          }
          .news-author {
            text-align: end
          }
        `}</style>
      </Layout>
    )
  }
}

const NewsDetail = (props) => {
  const router = useRouter()
  return <NewsDetailComponent {...props} router={router} />
}

export default NewsDetail;
