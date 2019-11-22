import { Header } from '@components/header'
import { LabTemplate } from '@templates/lab'
import React, { useState } from 'react'
import styled from 'styled-components'

const OPACITY = 0.8
const ROTATE = 360
const TIME = 15
const MIN_COL = 100
const MAX_COL = 240
const COLOR1 = '#f064f0'
const COLOR2 = '#64f0f0'
const COLOR3 = '#f0f064'
const SIZE = 50
const MARGIN = 0
const COUNT = 20
const PERSPECTIVE = 200
const ORIGIN = 50

interface SceneProps {
  perspective: number
  origin: number
}

interface BoxProps {
  height: number
  depth: number
  width: number
  margin: number
  duration: number
  opacity: number
  color1: string
  color2: string
  color3: string
}

const Scene = styled.div`
  ${({ perspective, origin }: SceneProps) => `
  perspective: ${perspective}px;
  perspective-origin: ${origin}% ${100 - origin}%;
  `}
`

const Box = styled.div`
  ${({ height, depth, width, margin, duration, opacity, color1, color2, color3 }: BoxProps) => `
  display: inline-block;
  position: relative;
  transform-style: preserve-3d;
  margin: ${margin}px;
  height: ${height}px;
  width: ${width}px;
  transform: translateZ(${-depth / 2}px);
  animation: spin ${duration}s infinite linear;

  div {
    position: absolute;
    opacity:  ${opacity};

    // front/back
    &:nth-child(3n + 1) {
      background: ${color1};
      height: ${height}px;
      width: ${width}px;
    }

    // top/bottom
    &:nth-child(3n + 2) {
      background: ${color2};
      height: ${depth}px;
      width: ${width}px;
      top: ${(height - depth) / 2}px;
    }

    // left/right
    &:nth-child(3n) {
      background: ${color3};
      height: ${height}px;
      width: ${depth}px;
      left: ${(width - depth) / 2}px;
    }

    &:nth-child(1) {
      transform: rotateY(0deg) translateZ(${depth / 2}px);
    }

    &:nth-child(2) {
      transform: rotateX(90deg) translateZ(${height / 2}px);
    }

    &:nth-child(3) {
      transform: rotateY(-90deg) translateZ(${width / 2}px);
    }

    &:nth-child(4) {
      transform: rotateY(180deg) translateZ(${depth / 2}px);
    }

    &:nth-child(5) {
      transform: rotateX(-90deg) translateZ(${height / 2}px);
    }

    &:nth-child(6) {
      transform: rotateY(90deg) translateZ(${width / 2}px);
    }
  }

  @keyframes spin {
    from {
      transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
    }
    to {
      transform: rotateX(${ROTATE}deg) rotateY(${ROTATE}deg) rotateZ(${ROTATE}deg);
    }
  }
  `}
`

const Config = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 50px 20px;

  div {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    padding: 5px 0;

    .label {
    }

    .input {
    }

    .value {
    }
  }
`

const Blocks: React.FC = () => {
  const [count, setCount] = useState(COUNT)
  const [width, setWidth] = useState(SIZE)
  const [height, setHeight] = useState(SIZE)
  const [depth, setDepth] = useState(SIZE)
  const [margin, setMargin] = useState(MARGIN)
  const [perspective, setPerspective] = useState(PERSPECTIVE)
  const [origin, setOrigin] = useState(ORIGIN)
  const [duration, setDuration] = useState(TIME)
  const [color1, setColor1] = useState(COLOR1)
  const [color2, setColor2] = useState(COLOR2)
  const [color3, setColor3] = useState(COLOR3)
  const [opacity, setOpacity] = useState(OPACITY)

  return (
    <LabTemplate>
      <Header headerText="Blocks" logoSize={25} />

      <Config>
        <div>
          <div className="label">Count</div>
          <div className="input">
            <input
              type="range"
              min="1"
              max="250"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="value">{count}</div>
        </div>
        <div>
          <div className="label">Width</div>
          <div className="input">
            <input
              type="range"
              min="1"
              max="1000"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="value">{width}</div>
        </div>
        <div>
          <div className="label">Height</div>
          <div className="input">
            <input
              type="range"
              min="1"
              max="1000"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="value">{height}</div>
        </div>
        <div>
          <div className="label">Depth</div>
          <div className="input">
            <input
              type="range"
              min="1"
              max="1000"
              value={depth}
              onChange={(e) => setDepth(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="value">{depth}</div>
        </div>
        <div>
          <div className="label">Margin</div>
          <div className="input">
            <input
              type="range"
              min="1"
              max="1000"
              value={margin}
              onChange={(e) => setMargin(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="value">{margin}</div>
        </div>
        <div>
          <div className="label">Perspective</div>
          <div className="input">
            <input
              type="range"
              min="1"
              max="1000"
              value={perspective}
              onChange={(e) => setPerspective(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="value">{perspective}</div>
        </div>
        <div>
          <div className="label">Opacity</div>
          <div className="input">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value) || 0.8)}
            />
          </div>
          <div className="value">{opacity}</div>
        </div>
        <div>
          <div className="label">Origin</div>
          <div className="input">
            <input
              type="range"
              min="1"
              max="1000"
              value={origin}
              onChange={(e) => setOrigin(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="value">{origin}</div>
        </div>
        <div>
          <div className="label">Duration</div>
          <div className="input">
            <input
              type="range"
              min="1"
              max="25"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="value">{duration}</div>
        </div>
        <div>
          <div className="label">Color1</div>
          <div className="input">
            <input type="color" value={color1} onChange={(e) => setColor1(e.target.value || COLOR1)} />
          </div>
          <div className="value">{color1}</div>
        </div>
        <div>
          <div className="label">Color2</div>
          <div className="input">
            <input type="color" value={color2} onChange={(e) => setColor2(e.target.value || COLOR2)} />
          </div>
          <div className="value">{color2}</div>
        </div>
        <div>
          <div className="label">Color3</div>
          <div className="input">
            <input type="color" value={color3} onChange={(e) => setColor3(e.target.value || COLOR3)} />
          </div>
          <div className="value">{color3}</div>
        </div>
      </Config>

      <div className="center-xs">
        <Scene perspective={perspective} origin={origin}>
          {Array.from(new Array(count)).map((_, i) => (
            <Box
              width={width}
              height={height}
              depth={depth}
              margin={margin}
              duration={duration}
              opacity={opacity}
              color1={color1}
              color2={color2}
              color3={color3}
              key={i}
            >
              {Array.from(new Array(6)).map((_, k) => (
                <div key={k} />
              ))}
            </Box>
          ))}
        </Scene>
      </div>
    </LabTemplate>
  )
}

export default Blocks
