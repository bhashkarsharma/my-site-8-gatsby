import React from 'react'
import { Footer } from '~components'

import '../assets/styles/index.scss'

export class BaseTemplate extends React.Component {
  render() {
    const { children } = this.props
    return (
      <>
        <div className="site">
          <div className="site-content">{children}</div>
          <Footer />
        </div>
      </>
    )
  }
}
