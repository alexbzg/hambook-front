import React from "react"
import { Helmet } from "react-helmet"
import styled from "styled-components"

const StyledLayout = styled.div`
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  background: #EDEEF0;
  display: flex;
  flex-direction: column;
`

const StyledMain = styled.main`
  min-height: 100vh;
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
      <StyledLayout>
        <StyledMain>{children}</StyledMain>
      </StyledLayout>
    </React.Fragment>
  )
}


