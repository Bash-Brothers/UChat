// Fetch to server side to check if the cookie stores the user name
// can be imported and used wherever required
const isLoggedIn =  async () => {
    console.log("inside isLoggedIn")
    const result = await fetch("/auth", 
               {
                method: 'GET',
                headers: {'Content-Type': "application/json; charset=utf-8",},
                mode:'cors',
                })

    const res = await result.json();
    console.log("returning from IsLoggedIn ", res.loggedIn);
    return res.loggedIn; // returns a boolean true/false
  };

export { isLoggedIn };
