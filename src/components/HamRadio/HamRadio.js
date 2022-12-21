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

export { CallsignField }
