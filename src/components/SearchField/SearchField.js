import { forwardRef, useRef, useState, useEffect, useCallback } from "react"

import { FormField } from ".."

import styles from "./SearchField.module.css"

import buttonClearImg from "../../assets/img/icons/clear.svg"
import buttonSearchImg from "../../assets/img/icons/search_grey.svg"

const SearchField = forwardRef(({ searchExpression, onSearch, onChange, searchTitle, ...props }, 
    ref) => {

    const fallbackRef = useRef()
    const searchInputRef = ref ?? fallbackRef

    const [_searchExpression, set_searchExpression] = useState(searchExpression)

    useEffect(() => {
        set_searchExpression( (state) => {
            if (state !== searchExpression) {
                searchInputRef.current.value = searchExpression
                state = searchExpression
            }
            return state
        })
    }, [searchExpression])

    const onSubmit = (e) => {
      e.preventDefault()
      onSearch(_searchExpression || undefined)
    }

    const onClear = (e) => {
      set_searchExpression(undefined)
      searchInputRef.current.value = ''
      onSearch(undefined)
    }

    const handleChange = useCallback( (e) => {
        set_searchExpression(e.target.value)
        onChange?.(e)
    }, [onChange])

    return (
        <form onSubmit={onSubmit}>
            <FormField
                ref={searchInputRef}
                name="search"
                type="text"
                autoComplete="off"
                onChange={handleChange}
                postInputContent={(
                    <>
                        <img
                            id={styles.buttonSearch}
                            onClick={(e) => e.target.closest('form').requestSubmit()}
                            src={buttonSearchImg}
                            title={searchTitle ??  "Search"}
                            alt={`${searchTitle ?? 'Search'} button`}/>
                        {_searchExpression &&
                        <img
                            id={styles.buttonDelete}
                            src={buttonClearImg}
                            onClick={onClear}
                            title="Clear input"
                            alt="Clear input button"/>
                        }
                    </>
                )}
                {...props}
            />
            <input type="submit" hidden/>
        </form>
    )
})


export default SearchField
