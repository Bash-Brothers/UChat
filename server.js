
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
var viewPath = path.join(__dirname, '../frontsrc/components/')
app.set('views', viewPath);
app.set("view engine", "js");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));
console.log("- Server created")

// Showing home page
app.get("/", function (req, res) {
    res.render("home");
});

// // Showing secret page
// app.get("/secret", isLoggedIn, function (req, res) {
//     res.render("secret");
// });

// Showing secret page
app.get("/chat", function (req, res) {
    res.render("ChatWindow");
});

// Showing signup form
app.get("/signup", function (req, res) {
    res.render("SignupPage");
});

// Handling new user signup
app.post("/signup", function (req, res) {
    var name = req.body.name
    var username = req.body.username
    var password = req.body.password
    console.log("new user: ")
    console.log("   name = ", name);
    console.log("   username = ", username);
    console.log("   password = ", password);

    addUser(name, username, password).catch(console.dir);

});

//Showing login form
app.get("/LoginPage", function (req, res) {
    res.render("LoginPage");
});

// Handling user login - if we use passport, this can go in the custom callback function
app.post("/LoginPage", async(req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    console.log("attempt to log in : ")
    console.log("   username = ", username);
    console.log("   password = ", password);

    try{
        successCode = await loginUser(username, password);      // loginUser does all the checking

        console.log("successCode = ", successCode)
        if (successCode == 0)       
        {
            console.log("- Successful login confirmed");      
            console.log("- Redirecting to secret page");      
            res.redirect("/secret");
        }
        else if (successCode==1 || successCode == 2)
        {
            console.log("- Unsuccessful login confirmed");
            res.redirect("");
        }
    }    
    catch (err)
    {
        console.log(err);
    }   
})

//Handling user logout
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) return next();
//     res.redirect("/login");
// }

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
        if (user.password == password)
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


// function that adds a new user to the database - should be called by /register
async function addUser(name, username, password)
{
    MongoClient.connect(uri, async function(err, db) {
        if (err) throw err;
        console.log("- Connected to Database for user creation")

        var dbo = db.db("test_db");
        user_data = dbo.collection("user_data");

        var new_user = { name: name, username: username, password: password };

        try{
        prev_user = await user_data.findOne({username: username});   // checks for previous user with given name

        console.log("prev user = ", prev_user);

        if (prev_user != null) throw "username taken";              // if the prev_user is already present

        user_data.insertOne(new_user, 
            function(err, res) 
            {
                if (err) throw err;
                console.log("- New user added");
            }
        );

        }
        finally{
            db.close();
            console.log("Database closed")
        }
    }); 
}

function main()
{
    var port = process.env.PORT || 3000;
    app.listen(port, function () {
        console.log("Server Has Started!");
    });

}
main();