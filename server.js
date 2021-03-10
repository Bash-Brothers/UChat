const { response } = require("express");
var express = require("express"),
    bodyParser = require("body-parser"),
    MongoClient = require('mongodb').MongoClient,
    cookieSession = require('cookie-session'),
    path = require('path'),
    { v4: uuidv4 } = require('uuid');


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
app.get("/auth", function (req, res) {
    console.log("inside auth");
    console.log("cookie username = ", req.session.username);
    if (req.session.username != null) //inspect cookie username value
    {
        res.json({ loggedIn: true });
    }
    else {
        res.json({ loggedIn: false });
    }
});


// Handling new user signup
app.post("/signup", async function (req, res) {
    var name = req.body.name
    var username = req.body.username
    var password = req.body.password
    var password_confirm = req.body.password_confirm;

    var successCode = 0;
    if (username.length == 0 || password.length == 0) {
        console.log("Username and Password must be non-empty");
        successCode = 2;
    }

    if (password_confirm != password) {
        console.log("Passwords do not match");
        successCode = 3;
    }

    if (successCode != 0) {
        return res.json({ successCode: successCode });
    }

    console.log("new user: ")
    console.log("   name = ", name);
    console.log("   username = ", username);
    console.log("   password = ", password);

    successCode = await addUser(name, username, password);
    return res.json({ successCode: successCode });

});


// Handling user login
app.post("/login", async (req, res) => {

    console.log("login submitted, cookie username= ", req.session.username);

    var username = req.body.username;   // entered user name
    var password = req.body.password;   // entered password

    console.log("attempt to log in : ")
    console.log("   username = ", username);
    console.log("   password = ", password);


    successCode = await loginUser(username, password);      // loginUser does all the checking
    console.log("successCode = ", successCode)

    if (successCode == 0) {
        req.session.username = username;
        console.log("cookie session  username = ", req.session.username);
    }
    else {
        req.session.username = null;
        console.log("cookie session  username = ", req.session.username);
    }

    // alert('success');

    return res.json({ successCode: successCode });
})

// Handling the sending of a 
//pass in true for response to signify accepted request
app.get("/findusers/:substring", async (req, res) => {

    curUser = req.session.username
    console.log(req.session.username, " is searching for users");
    console.log(req.params.substring, " is the entered substring");
    //var friendname = req.body.username;   // entered name of person who sent friend req

    users = await findUsers(req.params.substring);
    //console.log("In get method, received original users:")
    //console.log(users)

    listOfUsernames = []
    //extract just the usernames from the list of dicts
    for (var i in users) {
        dict = users[i]
        status = await friendStatus(dict['username'], curUser)
        listOfUsernames.push({ user: dict['username'], addstatus: status })
    }
    console.log('final list')
    console.log(listOfUsernames)

    successCode = 0
    if (users = -1) {
        successCode = -1;
    }

    return res.json({ successCode: successCode, users: listOfUsernames });
})

//returns an array of usernames that match substring
async function findUsers(substring) {
    matchingusers = [];
    try {
        db = await MongoClient.connect(uri);
        console.log("Connected to Database for lookup of substring", substring)

        var dbo = db.db("test_db");
        user_data = dbo.collection("user_data");

        matchingUsers = await user_data.find({ username: { $regex: substring } });
        matchingUsers = await matchingUsers.toArray();

        console.log("found users");

    }
    catch (err) {
        console.log(err);
        return -1;
    }
    finally {
        db.close();
        console.log("Database closed");
        return matchingUsers;
    }
}

app.post("/sendfriendrequest", async (req, res) => {

    console.log(req.session.username, " sent a friend request");

    var username = req.body.username; // user sending the request
    var friendname = req.body.friendname;   // user receiving the request

    console.log(username, "is sending a friend request to ", friendname);
    // console.log("   request changed = ", friendname);
    // console.log("   response = ", response);

    // Here, as opposed to backend login functionality, no checking of the submitted data needs to be done
    // Username is already confirmed to be in database during login page checking
    // There are only 2 options: Accept and Delete
    successCode = await sendFriendRequest(username, friendname);

    return res.json({ successCode: successCode });
})











