import React from "react"

const SelectFromObject = React.forwardRef(({ options, ...props }, ref) => {
    return (
        <select ref={ref} {...props}>
            {Object.keys(options).map( item =>
                <option
                    key={item}
                    value={item}
                >{item}</option>)}
        </select>
    )
})

export default SelectFromObject
