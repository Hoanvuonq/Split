import React from 'react'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import Split from '../Split'

const Home = () => {
    return (
        <div className='w-full h-screen'>
            <Header />
            <Split />
            <Footer />
        </div >
    )
}

export default Home
