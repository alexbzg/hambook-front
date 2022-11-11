import React from "react"
import styled from "styled-components"
import { connect } from "react-redux"
import { Link } from "react-router-dom"

import { Actions as authActions } from "../../../redux/auth"
import { default as NotLoggedIn } from "./NotLoggedIn"
import userIcon from "../../../assets/img/icons/user.svg"
import userImg from "../../../assets/img/user.jpg"
import logoutImg from "../../../assets/img/icons/logout.svg"

const UserMenuWrapper = styled.div`
	width: 250px;
	text-align: center;
	z-index: 4;
`
const UserMenuIconsWrapper = styled.div`
	width: 80%;
  line-height: 0;
	margin: 0px auto 0 auto;
	display: flex;
  	flex-direction: row;
  	align-items: center;
    align-self: center;
  	justify-content: space-between;
`
const UserMenuIconImg = styled.img`
	width: 30px;
	cursor: pointer;
`
const UserImg = styled.img`
	width: 40px;
	border: 2px solid var(--purple);
	border-radius: 5px;
`

function UserMenu({ user, logUserOut, ...props }) {
  const UserMenuContents = user?.email ?
    <div>
        <UserMenuIconsWrapper>
            <Link to="/profile"><UserImg src={userImg} title="Your profile"/></Link>
            <Link to="/profile"><UserMenuIconImg src={userIcon} title="Your profile"/></Link>
            <UserMenuIconImg src={logoutImg} onClick={logUserOut} title="Logout"/>
        </UserMenuIconsWrapper>
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
