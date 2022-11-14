/**
 * basic email validation 
 * to be impoved
 * @param {String} text - email to be validated
 * @return {Boolean}
 */
export function validateEmail(text) {
  return text?.indexOf("@") !== -1
}

/**
 * Ensures password is at least a certain length
 *
 * @param {String} password - password to be validated
 * @param {Integer} length - length password must be as long as
 * @return {Boolean}
 */
export function validatePassword(password, length = 8) {
  return password?.length >= length
}

export function validateCallsign(text) {
  return /^[a-zA-Z]{1,4}\d{1,3}[a-zA-Z]{1,4}$/.test(text)
}

export function validatePhone(text) {
  return /^\+\d{11}$/.test(text) 
}

export default {
  email: validateEmail,
  password: validatePassword,
  confirmUserAgreement: value => value,
  current_callsign: value => value === null || value.length === 0 || validateCallsign(value),
  phone: value => value === null || value.length === 0 || validatePhone(value)
}


