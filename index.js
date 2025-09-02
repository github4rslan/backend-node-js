const express = require('express');
const app = express();
require('dotenv').config();

// ✅ Always use uppercase PORT (Render sets this automatically)
const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
});

// ✅ Use backticks for template literal
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
