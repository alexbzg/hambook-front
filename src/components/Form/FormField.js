import { useRef, forwardRef, useState, useEffect } from "react"

import styles from './FormField.module.css'
import { Autocomplete } from "../../components"

const FormField = forwardRef((props, ref) => {
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
      hints,
      ...inputProps } = props

  const inputRef = useRef()

  const [activeHint, setActiveHint] = useState(null)
  const [showHints, setShowHints] = useState()
  
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
	setShowHints(true)
  }

  const handleHintClick = (hint) => {
    (ref || inputRef).current.value = hint
    setShowHints(false)
    setActiveHint(null)
    if (props.onChange) {
      props.onChange(props.name, hint)
    }
    (ref || inputRef).current.focus()
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
            ref={ref || inputRef}
            {...inputProps}
            onKeyDown={onKeyDown}
            onInvalid={e => invalidMessage && e.target.setCustomValidity(invalidMessage)}
			className={`${styles.input} ${classInvalid}`}
            onChange={onChange}/>
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
                    
