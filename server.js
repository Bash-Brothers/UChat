var express = require("express"),
    bodyParser = require("body-parser"),
    MongoClient = require('mongodb').MongoClient,
    cookieSession = require('cookie-session'),     
    path = require('path');  


// the link to the database along with username and password for the db - can be copied off Mongo's connection page 
const uri = "mongodb+srv://sudhanshu:aQDJZTTc6CO5Htrb@cluster0.xkm5f.mongodb.net/test_db?retryWrites=true&w=majority";
// create instance of mongo client 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("- Client created")
 
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
    name: 'session',
    secret: "Don't use trays",
    maxAge: 3600000, // 1 hour
    username: null,
  }))

console.log("- Server created")


// all isLoggedIn calls are redirected here
app.get("/auth", function(req, res){
    console.log("inside auth");
    console.log("cookie username = ", req.session.username);
    if(req.session.username != null) //inspect cookie username value
    {
        res.json({loggedIn: true});
    }
    else 
    {
        res.json({loggedIn: false});
    }
});


// Handling new user signup
app.post("/signup", async function (req, res) {
    var name = req.body.name
    var username = req.body.username
    var password = req.body.password
    var password_confirm = req.body.password_confirm;

    var successCode = 0;
    if(username.length == 0 || password.length == 0)
    {
        console.log("Username and Password must be non-empty");
        successCode = 2;
    }

    if (password_confirm != password)
    {
        console.log("Passwords do not match");
        successCode = 3;
    }

    if (successCode != 0)
    {
        return res.json({successCode: successCode});
    }

    console.log("new user: ")
    console.log("   name = ", name);
    console.log("   username = ", username);
    console.log("   password = ", password);

    successCode = await addUser(name, username, password);
    return res.json({successCode: successCode});   

});


// Handling user login
app.post("/login", async(req, res) => {

    console.log("login submitted, cookie username= ", req.session.username);

    var username = req.body.username;   // entered user name
    var password = req.body.password;   // entered password

    console.log("attempt to log in : ")
    console.log("   username = ", username);
    console.log("   password = ", password);


    successCode = await loginUser(username, password);      // loginUser does all the checking
    console.log("successCode = ", successCode)
    
    if (successCode == 0)
    {
        req.session.username = username;
        console.log("cookie session  username = ", req.session.username );
    }
    else 
    {
        req.session.username = null;
        console.log("cookie session  username = ", req.session.username );
    }

    return res.json({successCode: successCode});
})


async function loginUser(username, password)
{
    console.log("Inside loginUser")
    var returnCode = 0;
    try{
        db = await MongoClient.connect(uri)
        console.log("- Connected to database for user login")

        var dbo = db.db("test_db");
        user_data =  dbo.collection("user_data");

        user = await user_data.findOne({username: username});

        console.log("true user = ", user);

        if (user == null) 
        {
            console.log("user not found");
            returnCode =2;                      // code 2 : user not found
        }
        else if (user.password == password)
        {
            console.log("login successful");
            returnCode=0;                       // code 0 : success
        }
        else 
        {
            console.log("wrong password");
            returnCode=1;                       //code 1 : wrong password
        }       
    }
    catch (err)
    {
        returnCode = 3;                         // code 3: database errors
        console.log(err);
    }
    finally
    {
        db.close();
        console.log("- Database closed")
        console.log("return code = ", returnCode);
        return returnCode;
    }
}

/*helper functions:
function friendStatus(username1, username2);
    returns 0 if the users are "strangers"
    returns 1 if the users are pending friends
    returns 2 if the users are already friends
function findUsers(substring);
    returns an array of usernames that contain substring
function findUsersNames(substring);
    same as findUsers but returns names;
function getName(username);
    returns the full name of a user given a username
function sendFriendRequest(user1, user2);
    user1 now has a pending request, user2 now has a pending invitation (user1 sent to user2)
*/ 

