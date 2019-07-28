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
  multiline: Boolean
}

interface MenuListProps {
  multiline: Boolean
}

const MenuList = styled.ul`
  list-style-type: none;
  padding: 0;

  li {
    text-align: left;
    ${({ multiline }: MenuListProps) =>
      multiline
        ? `
    display: block;
    font-size: 4rem;
    margin: 1rem 0;
    text-align: left;
    `
        : `
    display: inline-block;
    font-size: 2rem;
    margin-right: 1em;

    &:last-child {
      margin: 0;
    }
    `}
  }
`

const Menu: React.FunctionComponent<MenuProps> = ({ items, multiline }) => (
  <div>
    <nav>
      <MenuList multiline={multiline}>
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