//this post function handles a RESPONSE to a friend request, contained in the response field as true (accepted) or false (rejected)
app.post("/handlefriendrequest", async (req, res) => {

    console.log(req.session.username, " responded to friend request");

    var username = req.body.curUser; // entered username
    var friendname = req.body.curfriendreq;   // entered name of person who sent friend req
    var response = req.body.response;   // entered user's response

    console.log("In the friend request list of ", username);
    console.log("   request changed = ", friendname);
    console.log("   response = ", response);

    // Here, as opposed to backend login functionality, no checking of the submitted data needs to be done
    // Username is already confirmed to be in database during login page checking
    // There are only 2 options: Accept and Delete
    if (response === true) {
        console.log("Friend request accepted", username);
        successCode = await confirmFriend(username, friendname);
    }
    await removeFriendRequest(username, friendname);

    return res.json({ successCode: successCode });
})


// handling user signout
app.post("/settings/signout", async (req, res) => {

    console.log("logout submitted, cookie username= ", req.session.username);
    console.log("attempt to log out")

    req.session.username = null;
    res.redirect('/login');
})



function main() {
    var port = process.env.PORT || 5000;
    app.listen(port, function () {
        console.log("Server Has Started!");
    });

}
main();


/*
HELPER FUNCTIONS
*/

/*Initial user handling, creation helpers*/

async function loginUser(username, password) {
    console.log("Inside loginUser")
    var returnCode = 0;
    try {
        db = await MongoClient.connect(uri)
        console.log("- Connected to database for user login")

        var dbo = db.db("test_db");
        user_data = dbo.collection("user_data");

        user = await user_data.findOne({ username: username });

        console.log("true user = ", user);

        if (user == null) {
            console.log("user not found");
            returnCode = 2;                      // code 2 : user not found
        }
        else if (user.password == password) {
            console.log("login successful");
            returnCode = 0;                       // code 0 : success
        }
        else {
            console.log("wrong password");
            returnCode = 1;                       //code 1 : wrong password
        }
    }
    catch (err) {
        returnCode = 3;                         // code 3: database errors
        console.log(err);
    }
    finally {
        db.close();
        console.log("- Database closed");
        console.log("return code = ", returnCode);
        return returnCode;
    }
}

// function that adds a new user to the database - should be called by /signup
async function addUser(name, username, password) {
    console.log("Inside add user");
    var returnCode = 0;
    try {
        db = await MongoClient.connect(uri);
        console.log("- Connected to Database for user creation")

        var dbo = db.db("test_db");
        user_data = dbo.collection("user_data");

        var new_user = { name: name, username: username, password: password, chats: [], friends: [], notifs: [], pendingfr: [] };

        // Add list of notifications containing notification objects with necessary info?


        prev_user = await user_data.findOne({ username: username });   // checks for previous user with given name

        console.log("prev user = ", prev_user);

        if (prev_user != null) // if the prev_user is already present
        {
            throw "username taken";
        }

        user_data.insertOne(new_user,
            function (err, res) {
                console.log("- New user added");
            }
        );

    }
    catch (err) {
        console.log(err);
        returnCode = 1;
    }

    finally {
        db.close();
        console.log("Database closed");
        console.log("Return code = ", returnCode);
        return returnCode;
    }

}

async function userInfo(username) {

    console.log("Inside server.js/userInfo");
    let returnCode;
    let info;
    try {
        db = await MongoClient.connect(uri);
        console.log("- Connected to Database for user info lookup")

        var dbo = db.db("test_db");
        user_data = dbo.collection("user_data");

        user = await user_data.findOne({ username: username }, { name: true, username: false, password: false, friends: true, notifs: true, pendingfr: true });

        if (user == null) {
            console.log("User not found")
            returnCode = 1;
            return;
        }

        info = user;
        returnCode = 0;

    }
    catch (err) {
        console.log(err);
        returnCode = 2;
    }

    finally {
        db.close();
        console.log("Database closed");
        console.log("Return code = ", returnCode);

        return { returnCode: returnCode, info: info };
    }


}

// endpoint to check who the current user is
app.get("/info", async (req, res) => {
    const username = req.session.username;
    console.log("inside /info, username = ", username);
    res.send({ username: req.session.username });
})

// endpoint to retrieve all the user info
app.get("/info/:username", async (req, res) => {
    const username = req.params.username;

    info = await userInfo(username);


    if (info.returnCode != 0) {
        res.send({ returnCode: returnCode, info: null });
    }

    info = await info.info;

    res.send({ returnCode: 0, info: info });

});


