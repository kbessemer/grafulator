import React from 'react';

function GetUsers() {

    const [userList, setUserList] = React.useState([]);

    React.useEffect(() => {
        fetch("http://192.168.1.94:8081/getusers")
          .then(res => res.json())
          .then(
            (result) => {
              setUserList(result.Data);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              console.log(error);
            }
          )
      }, [])

    return (
        <div>
            {userList.map((user, index) => {return ( <p key={index}>{user.username}</p> );})}
        </div>
    )
}

export default GetUsers