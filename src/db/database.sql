CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    plu VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE shops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    shop_id INTEGER REFERENCES shops(id),
    quantity_on_shelf INTEGER NOT NULL,
    quantity_in_order INTEGER NOT NULL,
    UNIQUE(product_id, shop_id)
);

CREATE TABLE actions_history (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    shop_id INTEGER REFERENCES shops(id),
    action VARCHAR(50) NOT NULL,
    quantity INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
