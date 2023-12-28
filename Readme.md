Create a new directory for your project:
mkdir mern-email-app
cd mern-email-app
Initialize a new Node.js project:
npm init -y

Step 2: Set Up the Server (Node.js/Express)
Install the required packages:
npm install express mongoose nodemailer

Step 3: Set Up the Client (React)
Create a client directory in your project:
mkdir client
cd client
Initialize a new React app:
npx create-react-app .

Step 5: Run Your Application
In the root directory of your project, start the server:
node server.js
In the client directory, start the React app:
npm start
Visit http://localhost:3000 in your web browser to see the MERN Email App in action.



<!-- Explanation -->

Dependencies and Environment Variables:

Imported necessary modules and loaded environment variables from the .env file.
Express Setup:

Created an Express application (app).
Enabled CORS to allow cross-origin requests.
Routes:

Defined a simple route to respond with "Hello" for the /api endpoint.
Added an API route (/api/get-all-users) to retrieve all users from the MongoDB database.
MongoDB Connection:

Connected to MongoDB using Mongoose.
Mongoose Model:

Defined a simple Mongoose model (User) to represent user information.
Middleware:

Used middleware to parse incoming JSON data.
API Endpoint to Save User:

Defined an API endpoint (/api/save-user) to handle POST requests for saving user information.
Extracted user information from the request body.
Saved the user information to MongoDB.
Sent a confirmation email using Node Mailer.
Server Start:

Started the Express server, and it listens on the specified port (PORT).
This organized code includes comments to explain each section of the server.js file. The comments provide a clear understanding of the functionality and flow of the MERN Email App server.