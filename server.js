require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());

// Api Routes
app.use('/users', require('./users/users.controller'));
app.use('/products', require('./product/products.controller'));
app.use('/orders', require('./orders/orders.controller'));
// Global Error Handler
app.use(errorHandler);


// Start Server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 5000;
app.listen(port, () => console.log('Server listening on port ' + port));