import React from "react"
import Footer from "../components/footer"

export class Template extends React.Component {
  render() {
    const { children } = this.props
    return (
      <div style={{ color: "teal" }}>
        {children}
        <Footer />
      </div>
    )
  }
}
