require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const validUrl = require('valid-url');
const shortid = require('shortid');
// Basic Configuration
const port = process.env.PORT || 5000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urlDatabase = {};

// Route to create short URLs
app.post('/api/shorturl', (req, res) => {
    const { url } = req.body;
 
    if (!validUrl.isWebUri(url)) {
        return res.status(400).json({ error: 'Invalid URL' });
    }
    const shortUrl = shortid.generate();
    urlDatabase[shortUrl] = url;

    res.json({ original_url: url, short_url: shortUrl });
});


app.get('/api/shorturl/:shortUrl', (req, res) => {
    const { shortUrl } = req.params;

    
    if (urlDatabase.hasOwnProperty(shortUrl)) {
       
        res.redirect(urlDatabase[shortUrl]);
    } else {
       
        res.status(404).json({ error: 'Short URL not found' });
    }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
