const express = require('express');
const db = require('../db/db');
const shopsRouter = express.Router();


shopsRouter.post('/', async (req, res) => {
    const name = req.body.name;
    try {
        const result = await db.query(
            'INSERT INTO shops (name) VALUES ($1) RETURNING *',
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = shopsRouter;