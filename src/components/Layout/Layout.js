import React from "react"
import { Helmet } from "react-helmet"
import { Navbar } from "../../components"
import styled, { ThemeProvider } from "styled-components"
import "../../assets/css/fonts.css"
import "../../assets/css/override.css"

const StyledLayout = styled.div`
  margin: 0;
  padding: 0;
  font-size: 16px;
  color: #333;
  text-align: center;
  font-family: 'Nunito', sans-serif;
  background: #EDEEF0;
  -webkit-font-smoothing: antialiased;
  position: relative;
  display: flex;
  flex-direction: column;
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
      <ThemeProvider theme={{}}>
        <StyledLayout>
          <Navbar />
          <StyledMain>
			<LeftColumn>{children}</LeftColumn>
			<RightColumn></RightColumn>
		  </StyledMain>
        </StyledLayout>
      </ThemeProvider>
    </React.Fragment>
  )
}


