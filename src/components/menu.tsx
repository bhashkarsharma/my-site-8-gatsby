import { Link } from 'gatsby'
import React from 'react'
import styled from 'styled-components'

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

const MenuList = styled.ul`
  list-style-type: none;
  padding: 0;
`

const Menu: React.FunctionComponent<MenuProps> = ({ items }) => (
  <div>
    <nav>
      <MenuList>
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
      </MenuList>
    </nav>
  </div>
)

export { Menu }
