/* Vendor imports */
import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
/* App imports */
import Layout from '../../components/layout'
import SEO from '../../components/seo'
import Utils from '../../utils'
import style from './index.module.less'

import SchoolIcon from '@material-ui/icons/School';
import WorkIcon from '@material-ui/icons/Work';
import StarIcon from '@material-ui/icons/Star';

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css'



export const aboutPropTypes = {
  data: PropTypes.shape({
    profilePhoto: PropTypes.shape({
      childImageSharp: PropTypes.shape({
        fluid: PropTypes.object.isRequired,
      }).isRequired,
    }).isRequired,
    flagIt: PropTypes.shape({
      childImageSharp: PropTypes.shape({
        fixed: PropTypes.object.isRequired,
      }),
    }),
    flagEn: PropTypes.shape({
      childImageSharp: PropTypes.shape({
        fixed: PropTypes.object.isRequired,
      }),
    }),
    skillIcons: PropTypes.object.isRequired,
    toolIcons: PropTypes.object.isRequired,
  }),
}

class About extends React.Component {
  static propTypes = aboutPropTypes

  render() {
    let { profilePhoto, _, skillIcons, toolIcons } = this.props.data
    return (
      <Layout>
        <SEO
          title="About"
          description="A brief summary of this blog"
          path="about"
        />
        <div className={style.container}>
          <div className={style.photo}>
            <Img fluid={profilePhoto.childImageSharp.fluid} />
          </div>
          <div className={style.content}>
            <h1>浮山 颯</h1>
            <p>技術に振り回されている開発者です。エンジニアになりたい。</p>
            <br />
            <h1>History</h1>

            <VerticalTimeline>
              <VerticalTimelineElement
                className="vertical-timeline-element--work"
                contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                date="2018 - present"
                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                icon={<WorkIcon />}
              >
                <h3 className="vertical-timeline-element-title">エンジニアリングコンサルタント</h3>
                <p>テクノスデータサイエンス・エンジニアリング株式会社</p>
              </VerticalTimelineElement>

              <VerticalTimelineElement
                className="vertical-timeline-element--education"
                date="2020/03"
                iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
                icon={<SchoolIcon />}
              >
                <h3 className="vertical-timeline-element-title"><a href="https://www.credential.net/933a26aa-71ce-4a6b-9b82-c7c6bd5f0bd1">Professional Cloud Developer</a></h3>
                <h4 className="vertical-timeline-element-subtitle"><a href="https://www.credential.net/933a26aa-71ce-4a6b-9b82-c7c6bd5f0bd1">Google Cloud Certified</a></h4>
              </VerticalTimelineElement>


              <VerticalTimelineElement
                className="vertical-timeline-element--education"
                date="2020/02"
                iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
                icon={<SchoolIcon />}
              >
                <h3 className="vertical-timeline-element-title"><a href="https://www.credential.net/843c6036-0e30-4603-87d2-74f17c5b6cb1">Professional Data Engineer</a></h3>
                <h4 className="vertical-timeline-element-subtitle"><a href="https://www.credential.net/933a26aa-71ce-4a6b-9b82-c7c6bd5f0bd1">Google Cloud Certified</a></h4>
              </VerticalTimelineElement>

              
              
              <VerticalTimelineElement
                className="vertical-timeline-element--education"
                date="2020/02"
                iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
                icon={<SchoolIcon />}
              >
                <h3 className="vertical-timeline-element-title"><a href="https://www.credential.net/4587cef9-0592-4a49-b386-9b43088af52e">Professional Cloud Architect</a></h3>
                <h4 className="vertical-timeline-element-subtitle"><a href="https://www.credential.net/933a26aa-71ce-4a6b-9b82-c7c6bd5f0bd1">Google Cloud Certified</a></h4>
              </VerticalTimelineElement>

              <VerticalTimelineElement
                className="vertical-timeline-element--education"
                date="2019/10"
                iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
                icon={<SchoolIcon />}
              >
                <h3 className="vertical-timeline-element-title">基本情報技術者試験</h3>
                <h4 className="vertical-timeline-element-subtitle">（独）情報処理推進機構</h4>
              </VerticalTimelineElement>
              
              
              <VerticalTimelineElement
                className="vertical-timeline-element--education"
                date="2019/04"
                iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
                icon={<SchoolIcon />}
              >
                <h3 className="vertical-timeline-element-title">Azure Administrator Associate</h3>
                <h4 className="vertical-timeline-element-subtitle">Microsoft Certified</h4>
              </VerticalTimelineElement>


              <VerticalTimelineElement
                className="vertical-timeline-element--education"
                date="2016 - 2018"
                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                icon={<WorkIcon />}
              >
                <h3 className="vertical-timeline-element-title">システムコンサルタント</h3>
                <h4 className="vertical-timeline-element-subtitle">株式会社ワークスアプリケーションズ</h4>
                <p>要件定義、業務設計</p>
              </VerticalTimelineElement>
              
              <VerticalTimelineElement
                className="vertical-timeline-element--education"
                date="2014 - 2016"
                iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
                icon={<SchoolIcon />}
              >
                <h3 className="vertical-timeline-element-title">細胞機能制御科学修士</h3>
                <h4 className="vertical-timeline-element-subtitle">北里大学大学院感染制御科学府</h4>
              </VerticalTimelineElement>
              <VerticalTimelineElement
                iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
                icon={<StarIcon />}
              />
            </VerticalTimeline>
            <h1>Outputs</h1>
            <h2><a href="https://play.google.com/store/apps/details?id=com.twinkle_toilet">Twinkle toilet</a></h2>
            <p>トイレの標識を見つけるアプリです。発見した際に、キラキラとひかるエフェクトとナビゲーターが声で教えてくれます。</p>
            <h2><a href="https://uniocto.github.io/">本ブログ</a></h2>
            <p>静的サイトジェネレーターのgatsby.jsとgithub pagesを利用してます。</p>
            <h2><a href="https://play.google.com/store/apps/details?id=com.soyai">SOYAI</a></h2>
            <p>Flutterで作成したandroidアプリです。ご飯屋さんで醤油かソースかわからなかった時、セカンドオピニオンとして利用されることを想定しております。精度はかなり低いです。</p>
            <h1>Skills</h1>
            <ImageList edges={skillIcons.edges} />
            <h1>Tools</h1>
            <ImageList edges={toolIcons.edges} />
          </div>
        </div>
      </Layout>
    )
  }
}

