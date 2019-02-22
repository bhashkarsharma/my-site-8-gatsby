import { graphql, Link, StaticQuery } from 'gatsby'
import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import { Logo } from './logo'
import { Menu } from './menu'

interface HeaderProp {
  headerText: string
  logoSize: number
}

interface HeaderState {
  open: boolean
}

const HeaderBox = styled.header`
  background: var(--color-red);
  color: var(--color-black);
  padding: 2em 1em;

  i {
    font-size: 2em;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }
`

export class Header extends React.Component<HeaderProp, HeaderState> {
  constructor(props: HeaderProp) {
    super(props)

    this.state = {
      open: false
    }

    this.onClick = this.onClick.bind(this)
  }

  onClick(): void {
    const open = !this.state.open
    this.setState({ open })
  }

  render() {
    const titleText: string = this.props.headerText ? `${this.props.headerText} - ` : ''
    const title = (
      <StaticQuery
        query={graphql`
          query TitleQuery {
            site {
              siteMetadata {
                title
                description
              }
            }
          }
        `}
        render={(data) => <Helmet title={`${titleText}${data.site.siteMetadata.title}`} />}
      />
    )
    const menu = (
      <StaticQuery
        query={graphql`
          query HeaderQuery {
            allHeaderJson {
              edges {
                node {
                  label
                  link
                }
              }
            }
          }
        `}
        render={(data) => <Menu items={data.allHeaderJson.edges} />}
      />
    )

    return (
      <HeaderBox className="row">
        {title}
        <div className="col-xs-6 col-sm-6 col-md-6 col-lg-1">
          <Link to="/">
            <Logo size={this.props.logoSize} />
          </Link>
        </div>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 center-xs last-md last-xs last-sm">
          <div className="col-md-offset-1 col-md-10">
            <h1>{this.props.headerText}</h1>
          </div>
        </div>
        <div className="col-xs-6 col-sm-6 col-md-6 col-lg-1 end-xs last-lg">
          <i className={`fas fa-${this.state.open ? 'times' : 'bars'}`} onClick={this.onClick} />
          {this.state.open ? menu : null}
        </div>
      </HeaderBox>
    )
  }
}
