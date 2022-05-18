// GRAFULATOR
// Last Modified: May 17, 2022
// Authored and Developed by: Kyle Bessemer
// LinkedIn: https://www.linkedin.com/in/kyle-bessemer-606a7a1b2/
// GitHub: https://github.com/kbessemer

import React from 'react';
import { useNavigate } from "react-router-dom";

// Sign Out component
function SignOut() {
    // Setup variable for navigation
    let navigate = useNavigate();

    // Do this on screen load
    React.useEffect(() => {
        // Remove session id from browser's local storage
        localStorage.removeItem('session-id');
        // Navigate to index route
        navigate("../", { replace: true });
      }, [])

    // Return statementm returns a blank div
    return (
        <div>
        </div>
    )
}

export default SignOut