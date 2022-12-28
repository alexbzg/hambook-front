const handleSubmit = (action) => (e) => {
    e.preventDefault()
    const data = Object.fromEntries(Array.from(new FormData(e.target)).filter(
        (item) => item[1] !== ''))
    action(data)
}

const excludeUnset = (data) => Object.fromEntries(Object.entries(data).filter( item => item[1] ))
  
export { handleSubmit, excludeUnset }
