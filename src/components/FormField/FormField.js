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
      inputClass, 
      isValid,
      ...inputProps } = props
  return (
    <div>
        {props.preInputContent}
        { (props.title || props.note) && (
            <>
                {title}
                <span className={styles.note}>{note}</span>
                <br/>
            </>
        )}
        <InputElement
            {...inputProps}
			className={`${styles.input} ${classInvalid} ${inputClass ? inputClass : ''}`}
            onChange={onChange}/>
        {props.postInputContent}
    </div>
  )
}


