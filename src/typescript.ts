import express, { Request, Response, NextFunction } from 'express';
import { conn } from './db.ts';
import bodyParser from 'body-parser';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 8080;
const SECRET_KEY = process.env.JWT_SECRET || 'your_super_secret_key';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Respond to GET request on the root route
app.get('/', (req, res) => {
    res.send('GET request to the homepage');
});













// Middleware to verify JWT
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: "Access denied, token missing" });
        return;
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            res.status(403).json({ error: "Invalid or expired token" });
            return;
        }
        (req as any).user = user;
        next();
    });
};

// Login route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const rows = await conn.query('SELECT * FROM Uzerz WHERE username = ?', [username]);
        if (rows.length === 0) {
            res.status(401).json({ error: "Invalid username or password" });
            return;
        }

        const user = rows[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(401).json({ error: "Invalid username or password" });
            return;
        }

        // Generate Token
        const token = jwt.sign({ username: user.username, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
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
app.delete('/user/delete/:name', authenticateToken, async (req, res) => {
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
app.get('/user/list', authenticateToken, async (req, res) => {
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
