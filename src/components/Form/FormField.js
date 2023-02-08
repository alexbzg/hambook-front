import { useRef, forwardRef, useState, useEffect } from "react"

import PhoneInput from 'react-phone-number-input/input'
import { isValidPhoneNumber } from 'react-phone-number-input'

import styles from './FormField.module.css'
import { Autocomplete } from "../../components"

const FormField = forwardRef((props, ref) => {
  const InputElement = props.type === `textarea` ? `textarea` : 
        (props.type === 'tel' ? PhoneInput : `input`)
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
      hints,
      ...inputProps } = props

  if (!inputProps.pattern && inputProps.type === 'email') {
      inputProps.pattern = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$"
  }

  const backupRef = useRef()
  const inputRef = ref || backupRef

  const [activeHint, setActiveHint] = useState(null)
  const [showHints, setShowHints] = useState()

  const inputFilters = []
  if (inputFilter) {
    inputFilters.push(inputFilter)
  }
  if (props.type === 'email') {
    inputFilters.push(/[^a-zA-Z0-9@.!#$%&'*+/=?^_`{|}~-]/gi)
  }
  
  useEffect( () => {
    setActiveHint( (val) => {
      if (hints === null || val === null) {
        return null
      } else if (val >= hints.length - 1) {
        return hints.length - 1
      } else {
        return val
      }
    })
  }, [hints] )

  const onKeyDown = (e) => {
    
    if (hints && showHints) {
      // User pressed the enter key
      if (e.keyCode === 13) {
        if (activeHint != null) {
          e.preventDefault()
          handleHintClick(hints[activeHint])
        }
      }
      // User pressed the up arrow
      else if (e.keyCode === 38) {
        if (activeHint > 0) {
          e.preventDefault()
          setActiveHint( (state) => state - 1 )
        }
      }
      // User pressed the down arrow
      else if (e.keyCode === 40) {
        if (activeHint === null) {
          e.preventDefault()
          setActiveHint(0)
        } else if (activeHint < hints.length - 1) {
          e.preventDefault()
          setActiveHint( (state) => state + 1 )
        }
      }
    }
  }
   
  const onChange = (e) => {
    e.target.setCustomValidity('')
    inputFilters.forEach( (filter) => {
      let position = null
      if (props.type !== 'email') {
        position = e.target.selectionStart
        if (position > 0) {
            position = e.target.value.substring(0, position).replace(filter, '').length
        }
      }
      e.target.value = e.target.value.replace(filter, '')
      if (props.type !== 'email') {
        e.target.selectionEnd = position
      }
    })
    props.onChange?.(e)
	setShowHints(true)
  }

  const onPhoneChange = (value) => {
    inputRef.current.setCustomValidity(isValidPhoneNumber(value) ? '' : 'Enter valid phone number')
  }

  const handleHintClick = (hint) => {
    const inputEl = inputRef.current
    inputEl.value = hint
    setShowHints(false)
    setActiveHint(null)
    if (props.onChange) {
      props.onChange({target: inputEl})
    }
    inputEl.focus()
  }

  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setShowHints(false)
    }
  }

    
  return (
    <div className={className} id={id} onBlur={handleBlur}>
        {props.preInputContent}
        { (props.title || props.note) && (
            <>
                {title}
                <span className={noteClass || styles.note}>{note}</span>
                <br/>
            </>
        )}
        <InputElement
            ref={inputRef}
            {...inputProps}
            onKeyDown={onKeyDown}
            onInvalid={e => invalidMessage && e.target.setCustomValidity(invalidMessage)}
			className={`${styles.input} ${classInvalid}`}
            onChange={props.type === 'tel' ? onPhoneChange : onChange}/>
        {showHints && hints && (
            <Autocomplete 
                hints={hints}
                activeHint={activeHint}
                onActiveHint={(value) => setActiveHint(value)}
                onHintClick={handleHintClick}/>
            )
        }
        {props.postInputContent}
    </div>
  )
})

export default FormField
                    
