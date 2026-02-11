const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use("/assets", express.static(path.join(__dirname, 'assets')));
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



app.post('/api/ifr/submit', async function(req,res){

const data= req.body
console.log(data)
if(data.data !=null && data.data != undefined){

  data = data.data
  console.log(data)
}
  const embedBody = {
        content: '<@&1459722493685141636> incoming ATC Flight Plan', // Empty content field
        "embeds": [{
            title: 'Flight Plan',
            description: `Here is the flight plan for callsign ${data.flightName || '(Not specified)'}|| Flight ID: ${data.squawkCode}`,
            color: 0xFFA500,
            fields: [
                { name: 'SessionID', value: data.sessionID || '(Not specified)' },
                { name: 'Session Map', value: data.sessionMap || '(Not specified)' },
                { name: 'Flight Callsign', value: data.flightName || '(Not specified)' },
                { name: 'Aircraft Type', value: data.aircraftType || '(Not specified)' },
                { name: 'Cruising Altitude', value: data.altitude || '(Not specified)' },
                { name: 'Departure Location', value: data.departure || '(Not specified)' },
                { name: 'Destination', value: data.destination || '(Not specified)' },
                { name: 'Total Fuel Onboard', value: data.totalFuel || '(Not specified)' },
                { name: 'Bingo Fuel Level', value: data.bingoFuel || '(Not specified)' },
                { name: 'Weather Briefing', value: data.weatherBriefing || '(Not specified)' },
                { name: 'Navigation Log', value: data.navigationLog !== undefined && data.navigationLog !== null ? data.navigationLog.toString() : 'None' },
                { name: 'Pilot in Command', value: data.pic + " " + data["role"] || '(Not specified)' },
                { name: 'Co-Pilot', value: data.copilot + " " + data["co-role"] || 'None' },
                { name: 'Radio Frequencies', value: data.radioFrequencies || '(Not specified)' },
                { name: 'Additional Notes', value: data.additionalNotes || '(Not specified)' }
            ],
            
            timestamp: new Date().toISOString()
        }]
    };
 
    try{
        const body = JSON.stringify(embedBody);
        const webhookURL =process.env.DISCORD_WEBHOOK_URL;
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:body
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            return res.send("Flight plan submitted successfully!")
            
            } catch(error){
              console.log(error)
              res.status(500).send("Error submitting flight plan: " + error.message)
              }
        
  
  
  })

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
