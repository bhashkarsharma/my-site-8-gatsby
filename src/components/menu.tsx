import { Link } from 'gatsby'
import React from 'react'

interface MenuItem {
  node: {
    class?: string
    hover?: string
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
              <a target="_blank" href={item.node.link}>
                <i className={item.node.class ? item.node.class : ''} />
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  </div>
)

export { Menu }
