import React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { Link } from "react-router-dom"

import { Actions as authActions } from "../../../redux/auth"
import { default as NotLoggedIn } from "./NotLoggedIn"
import userIcon from "../../../assets/img/icons/user.svg"
import userImg from "../../../assets/img/user.jpg"

const UserMenuWrapper = styled.div`
	width: 250px;
	text-align: center;
	z-index: 4;
`
const UserMenuIconsWrapper = styled.div`
	width: 80%;
	margin: 0px auto 0 auto;
	display: flex;
  	flex-direction: row;
  	align-items: center;
  	justify-content: space-between;
`
const UserMenuLogoutButton = styled.div`
	margin-top: 5px;
	color: var(--orange);
	cursor: pointer;

    &:hover{
	    text-decoration: underline;
    }
`
const UserMenuIconImg = styled.img`
	width: 30px;
	cursor: pointer;
`
const UserImg = styled.img`
	width: 50px;
	border: 2px solid var(--purple);
	border-radius: 5px;
`

function UserMenu({ user, logUserOut, ...props }) {
  const UserMenuContents = user?.email ? 
    <div>
        <UserMenuIconsWrapper>
            <Link to="/profile"><UserImg src={userImg}/></Link>
            <Link to="/profile"><UserMenuIconImg src={userIcon}/></Link>
        </UserMenuIconsWrapper>
        <UserMenuLogoutButton 
            onClick={logUserOut}>
            LOGOUT
        </UserMenuLogoutButton>
    </div>
    : <NotLoggedIn/>
  return (
    <UserMenuWrapper>
      {UserMenuContents}
    </UserMenuWrapper>
  )
}

export default connect((state) => ({ user: state.auth.user }), {
  logUserOut: authActions.logUserOut
})(UserMenu)
