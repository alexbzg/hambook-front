import React from "react"

export default function SelectFromObject({ options, ...props }) {
    return (
        <select {...props}>
            {Object.keys(options).map( item =>
                <option
                    key={item}
                    value={item}
                >{item}</option>)}
        </select>
    )
}
