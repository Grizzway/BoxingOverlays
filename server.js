const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { WebSocketServer } = require('ws');

const app = express();
const port = 3000;
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let lastSentFight = null;
let latestToast = null;

wss.on('connection', ws => {
    console.log("Overlay connected");
  });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/fights', (req, res) => {
    res.sendFile(path.join(__dirname, 'dock.html'));
});
app.get('/dock.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'dock.js'));
});
app.get('/fighters.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'fighters.json'));
});

let currentFight = { red: null, blue: null };

app.post('/set-fight', (req, res) => {
  const { red, blue } = req.body;
  currentFight = { red, blue };
  lastSentFight = { red, blue };
  console.log(`Selected Fight: ${red} vs ${blue}`);

  // Notify all overlays
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(currentFight));
    }
  });

  res.json({ success: true });
});


app.get('/current-fight', (req, res) => {
    res.json(currentFight);
});

server.listen(port, () => {
    console.log(`✅ Server + WebSocket running at http://localhost:${port}`);
  });
  

app.get('/overlay', (req, res) => {
    res.sendFile(path.join(__dirname, 'overlay.html'));
  });
  app.get('/overlay.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'overlay.js'));
  });
  app.get('/overlay.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'overlay.css'));
  });
  
  app.post('/send-toast', (req, res) => {
    const { message, duration } = req.body;
    latestToast = { message, duration };
    console.log(`📢 Toast: "${message}" for ${duration}ms`);
  
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ type: "toast", message, duration }));
      }
    });
  
    res.json({ success: true });
  });