import React from "react"
import styled from "styled-components"

const FormFieldNote = styled.span`
	margin-left: 10px;
	color: var(--grey);
	font-size: 12px;
	font-style: italic;
`
const FormFieldWrapper = styled.div`
    & input:not([type=checkbox]), textarea {
    	width: 100%;
	    font-weight: bold;
    }
    & input[type=checkbox] {
        width: 30px;
    }
`

export default function FormField({...props}) {
  const InputElement = props.type === `textarea` ? `textarea` : `input`
  const classInvalid = props.isValid(props.name) ? '' : 'invalid'
  const onChange = (e) => 
    props.onChange(props.name, props.type === 'checkbox' ? e.target.checked : e.target.value)
  return (
    <FormFieldWrapper>
        {props.preInputContent}
        { (props.title || props.note) && (
            <>
                {props.title}
                <FormFieldNote>{props.note}</FormFieldNote>
                <br/>
            </>
        )}
        <InputElement
            type={props.type} 
            name={props.name}
			className={`${classInvalid}`}
            onChange={onChange}/>
        {props.postInputContent}
    </FormFieldWrapper>
  )
}


