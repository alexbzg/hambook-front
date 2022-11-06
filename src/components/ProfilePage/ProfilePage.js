import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import { EmailVerification } from "../../components"

const ProfilePageWrapper = styled.div`
`

function ProfilePage({ user }) {
  return (
    <ProfilePageWrapper>
        <EmailVerification/>
        <h1>user {user.id}</h1>
    </ProfilePageWrapper>
    )
}

export default connect((state) => ({ user: state.auth.user }))(ProfilePage)
