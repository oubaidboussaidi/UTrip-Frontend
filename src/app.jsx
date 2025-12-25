import React from 'react'
import Hero from './sections/Hero.jsx'
import Navbar from "./components/NavBar";
import UserEvents from './sections/UserEvents.jsx'
const App = () => {
  return (
    <>
      <Navbar />
      <Hero/>
      <UserEvents />
    </>
  )
}

export default App