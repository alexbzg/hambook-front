import React from "react"
import styled from "styled-components"
import {Link} from "react-router-dom"

const UserMenuWrapper = styled.div`
	width: 250px;
	text-align: center;
	z-index: 4;
`
const UserMenuButton = styled.div`
	width: 150px;
	margin: 10px auto;
	background-color: var(--orange);
	color: var(--black);
`
const UserMenuButtonLink = styled(Link)`
	text-decoration: none;
	color: var(--black);
    &:hover {
        color: var(--balck);
    }
`

export default function UserMenu({ ...props }) {
  return (
    <UserMenuWrapper>
      <UserMenuButton className="button">
        <UserMenuButtonLink to="/login">Login / Register</UserMenuButtonLink>
      </UserMenuButton>
    </UserMenuWrapper>
  )
}

