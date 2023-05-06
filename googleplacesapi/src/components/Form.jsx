import React, { useState } from 'react'
import { getAddressDetails, getAddresses } from '../functions/apiRequest'

// Renders alert that the address provided is not a address
function Alert({ invalid }) {
    return (
        <>
            {/* If invalid is true display the bellow html */}
            {invalid && (
                <div className='flex flex-col items-center bg-red-600 w-5/12 rounded p-1'>
                    <p className='text-white font-bold'>Entry not valid! Not an address</p>   
                </div>
            )}
        </>
    )
}

// Renders the Form
export default function Form() {
    // State Variables
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [places, setPlaces] = useState([])
  const [invalid, setInvalid] = useState(false)

  // Function to handle input
  const handleAddress = async (e) => {
    // Sets state of address to users input
    setAddress(e.target.value)

    // Makes sure state is not empty before sending request(prevents adding blank space)
    if(address !== '') {
      try {
        // Sends text to api and returns results
        const data = await getAddresses(address)

        // Sets the places state to predictions returned from getAddresses()
        setPlaces(data)
      } catch (error) {
        console.log(`Failed to get addresses from api: ${error}`)
      }
      
      // Clear all fields and predictions when address field is cleared
      if(e.target.value === '') {
            setPlaces([])
            setCity('')
            setState('')
            setZip('')
            setInvalid(false)
      }
    }
  } 

  /* Description
    
    The placeId that is clicked is passed to this function which
    calls another route on the node server that makes another request
    to the google api. However, this time it is passed to the geocode
    api endpoint to get more details about the location. Example: zipcode

  */
  const handleClick = async (placeId) => {
    // Store the return from getAddressDetails()
    let data = {}
    try {
      // Calls functions to get details about selected address
      // Stores return from function in data variable
      data = await getAddressDetails(placeId)
    } catch (error) {
      console.log(`An error occured with the request to get address details: ${error}`)
    }

    try {
      // Trims down the json returned to only the address components
      const addressComponent = data.results[0].address_components

      // Finds the route and if it exists it gets set to route
      const routeComponent = addressComponent.find(component => component.types.includes('route'))
      // const route = routeComponent ? routeComponent.long_name : null
      const route = routeComponent.long_name ?? 'No address found'

      // Finds the locality and if it exits sets it to locality
      const localityComponent = addressComponent.find(component => component.types.includes('locality'))
      const locality = localityComponent ? localityComponent.long_name : null

      // Finds the state and if it exits sets it to state
      const stateComponent = addressComponent.find(component => component.types.includes('administrative_area_level_1'))
      const state = stateComponent ? stateComponent.long_name : null
      
      // Search through the components to find the postal_code type
      // If the postal code exists the long_name associated with it is set to the postalCode variable
      const postalCodeComponent = addressComponent.find(component => component.types.includes('postal_code'))
      const postalCode = postalCodeComponent ? postalCodeComponent.long_name : null
      
      // If any of the conditions for the fields aren't met set invalid to true
      if(!route || !locality || !state || !postalCode) {
        // When invalid is set to true it triggers the alert component 
        // to instruct the user to enter an actual address
        setInvalid(true)
      } else {
        // Checks if the value is null to prevent state from being set to null value
        route ? setAddress(route) : setAddress('No address found')
        locality ? setCity(locality) : setCity('No city found')
        state ? setState(state) : setState('No state found')
        postalCode ? setZip(postalCode) : setZip('No postal code found')
      }
      

      // Clears the state of places after function runs
      setPlaces([])
    } catch (error) {
      console.error(`An error occured processing the data: ${error}`)
    }
  }

  // Gets any changes to city field
  const handleCity = (e) => {
    setCity(e.target.value)
  }

  // Gets any changes to state field
  const handleState = (e) => {
    setState(e.target.value)
  }

  // Gets any changes to zip code field
  const handleZip = (e) => {
    setZip(e.target.value)
  }

  return (
    <div className='flex flex-col justify-center items-center mt-32'>
        <div className='flex flex-col justify-center items-center w-1/2'>
            {/* If invalid is true render Alert component */}
            <Alert invalid={invalid}/>
            <form className='flex flex-col items-center w-96 border-2 mt-2'>
                <input className='w-full p-2' type='text' value={address} onChange={handleAddress} placeholder="Address"></input>
                {/* Renders predictions from api */}
                {places.map(place => (
                <div className='w-full' key={place.place_id}>
                    <p className='hover:bg-slate-200 justify-center items-center' onClick={() => handleClick(place.place_id)}>{place.description}</p>
                </div>
                ))}
                <input className='w-full p-2' type='text' value={city} onChange={handleCity} placeholder="City"></input>
                <input className='w-full p-2' type='text' value={state} onChange={handleState} placeholder="State"></input>
                <input className='w-full p-2' type='text' value={zip} onChange={handleZip} placeholder="Zip Code"></input>
            </form>
            <button className='bg-blue-700 text-white font-bold py-2 px-16 rounded mt-2' type='submit' disabled={!address || !city || !zip}>Submit</button>
        </div>
    </div>
  );
}