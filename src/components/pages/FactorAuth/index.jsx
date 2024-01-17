import React from 'react'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import Factor from '../../layouts/Factor'


const FactorAuth = () => {

    return (
        <div className='w-full h-screen flex justify-between flex-col bg-[#f1f3f5] dark:bg-[#2f3136]'>
            <div className="">
                <Header />
                <Factor />
            </div>
            <Footer />
        </div >
    )
}

export default FactorAuth
