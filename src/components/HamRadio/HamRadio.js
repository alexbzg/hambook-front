import { forwardRef } from "react"

import { FormField } from ".."
import { RE_STR_CALLSIGN_FULL, RE_STR_CALLSIGN } from "../../utils/validation"
import { BANDS, QSO_MODES } from "../../utils/hamRadio"

const CallsignField = forwardRef(({ full = true, ...props }, ref) => {
    return (
        <FormField
            ref={ref}
            name="callsign"
            title="Callsign"
            type="text"
            invalidMessage="Enter valid callsign."
            pattern={full ? RE_STR_CALLSIGN_FULL : RE_STR_CALLSIGN}
            {...props}
        />
    )
})

export { CallsignField }
