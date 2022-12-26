const handleSubmit = (action) => (e) => {
    e.preventDefault()
    const data = Object.fromEntries(Array.from(new FormData(e.target)).filter(
        (item) => item[1] !== ''))
    action(data)
}

export { handleSubmit }
