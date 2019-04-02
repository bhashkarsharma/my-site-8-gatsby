import React from 'react'
import Helmet from 'react-helmet'
import { Header, Footer, Vinyl } from '@components'

import '../assets/styles/index.scss'

const IndexPage: React.FunctionComponent = () => (
  <div className="site" style={{ backgroundColor: 'var(--color-black)' }}>
    <div className="site-content">
      {/* <Helmet title="Bhashkar Sharma" /> */}
      <Header headerText="" logoSize={30} />
      <div className="row center-xs">
        <div className="col-xs-12">
          <div className="box">
            <Vinyl />
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
)

export default IndexPage
