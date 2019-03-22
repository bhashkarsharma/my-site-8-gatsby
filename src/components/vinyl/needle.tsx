import React from 'react'
import styled from 'styled-components'

interface NeedleProps {
  angle: number
}

const NeedleBox = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  transition-duration: 0.5s;
  transform-origin: 50% 34%;
  z-index: 1;

  .head {
    background: var(--color-white);
    clip-path: polygon(0 0, 100% 0%, 80% 100%, 20% 100%);
    height: 5vw;
    transform: translateX(-110%) translateY(-26%) rotateZ(20deg);
    width: 3vw;
  }

  .stick {
    background: var(--color-blue);
    height: 8vw;
    text-align: center;
    width: 1vw;

    &:nth-child(2) {
      height: 5vw;
    }

    &:nth-last-child(2) {
      transform: translateX(-140%) translateY(-6%) rotateZ(20deg);
    }
  }

  .axis {
    background: var(--color-white);
    border-radius: 50%;
    height: 3vw;
    width: 3vw;
  }

  .tail {
    background: var(--color-white);
    height: 5vw;
    width: 3vw;
  }
`

const Needle: React.FunctionComponent<NeedleProps> = (props: NeedleProps) => (
  <NeedleBox style={{ transform: `rotateZ(${props.angle}deg)` }}>
    <div className="tail" />
    <div className="stick" />
    <div className="axis" />
    <div className="stick" />
    <div className="stick" />
    <div className="head" />
  </NeedleBox>
)

export { Needle }
