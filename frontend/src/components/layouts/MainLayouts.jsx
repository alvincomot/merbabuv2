import React from 'react'
import Navbar from '../navigation/Navbar'
import Footer from '../navigation/Footer'

const MainLayouts = ({ children }) => {
  return (
    <div>
        <Navbar />
        <main>
            {children}
        </main>
        <Footer />
    </div>
  )
}

export default MainLayouts