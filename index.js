const express = require("express");
const ejs = require("ejs");
const firebase = require("firebase");
const firebaseConfig = require("./public/js/firebaseConfig");

const app = express();
const port = 3000;

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
// reference your database
const contactFormDB = db.ref("users");


app.use(express.json())
app.use(express.urlencoded())

// Define a route for handling the POST request when a user registers
app.post("/register/create", async function(req, res) {
  // Extract user registration data from the request body
  const name = req.body.name;
  const email = req.body.username;
  const password = req.body.password;
  const address = req.body.address;

  console.log({
    body: req.body
  })

  try {
    const newContactForm = contactFormDB.push();

    newContactForm.set({
      name: name,
      email: email,
      password: password,
      address: address,
    });

    console.log("User data saved to Firebase");

    // Handle a successful registration here
    // You can send a response back to the client if needed
    res.redirect("/login.html");

  } catch (err) {
    console.log(err);

    // Handle any errors that occur during the registration process
    // Send an error response back to the client if needed
    res.status(500).send("Error during registration");
  }
});



// Define a route for handling the POST request when a user logs in on the dashboard
app.post("/dashboard", async function(req, res) {
  // Extract the email and password from the request body
  const email = req.body.username;
  const password = req.body.password;

  try {
    // Create a reference to the 'users' location in the database
    const usersRef = db.ref("users");

    // Fetch all user data from the database
    const snapshot = await usersRef.once("value");
    const users = snapshot.val();

    // Find a user in the user data with matching email and password
    const foundUser = Object.values(users).find(
      user => user.email === email && user.password === password
    );

    res.redirect("/dashboard.html");

  
  } catch (err) {
    // Handle any errors that occur during the process
    console.error(err);
    
    // Send a 500 Internal Server Error response in case of an error
    res.status(500).send("Internal server error");
  }
});



// Set up your Express application
app.use(express.static("public")); // Serve static files from the 'public' directory
app.set('views', "views"); // Set the 'views' directory for EJS templates
app.set('view engine', 'ejs'); // Set the view engine to EJS

// Define a route for the root URL ("/") and handle it with a callback function

app.get("/", function(req, res) {
  // Send the "home.html" file as a response when the root URL is accessed
  res.sendFile(__dirname + "/index.html");
});
// Define routes for other HTML pages
app.get("/login.html/", function (req, res) {
    res.sendFile(__dirname + "/login.html");
});

app.get("/register.html/", function (req, res) {
    res.sendFile(__dirname + "/register.html");
});

app.get("/dashboard.html/", function (req, res) {
  res.sendFile(__dirname + "/dashboard.html");
});

// Listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