/*FRIEND helper functions:
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
async function friendStatus(username1, username2) {
    retvar = -1;
    try {
        db = await MongoClient.connect(uri);
        console.log("Connected to Database for lookup")

        var dbo = db.db("test_db");
        user_data = dbo.collection("user_data");

        //note to devs, we need this to happen at the same time incase of possible changes at the same time
        //note, also please handle the pendingfr
        user1status = await user_data.findOne({ username: username1 }, { notifs: 1, friends: 1 });
        user2status = await user_data.findOne({ username: username2 }, { notifs: 1, friends: 1, });

        if (user1status.notifs.includes(username2) && user2status.notifs.includes(username1)) {
            console.log("Issue: The user did not have their notifs scrubbed correctly");
            retvar = -1;
        }
        else if (user1status.friends.includes(username2) || user2status.friends.includes(username2)) {
            //already friends
            retvar = 2;
        }
        else if (user1status.notifs.includes(username2) || user2status.notifs.includes(username1)) {
            //already pending a fr
            retvar = 1;
        }
        else {
            retvar = 0;
        }

    }
    catch (err) {
        console.log(err);
        returnCode = 1;
    }
    finally {
        db.close();
        console.log("Database closed");
        console.log("Return code = ", retvar);
        return retvar;
    }
}

async function getName(usernameID) {
    matchingUserName = "";
    try {
        db = MongoClient.connect(uri);
        console.log("Connected to Database for lookup")

        var dbo = db.db("test_db");
        user_data = dbo.collection("user_data");

        matchingUserName = await user_data.findOne({ username: usernameID }, { name: 1 });
    }
    catch (err) {
        console.log(err);
        returnCode = 1;
    }
    finally {
        db.close();
        console.log("Database closed");
        console.log("Return code = ", returnCode);
        return matchingUserName;
    }
}



//FUNCTION: returns array of names based on username substr
async function findUsersNames(substring) {
    nameslist = [];
    userlist = findUsers(substring);
    for (const item in userlist) {
        nameslist.push(item);
    }
    console.log("Query for names");
    return nameslist;
}


/*NOTE: this function will test to make sure that their status is valid for posterity. Frontent should prevent this check from
 ever happening by preventing a button push if they are already related*/
async function sendFriendRequest(username1, username2) {
    status = await friendStatus(username1, username2);
    if (status !== 0) {
        console.log("Notice: Attempted to send invalid friend req");
        return -1;
    }
    try {
        db = await MongoClient.connect(uri);
        console.log("Connected to Database for lookup")

        var dbo = db.db("test_db");
        user_data = dbo.collection("user_data");

        const filter1 = { username: username1 };
        //push a new value to their pending friends
        const updateDocument1 = {
            $push: {
                pendingfr: username2,
            },
        };
        const result1 = await user_data.updateOne(filter1, updateDocument1);

        const filter2 = { username: username2 };
        //push a new value to their notifcations friends
        const updateDocument2 = {
            $push: {
                notifs: username1,
            },
        };
        const result2 = await user_data.updateOne(filter2, updateDocument2);

    }
    catch (err) {
        console.log(err);
        returnCode = 1;
    }
    finally {
        //console.log("Attempted friend request. Status: ", result1, result2);
        db.close();
        console.log("Database closed");
        //console.log("Return code = ", returnCode);
        return 0;
    }
}















async function removeFriendRequest(username, friendname) {
    console.log("Inside add user");
    let returnCode;

    try {
        db = await MongoClient.connect(uri);
        console.log("- Connected to Database for friend request processing")

        var dbo = db.db("test_db");
        user_data = dbo.collection("user_data");

        // Remove the friend request notification from the user
        // who received the friend request

        const filter1 = { username: username };
        const updateDocument1 = {
            $pull:
            {
                notifs: friendname,
            },
        };
        const result1 = await user_data.updateOne(filter1, updateDocument1);
        console.log("Notification removed");


        // Remove the pending friend request from the user
        // who sent the friend request

        const filter2 = { username: friendname };
        const updateDocument2 = {
            $pull:
            {
                pendingfr: username,
            },
        };
        const result2 = await user_data.updateOne(filter2, updateDocument2);
        console.log("PendingFR removed");


        // updated_msgs = chat.messages;
        // updated_msgs.push(message);

        // chat_data.update({chat_id: chat.chat_id},{$set:{"messages":updated_msgs}});

        // console.log("chat updated");

        // returnCode = 0;





    }
    catch (err) {
        console.log(err);
        returnCode = 1;
    }

    finally {
        db.close();
        console.log("Database closed")
        console.log("Return code = ", returnCode);
        return returnCode;
    }


    // Old code

    // // Find the friend request list of a specific user
    // user = await user_data.findOne({username: username});
    // console.log("true user = ", user);

    // // Search through the friend request list of the above specific user
    // req = await user.findOne({friendname: friendname});   // checks for friend request from given friend's name
    // console.log("matching request found = ", req);

    // // Getting the specific friend's name that we will use to identify the friend request
    // var friend_req_identifier = { friendname: friendname }; // Not sure if we need the username in here as well

    // if (req == null) // if friend request from given friend's name does not exist
    // {
    //     throw "friend request not found";
    // }

    // user_data.deleteOne(friend_req_identifier,
    //     function(err, res) 
    //     {
    //         console.log("- Friend request deleted");
    //     }
    // );



}













