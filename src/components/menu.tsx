import { Link } from 'gatsby'
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
            {item.node.link.startsWith('/') ? (
              <Link to={item.node.link}>{item.node.label}</Link>
            ) : (
              <a href={item.node.link}>{item.node.label}</a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  </div>
)

export { Menu }
