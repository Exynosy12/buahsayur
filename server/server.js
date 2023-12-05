const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const axios = require('axios');

const app = express()
var port = process.env.PORT || 3000;

let products = [];
let orders = [];
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("API deployment successful");
});

// Konfigurasi Duitku
const merchantCode = 'DS17453';
const merchantKey = '0b5182cc15e4774f6af74c0c6c5f759c';

//create callback function


app.post('/create-invoice', async (req, res) => {
    const timestamp = Date.now().toString();
    const signature = crypto.createHash('sha256').update(merchantCode + timestamp + merchantKey).digest('hex');

    let total = req.body.total;
    let items = req.body.items;

    let itemsDetail = [];
    for (let item of items) {
        itemsDetail.push({
            name: item.name, price: item.price, quantity: item.unit,
        });
    }

    const data = {
        paymentAmount: total, merchantOrderId: timestamp.toString(), // unique ID dari merchant
        productDetails: 'Payment', email: 'sultanhawari12@gmail.com', // email pelanggan
        callbackUrl: 'http://example.com/api-pop/backend/callback.php', // URL untuk callback
        returnUrl: 'https://tokobuahsultan.onrender.com', // URL untuk redirect
        expiryPeriod: 5, // waktu kedaluwarsa dalam menit
        customerDetail: {
            firstName: 'Customer', lastName: 'Toko Buah Sultan',
        }, itemDetails: itemsDetail,
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'x-duitku-signature': signature,
            'x-duitku-timestamp': timestamp,
            'x-duitku-merchantcode': merchantCode
        }
    };

    try {
        const response = await axios.post('https://api-sandbox.duitku.com/api/merchant/createinvoice', data, config);
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.post('/product', (req, res) => {
    const product = req.body;

    // output the product to the console for debugging
    console.log(product);
    products.push(product);

    res.send('Product is added to the database');
});

app.get('/product', (req, res) => {
    res.json(products);
});

app.get('/product/:id', (req, res) => {
    // reading id from the URL
    const id = req.params.id;

    // searching products for the id
    for (let product of products) {
        if (product.id === id) {
            res.json(product);
            return;
        }
    }

    // sending 404 when not found something is a good practice
    res.status(404).send('Product not found');
});

app.delete('/product/:id', (req, res) => {
    // reading id from the URL
    const id = req.params.id;

    // remove item from the products array
    products = products.filter(i => {
        if (i.id !== id) {
            return true;
        }

        return false;
    });

    // sending 404 when not found something is a good practice
    res.send('Product is deleted');
});

app.post('/product/:id', (req, res) => {
    // reading id from the URL
    const id = req.params.id;
    const newProduct = req.body;

    // remove item from the products array
    for (let i = 0; i < products.length; i++) {
        let product = products[i]

        if (product.id === id) {
            products[i] = newProduct;
        }
    }

    // sending 404 when not found something is a good practice
    res.send('Product is edited');
});

app.post('/checkout', (req, res) => {
    const order = req.body;

    // output the product to the console for debugging
    orders.push(order);

    res.redirect(302, 'https://assettracker.cf');
});

app.get('/checkout', (req, res) => {
    res.json(orders);

});

app.listen(port, () => console.log(`Server listening on port ${port}!`));
