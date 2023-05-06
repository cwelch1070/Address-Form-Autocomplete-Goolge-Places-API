import React from 'react'
import Form from './components/Form'

// Main component
export default function App() {
  return (
    <>
      {/* Renders the form */}
      <Form />
    </>
  )
}

/* TODO
  - Alert user when address does not contain all needed information and require reprompt
  - If submit button is clicked alert user which fields still need to be filled out
*/