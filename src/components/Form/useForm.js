import { useState, useCallback } from "react"

import { FormField } from "../../components"

const useForm = ({ initialFormState, onSubmit }) => {
  const [form, setForm] = useState(initialFormState)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [submitRequested, setSubmitRequested] = useState(false)
  const [requestResult, setRequestResult] = useState(null)
  const [requestErrors, setRequestErrors] = useState([])

  const handleInputChange = useCallback((label, value) => {
    setForm((form) => ({ ...form, [label]: value }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
	setSubmitRequested(true)
    setRequestResult(null)
    setHasSubmitted(true)
    onSubmit(form)
  }

  const FormFields = (items) => items.map( (item, index) =>
    <FormField
        key={index}
        defaultValue={initialFormState[item.name]}
        onChange={handleInputChange}
        {...item}
    /> )

  return {
    form,
    setForm,
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
	handleSubmit,
  }
}

export default useForm
