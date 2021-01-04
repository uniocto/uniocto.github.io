/* Vendor imports */
import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
/* App imports */
import { aboutPropTypes, imageListPropTypes, iconsNameMap } from './index'
import Layout from '../../components/layout'
import SEO from '../../components/seo'
import Utils from '../../utils'
import style from './index.module.less'

class About extends React.Component {
  static propTypes = aboutPropTypes

  render() {
    let { profilePhoto, _, skillIcons, toolIcons } = this.props.data
    return (
      <Layout>
        <SEO
          title="About"
          description="Una breve presentazione di questo blog"
          path="about"
        />
        <div className={style.container}>
          <div className={style.photo}>
            <Img fluid={profilePhoto.childImageSharp.fluid} />
          </div>
          <div className={style.content}>
          <h1>So Ukiyama</h1>
            <h2>エンジニア</h2>
            <a href={Utils.resolvePageUrl('../', '../', 'about')}>
            <p>If you see English version, click Here</p>
              {/* <Img
                fixed={flagEn.childImageSharp.fixed}
                style={{ display: 'block', margin: 'auto' }}
              /> */}
            </a>
            <p>技術に振り回されているソフトウェアエンジニアです。</p>
            <p>趣味はプログラミング、動物観賞、漫画です。</p>
            <p>エナジードリンクはモンスターエナジー派です。</p>
            <br />
            <h2>Outputs</h2>
            <h4>SOYAI</h4>
            <p>androidアプリです。ご飯屋さんで醤油かソースかわからなかった時、セカンドオピニオンとして利用されることを想定しております。精度はかなり低いです。</p>
            <p><a href="https://play.google.com/store/apps/details?id=com.soyai">ダウンロードはこちら</a></p>
            <h2>Skills</h2>
            <ImageList edges={skillIcons.edges} />
            <h2>Tools</h2>
            <ImageList edges={toolIcons.edges} />
          </div>
        </div>
      </Layout>
    )
  }
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
        fluid(maxWidth: 800) {
          ...GatsbyImageSharpFluid_tracedSVG
        }
      }
    }
    flagEn: file(name: { eq: "flag-en" }) {
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

export default About
