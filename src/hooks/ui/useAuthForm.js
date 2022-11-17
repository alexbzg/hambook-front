import { useState, useEffect } from "react"
import { toast } from "react-toastify"

import { useAuthenticatedUser } from "../../hooks/auth/useAuthenticatedUser"
import { FormField } from "../../components"
import validation from "../../utils/validation"

import styles from "./AuthBlock.module.css"
import layoutStyles from "../../components/Layout/Layout.module.css"

export const AuthBlock = (props) => <div {...props} className={styles.authBlock}></div>

export const AuthBlockTitle = ({ inactive, ...props }) =>
    <span {...props} className={`${styles.title} ${inactive ? styles.inactive : ''}`}></span>

export const useAuthForm = ({ initialFormState, getAction, getActionArgs, successMessage }) => {
  const { user, error, isLoading, isAuthenticated } = useAuthenticatedUser()
  const [form, setForm] = useState(initialFormState)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [submitRequested, setSubmitRequested] = useState(false)
  const [requestResult, setRequestResult] = useState(null)
  const [requestErrors, setRequestErrors] = useState([])

  // grab validation function and run it on input if it exists
  // if it doesn't exists, just assume the input is valid
  const isValid = (label, value) => validation?.[label] ? validation?.[label]?.(value) : true
  const initialErrorsState = {}
  for (const label in initialFormState) {
    initialErrorsState[label] = !isValid(label, initialFormState[label])
  }
  const [errors, setErrors] = useState(initialErrorsState)
  const validateInput = (label, value) => {
   // set an error if the validation function did NOT return true
    setErrors((errors) => ({ ...errors, [label]: !isValid(label, value) }))
  }

  useEffect(() => {
    if ((requestResult && successMessage) || requestResult === false) {
      const content = <>
            {requestResult ? 
            successMessage :  
			requestErrors.map((error, index) => <span key={index}>{error}<br/></span>)}
        </>            
        toast( content, 
          {
            hideProgressBar: true,
            className: `${layoutStyles.response} ${requestResult ? layoutStyles.OK : ''}`,
            autoClose: requestResult
      } )
    }
  }, [requestResult])

  const handleInputChange = (label, value) => {
    if (value === "") {
      value = null
    }
    validateInput(label, value)
    setForm((form) => ({ ...form, [label]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
	setSubmitRequested(true)
    setRequestResult(null)
    const newErrors = {}
    let formIsValid = true
    Object.keys(form).forEach((label) => {
        const fieldIsValid = isValid(label, form[label])
        newErrors[label] = !fieldIsValid
        if (!fieldIsValid)
            formIsValid = false
    })
    setErrors(newErrors)
    if (!formIsValid)
      return
    setHasSubmitted(true)
    await getAction()(getActionArgs({form, setRequestResult, setRequestErrors}))
  }

  const isFieldValid = (label) => !submitRequested || !Boolean(errors[label])

  const AuthFormFields = (items) => items.map( (item, index) =>
    <FormField
        {...item}
        key={index}
        isValid={isFieldValid}
        onChange={handleInputChange}
    /> )

  const AuthFormSubmit = (props) =>
        <input
            {...props}
            type="submit"
            name="submit"
            disabled={isLoading}/>

  const AuthResultDisplay = (successMessage) => requestResult ? (
		  <div className={`${styles.response} ${styles.OK}`}>
            {successMessage}
		  </div>
        ) : ( requestResult === false ? (
		  <div className={styles.response}>
			{requestErrors.map((error, index) => <span key={index}>{error}<br/></span>)}
		  </div>
	    ) : null )

  return {
	user,
	error,
	isAuthenticated,
	isLoading,
    form,
    setForm,
	errors,
	setErrors,
    isFieldValid,
    AuthFormFields,
    AuthFormSubmit,
    AuthResultDisplay,
	submitRequested,
	setSubmitRequested,
    hasSubmitted,
    setHasSubmitted,
	requestResult,
	setRequestResult,
	requestErrors,
	setRequestErrors,
    handleInputChange,
    validateInput,
	handleSubmit,
  }
}

