const DATE_FORMAT = new Intl.DateTimeFormat('default', 
    {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })

export function formatDate(str) {
  return DATE_FORMAT.format(new Date(str))
}
