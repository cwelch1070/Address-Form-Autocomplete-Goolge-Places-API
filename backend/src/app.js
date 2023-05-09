// Imports
const express = require('express')
const cors = require('cors')
require('dotenv').config()

// Sets app variable to express library
const app = express()
// Defines what port the server will start on
const port = process.env.PORT

// Tells express to use JSON
app.use(express.json())

// Tells express to use cors
app.use(cors())

// API key and google places and geocode URL's
const apiKey = process.env.API_KEY
const placesURL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
const geoCodeURL = 'https://maps.googleapis.com/maps/api/geocode/json'

// Route
app.post('/places', async (req, res) => {
    // Gets the users input from the HTTP body
    const location = await req.body.address

    /* Description

        Sends a request to the google places autocomplete api 
        with a specified type of address to prevent general 
        predictions such as an entire city or area. This was problematic 
        because there is no single address for an entire area. The 
        componentFilters also requests address that contain a zip code.

    */
    const url = `${placesURL}?input=${location}&type=address&componentFilter=postal_code&key=${apiKey}`

    try {
        // Sends HTTP request to google places api
        const response = await fetch(url)
        // Stores data JSON returned from google api
        const data = await response.json()
        
        // Sends JSON data to client
        res.json(data).status(200)
    } catch (error) {
        // handles error
        res.send(error).status(400)
    }
    
})

/* Description 
    
    This route is needed to get more details about an address
    mainly the postal code. The places autocomplete api does not
    return a postal code or much detail about an address in general

*/
app.post('/geocode', async (req, res) => {
    // Gets placeId from request body
    const placeId = req.body.placeId

    /* Description

        The placeId is sent to this route that is returned from the autocomplete api
        and is sent to the google geocode api with a type of postal_code to again only
        return address that contain a postal code.

    */
    const url = `${geoCodeURL}?place_id=${placeId}&type=postal_code&key=${apiKey}`

    try {
        // Sends request to gecode api
        const response = await fetch(url)

        // Stores returned json in data variable
        const data = await response.json()

        // Sends json to client with status code 200
        res.json(data).status(200)
    } catch (error) {
        // Handles error
        res.send(error).status(400)
    }
})

// Starts Server and listens on specified port
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})