async function createNewChat(username1, username2) {
    let returnCode;
    try {
        db = await MongoClient.connect(uri);
        console.log("Connected to database for new chat creation");

        var dbo = db.db("test_db");
        chat_data = dbo.collection("chat_data");

        var uniqueChatID = uuidv4();
        new_chat = {
            chat_id: uniqueChatID,
            messages: [],
            participants: [username1, username2]
        }

        chat_data.insertOne(new_chat,
            function (err, res) {
                if (err) throw err;
                console.log("New chat with ID ", uniqueChatID, " added");
            });

        returnCode = uniqueChatID;
    }
    catch (err) {
        console.log(err);
        returnCode = -1;
    }
    finally {
        db.close();
        console.log("Database closed");
        console.log("Return code = ", returnCode);
        return returnCode;
    }
}

async function confirmFriend(username1, username2) {
    //remove Friend request
    matchingUserName = "";
    try {
        db = await MongoClient.connect(uri);
        console.log("Connected to Database for lookup")

        var dbo = db.db("test_db");
        user_data = dbo.collection("user_data");
        //create new chat here
        chatID = await createNewChat(username1, username2);
        const filter1 = { username: username1 };
        //push a new value to their notifcations friends
        const updateDocument1 = {
            $push: {
                friends: username2,
                chats: { chat_id: chatID, chat_name: username2 },
            },
        };
        const result1 = await user_data.updateOne(filter1, updateDocument1);

        const filter2 = { username: username2 };
        //push a new value to their notifcations friends
        const updateDocument2 = {
            $push: {
                friends: username1,
                chats: { chat_id: chatID, chat_name: username1 },
            },
        };
        const result2 = await user_data.updateOne(filter2, updateDocument2);
    }
    catch (err) {
        console.log(err);
        returnCode = 0;
    }
    finally {
        db.close();
        console.log("Database closed");
        var returnCode = 0
        console.log("Return code = ", returnCode);
        return returnCode;
    }
}

// returns the entire message list from this chatID
app.get("/chat/:chat_id", async (req, res) => {

    let returnCode;
    let messages;
    let participants;
    try {
        const chat_id = req.params.chat_id;
        console.log("Inside server.js /chat/", chat_id);

        db = await MongoClient.connect(uri);
        console.log("- Connected to database for chat retrieval");

        var dbo = db.db("test_db");
        chat_data = dbo.collection("chat_data");


        const chat = await chat_data.findOne({ chat_id: chat_id });

        if (chat == null) // chat doesn't exist 
        {
            console.log("Chat doesn't exist");
            returnCode = 1;
            return;
        }

        participants = await chat.participants;

        if (!participants.includes(req.session.username))   // if user isn't a participant in the chat
        {
            console.log("User isn't logged in ");
            returnCode = 2;
            return;
        }

        messages = await chat.messages;
        returnCode = 0;
    }
    catch (err) {
        console.log(err);
        returnCode = 3;
    }
    finally {
        db.close();
        console.log("Database closed");
        console.log("Return code = ", returnCode);
        res.json({ returnCode: returnCode, messages: messages, participants: participants });
    }
});

