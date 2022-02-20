import React from 'react';

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function GetUsers() {

    const [userList, setUserList] = React.useState([]);

    React.useEffect(() => {
        fetch("http://192.168.1.94:8081/getusers", {
          headers: {
            'Authorization': localStorage.getItem('session-id')
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
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