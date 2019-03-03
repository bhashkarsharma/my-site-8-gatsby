import React from 'react'
import styled from 'styled-components'

interface FaceProps {
  isDigital: boolean
  val: number
  hours: number
  minutes: number
}

interface HandProps {
  angle?: number
}

const FaceBox = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  position: relative;

  .node {
    height: 3vw;
    margin: 2vw;
    position: relative;
    width: 3vw;
  }
`

const Hand = styled.div`
  background: var(--color-black);
  border: 1px solid;
  border-color: var(--color-white);
  border-top-left-radius: 1vw;
  border-bottom-left-radius: 1vw;
  height: 1vw;
  position: absolute;
  transform: rotateZ(${(props: HandProps) => props.angle}deg);
  transform-origin: 0.5vw;
  transition-duration: 0.5s;
  width: 4vw;

  &.mask {
    background: var(--color-white);
    border-bottom-left-radius: 0;
    border-color: var(--color-black);
    left: -0.7vw;
    top: 0.7vw;
    transform: rotateZ(135deg);
    width: 3vw;
    z-index: 2;
  }
`

const PATTERN = [
  [0, 2, 2, 4, 2, 6, 2, 6, 0, 6, 4, 6],
  [3, 3, 2, 2, 3, 3, 2, 6, 3, 3, 6, 6],
  [0, 0, 2, 4, 0, 2, 4, 6, 0, 6, 4, 4],
  [0, 0, 2, 4, 0, 0, 2, 6, 0, 0, 4, 6],
  [2, 2, 2, 2, 0, 6, 2, 6, 3, 3, 6, 6],
  [0, 2, 4, 4, 0, 6, 2, 4, 0, 0, 4, 6],
  [0, 2, 4, 4, 2, 6, 2, 4, 0, 6, 4, 6],
  [0, 0, 2, 4, 3, 3, 2, 6, 3, 3, 6, 6],
  [0, 2, 2, 4, 0, 6, 4, 6, 0, 6, 4, 6],
  [0, 2, 2, 4, 0, 6, 4, 6, 0, 0, 4, 6]
]

const ANGLE = 45

const Face: React.FunctionComponent<FaceProps> = (props) => (
  <FaceBox>
    {Array.from({ length: 6 }, (_, k) => (
      <div className="node" key={k}>
        {props.isDigital && k % 2 === 0 ? <Hand className="mask" /> : ''}
        <Hand angle={props.isDigital ? PATTERN[props.val][2 * k] * ANGLE : props.hours} />
        <Hand angle={props.isDigital ? PATTERN[props.val][2 * k + 1] * ANGLE : props.minutes} />
      </div>
    ))}
  </FaceBox>
)

export { Face }
