import React from "react"
import styled from "styled-components"
import UserMenu from "./UserMenu/UserMenu"
import MainMenu from "./MainMenu/MainMenu"

const StyledNavbar = styled.div`
  height: 90px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: #fff;
  padding: 5px 0 0 0;
  position: relative;
  z-index: 0;
  box-shadow: 0 3px 5px rgba(0,0,0,0.2);
`

const BgLine = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 30px;
  width: 100%;
  background-color: var(--purple);
  z-index: 1;
`

export default function Navbar({ ...props }) {
  return (
	<StyledNavbar>
	  <BgLine/>
	  <MainMenu/>
      <UserMenu/>
	</StyledNavbar>
  )
}