//FUNCTION: friends Status: 4 outputs
//from user1's perspective, what is the friend status of user2? 
//-1 - error, 0 - not friends at all, 1- pending friends, 2- friends already
function friendStatus(username1, username2){
    retvar = -1;
    try
    {
    db = MongoClient.connect(uri);
    console.log("Connected to Database for lookup")

    var dbo = db.db("test_db");
    user_data = dbo.collection("user_data");

    user1Notifs = user_data.findOne({username: username1},{notifs: 1});
    user1Friends = user_data.findOne({username: username2},{username: 1});
    if(user1Notifs.contains(username2) && user1Friends.contains(username2)){
        console.log("Issue: The user ", username1, "did not have their notifs scrubbed correctly");
        retvar = -1;
    }
    else if(user1Notifs.contains(username2)){
        retvar = 1;
    }
    else if(user1Friends.contains(username2)){
        retvar = 2;
    }
    else{
        retvar = 0;
    }

    }
    catch (err)
    {
        console.log(err);
        returnCode = 1;
    }
    finally
    {
        db.close();
        console.log("Database closed")
        console.log("Return code = ", returnCode);
        return retvar;
    }
}

//returns an array of usernames that match substring
function findUsers(substring){
    matchingusers = [];
    try
    {
    db = MongoClient.connect(uri);
    console.log("Connected to Database for lookup")

    var dbo = db.db("test_db");
    user_data = dbo.collection("user_data");

    matchingUsers = user_data.find( { username: {$regex: substring}}, {username: 1} );
    matchingUsers.toArray();
    console.log("found users: ", matchingUsers);
    
    }
    catch (err)
    {
        console.log(err);
        returnCode = 1;
    }
    finally
    {
        db.close();
        console.log("Database closed")
        console.log("Return code = ", returnCode);
        return matchingUsers;
    }
}
//FUNCTION: returns array of names based on username substr
function findUsersNames(substring){
    nameslist = [];
    userlist = findUsers(substring);
    for(const item in userlist){
        nameslist.push(item);
    }
    console.log("Query for names");
    return nameslist;
}

function getName(usernameID){
    matchingUserName = "";
    try
    {
    db = MongoClient.connect(uri);
    console.log("Connected to Database for lookup")

    var dbo = db.db("test_db");
    user_data = dbo.collection("user_data");

    matchingUserName = user_data.findOne( { username: usernameID}, {name: 1} );
    }
    catch (err)
    {
        console.log(err);
        returnCode = 1;
    }
    finally
    {
        db.close();
        console.log("Database closed")
        console.log("Return code = ", returnCode);
        return matchingUserName;
    }
}

// function that adds a new user to the database - should be called by /signup
async function addUser(name, username, password)
{
    console.log("Inside add user");
    var returnCode = 0;
    try
    {
    db = await MongoClient.connect(uri);
    console.log("- Connected to Database for user creation")

    var dbo = db.db("test_db");
    user_data = dbo.collection("user_data");

    var new_user = { name: name, username: username, password: password, friends: {}, notifs: {}};

    // Add list of notifications containing notification objects with necessary info?


    prev_user = await user_data.findOne({username: username});   // checks for previous user with given name

    console.log("prev user = ", prev_user);

    if (prev_user != null) // if the prev_user is already present
    {
        throw "username taken";
    }

    user_data.insertOne(new_user, 
        function(err, res) 
        {
            console.log("- New user added");
        }
    );

    }
    catch (err)
    {
        console.log(err);
        returnCode = 1;
    }

    finally
    {
        db.close();
        console.log("Database closed")
        console.log("Return code = ", returnCode);
        return returnCode;
    }
 
}
// handling user signout
app.post("/settings/signout", async(req, res) => {

    console.log("logout submitted, cookie username= ", req.session.username);
    console.log("attempt to log out")

    req.session.username = null;
    res.redirect('/login');
})



function main()
{
    var port = process.env.PORT || 5000;
    app.listen(port, function () {
        console.log("Server Has Started!");
    });

}
main();