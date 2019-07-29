# TodoApp

> A 'Reddit' type of app where users can post posts, view other users posts and also follow them. Developed using MongoDb, Express, ReactJs, Node, Bootstrap 4 and Fontawesome.

## Installation

```bash
# To install server dependencies
npm install

# To install client dependencies, Change directory to client then perform npm install

cd client
npm install
```

## Getting Started

```bash
# To run client & server with concurrently
npm run dev

# To run Express server only
npm run server

# To run React client only
npm run client

# Server runs on http://localhost:5000 and client on http://localhost:3000
```

In config folder create keys_dev.js file with

```bash
module.exports = {
  mongoURI: 'YOUR_OWN_MONGO_URI',
  secretOrKey: 'YOUR_OWN_SECRET'
};
```

You have to set your own mongoURI. You could use 'mLab' or 'MongoDB Atlas' for mongodb which is easy to setup & use.
