import React from 'react'
import Logo from '../../../assets/img/logo.png'

const Footer = () => {
    return (
        <footer className="w-full bg-[#ededed] max-w-1600 relative bottom-0">
            <div className="max-w-[80%] m-auto flex gap-2 items-center h-10 all-center">
                <a href="#" className="logo ">
                    <img src={Logo} alt="Logo INFINITY" className="!w-[30px] " />
                </a>
                <p className="text-monospace">Copyright © 2023 Infinity Software</p>
            </div>
        </footer>
    )
}

export default Footer
