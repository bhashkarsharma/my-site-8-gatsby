import { Footer } from '@components/footer'
import React from 'react'
import '../assets/styles/index.scss'

const BaseTemplate: React.FunctionComponent = (props) => (
  <div className="site">
    <div className="site-content">{props.children}</div>
    <Footer />
  </div>
)
export { BaseTemplate }
