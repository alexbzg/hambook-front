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
  display: flex;
  flex-direction: column;
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
          <StyledMain>{children}</StyledMain>
        </StyledLayout>
      </ThemeProvider>
    </React.Fragment>
  )
}


