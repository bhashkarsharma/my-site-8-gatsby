// animation spinning concentric disks with vinyl texture

import React from 'react'
import styled from 'styled-components'

const discCount = 9

const VinylBox = styled.div``

const RecordBox = styled.div`
  height: 50vw;
  position: relative;
  width: 50vw;
`

const RecordBaseStyles = `
  background: 
    linear-gradient(30deg, transparent 40%, rgba(42, 41, 40, .85) 40%) no-repeat 100% 0,
    linear-gradient(60deg, rgba(42, 41, 40, .85) 60%, transparent 60%) no-repeat 0 100%,
    repeating-radial-gradient(#2a2928, #2a2928 4px, #ada9a0 5px, #2a2928 6px);
  background-size: 50% 100%, 100% 50%, 100% 100%;
  border-radius: 50%;
  bottom: 0;
  box-shadow: 0px 0px 1px var(--color-white);
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;

  &:nth-child(1):after {
    background: var(--color-red);
    border: solid 1px #d9a388;
    border-radius: 50%;
    bottom: 0;
    box-shadow: 0 0 0 4px var(--color-red),
      inset 0 0 0 27px var(--color-red);
    content: '';
    left: 0;
    margin: auto;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
  }
`

function generateStyles(count: number): string {
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
  return styles.join('\n\t')
}

console.log(`${RecordBaseStyles}${generateStyles(discCount)}`)

const Record = styled.div`
  ${RecordBaseStyles}${generateStyles(discCount)}
`

export class Vinyl extends React.Component {
  render() {
    return (
      <VinylBox>
        <RecordBox>
          {Array.from(Array(discCount), (_, i) => (
            <Record key={i} />
          ))}
        </RecordBox>
      </VinylBox>
    )
  }
}
