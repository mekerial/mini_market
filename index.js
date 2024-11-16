const productsRouter = require("./src/routes/products.route") ;
const stocksRouter = require("./src/routes/stocks.route")
const shopsRouter = require("./src/routes/shops.route")
const express = require('express');



const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json())


app.use('/products', productsRouter);
app.use('/stocks', stocksRouter);
app.use('/shops', shopsRouter);
app.get('/', (req, res) => {
    res.send('hello!')
});

app.listen(PORT, () => console.log(`app started on port: ${PORT}`));
