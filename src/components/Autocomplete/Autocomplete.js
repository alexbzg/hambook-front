import React from 'react'

import styles from './Autocomplete.module.css'

export default function Hints({ 
    hints, 
    activeHint, 
    onActiveHint, 
    onHintClick, 
    ...props }) {
    
    return (
        <>
        {hints &&
            <ul className={styles.hints}>
                {hints.map( (hint, index) => (
                    <li 
                        key={index}
                        className={activeHint === index ? styles.activeHint : null}
                        onClick={() => onHintClick(hint)}
                        onMouseOver={() => onActiveHint(index)}>
                        {hint}
                    </li>))
                }
            </ul>
        }
        </>
    )
    
    
}
