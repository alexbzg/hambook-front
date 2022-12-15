import React from "react"

import styles from './FormField.module.css'

const FormField = React.forwardRef((props, ref) => {
  const InputElement = props.type === `textarea` ? `textarea` : `input`
  const classInvalid = !props.isValid || props.isValid(props.name) ? '' : 'invalid'
  const onChange = (e) => {
    e.target.setCustomValidity('')
    props.onChange(props.name, props.type === 'checkbox' ? e.target.checked : e.target.value)
  }
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
      id,
      ...inputProps } = props
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
                    
