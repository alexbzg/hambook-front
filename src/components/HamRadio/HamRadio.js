import { forwardRef } from "react"

import { FormField } from ".."
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

const CallsignSearchField = forwardRef(({ ...props }, ref) => {
    return (
        <FormField
            ref={ref}
            name="callsign_search"
            type="text"
            invalidMessage="Enter valid callsign or search expression (* matches anything)."
            pattern={`([A-Za-z\\d/]*\\*[A-Za-z\\d/]*|${RE_STR_CALLSIGN_FULL})`}
            inputFilter={/[^a-zA-Z\d*/]/gi}
            style={{textTransform: 'uppercase'}}
            autoComplete="off"
            {...props}
        />
    )
})


export { CallsignField, CallsignSearchField }
