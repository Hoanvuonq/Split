import React from 'react'
import Logo from '../../../assets/img/logo.png'

const Footer = () => {
    return (
        <footer className="w-full bg-white dark:bg-[#202225] max-w-1600 relative bottom-0 mt-10">
            <div className="max-w-[88%] m-auto flex gap-2 items-center h-10 all-center">
                <a href="#" className="logo ">
                    <img src={Logo} alt="Logo INFINITY" className="!w-[30px] " />
                </a>
                <p className="text-monospace dark:text-white">Coder © 2024 Infinity Software</p>
            </div>
        </footer>
    )
}

export default Footer
