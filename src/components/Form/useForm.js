import { useState, useCallback } from "react"

import { FormField } from "../../components"
import validation from "../../utils/validation"

const useForm = ({ initialFormState, onSubmit }) => {
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
  const validateInput = useCallback((label, value) => {
   // set an error if the validation function did NOT return true
    setErrors((errors) => ({ ...errors, [label]: !isValid(label, value) }))
  }, [])

  const handleInputChange = useCallback((label, value) => {
    if (value === "") {
      value = null
    }
    validateInput(label, value)
    setForm((form) => ({ ...form, [label]: value }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
	setSubmitRequested(true)
    setRequestResult(null)
    setRequestErrors(null)
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
    onSubmit(form)
  }

  const isFieldValid = useCallback((label) => !submitRequested || !Boolean(errors[label]), 
      [submitRequested, errors])

  const FormFields = (items) => items.map( (item, index) =>
    <FormField
        {...item}
        key={index}
        isValid={isFieldValid}
        defaultValue={initialFormState[item.name]}
        onChange={handleInputChange}
    /> )

  return {
    form,
    setForm,
	errors,
	setErrors,
    isFieldValid,
    FormFields,
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

export default useForm
