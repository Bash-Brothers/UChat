var express = require("express"),
    bodyParser = require("body-parser"),
    MongoClient = require('mongodb').MongoClient;     
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
app.use(require("express-session")({
    secret: "this is a secret",
    resave: false,
    saveUninitialized: false,
    username: null,
}));
console.log("- Server created")

// // Showing secret page
// app.get("/secret", isLoggedIn, function (req, res) {
//     res.render("secret");
// });


// Handling new user signup
app.post("/signup", async function (req, res) {
    var name = req.body.name
    var username = req.body.username
    var password = req.body.password
    var password_confirm = req.body.password_confirm;

    if(username.length == 0 || password.length == 0)
    {
        console.log("Username and Password must be non-empty");
        // set some react app state for the code 2 
        res.redirect("/signup");
    }

    if (password_confirm != password)
    {
        console.log("Passwords do not match");
        // set some react app state for the code 3
        res.redirect("/signup")
    }

    console.log("new user: ")
    console.log("   name = ", name);
    console.log("   username = ", username);
    console.log("   password = ", password);

    var successCode = await addUser(name, username, password);
    if (successCode == 0)
    {
        console.log("successCode = ", successCode, " \n successful registration confirmed, redirecting to login");
        // set some react app state for the code 0
        res.redirect("/login");
    }
    else
    {
        console.log("succesCode = ", successCode, " \n registration unsuccessful, redirecting back to signup");
        // set some react app state for the code 1
        res.redirect("/signup");
    }
    

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
        console.log("- Successful login confirmed"); 

        console.log("cookie before trying to update: ", req.session.username);
        req.session.username = username;
        console.log("cookie username after update = ", req.session.username);

        res.redirect("/chats");
    }
    else if (successCode==1 || successCode == 2)
    {
        console.log("- Unsuccessful login confirmed");
        res.redirect("/login");
    }
    
})

function isLoggedIn(req, res, next) 
{   
    const username = req.session.username;
    console.log("inside isLoggedIn, session username = ", username);
    if (username != null) 
    {   console.log("- Redirecting to secret page");      
        return next();
    }
    console.log("- User not logged in, redirecting to login")
    res.redirect("/login");
}
async function loginUser(username, password)
{
    console.log("Inside loginUser")
    let returnCode;
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
            returnCode=0;                       // code 0: success
        }
        else 
        {
            console.log("wrong password");
            returnCode=1;                       //code 1: wrong password
        }       
    }
    catch (err)
    {
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

    var new_user = { name: name, username: username, password: password };

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

function main()
{
    var port = process.env.PORT || 5000;
    app.listen(port, function () {
        console.log("Server Has Started!");
    });

}
main();