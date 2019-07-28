import { graphql, Link, StaticQuery } from 'gatsby'
import Img, { FluidObject } from 'gatsby-image'
import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import { Logo } from './logo'
import { Menu } from './menu'

interface HeaderProps {
  bgColor?: string
  bgImage?: FluidObject
  bgAlt?: string
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
  bgImage?: boolean
}

const HeaderBox = styled.header`
  background-color: ${(props: HeaderBoxProps) => (props.bgColor ? props.bgColor : `var(--color-red)`)};
  clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
  color: ${(props: HeaderBoxProps) => (props.color ? props.color : `var(--color-black)`)};
  margin-bottom: 4em;
  padding: 2em 1em;

  &.img {
    background-color: transparent;
    height: 70vh;
  }

  a {
    padding: 0.5em;
    color: ${(props: HeaderBoxProps) => (props.color ? props.color : `var(--color-black)`)};
  }

  h1 {
    text-transform: capitalize;
  }

  i {
    cursor: pointer;
    font-size: 2em;
  }
`

const HeaderText = styled.div`
  ${(props: HeaderBoxProps) =>
    props.bgImage
      ? `text-shadow: 0 0 10px ${props.color === `var(--color-black)` ? `var(--color-white)` : `var(--color-black)`}`
      : ''}
`

const HeaderImg = styled(Img)`
  bottom: 0;
  height: 100%;
  left: 0;
  margin: auto;
  opacity: 0.8;
  padding-top: 50%;
  right: 0;
  top: 0;
  width: 100%;
  z-index: -1;
`

export class Header extends React.Component<HeaderProps, HeaderState> {
  state = {
    open: false
  }

  onClick = (): void => {
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
          <HeaderBox
            bgColor={this.props.bgColor}
            color={this.props.color}
            className={`${this.props.bgImage ? 'img' : ''}`}
          >
            <Helmet
              title={`${this.props.headerText ? `${this.props.headerText} - ` : ''}${data.site.siteMetadata.title}`}
            />
            {this.props.bgImage ? (
              <HeaderImg
                fluid={this.props.bgImage}
                backgroundColor={this.props.bgColor}
                alt={this.props.bgAlt}
                style={{ position: 'absolute' }}
              />
            ) : null}
            <div className="row col-xs-12">
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-1">
                <Link to="/">
                  <Logo size={this.props.logoSize} />
                </Link>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-10 center-xs last-md last-xs last-sm">
                <HeaderText
                  color={this.props.color}
                  bgImage={!!this.props.bgImage}
                  className="col-md-offset-1 col-md-10"
                >
                  {this.state.open ? (
                    <Menu items={data.allHeaderJson.edges} multiline={true} />
                  ) : (
                    <>
                      <h1>{this.props.headerText}</h1>
                      <p>{this.props.byline}</p>
                    </>
                  )}
                </HeaderText>
              </div>
              <div className="col-xs-6 col-sm-6 col-md-6 col-lg-1 end-xs last-lg">
                <HeaderText color={this.props.color} bgImage={!!this.props.bgImage}>
                  <i className={`fas fa-${this.state.open ? 'times' : 'bars'}`} onClick={this.onClick} />
                </HeaderText>
              </div>
            </div>
          </HeaderBox>
        )}
      />
    )
  }
}
