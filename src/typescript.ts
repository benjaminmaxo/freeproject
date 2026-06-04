import express from 'express';
import { conn } from './db.ts';
import bodyParser from 'body-parser';
import bcrypt from "bcryptjs";

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Respond to GET request on the root route
app.get('/', (req, res) => {
    res.send('GET request to the homepage');
});

//search anime
app.get('/anime/search/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const rows = await conn.query('SELECT episodes FROM Anime WHERE title = ?', [name]);
        if (rows.length > 0) {
            res.json({ "episodes": rows[0].episodes });
        } else {
            res.status(404).json({ "error": "Anime not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ "error": "Internal server error" });
    }
});

//list anime
app.get('/anime/list', async (req, res) => {
    try {
        const rows = await conn.query('SELECT * FROM Anime');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({"error": "error in the table"});
    }
});

// add anime 
app.post('/anime/create/', async (req, res) => {
    try {
        const {
            title,
            synopsis,
            media_type,
            episodes,
            status,
            aired_from,
            aired_to,
            rating,
            score,
            image_url
        } = req.body;
        await conn.query(
            'INSERT INTO Anime (title, synopsis, media_type, episodes, status, aired_from, aired_to, rating, score, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [title, synopsis, media_type, episodes, status, aired_from, aired_to, rating, score, image_url]
        );
        res.status(201).json({ "message": "Anime created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "error": "Failed to create anime" });
    }
});

//delete anime
app.delete('/anime/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const rows = await conn.query('DELETE FROM Anime WHERE id = ?', [id]);
        res.json({"msg": "successfully deleted"})
    } catch (err) {
        console.error(err);
        res.status(500).json({ "error": "no ID foud" });
    }
});

// Respond to GET request on the /about route
app.get('/about', (req, res) => {
    res.send('About page');
});











//add user
app.post('/user/add/', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await conn.query('INSERT INTO Uzerz (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
        res.status(201).json({ "message": "User created successfully" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ "error": "User not created" });
    }
});

//delete user
app.delete('/user/delete/:name', async (req, res) => {
    try {
        const name = req.params.name;
        await conn.query('DELETE FROM Uzerz WHERE username = ?', [name])
        res.json({"msg": "successfully deleted"})
    } catch(err) {
        console.error(err);
        res.status(500).json({ "error": "cannot delete the user" });
    }
});

//list Users
app.get('/user/list', async (req, res) => {
    try {
        const rows = await conn.query('SELECT * FROM Uzerz');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({"error": "error in the table"});
    }
    
});


// Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
}); 
