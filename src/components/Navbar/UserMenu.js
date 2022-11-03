import React from "react"
import styled from "styled-components"
import {Link} from "react-router-dom"
import { connect } from "react-redux"

import { Actions as authActions } from "../../redux/auth"

const UserMenuWrapper = styled.div`
	width: 250px;
	text-align: center;
	z-index: 4;
`
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

function UserMenu({ user, logUserOut, ...props }) {
  return (
    <UserMenuWrapper>
      <UserMenuLoginButton className="button">
        <UserMenuLoginButtonLink to="/login">Login / Register</UserMenuLoginButtonLink>
      </UserMenuLoginButton>
    </UserMenuWrapper>
  )
}

export default connect((state) => ({ user: state.auth.user }), {
  logUserOut: authActions.logUserOut
})(UserMenu)