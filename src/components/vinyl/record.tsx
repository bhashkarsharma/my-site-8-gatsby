import styled from 'styled-components'

interface RecordProps {
  discCount: number
}

const RecordBaseStyles = `
align-items: center;
border: 1px solid black;
border-radius: 50%;
box-shadow: 0px 0px 1px var(--color-white), inset 0 0 0 100px rgba(0, 0, 0, .4);
display: flex;
justify-content: center;
position: absolute;

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
  box-shadow: 0 0 0 35px var(--color-red), inset 0 0 0 35px var(--color-red);
  content: '';
  position: absolute;
  z-index: 1;
}
`

function generateRecordStyles(count: number): string {
  const styles: string[] = [
    `&:nth-child(1):after {
      height: ${100 / count}%;
      width: ${100 / count}%;
    }`
  ]
  Array.from(Array(count), (_, i) => {
    const size = ((count - i) * 100) / count
    styles.push(`&:nth-child(${i + 1}) {
        height: ${size}%;
        width: ${size}%;
      }`)
  })
  return styles.join('')
}

const Record = styled.div`
  ${(props: RecordProps) => `${RecordBaseStyles}${generateRecordStyles(props.discCount)}`}
`

export { Record }
