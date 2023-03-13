import axios from "axios"

export const getCountries = async () => {
  const rsp = await axios.get('/geonames_cache/countries.json')
  return rsp.data
}

export const getRegions = async (countryId) => {
  try {
    const rsp = await axios.get(`/geonames_cache/${countryId}/regions.json`)
    return rsp.data
  } catch {
    return []
  }
}

export const getRegionData = async (countryId, regionId) => {
  try {
    const rsp = await axios.get(`/geonames_cache/${countryId}/${regionId}.json`)
    return rsp.data
  } catch {
    return {districts: [], cities: []}
  }
}

