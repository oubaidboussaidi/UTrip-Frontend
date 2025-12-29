import React from 'react'
import Hero from './sections/Hero.jsx'
import Navbar from "./components/NavBar";
import UserEvents from './sections/UserEvents.jsx'
import AppDownload from './sections/AppDownload.jsx'
import Footer from './components/Footer.jsx'
const App = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <UserEvents />
      <AppDownload />
      <Footer />
    </>
  )
}

export default App