import axios from "axios"

export const getCountries = async () => {
  return await axios.get('/countries+states+cities/countries.json')
}

export const getRegions = async (countryId) => {
  return await axios.get(`/countries+states+cities/${countryId}/states.json`)
}

export const getCities = async (countryId, regionId) => {
  return await axios.get(`/countries+states+cities/${countryId}/${regionId}.json`)
}

