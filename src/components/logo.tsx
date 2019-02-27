import React from 'react'
import styled from 'styled-components'

interface LogoProps {
  size: number
}

const LogoBox = styled.div`
  display: inline-block;
  transition: transform 0.5s;

  .logo-container {
    background: var(--color-black);
    border-radius: 50%;
    color: var(--color-white);
    display: inline-block;
    ${(props: LogoProps) => (props.size ? `padding: ${Math.round(props.size / 50)}em;` : '')}

    .logo-content {
      position: relative;
      ${(props: LogoProps) =>
        props.size
          ? `height: ${props.size}px;
            width: ${props.size}px;`
          : ''}

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
    transform-origin: center center;
  }
`

const Logo: React.FunctionComponent<LogoProps> = (props: LogoProps) => (
  <LogoBox size={props.size}>
    <div className="logo-container">
      <div className="logo-content">
        {Array.from(Array(2).keys()).map((i) => (
          <div className="letter" key={i}>
            {Array.from(Array(4).keys()).map((j) => (
              <div key={j} />
            ))}
          </div>
        ))}
      </div>
    </div>
  </LogoBox>
)

export { Logo }
