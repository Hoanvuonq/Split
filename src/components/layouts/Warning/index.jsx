import React from 'react'
import WarningIcon from '../../../assets/img/icon-warning.png'

const Warning = () => {
    return (
        <div className="">
            <div className="bg-[#fff6e5] w-[400px] text-yellow-400 font-bold px-4 py-3 rounded flex items-center gap-2" role="alert">
                <img src={WarningIcon} alt="Warning Icon" className='w-7 h-7' />
                <div className="">
                    <p className='text-lg'> Warning</p>
                    <p className='font-normal text-yellow-500'>Ký tự Split không được trống.</p>
                </div>
            </div>
            <span className='warning w-[400px]'></span>
        </div>
    )
}

export default Warning
