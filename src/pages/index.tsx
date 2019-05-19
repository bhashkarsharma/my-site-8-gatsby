import { Footer, Header, Vinyl } from '@components/index'
import React from 'react'
import '../assets/styles/index.scss'

const IndexPage: React.FunctionComponent = () => (
  <div className="site" style={{ backgroundColor: 'var(--color-black)' }}>
    <div className="site-content">
      <Header headerText="" logoSize={40} />
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
