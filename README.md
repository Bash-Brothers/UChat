# Bash Brothers - CS 97 Project - Chat app for students and academia

<h2> Steps to run the app on your computer </h2>

To run this repository on your local computer, open the terminal/command line and navigate to the directory you wish to download the repository to.
Then type this into your terminal or command line:
```
git clone https://github.com/TheDarkLord247/chatapp.git
```

After this, enter the following command:
```
cd chatapp
```

Now enter this command to install all our node dependencies:
```
npm install
```

Change directory into the client directory, using the command:
```
cd client
```

Install all our node dependencies in the client directory using:
```
npm install
```

Change back into the main chatapp directory, using the command:
```
cd ..
```

<br />

Ensure that the Requests HTTP library for Python is installed on your computer.<br />
Instructions on how to install Requests will depend on the device.<br />
https://requests.readthedocs.io/en/master/


<br />

To run the app, in the main chatapp directory, use the command:
```
yarn dev
```

<br />

Yarn takes a while to start the dev server. Do not use the localhost url that this command opens. Instead copy the url provided next to "On Your Network" (shown in the screenshot below)and paste it in the browser to run the app. (We do not use the default localhost url because our application uses Imgur's API to store and fetch images but Imgur blocks post requests from localhost.)
<br />
![Screen Shot 2021-03-11 at 11 55 41 PM](https://user-images.githubusercontent.com/40956188/111013756-7860ca00-8355-11eb-8684-685ea0bab06f.jpg)

<h2>Creators</h2>
<ul>
  <a href='https://github.com/YanHauw'>Yan Hauw</a>
  <a href='https://github.com/SudhanshuAgrawal27'>Sudhanshu Agrawal</li>
  <a href='https://github.com/Monko2k'>Kevin Huang</li>
  <a href='https://github.com/milo-ucla'>Milo Kearney</li>
  <a href='https://github.com/TheDarkLord247'>Aman Oberoi</li>
</ul>
<h2>Technology Stack</h2>

This project was bootstrapped with [React](https://github.com/facebook/create-react-app), and we used [Express](https://expressjs.com/en/guide/routing.html) to set up end points and methods that received stimulus from our React components and conveyed and retrieved information from our [MongoDB](http://mongodb.com) collections. We used [Imgur's API](https://api.imgur.com) to store and fetch images sent in chats, and [rTeX](https://rtex.probablyaweb.site) along with Python's [requests library](https://requests.readthedocs.io/en/master/) to convert LaTeX code into images.
