import React from 'react'

interface HeaderProp {
  headerText: string
}

const Header: React.FunctionComponent<HeaderProp> = (props: HeaderProp) => <h1>{props.headerText}</h1>

export default Header
