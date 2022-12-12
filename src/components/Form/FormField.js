import React from "react"

import styles from './FormField.module.css'

export default function FormField({...props}) {
  const InputElement = props.type === `textarea` ? `textarea` : `input`
  const classInvalid = props.isValid(props.name) ? '' : 'invalid'
  const onChange = (e) => 
    props.onChange(props.name, props.type === 'checkbox' ? e.target.checked : e.target.value)
  const { 
      preInputContent, 
      title, 
      note, 
      postInputContent, 
      noteClass,
      inputClass, 
      isValid,
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
            {...inputProps}
			className={`${styles.input} ${classInvalid}`}
            onChange={onChange}/>
        {props.postInputContent}
    </div>
  )
}


