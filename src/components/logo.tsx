import React from 'react'
import styled from 'styled-components'

interface LogoProp {
  size: number
}

const LogoBox = styled.div`
  display: inline-block;

  .logo-container {
    background: var(--color-black);
    border-radius: 50%;
    color: var(--color-white);
    display: inline-block;
    padding: 1em;
    transition: all 0.5s;

    .logo-content {
      position: relative;

      .letter {
        box-sizing: border-box;
        display: inline-block;
        height: 100%;
        vertical-align: top;
        width: 50%;

        div {
          border: 4px solid;
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
`

const Logo: React.FunctionComponent<LogoProp> = (props: LogoProp = { size: 50 }) => (
  <LogoBox>
    <div className="logo-container">
      <div className="logo-content" style={{ height: `${props.size}px`, width: `${props.size}px` }}>
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
)

export { Logo }