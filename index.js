
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

// Allow requests from your deployed frontend domain
app.use(cors({
  origin: 'http://localhost:3000', // Change to your deployed frontend URL when live
  credentials: true
}));

app.use(express.json());

// Import your routes
app.use('/api/admin', require('./routes/admin'));
// ...add other routes as needed

const port = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
  res.send('PONG');
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
