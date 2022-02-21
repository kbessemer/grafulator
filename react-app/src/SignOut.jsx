import React from 'react';
import { useNavigate } from "react-router-dom";

function GetUsers() {
    
    let navigate = useNavigate();

    React.useEffect(() => {
        localStorage.removeItem('session-id');
        navigate("../", { replace: true });
      }, [])

    return (
        <div>
        </div>
    )
}

export default GetUsers