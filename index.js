const express = require('express');
const app = express();
require('dotenv').config();

// Use the dynamic port from hosting provider OR default 8080 locally
const port = process.env.PORT || 8080;

// Test route
app.get('/ping', (req, res) => {
  res.send('PONG');
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
