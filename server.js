const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;
let blogs = [];
let nextId = 1;
app.use(cors());
app.use(express.json());

app.get('/', (req,res) => 
{
    res.send('running');
});
app.get('/api/blogs', (req,res) => 
{
    res.json(blogs);
});

app.post('/api/blogs', (req, res) => {
    const { title, body, author } = req.body;
    if (!title || !body || !author) 
    {
        return res.status(400).json({ error: 'Title and body are required.' });
    }

    const newPost = {
        id: nextId++,
        title,
        body,
        author
    };
    blogs.push(newPost);
    res.status(201).json(newPost);
});

app.put('/api/blogs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, body} = req.body;
    const postIndex = blogs.findIndex(post => post.id === id);

    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found.' });
    }

    blogs[postIndex].title = title || blogs[postIndex].title;
    blogs[postIndex].body = body || blogs[postIndex].body;

    res.json(blogs[postIndex]);
});

app.delete('/api/blogs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = blogs.length;
    
    blogs = blogs.filter(post => post.id !== id);

    if (blogs.length === initialLength) {
        return res.status(404).json({ error: 'Post not found.' });
    }

    res.status(204).send();
});
//test run
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});