import { forwardRef, useRef, useState, useEffect, useCallback } from "react"

import { FormField } from ".."
import { RE_STR_CALLSIGN_FULL, RE_STR_CALLSIGN } from "../../utils/validation"

import styles from "./HamRadio.module.css"

import buttonClearImg from "../../assets/img/icons/clear.svg"
import buttonSearchImg from "../../assets/img/icons/search_grey.svg"

const CallsignField = forwardRef(({ full = true, ...props }, ref) => {
    return (
        <FormField
            ref={ref}
            name="callsign"
            type="text"
            invalidMessage="Enter valid callsign."
            pattern={full ? RE_STR_CALLSIGN_FULL : RE_STR_CALLSIGN}
            inputFilter={/[^a-zA-Z\d/]/gi}
            style={{textTransform: 'uppercase'}}
            autoComplete="off"
            {...props}
        />
    )
})

const CallsignSearchField = forwardRef(({ name, allowWildcards = true, searchExpression, onSearch, onChange, ...props }, ref) => {

    const fallbackRef = useRef()
    const searchInputRef = ref ?? fallbackRef

    const [_searchExpression, set_searchExpression] = useState(searchExpression)

    useEffect(() => {
        set_searchExpression( (state) => {
            if (state !== searchExpression) {
                searchInputRef.current.value = searchExpression
                state = searchExpression
            }
            return state
        })
    }, [searchExpression])

    const onSubmit = (e) => {
      e.preventDefault()
      onSearch(_searchExpression || undefined)
    }

    const onClear = (e) => {
      set_searchExpression(undefined)
      searchInputRef.current.value = ''
      onSearch(undefined)
    }

    const pattern = allowWildcards ? 
        `([A-Za-z\\d/]*\\*[A-Za-z\\d/\\*]*|${RE_STR_CALLSIGN_FULL})` :
        RE_STR_CALLSIGN_FULL

    const invalidMessage = allowWildcards ?
        "Enter valid callsign or search expression (* matches anything)." :
        "Enter valid callsign."

    const handleChange = useCallback( (e) => {
        set_searchExpression(e.target.value)
        onChange?.(e)
    }, [onChange])

    return (
        <form onSubmit={onSubmit}>
            <FormField
                ref={searchInputRef}
                name="callsign_search"
                type="text"
                invalidMessage={invalidMessage}
                pattern={pattern}
                inputFilter={/[^a-zA-Z\d*/]/gi}
                style={{textTransform: 'uppercase'}}
                autoComplete="off"
                onChange={handleChange}
                postInputContent={(
                    <>
                        <img
                            id={styles.buttonSearch}
                            onClick={(e) => e.target.closest('form').requestSubmit()}
                            src={buttonSearchImg}
                            alt="Search callsign"
                            title="Search callsign"/>
                        {_searchExpression &&
                        <img
                            id={styles.buttonDelete}
                            src={buttonClearImg}
                            onClick={onClear}
                            alt="Clear"
                            title="Clear"/>
                        }
                    </>
                )}
                {...props}
            />
            <input type="submit" hidden/>
        </form>
    )
})


export { CallsignField, CallsignSearchField }
