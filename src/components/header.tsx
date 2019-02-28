import { graphql, Link, StaticQuery } from 'gatsby'
import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import { Logo } from './logo'
import { Menu } from './menu'

interface HeaderProps {
  bgColor?: string
  bgImage?: string
  color?: string
  headerText: string
  byline?: string
  logoSize: number
}

interface HeaderState {
  open: boolean
}

interface HeaderBoxProps {
  bgColor?: string
  color?: string
}

const HeaderBox = styled.header`
  background-color: ${(props: HeaderBoxProps) => (props.bgColor ? props.bgColor : `var(--color-red)`)};
  color: ${(props: HeaderBoxProps) => (props.color ? props.color : `var(--color-black)`)};
  padding: 2em 1em;

  a {
    padding: 0.5em;
  }

  h1 {
    text-transform: capitalize;
  }

  i {
    cursor: pointer;
    font-size: 2em;
  }
`

export class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
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
    return (
      <StaticQuery
        query={graphql`
          query HeaderQuery {
            site {
              siteMetadata {
                title
                description
              }
            }
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
        render={(data) => (
          <HeaderBox bgColor={this.props.bgColor} color={this.props.color} className="row">
            <Helmet
              title={`${this.props.headerText ? `${this.props.headerText} - ` : ''}${data.site.siteMetadata.title}`}
            />
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-1">
              <Link to="/">
                <Logo size={this.props.logoSize} />
              </Link>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 center-xs last-md last-xs last-sm">
              <div className="col-md-offset-1 col-md-10">
                <h1>{this.props.headerText}</h1>
                <p>{this.props.byline}</p>
              </div>
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-1 end-xs last-lg">
              <i className={`fas fa-${this.state.open ? 'times' : 'bars'}`} onClick={this.onClick} />
              {this.state.open ? <Menu items={data.allHeaderJson.edges} /> : null}
            </div>
          </HeaderBox>
        )}
      />
    )
  }
}
