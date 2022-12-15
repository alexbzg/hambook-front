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

export const RE_STR_CALLSIGN_FULL = 
    "^([A-Za-z\\d]{1,3}/){0,3}[a-zA-Z]{1,4}\\d{1,3}[a-zA-Z]{1,4}(/[A-Za-z\\d]{1,3}){0,3}$"
export const RE_CALLSIGN_FULL = new RegExp(RE_STR_CALLSIGN_FULL) 

export function validateFullCallsign(text) {
  return RE_CALLSIGN_FULL.test(text)
}

const optional = (validation) => (value) => (value !== 0 &&  !Boolean(value)) || validation(value)

export default {
  email: validateEmail,
  password: validatePassword,
  confirmUserAgreement: value => value,
  current_callsign: optional(validateCallsign),
  phone: optional(validatePhone),
  callsign: validateFullCallsign,
  station_callsign: validateFullCallsign
}