export const imageListPropTypes = {
  edges: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        name: PropTypes.string.isRequired,
        childImageSharp: PropTypes.shape({
          fixed: PropTypes.object.isRequired,
        }).isRequired,
      }).isRequired,
    })
  ).isRequired,
}

class ImageList extends React.Component {
  static propTypes = imageListPropTypes

  render = () => (
    <div className={style.iconsContainer}>
      {this.props.edges
        .sort((edgeA, edgeB) =>
          edgeA.node.name.toLowerCase() > edgeB.node.name.toLowerCase() ? 1 : -1
        )
        .map(({ node: { name, childImageSharp } }) => (
          <div className={style.iconWrapper} key={name}>
            <Img
              fixed={childImageSharp.fixed}
              alt={name + ' logo'}
              title={name}
            />
            <label>
              {iconsNameMap[name] ? iconsNameMap[name] : Utils.capitalize(name)}
            </label>
          </div>
        ))}
    </div>
  )
}

export const query = graphql`
  {
    profilePhoto: file(name: { eq: "profile-photo" }) {
      childImageSharp {
        fluid{
          ...GatsbyImageSharpFluid_tracedSVG
        }
      }
    }
    flagIt: file(name: { eq: "flag-it" }) {
      childImageSharp {
        fixed(width: 50) {
          ...GatsbyImageSharpFixed_tracedSVG
        }
      }
    }
    skillIcons: allFile(filter: { dir: { regex: "/about/skills$/" } }) {
      edges {
        node {
          name
          childImageSharp {
            fixed(width: 50) {
              ...GatsbyImageSharpFixed_tracedSVG
            }
          }
        }
      }
    }
    toolIcons: allFile(filter: { dir: { regex: "/about/tools$/" } }) {
      edges {
        node {
          name
          childImageSharp {
            fixed(width: 50) {
              ...GatsbyImageSharpFixed_tracedSVG
            }
          }
        }
      }
    }
  }
`
// Use to set specific icons names
export const iconsNameMap = {
  css: 'CSS',
  html: 'HTML',
  jquery: 'JQuery',
  nodejs: 'Node.js',
  vuejs: 'Vue.js',
  gruntjs: 'Grunt.js',
}

export default About
