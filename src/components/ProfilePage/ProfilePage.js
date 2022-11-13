import React from "react"
import { connect } from "react-redux"

import {
	AuthPageWrapper,
	AuthForm,
	AuthPageSubmit,
	AuthPageResponseError,
	AuthPageResponseOK,
    EmailVerification } from "../../components"
import { useAuthenticatedUser } from "../../hooks/auth/useAuthenticatedUser"
import { useAuthForm } from "../../hooks/ui/useAuthForm"
import { extractErrorMessages } from "../../utils/errors"
import { Actions as authActions } from "../../redux/auth"

function ProfilePage({ updateUserProfile }) {
  const { user, error, isLoading } = useAuthenticatedUser()
  const getAction = () => updateUserProfile
  const getActionArgs = ({form}) => form
  const { AuthFormFields, hasSubmitted, handleSubmit } = useAuthForm({
      initialFormState: { ...user.profile }, getAction, getActionArgs 
  })

  const authErrorList = extractErrorMessages(error)
  const FormErrors = authErrorList.map((entry, index) =>
	<span key={index}>{entry}<br/></span>
  )

  return (
    <AuthPageWrapper>
        <EmailVerification/>
        {error && hasSubmitted &&
            <AuthPageResponseError>{FormErrors}</AuthPageResponseError>}
        {!error && !isLoading && hasSubmitted &&
            <AuthPageResponseOK>Your profile was updated succefully.</AuthPageResponseOK>}
        <AuthForm onSubmit={handleSubmit}>
            {AuthFormFields([
                {
                    name: 'full_name',
                    defaultValue: user.profile.full_name,
                    title: "Your full name",
                    type: "text",
                },
                {
                    name: 'address',
                    defaultValue: user.profile.address,
                    title: "Your home address",
                    type: "textarea",
                },
                {
                    name: 'current_callsign',
                    defaultValue: user.profile.current_callsign,
                    title: "Your current callsign",
                    type: "text",
                },
                {
                    name: 'prev_callsigns',
                    defaultValue: user.profile.prev_callsigns,
                    title: "Your previous callsigns",
                    type: "textarea",
                },
                {
                    name: 'birthdate',
                    defaultValue: user.profile.birthdate,
                    title: "Date of your birth",
                    type: "date",
                },
                {
                    name: 'bio',
                    defaultValue: user.profile.bio,
                    title: "Please tell about yourself",
                    type: "textarea",
                }
            ])}
            <AuthPageSubmit
                type="submit"
                name="submit"
                disabled={isLoading}
                value="Save changes"/>
        </AuthForm>
    </AuthPageWrapper>
    )
}
export default connect(null, {
    updateUserProfile: authActions.updateUserProfile
})(ProfilePage)
