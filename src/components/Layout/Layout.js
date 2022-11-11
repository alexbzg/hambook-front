import React from "react"
import { Helmet } from "react-helmet"
import { Navbar } from "../../components"
import styled from "styled-components"
import "../../assets/css/fonts.css"
import "../../assets/css/override.css"

const StyledLayout = styled.div`
`
const StyledMain = styled.main`
  text-align: center;
  padding-top: 20px;
  //display: flex;
  //flex-direction: column;
`
const LeftColumn = styled.div`
  width: 830px;
  display: inline-block;
  padding-right: 20px;
  vertical-align: top;
`
const RightColumn = styled.div`
  width: 250px;
  display: inline-block;
  vertical-align: top;
`

export default function Layout({ children }) {
  return (
    <React.Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>HAMBOOK.net - Amateur radio social network. Plus online-logger!</title>
        <link rel="canonical" href="https://hambook.net" />
      </Helmet>
        <StyledLayout>
          <Navbar />
          <StyledMain>
			<LeftColumn>{children}</LeftColumn>
            {false && <RightColumn></RightColumn>}
		  </StyledMain>
        </StyledLayout>
    </React.Fragment>
  )
}


