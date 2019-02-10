import React from "react"

interface HeaderProp {
  headerText: string
}

export default (props: HeaderProp) => <h1>{props.headerText}</h1>
