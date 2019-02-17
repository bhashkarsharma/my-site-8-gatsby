import React from 'react'
import { Footer } from '~components'

import '../styles/index.scss'

export class HomeTemplate extends React.Component {
  render() {
    const { children } = this.props
    return (
      <div>
        {children}
        <Footer />
      </div>
    )
  }
}
