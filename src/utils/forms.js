const handleSubmit = (action) => (e) => {
    e.preventDefault()
    const form = e.target
    const data = Object.fromEntries(Array.from(new FormData(form)).filter(
        (item) => item[1] !== ''))
    for (let idx = 0; idx < form.elements.length; idx++) {
      let el = form.elements[idx]
      if (el.type === 'tel' && el.name in  data) {
        data[el.name] = data[el.name].replace(/ /g, '')
      }
    }
    action(data)
}

const excludeUnset = (data) => Object.fromEntries(Object.entries(data).filter( item => item[1] ))
  
export { handleSubmit, excludeUnset }
