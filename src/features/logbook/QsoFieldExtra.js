import { forwardRef } from "react"

import { SelectFromObject } from "../../components"

import { QSO_FIELDS_EXTRA } from "../../utils/hamRadio"

import styles from "./QsoFieldExtra.module.css"

const QsoFieldExtra = forwardRef(({ field, value, onFieldChange, onValueChange, ...props }, ref) => {
    return (
        <div className={styles.wrapper}>
            <SelectFromObject
                defaultValue={field}
                className={styles.field}
                onChange={(e) => onFieldChange(e.target.value)}
                options={QSO_FIELDS_EXTRA}/><br/>
            <input
                type="text"
                ref={ref}
                className={styles.value}
                defaultValue={value}
                onChange={(e) => onValueChange(e.target.value)}/>
        </div>
    )
})

export default QsoFieldExtra

