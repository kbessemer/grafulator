// GRAFULATOR
// Last Modified: March 3, 2022
// Authored and Developed by: Kyle Bessemer
// LinkedIn: https://www.linkedin.com/in/kyle-bessemer-606a7a1b2/
// GitHub: https://github.com/kbessemer

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