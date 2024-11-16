const express = require('express');
const db = require('../db/db');
const stocksRouter = express.Router();


stocksRouter.post('/', async (req, res) => {
    const { product_id, shop_id, quantity_on_shelf, quantity_in_order } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO stocks (product_id, shop_id, quantity_on_shelf, quantity_in_order) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [product_id, shop_id, quantity_on_shelf, quantity_in_order]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


stocksRouter.put('/increase', async (req, res) => {
    const { product_id, shop_id, quantity } = req.body;
    try {
        const result = await db.query(
            `UPDATE stocks 
       SET quantity_on_shelf = quantity_on_shelf + $1 
       WHERE product_id = $2 AND shop_id = $3 
       RETURNING *`,
            [quantity, product_id, shop_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Stock record not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


stocksRouter.put('/decrease', async (req, res) => {
    const { product_id, shop_id, quantity } = req.body;
    try {
        const result = await db.query(
            `UPDATE stocks 
       SET quantity_on_shelf = quantity_on_shelf - $1 
       WHERE product_id = $2 AND shop_id = $3 
       RETURNING *`,
            [quantity, product_id, shop_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Stock record not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


stocksRouter.get('/', async (req, res) => {
    const { plu, shop_id, quantity_on_shelf_min, quantity_on_shelf_max, quantity_in_order_min, quantity_in_order_max } = req.query;
    let query = `SELECT s.*, p.plu, p.name FROM stocks s 
               JOIN products p ON s.product_id = p.id 
               WHERE 1=1`;
    const params = [];
    let index = 1;

    if (plu) {
        query += ` AND p.plu = $${index++}`;
        params.push(plu);
    }
    if (shop_id) {
        query += ` AND s.shop_id = $${index++}`;
        params.push(shop_id);
    }
    if (quantity_on_shelf_min) {
        query += ` AND s.quantity_on_shelf >= $${index++}`;
        params.push(quantity_on_shelf_min);
    }
    if (quantity_on_shelf_max) {
        query += ` AND s.quantity_on_shelf <= $${index++}`;
        params.push(quantity_on_shelf_max);
    }
    if (quantity_in_order_min) {
        query += ` AND s.quantity_in_order >= $${index++}`;
        params.push(quantity_in_order_min);
    }
    if (quantity_in_order_max) {
        query += ` AND s.quantity_in_order <= $${index++}`;
        params.push(quantity_in_order_max);
    }

    try {
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = stocksRouter;