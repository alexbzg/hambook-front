import React from "react"

import styles from "./AdifImportResult.module.css"

export default function AdifImportResult({ filename, result, status, ...props }) {
    return (status !== 'PENDING' &&
        <>
            { status === 'SUCCESS' && 
                <>
                    File &quot;{filename}&quot; was imported successfully.<br/>
                    {(Boolean(result?.new) || Boolean(result?.duplicates)) &&
                      <>
                        <span className={styles.valid}>
                            {result.new} new and {result.duplicates} existing qso were found.
                        </span><br/>
                      </>
                    }
                    {Boolean(result?.invalid?.length) && result.invalid.map( (item) => 
                        <>
                            <span className={styles.invalid}>
                                {item[1]} qso: {item[0]}
                            </span><br/>
                        </> )}
                </>
            } 
            { status === 'FAILURE' &&
                    <>
                        File &quot;{filename}&quot; import failed.<br/>
                        Please check your file or contact technical support.
                    </>
            }
        </>
    )
}
