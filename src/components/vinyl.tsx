// animation spinning concentric disks with vinyl texture

import React from 'react'
import styled from 'styled-components'

const discCount = 8

const VinylBox = styled.div`
  background: var(--color-black);
  padding: 2em;
`

const RecordBox = styled.div`
  height: 50vw;
  position: relative;
  width: 50vw;

  &:hover {
    animation: rotation 5s infinite linear;
  }
`

const RecordBaseStyles = `
  background-position: center center;
  border-radius: 50%;
  bottom: 0;
  box-shadow: 0px 0px 1px var(--color-white), inset 0 0 0 100px rgba(0, 0, 0, .4);
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;

  &.texture {
    background: linear-gradient(30deg, transparent 40%, rgba(42, 41, 40, .85) 40%) no-repeat 100% 0,
      linear-gradient(60deg, rgba(42, 41, 40, .85) 60%, transparent 60%) no-repeat 0 100%,
      repeating-radial-gradient(#2a2928, #2a2928 4px, #ada9a0 5px, #2a2928 6px);
    background-size: 50% 100%, 100% 50%, 100% 100%;
  }

  &:nth-child(1):after {
    background: var(--color-black);
    border: solid 1px #d9a388;
    border-radius: 50%;
    bottom: 0;
    box-shadow: 0 0 0 35px var(--color-red),
      inset 0 0 0 35px var(--color-red);
    content: '';
    left: 0;
    margin: auto;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
  }
  
`

function generateRecordStyles(count: number): string {
  let styles: string[] = [
    `&:nth-child(1):after {
    height: ${100 / count}%;
    width: ${100 / count}%;
  }`
  ]
  Array.from(Array(discCount), (_, i) => {
    const size = ((count - i) * 100) / count
    styles.push(`&:nth-child(${i + 1}) {
      height: ${size}%;
      width: ${size}%;
    }`)
  })
  return styles.join('\n')
}

const Record = styled.div`
  ${RecordBaseStyles}${generateRecordStyles(discCount)}
`

export class Vinyl extends React.Component {
  render() {
    return (
      <VinylBox>
        <RecordBox>
          {Array.from(Array(discCount), (_, i) => (
            <Record className="texture" key={i} />
          ))}
        </RecordBox>
      </VinylBox>
    )
  }
}
