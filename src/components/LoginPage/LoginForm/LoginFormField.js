import React from "react"
import styled from "styled-components"

const LoginFormFieldNote = styled.span`
	margin-left: 10px;
	color: var(--grey);
	font-size: 12px;
	font-style: italic;
`
const LoginFormFieldInput = styled.input`
	width: 100%;
	font-weight: bold;
`

export default function LoginFormField({...props}) {
  return (
    <div>
        {props.title}
        <LoginFormFieldNote>{props.note}</LoginFormFieldNote>
        <br/>
        <LoginFormFieldInput 
            type={props.type} 
            name={props.name}
			className={props.invalid ? 'invalid' : null}
            onChange={(e) => props.onChange(props.name, e.target.value)}/>
    </div>
  )
}


