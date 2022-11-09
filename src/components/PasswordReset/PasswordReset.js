import React from "react"
import { connect } from "react-redux"
import { useLocation } from "react-router-dom"

import { AuthPageWrapper, AuthPageTitle, AuthForm, AuthPageField, AuthPageSubmit } from "../../components"
import validation from "../../utils/validation"
import { extractErrorMessages } from "../../utils/errors"
import { Actions as authActions, REQUEST_PASSWORD_RESET_SUCCESS } from "../../redux/auth"


function PasswordResetRequest({ isLoading, requestPasswordReset }) {
  const { search } = useLocation()
  const token = React.useMemo(() => {
      const params = new URLSearchParams(search)
      return params.get('token')
  }, [search])

  const [requestResult, setRequestResult] = React.useState(null)
  const [errors, setErrors] = React.useState({})
  const [requestErrors, setRequestErrors] = React.useState([])
  const [hasSubmitted, setHasSubmitted] = React.useState(false)
  const [form, setForm] = React.useState({ password: "" })

  const validateInput = (label, value) => {
    const isValid = validation?.[label] ? validation?.[label]?.(value) : true
    setErrors((errors) => ({ ...errors, [label]: !isValid }))
  }

  const handleInputChange = (label, value) => {
    validateInput(label, value)
    setForm((form) => ({ ...form, [label]: value }))
  }

  const handleSubmit = async (e) => {
    setErrors({})
    e.preventDefault()
    Object.keys(form).forEach((label) => validateInput(label, form[label]))
    if (!Object.keys(form).every((value) => !Boolean(errors[value]))) {
      return
    }
    if (!Object.values(form).every((value) => Boolean(value))) {
   //   setErrors((errors) => ({ ...errors, form: `You must fill out all fields.` }))
      return
    }
    setHasSubmitted(true)
    await requestPasswordReset({
        password: form.password, 
        token,
        callback: (res) => {
		    setRequestResult(res.type)
		    setRequestErrors(res.error ? extractErrorMessages(res.error.data) : [])
	    }
    })
  }

  const getFormErrors = () => {
    const formErrors = []
    if (hasSubmitted && requestErrors.length && !isLoading) {
      formErrors.push(...requestErrors)
    }
    if (errors.form) {
      formErrors.push(errors.form)
    }
    return formErrors
  }
  const FormErrors = getFormErrors().map((entry, index) => 
	<span key={index}>{entry}</span>
  )

  const RequestSubmit = () => {
    switch(requestResult) {
      case REQUEST_PASSWORD_RESET_SUCCESS:
        return (
          <span><br/>Your password was changed. Now you can login with your new password.</span>
        )
      default:        
        return (
            <AuthPageSubmit
                type="submit"
                name="submit"
                disabled={isLoading}
                value="Send"/>
        )
    }
  }

  return (
    <AuthPageWrapper>
      <AuthPageTitle>Password recovery</AuthPageTitle><br/>
      <AuthForm onSubmit={handleSubmit}>
        <AuthPageField
            title="Your new password"
            type="password" 
            name="password"
            invalid={Boolean(errors.password)}
            onChange={handleInputChange}/>
        {FormErrors}
        <RequestSubmit/>
      </AuthForm>
    </AuthPageWrapper>
  )
}

const mapStateToProps = (state) => ({
  isLoading: state.auth.isLoading,
})
const mapDispatchToProps = (dispatch) => ({
  requestPasswordReset: ({password, token, callback}) => 
    dispatch(authActions.requestPasswordReset({password, token, callback}))
})

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetRequest)
