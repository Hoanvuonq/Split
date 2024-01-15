import React from 'react'
import Logo from '../../../assets/img/logo.png'

const Header = () => {
    return (
        <header className='w-full flex justify-between'>
            <div className="w-[200px] all-center py-2">
                <img src={Logo} alt="Logo Infinity" width={100} />
            </div>
        </header>
    )
}

export default Header
