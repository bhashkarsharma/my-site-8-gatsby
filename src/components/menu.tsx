import { StaticQuery, graphql, Link } from 'gatsby'
import React from 'react'

interface MenuItem {
  node: {
    label: string
    link: string
  }
}

interface MenuProps {
  items: MenuItem[]
}

const Menu: React.FunctionComponent<MenuProps> = ({ items }) => (
  <div>
    <nav>
      <ul>
        {items.map((item, key) => (
          <li key={key}>
            <Link to={item.node.link}>{item.node.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  </div>
)

export { Menu }
