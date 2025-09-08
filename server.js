const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve frontend files
app.use(express.static('public'));

// Start server
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
