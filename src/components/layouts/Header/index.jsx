import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Logo from '../../../assets/img/logo.png'
import DarkModeToggle from "react-dark-mode-toggle";

const Header = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => false);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode])

    return (
        <header className='w-full flex bg-white dark:bg-[#202225] justify-between px-10 items-center shadow-custom'>
            <div className="w-[200px] all-center py-2 ml-[174px]">
                <img src={Logo} alt="Logo Infinity" width={100} />
            </div>
            {/* <div className="list-menu  flex gap-2">
                <Link className='font-bold'>Split Text</Link>
                <Link className='font-bold'>2 FA</Link>
            </div> */}
            <div className="flex gap-4 items-center pb-1">
                <div className="shadow-toggle-light rounded-full w-[66px] h-[34px] block dark:hidden">
                    <DarkModeToggle
                        onChange={setIsDarkMode}
                        checked={isDarkMode}
                        size={60}
                        className='mt-[2px] ml-[3px]'
                    />

                </div>
                <div className="shadow-toggle-dark rounded-full w-[66px] h-[34px] hidden dark:block">
                    <DarkModeToggle
                        onChange={setIsDarkMode}
                        checked={isDarkMode}
                        size={60}
                        className='mt-[2px] ml-[3px] '
                    />
                </div>
            </div>
        </header>
    )
}

export default Header
