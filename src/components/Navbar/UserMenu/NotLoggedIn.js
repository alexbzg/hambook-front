import React from "react"
import styled from "styled-components"
import {Link} from "react-router-dom"

const UserMenuLoginButton = styled.div`
	width: 150px;
	margin: 10px auto;
	background-color: var(--orange);
	color: var(--black);
`
const UserMenuLoginButtonLink = styled(Link)`
	text-decoration: none;
	color: var(--black);
    &:hover {
        color: var(--balck);
    }
`

export default function UserMenu({ user, logUserOut, ...props }) {
  return (
      <UserMenuLoginButton className="button">
        <UserMenuLoginButtonLink to="/login">Login / Register</UserMenuLoginButtonLink>
      </UserMenuLoginButton>
  )
}

