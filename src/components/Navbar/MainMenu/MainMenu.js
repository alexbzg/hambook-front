import React from "react"
import styled from "styled-components"
import logo from "../../../assets/img/hambook_logo.svg"
import MainMenuItem from "./MainMenuItem"

const LogoImg = styled.img`
	position: absolute;
	bottom: -1px;
	left: 0;
	width: 70px;
`

const LogoText = styled.span`
	position: absolute;
	bottom: 30px;
	left: 80px;
	color: var(--grey);
	font-size: 40px;
	font-weight: bold;
`

const MainMenuWrapper = styled.div`
	width: 800px;
	padding-left: 50px;
	z-index: 2;
	color: #FFF;
	position: relative;
`

const MainMenuOptions = styled.div`
	position: absolute;
	top: 0;
	left: 80px;
	margin-top: 65px;
	z-index: 3;
`

const mainMenu = [
	"MYBOOK", 
	"WORLDBOOK", 
	"LOGBOOK", 
	"QSLBOOK", 
	"PHOTOBOOK",
	"ALL BOOKS"
]

const MainMenuItems = mainMenu.map((entry, index) => 
	<MainMenuItem title={entry} key={index}/>
)

export default function MainMenu({ ...props }) {
  return (
	  <MainMenuWrapper>
        <a href="/">
	      <LogoImg src={logo}/>
		  <LogoText>HAMBOOK</LogoText>
        </a>
		<MainMenuOptions>
		  {MainMenuItems}
		</MainMenuOptions>
	  </MainMenuWrapper>
  )
}