app.post("/sendchat/:chat_id", async (req, res) => {
    const chat_id = req.params.chat_id;
    console.log("Inside server.js /sendchat/", chat_id);
    const message = req.body;
    let returnCode;

    try {
        db = await MongoClient.connect(uri);
        console.log("- Connected to database for chat submission");

        var dbo = db.db("test_db");
        chat_data = dbo.collection("chat_data");


        const chat = await chat_data.findOne({ chat_id: chat_id });

        if (chat == null) // chat doesn't exist 
        {
            console.log("Chat doesn't exist");
            returnCode = 1;
            return;
        }

        participants = await chat.participants;
        if (!participants.includes(req.session.username))   // if user isn't a participant in the chat
        {
            console.log("User isn't logged in ");
            returnCode = 2;
            return;
        }

        messages = await chat.messages;

        updated_msgs = chat.messages;
        updated_msgs.push(message);

        chat_data.update({ chat_id: chat.chat_id }, { $set: { "messages": updated_msgs } });

        console.log("chat updated");

        returnCode = 0;
    }
    catch (err) {
        console.log(err);
        returnCode = 3;
    }
    finally {
        db.close();
        console.log("Database closed");
        console.log("Return code = ", returnCode);
        res.json({ returnCode: returnCode });
    }
});


app.post('/change/name/:username', async (req, res) => {

    const username = req.params.username;
    const submittedName = req.body.submittedName;

    console.log("inside server.js /change/name/", username);

    let returnCode;

    try {
        db = await MongoClient.connect(uri);
        console.log("- Connected to database for name change");

        var dbo = db.db("test_db");
        user_data = dbo.collection("user_data");


        const user = await user_data.findOne({ username: username });

        if (user == null) // user doesn't exist 
        {
            console.log("User doesn't exist");
            returnCode = 1;
            return;
        }

        user_data.update({ username: username }, { $set: { "name": submittedName } });

        console.log("name updated");

        returnCode = 0;
    }
    catch (err) {
        console.log(err);
        returnCode = 3;  // database errors
    }
    finally {
        db.close();
        console.log("Database closed");
        console.log("Return code = ", returnCode);
        res.json({ returnCode: returnCode });
    }
});

app.post('/change/password/:username', async (req, res) => {

    const username = req.params.username;

    const newPassword = req.body.newPassword;

    console.log("inside server.js /change/password/", username);

    let returnCode;

    try {
        db = await MongoClient.connect(uri);
        console.log("- Connected to database for password change");

        var dbo = db.db("test_db");
        user_data = dbo.collection("user_data");


        const user = await user_data.findOne({ username: username });

        if (user == null) // user doesn't exist 
        {
            console.log("User doesn't exist");
            returnCode = 1; // user DNE error
            return;
        }

        user_data.update({ username: username }, { $set: { "password": newPassword } });

        console.log("password updated");

        returnCode = 0;
    }
    catch (err) {
        console.log(err);
        returnCode = 3;  // database errors
    }
    finally {
        db.close();
        console.log("Database closed");
        console.log("Return code = ", returnCode);
        res.json({ returnCode: returnCode });
    }


});
app.post("/latexRequest", async (req, res) => {
    const latex = await req.body.latex;
    console.log('called', latex)
    var spawn = require("child_process").spawn;
    var request = spawn('python', ['latexRequest.py', latex]);
    request.stderr.pipe(process.stderr);
    request.stdout.pipe(process.stdout);
    request.stdout.on('data', function (data) {
        res.json({ filename: data.toString() }); //returns filename of converted latex
    })
});








// returns the entire friend requests list from this chatID
// app.get("/chat/:chat_id", async (req, res) => 
// {

//     let returnCode;
//     let messages;
//     let participants;
//     try
//     {
//         const chat_id = req.params.chat_id;
//         db = await MongoClient.connect(uri);
//         console.log("- Connected to database for chat retrieval");

//         var dbo = db.db("test_db");
//         chat_data = dbo.collection("chat_data");


//         const chat = await chat_data.findOne({chat_id: chat_id});

//         if (chat == null) // chat doesn't exist 
//         {
//             console.log("Chat doesn't exist");
//             returnCode = 1;
//             return;
//         }

//         participants = await chat.participants;

//         if (!participants.includes(req.session.username))   // if user isn't a participant in the chat
//         {
//             console.log("User isn't logged in ");
//             returnCode = 2;
//             return;
//         }

//         messages = await chat.messages;
//         returnCode = 0;
//     }
//     catch (err)
//     {
//         console.log(err);
//         returnCode = 3;
//     }
//     finally
//     {
//         db.close();
//         console.log("Database closed");
//         console.log("Return code = ", returnCode);
//         res.json({returnCode: returnCode , messages: messages, participants: participants});
//     }
// });

