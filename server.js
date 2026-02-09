const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'VTOL VR ATC Site',
    message: 'Welcome to the VTOL VR ATC  Site'
  });
});

app.get('/sessions', (req, res) => {
  res.render('sessions', { 
    title: 'Sessions',
    message: 'Manage your VTOL VR sessions here'
  });
});

app.get("/ifr", (req, res) => {
  res.render('ifr', {
    title: 'IFR',
    message: 'IFR Flight Planning and Tracking'
  });
});

app.get("/charts", (req, res) => {
  res.render('charts', {
    title: 'Charts',
    message: 'VTOL VR Maps and Charts'
  });
});
app.get("/api/sessions", (req, res) => {
 const sessions = fetch("http://172.93.104.139:3000")
  .then(response => response.json())
  .then(data => {
    res.json(data);
  }
  ).catch(error => {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
