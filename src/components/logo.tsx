import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'

interface LogoProp {
  size: number
}

const LogoBox = styled.div`
  display: inline-block;
  transition: all 0.5s;

  .logo-container {
    background: var(--color-black);
    border-radius: 50%;
    color: var(--color-white);
    display: inline-block;
    padding: 4em;

    .logo-content {
      position: relative;

      .letter {
        box-sizing: border-box;
        display: inline-block;
        height: 100%;
        vertical-align: top;
        width: 50%;

        div {
          border: 2px solid;
          box-sizing: border-box;
          height: 25%;

          &:nth-child(1) {
            border-bottom-width: 0;
            border-top-right-radius: 100%;
          }

          &:nth-child(2) {
            border-bottom-right-radius: 100%;
            border-bottom-width: 0;
            border-top-width: 0;
          }

          &:nth-child(3) {
            border-bottom-width: 0;
            border-left-width: 0;
            border-top-right-radius: 100%;
          }

          &:nth-child(4) {
            border-bottom-right-radius: 100%;
            border-top-width: 0;
          }
        }

        &:last-child {
          transform: scale(-1, -1);
        }
      }
    }
  }

  &:hover {
    transform: rotateZ(180deg);
  }
`

export class Logo extends React.Component<LogoProp> {
  state = {
    size: 50
  }

  componentDidMount() {
    const { size } = this.props || this.state
    this.setState({ size })
  }

  render() {
    return (
      <Link to="/">
        <LogoBox>
          <div className="logo-container" style={{ fontSize: `${Math.round(this.state.size / 10)}px` }}>
            <div
              className="logo-content"
              style={{
                height: `${this.state.size}px`,
                width: `${this.state.size}px`
              }}
            >
              <div className="letter">
                <div />
                <div />
                <div />
                <div />
              </div>
              <div className="letter">
                <div />
                <div />
                <div />
                <div />
              </div>
            </div>
          </div>
        </LogoBox>
      </Link>
    )
  }
}
