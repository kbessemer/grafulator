import React from 'react';
import { useNavigate } from "react-router-dom";

function GetUsers() {
    
    let navigate = useNavigate();
    const [userList, setUserList] = React.useState([]);

    React.useEffect(() => {
        navigate("../", { replace: true });
      }, [])

    return (
        <div>
        </div>
    )
}

export default GetUsers