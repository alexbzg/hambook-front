import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"

import {
	AuthPageWrapper,
	AuthPageTitle,
	AuthForm,
	FormField,
	AuthPageSubmit,
	AuthPageResponseError,
    EmailVerification } from "../../components"
import { useAuthForm } from "../../hooks/ui/useAuthForm"
import { useAuthenticatedUser } from "../../hooks/auth/useAuthenticatedUser"
import { extractErrorMessages } from "../../utils/errors"
import { Actions as authActions } from "../../redux/auth"


function ProfilePage({ updateUserProfile }) {
  const getAction = () => updateUserProfile
  const getActionArgs = (form) => form
  const {
    user,
    error,
    isAuthenticated,
	errors,
    setForm,
    setErrors,
    setHasSubmitted,
    isLoading,
	submitRequested,
    setSubmitRequested,
    hasSubmitted,
    handleInputChange,
	handleSubmit
  } = useAuthForm({
      initialFormState: {
        full_name: null,
        address: null, 
        current_callsign: null, 
        prev_callsigns: null, 
        birthdate: null,
        bio: null
      }, 
      getAction, getActionArgs })

  const authErrorList = extractErrorMessages(error)
  const FormErrors = authErrorList.map((entry, index) =>
	<span key={index}>{entry}<br/></span>
  )

  return (
    <AuthPageWrapper>
        <EmailVerification/>
        {error && hasSubmitted &&
            <AuthPageResponseError>{FormErrors}</AuthPageResponseError>}
        <AuthForm onSubmit={handleSubmit}>
            <FormField
                title="Your full name"
                note="(requires confirmation)"
                type="text"
                name="full_name"
                invalid={Boolean(errors.full_name) && submitRequested}
                onChange={handleInputChange}/>
            <FormField
                title="Password"
                note="(8-20 symbols)"
                type="password"
                name="password"
                invalid={Boolean(errors.password) && submitRequested}
                onChange={handleInputChange}/>
            <AuthPageSubmit
                type="submit"
                name="submit"
                disabled={isLoading}
                value="Save changes"/>
        </AuthForm>
    </AuthPageWrapper>
    )
}

export default connect((state) => ({ user: state.auth.user }))(ProfilePage)
