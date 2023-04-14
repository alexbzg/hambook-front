import { forwardRef, useRef, useState, useEffect, useCallback } from "react"

import { FormField, SearchField } from ".."
import { RE_STR_CALLSIGN_FULL, RE_STR_CALLSIGN } from "../../utils/validation"


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

const CallsignSearchField = forwardRef(({ allowWildcards = true, searchExpression, onSearch, onChange, ...props }, ref) => {

    const fallbackRef = useRef()
    const searchFieldRef = ref ?? fallbackRef

    const pattern = allowWildcards ? 
        `([A-Za-z\\d/]*\\*[A-Za-z\\d/\\*]*|${RE_STR_CALLSIGN_FULL})` :
        RE_STR_CALLSIGN_FULL

    const invalidMessage = allowWildcards ?
        "Enter valid callsign or search expression (* matches anything)." :
        "Enter valid callsign."

    return (
            <SearchField
                ref={searchFieldRef}
                name="callsign_search"
                invalidMessage={invalidMessage}
                pattern={pattern}
                inputFilter={/[^a-zA-Z\d*/]/gi}
                style={{textTransform: 'uppercase'}}
                {...props}
            />
    )
})


export { CallsignField, CallsignSearchField }
