"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const port = 8080;
// Respond to GET request on the root route
app.get('/', (req, res) => {
    res.send('GET request to the homepage');
});
app.get('/bonjour/:name', (req, res) => {
    const name = req.params.name;
    res.json({ "msg": `bonjour ${name}`, "trci": `2m890` });
});
// Respond to POST request on the root route
app.post('/', (req, res) => {
    res.send('POST request to the homepage');
});
// Respond to GET request on the /about route
app.get('/about', (req, res) => {
    res.send('About page');
});
// Catch all other routes
//app.all('*', (req, res) => {
//  res.status(404).send('404 - Page not found');
//});
// Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
//# sourceMappingURL=typescript.js.map