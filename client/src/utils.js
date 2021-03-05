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


// Function which returns info about the user specified, 
// otherwise about the user currently logged in
// by first checking the cookie to retrieve the appropriate username 
// and then querying the database
const getUserInfo = async (username = null) => {
  console.log("inside getUserInfo");

  // find which user is logged in
  let userResult;
  if (username == null)
  {
    const userResult = await fetch("/info", 
              {
                method: 'GET',
                headers: {'Content-Type': "application/json; charset=utf-8",},
            })
    const res = await userResult.json();
    username = res.username;
  }

  console.log("Username to lookup = ", username);

  // get the info about that user
  const result = await fetch("/info/"+username, 
              {
                method: 'GET',
                headers: {'Content-Type': "application/json; charset=utf-8",},
                mode:'cors',
            })

  const userInfo = await result.json();

  if(userInfo.returnCode != 0)
  {
    return -1;
  }

  return userInfo.info;
}

export { isLoggedIn, getUserInfo };
