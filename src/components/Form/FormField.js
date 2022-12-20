import React from "react"

import styles from './FormField.module.css'

const FormField = React.forwardRef((props, ref) => {
  const InputElement = props.type === `textarea` ? `textarea` : `input`
  const classInvalid = !props.isValid || props.isValid(props.name) ? '' : 'invalid'
  const { 
      preInputContent, 
      title, 
      note, 
      postInputContent, 
      noteClass,
      inputClass, 
      isValid,
      invalidMessage,
      className,
      inputFilter,
      id,
      ...inputProps } = props
  const onChange = (e) => {
    e.target.setCustomValidity('')
    if (inputFilter) {
      let position = e.target.selectionStart
      if (position > 0) {
        position = e.target.value.substring(0, position).replace(inputFilter, '').length
      }
      e.target.value = e.target.value.replace(inputFilter, '')
      e.target.selectionEnd = position
    }
    if (props.onChange) {
      props.onChange(props.name, props.type === 'checkbox' ? e.target.checked : e.target.value)
    }
  }

  return (
    <div className={className} id={id}>
        {props.preInputContent}
        { (props.title || props.note) && (
            <>
                {title}
                <span className={noteClass || styles.note}>{note}</span>
                <br/>
            </>
        )}
        <InputElement
            ref={ref}
            {...inputProps}
            onInvalid={e => invalidMessage && e.target.setCustomValidity(invalidMessage)}
			className={`${styles.input} ${classInvalid}`}
            onChange={onChange}/>
        {props.postInputContent}
    </div>
  )
})

export default FormField
                    
