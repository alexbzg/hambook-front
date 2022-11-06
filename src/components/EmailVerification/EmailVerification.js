import React from "react"
import { connect } from "react-redux"
//import styled from "styled-components"

import { AuthPageWrapper, AuthPageTitle } from "../../components"

function EmailVerification({ user }) {
    if (user.email_verified) return ''
    return (
        <AuthPageWrapper>
            <AuthPageTitle>Email verification</AuthPageTitle>
        </AuthPageWrapper>
    )
}

export default connect((state) => ({ user: state.auth.user }))(EmailVerification)
