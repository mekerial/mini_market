const express = require('express');
const db = require('../db/db');
const productsRouter = express.Router();



productsRouter.post('/', async (req, res) => {
    const { plu, name } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO products (plu, name) VALUES ($1, $2) RETURNING *',
            [plu, name]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


productsRouter.get('/', async (req, res) => {
    const { name, plu } = req.query;
    let query = `SELECT * FROM products WHERE 1=1`;
    const params = [];
    let index = 1;

    if (name) {
        query += ` AND name ILIKE $${index++}`;
        params.push(`%${name}%`);
    }
    if (plu) {
        query += ` AND plu = $${index++}`;
        params.push(plu);
    }

    try {
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = productsRouter;
