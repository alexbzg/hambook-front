import React from "react"
import styled from "styled-components"

const StyledMainMenuItem = styled.span`
	display: inline-block;
	width: 120px;
	cursor: pointer;

	&:hover {
		color: var(--orange);		
	}
`

export default function MainMenuItem({ ...props }) {
  return (
    <StyledMainMenuItem>
      {props.title}
    </StyledMainMenuItem>
  )
}


