import styled from 'styled-components'

interface TagProps {
  bgColor?: string
  color?: string
}

const Tag = styled.div`
  background-color: ${(props: TagProps) => (props.bgColor ? props.bgColor : 'var(--color-black)')};
  border: 1px solid;
  color: ${(props: TagProps) => (props.color ? props.color : 'var(--color-white)')};
  display: inline-block;
  font-size: 0.6em;
  padding: 0.2em 0.4em;
`

export { Tag }
