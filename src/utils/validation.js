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

export function validatePhone(text) {
  return /^\+\d{11}$/.test(text) 
}

export const RE_STR_CALLSIGN_FULL = "^(:?[A-Za-z\\d]+/)?\\d*[A-Za-z]+\\d+[A-Za-z]+(:?/[A-Za-z\\d]+)*$"
const RE_CALLSIGN_FULL = new RegExp(RE_STR_CALLSIGN_FULL) 

export function validateFullCallsign(text) {
  return RE_CALLSIGN_FULL.test(text)
}

export const RE_STR_CALLSIGN = "^\\d*[A-Za-z]+\\d+[A-Za-z]+$"
const RE_CALLSIGN = new RegExp(RE_STR_CALLSIGN) 

export function validateCallsign(text) {
  return RE_CALLSIGN.test(text)
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


