import { forwardRef, useRef, useState } from "react"

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

const CallsignSearchField = forwardRef(({ name, allowWildcards = true, onSearch, ...props }, ref) => {

    const fallbackRef = useRef()
    const searchInputRef = ref ?? fallbackRef

    const [searchExpression, setSearchExpression] = useState()

    const onSubmit = (e) => {
      e.preventDefault()
      onSearch(searchExpression || undefined)
    }

    const onClear = (e) => {
      setSearchExpression(undefined)
      searchInputRef.current.value = ''
      onSearch(undefined)
    }

    const pattern = allowWildcards ? 
        `([A-Za-z\\d/]*\\*[A-Za-z\\d/\\*]*|${RE_STR_CALLSIGN_FULL})` :
        RE_STR_CALLSIGN_FULL

    const invalidMessage = allowWildcards ?
        "Enter valid callsign or search expression (* matches anything)." :
        "Enter valid callsign."

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
                onChange={(e) => setSearchExpression(e.target.value)}
                postInputContent={(
                    <>
                        <img
                            id={styles.buttonSearch}
                            onClick={(e) => e.target.closest('form').requestSubmit()}
                            src={buttonSearchImg}
                            alt="Search callsign"
                            title="Search callsign"/>
                        {searchExpression &&
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
