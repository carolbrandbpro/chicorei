const express = require('express');
const path = require('path');

const app = express();

// Serve static assets from project root
app.use(express.static(__dirname));

// Explicit routes for main pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/novidades.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'novidades.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});