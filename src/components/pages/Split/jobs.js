import { useState } from "react";

const useJobs = () => {
    const [columns, setColumns] = useState([])

    const handleGoBack = () => {
        setColumns([]);
        setWarningMessage('');
    };

    return {
        handleGoBack,
        state: {
            columns
        }
    }

}

export default useJobs;