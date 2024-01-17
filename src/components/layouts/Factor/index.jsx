import React from 'react'
import { Button } from "@material-tailwind/react";
import ToastProvider from '../../../hook/ToastProvider';

const Factor = () => {
    const handleSumit = () => {
        ToastProvider('success', 'Submit Code')
    }
    const handleCoppy = () => {
        ToastProvider('success', 'Coppy !!')
    }
    return (
        <div className='w-full all-center flex-col'>
            <div className="w-[800px] h-full flex-col !justify-start flex mt-10 gap-5">
                <textarea
                    rows="4"
                    className="cus-textarea-x block p-3 text-sm outline-0 text-gray-900 bg-gray-50 dark:bg-[#3b3e45] dark:text-white border dark:border-0 border-gray-300 rounded-lg w-[800px] h-[200px] shadow-func-btn"
                    placeholder="BK5V TVQ7 D2RB..."
                />
                <Button onClick={handleSumit} variant="filled" className="bg-[#10b0e7] hover:bg-[#11a5e4] btn transform w-[100px]">Submit</Button>
            </div>
            <div className="w-[800px] h-full flex-col !justify-start flex mt-10 gap-5">
                <textarea
                    rows="4"
                    className="cus-textarea-x block p-3 text-sm outline-0 text-gray-900 bg-gray-50 dark:bg-[#3b3e45] dark:text-white border dark:border-0 border-gray-300 rounded-lg w-[800px] h-[200px] shadow-func-btn"
                    placeholder="ABC|2FA Code"
                />
                <Button onClick={handleCoppy} variant="filled" className="bg-[#10b0e7] hover:bg-[#11a5e4] btn transform w-[100px]">Coppy</Button>
            </div>
        </div>
    )
}

export default Factor
