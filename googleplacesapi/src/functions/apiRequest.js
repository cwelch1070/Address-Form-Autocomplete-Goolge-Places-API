// 
const apiPlaces = process.env.REACT_APP_API_PLACES
const apiGeocode = process.env.REACT_APP_API_GEOCODE

// Sends request to custom node api
export const getAddresses = async (address) => {
    const res = await fetch(apiPlaces, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({ 
      address: address
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

   // Stores data returned from api
   const data = await res.json()
   
  // Return the json data
   return data.predictions
}

// Sends placeId from places api to geocode api to get details about location
export const getAddressDetails = async (placeId) => {
    // Sends request to node api 
    const res = await fetch(apiGeocode, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        placeId: placeId
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Stores json in data variable
    const data = await res.json()

    // Returns the json data 
    return data
}
