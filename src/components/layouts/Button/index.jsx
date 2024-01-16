import React from 'react';
import { Button } from "@material-tailwind/react";

const ButtonFunc = ({ onClick, img }) => {
    return (
        <Button variant="filled" onClick={onClick} className="bg-[#10b0e7] hover:bg-[#11a5e4] btn transform">
            <img src={img} alt={`Icon`} width={18} />
        </Button>
    );
};

export default ButtonFunc;
